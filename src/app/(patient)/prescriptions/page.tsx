"use client";

import { useReducer, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { PageContainer, PageHeader } from "@/components/shared";
import UploadInitial from "@/components/patient/prescriptions/UploadInitial";
import UploadPicker from "@/components/patient/prescriptions/UploadPicker";
import UploadProgress from "@/components/patient/prescriptions/UploadProgress";
import UploadError from "@/components/patient/prescriptions/UploadError";
import UploadUnsupported from "@/components/patient/prescriptions/UploadUnsupported";
import UploadSuccess from "@/components/patient/prescriptions/UploadSuccess";
import UploadSidePanel from "@/components/patient/prescriptions/UploadSidePanel";
import {
  fileUploadService,
  prescriptionApiService,
} from "@/services/api.service";

type UploadStep =
  | "initial"
  | "picker"
  | "uploading"
  | "error"
  | "unsupported"
  | "success";

interface State {
  step: UploadStep;
  progress: number;
  file: File | null;
}

type Action =
  | { type: "GO_PICKER" }
  | { type: "BACK" }
  | { type: "START_UPLOAD"; file: File }
  | { type: "SET_PROGRESS"; value: number }
  | { type: "SUCCESS" }
  | { type: "ERROR" }
  | { type: "UNSUPPORTED" }
  | { type: "RESET" };

const initialState: State = {
  step: "initial",
  progress: 0,
  file: null,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "GO_PICKER":
      return { ...state, step: "picker" };

    case "BACK":
      if (state.step === "picker") return { ...state, step: "initial" };
      if (state.step === "uploading") return { ...state, step: "picker" };
      if (state.step === "error") return { ...state, step: "initial" };
      if (state.step === "unsupported") return { ...state, step: "initial" };
      if (state.step === "success") return { ...state, step: "initial" };
      return state;

    case "START_UPLOAD":
      return { ...state, step: "uploading", file: action.file, progress: 0 };

    case "SET_PROGRESS":
      return { ...state, progress: action.value };

    case "SUCCESS":
      return { ...state, step: "success", progress: 100 };

    case "ERROR":
      return { ...state, step: "error" };

    case "UNSUPPORTED":
      return { ...state, step: "unsupported" };

    case "RESET":
      return initialState;

    default:
      return state;
  }
}

export default function UploadPrescriptionPage() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // -------------------------------
  // Validation (UI-only as requested)
  // -------------------------------
  const validateFile = async (file: File): Promise<"valid" | "unsupported"> => {
    const allowedTypes = ["image/png", "image/jpeg", "application/pdf"];
    if (!allowedTypes.includes(file.type)) return "unsupported";

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) return "unsupported";

    if (file.type.startsWith("image/")) {
      const ok = await validateImageDimensions(file);
      if (!ok) return "unsupported";
    }

    return "valid";
  };

  const validateImageDimensions = (file: File): Promise<boolean> => {
    return new Promise((resolve) => {
      const img = new Image();
      const url = URL.createObjectURL(file);

      img.onload = () => {
        const valid = img.width >= 600 && img.height >= 600;
        URL.revokeObjectURL(url);
        resolve(valid);
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        resolve(false);
      };

      img.src = url;
    });
  };

  // -------------------------------
  // Real API upload: POST /file/upload → POST /prescriptions
  //
  // Flow:
  //   1. Upload file binary to POST /file/upload → get public URL
  //   2. POST /prescriptions with { pharmacyId, fileUrls: [url] }
  //
  // pharmacyId comes from URL ?pharmacyId=N set by cart navigation.
  // If not present, the file is still uploaded but no prescription record
  // is created — the console will log a warning.
  // -------------------------------

  const handleFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Allow re-selecting the same file later
    e.target.value = "";

    const validation = await validateFile(file);

    if (validation === "unsupported") {
      dispatch({ type: "UNSUPPORTED" });
      return;
    }

    dispatch({ type: "START_UPLOAD", file });

    try {
      // Step 1: Upload file to cloud storage — POST /file/upload
      dispatch({ type: "SET_PROGRESS", value: 20 });
      const fileUrl = await fileUploadService.uploadFile(file, "prescription");
      dispatch({ type: "SET_PROGRESS", value: 65 });

      // Step 2: Create prescription record — POST /prescriptions
      const pharmacyIdStr =
        typeof window !== "undefined"
          ? new URLSearchParams(window.location.search).get("pharmacyId")
          : null;
      const pharmacyId = pharmacyIdStr ? Number(pharmacyIdStr) : null;

      if (!pharmacyId) {
        // No pharmacyId in URL — file uploaded but prescription record not created.
        // This happens if the user navigates directly to /prescriptions without
        // a pharmacyId. Normal cart navigation always passes ?pharmacyId=N.
        console.warn(
          "[Prescriptions] No pharmacyId in URL — file uploaded but prescription record not created.",
          "Navigate here with ?pharmacyId=<id> from the cart.",
        );
      } else {
        await prescriptionApiService.createPrescription({
          pharmacyId,
          fileUrls: [fileUrl],
        });
      }

      dispatch({ type: "SET_PROGRESS", value: 100 });
      dispatch({ type: "SUCCESS" });
    } catch (err) {
      console.error("[Prescriptions] Upload failed:", err);
      dispatch({ type: "ERROR" });
    }
  };

  // Retry: re-trigger file picker (used by UploadError onRetry)
  const handleRetry = () => {
    inputRef.current?.click();
  };

  const headerTitle =
    state.step === "uploading" ||
    state.step === "error" ||
    state.step === "unsupported"
      ? "Prescription Status"
      : "Upload Prescription";

  const headerSubtitle =
    state.step === "uploading" ||
    state.step === "error" ||
    state.step === "unsupported"
      ? undefined
      : "Upload a clear photo of your prescription to help us prepare your order accurately";

  return (
    /* One container for the header and the body, so the two halves of the page
       share a left and right edge. They used to sit at x=80 and x=208 because
       each half set its own (dead) max-w-* class. */
    <PageContainer>
      <PageHeader
        title={headerTitle}
        subtitle={headerSubtitle}
        showBack
        onBack={() => dispatch({ type: "BACK" })}
      />

      {/* Two columns on desktop: the flow on the left, context on the right.
          The same grid wraps every step, so the upload box, the picker, the
          progress bar and all three end states keep identical edges. Below lg
          the columns stack with the flow first. */}
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_360px] xl:grid-cols-[minmax(0,1fr)_400px]">
        <div className="flex min-w-0 flex-col gap-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={state.step}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.32, ease: "easeOut" }}
            >
              {state.step === "initial" && (
                <UploadInitial
                  onUploadClick={() => dispatch({ type: "GO_PICKER" })}
                />
              )}

              {state.step === "picker" && (
                <UploadPicker
                  onSelect={() => inputRef.current?.click()}
                  onClose={() => dispatch({ type: "BACK" })}
                />
              )}

              {state.step === "uploading" && (
                <UploadProgress
                  progress={state.progress}
                  onCancel={() => dispatch({ type: "BACK" })}
                />
              )}

              {state.step === "error" && <UploadError onRetry={handleRetry} />}

              {state.step === "unsupported" && (
                <UploadUnsupported
                  onUploadAgain={() => dispatch({ type: "RESET" })}
                />
              )}

              {state.step === "success" && (
                <UploadSuccess
                  onClose={() => dispatch({ type: "RESET" })}
                  onTrack={() => {
                    // لاحقاً: route لصفحة تتبع status (غير موجودة حالياً)
                    console.log("Track status");
                  }}
                />
              )}
            </motion.div>
          </AnimatePresence>

          <input
            ref={inputRef}
            type="file"
            hidden
            accept=".png,.jpg,.jpeg,.pdf"
            onChange={handleFileSelected}
          />
        </div>

        <UploadSidePanel />
      </div>
    </PageContainer>
  );
}
