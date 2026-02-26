"use client";

import { useReducer, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";

import UploadHeader from "@/components/patient/prescriptions/UploadHeader";
import UploadInitial from "@/components/patient/prescriptions/UploadInitial";
import UploadPicker from "@/components/patient/prescriptions/UploadPicker";
import UploadProgress from "@/components/patient/prescriptions/UploadProgress";
import UploadError from "@/components/patient/prescriptions/UploadError";
import UploadUnsupported from "@/components/patient/prescriptions/UploadUnsupported";
import UploadSuccess from "@/components/patient/prescriptions/UploadSuccess";

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
  // Upload simulation (replace later with real endpoint + progress event)
  // -------------------------------
  const simulateUpload = () => {
    let progress = 0;

    const interval = setInterval(() => {
      // smooth-ish increments
      progress += 6 + Math.random() * 10;

      if (progress >= 100) {
        clearInterval(interval);
        dispatch({ type: "SUCCESS" });
        return;
      }

      dispatch({ type: "SET_PROGRESS", value: Math.floor(progress) });
    }, 380);
  };

  const handleFileSelected = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // allow re-select same file later
    e.target.value = "";

    const validation = await validateFile(file);

    if (validation === "unsupported") {
      dispatch({ type: "UNSUPPORTED" });
      return;
    }

    dispatch({ type: "START_UPLOAD", file });
    simulateUpload();
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
    <div className="min-h-screen bg-white px-4 sm:px-8 lg:px-16 py-8">
      <UploadHeader
        title={headerTitle}
        subtitle={headerSubtitle}
        onBack={() => dispatch({ type: "BACK" })}
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={state.step}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.32, ease: "easeOut" }}
          className="mt-8"
        >
          {state.step === "initial" && (
            <UploadInitial onUploadClick={() => dispatch({ type: "GO_PICKER" })} />
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

          {state.step === "error" && (
            <UploadError onRetry={() => simulateUpload()} />
          )}

          {state.step === "unsupported" && (
            <UploadUnsupported onUploadAgain={() => dispatch({ type: "RESET" })} />
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
  );
}