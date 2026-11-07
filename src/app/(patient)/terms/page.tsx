import { PageContainer, PageHeader } from "@/components/shared";

const termsData = [
  {
    title: "Use of the Service",
    content:
      "The application allows users to upload medical prescriptions and send them to licensed pharmacies in order to receive availability and price offers. The application does not provide medical advice and does not replace consultation with a doctor or pharmacist.",
  },
  {
    title: "Medical Prescriptions",
    content:
      "Users are responsible for uploading clear, valid, and accurate prescriptions. The application is not responsible for errors resulting from unclear images or incorrect information provided by the user.",
  },
  {
    title: "Pharmacy Responsibility",
    content:
      "Pharmacies are responsible for reviewing prescriptions, confirming medicine availability, suggesting alternatives when applicable, and providing final pricing and preparation time. The final decision to dispense any medication remains with the pharmacy.",
  },
  {
    title: "Pricing and Payments",
    content:
      "Prices are set by pharmacies and may vary. The application is not responsible for price changes after an order has been confirmed.",
  },
  {
    title: "Privacy and Data Protection",
    content:
      "We are committed to protecting user data and medical prescriptions. Information is shared only with selected pharmacies for the purpose of fulfilling the request.",
  },
  {
    title: "Order Cancellation",
    content:
      "Users may cancel a request before it is confirmed by a pharmacy. After confirmation, cancellation is subject to the pharmacy's policy.",
  },
  {
    title: "Limitation of Liability",
    content:
      "The application is not liable for any misuse of medication or failure to follow medical or pharmaceutical instructions.",
  },
  {
    title: "Changes to Terms",
    content:
      "The application reserves the right to update these Terms and Conditions at any time. Users will be notified of significant changes.",
  },
];

export default function TermsPage() {
  return (
    <PageContainer variant="account" className="flex flex-col gap-4">
      <PageHeader
        title="Terms & Conditions"
        subtitle="By using this application, you agree to the following Terms and Conditions:"
      />

      <div className="w-full bg-white border-[5px] border-primary-light rounded-2xl shadow-card px-8 md:px-20 py-10">
        <ol className="list-decimal list-outside space-y-2 pl-6">
          {termsData.map((item) => (
            <li key={item.title} className="text-t-14 leading-[1.2]">
              <span className="font-semibold text-black">{item.title}</span>
              <br />
              <span className="font-normal text-neutral-dark-active leading-[1.2]">
                {item.content}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </PageContainer>
  );
}
