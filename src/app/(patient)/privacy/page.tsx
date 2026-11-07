import { PageHeader } from "@/components/patient/PageHeader";

export default function PrivacyPolicyPage() {
  return (
    <div className="flex flex-col items-center gap-3 px-3 md:px-6 lg:px-12 py-6">
      <div className="w-full max-w-[1280px]">
        <PageHeader
          title="Privacy Policy"
          subtitle="Please provide clear details so we can help you faster."
        />
      </div>

      <div className="w-full max-w-[1130px] flex flex-col gap-4 items-center">
        <div className="w-full bg-white border border-primary-light rounded-3xl p-6 min-h-[335px] flex flex-col justify-center">
          <div className="text-t-17 font-semibold text-neutral-dark-active leading-[1.2] space-y-4">
            <p>Your privacy is important to us.</p>
            <p>
              We collect and use your information only to provide and improve
              our services.
            </p>
            <p>
              Your prescription data is encrypted and never shared with
              unauthorized parties.
            </p>
          </div>
        </div>

        <p className="text-t-21 font-normal text-neutral-dark-active leading-[1.5] text-center">
          By using this application, you agree to our privacy policy
        </p>
      </div>
    </div>
  );
}
