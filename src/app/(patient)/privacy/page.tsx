import { PageContainer, PageHeader } from "@/components/shared";

export default function PrivacyPolicyPage() {
  return (
    <PageContainer variant="account" className="flex flex-col gap-4">
      <PageHeader
        title="Privacy Policy"
        subtitle="Please provide clear details so we can help you faster."
      />

      <div className="w-full flex flex-col gap-4 items-center">
        <div className="w-full bg-white border border-primary-light rounded-2xl p-6 min-h-[335px] flex flex-col justify-center">
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
    </PageContainer>
  );
}
