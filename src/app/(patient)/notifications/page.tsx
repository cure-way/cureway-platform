import { requirePatient } from "@/lib/auth";
import { PageContainer } from "@/components/shared";

/**
 * Notifications Page (Protected)
 * View patient's notifications
 */
export default async function NotificationsPage() {
  // Require patient authentication
  await requirePatient();

  return (
    <PageContainer variant="account">
      <h1 className="text-2xl font-bold mb-4">Notifications</h1>

      <div className="space-y-3">
        <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-blue-500">
          <div className="flex justify-between items-start mb-1">
            <p className="font-medium text-sm">
              Your order is out for delivery
            </p>
            <span className="text-xs text-gray-400">2h ago</span>
          </div>
          <p className="text-gray-500 text-sm">Order #12345 is on its way</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-green-500">
          <div className="flex justify-between items-start mb-1">
            <p className="font-medium text-sm">Prescription verified</p>
            <span className="text-xs text-gray-400">1d ago</span>
          </div>
          <p className="text-gray-500 text-sm">
            Your prescription #P001 has been verified
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-yellow-500">
          <div className="flex justify-between items-start mb-1">
            <p className="font-medium text-sm">New offer available</p>
            <span className="text-xs text-gray-400">3d ago</span>
          </div>
          <p className="text-gray-500 text-sm">
            20% off on vitamins this week!
          </p>
        </div>
      </div>
    </PageContainer>
  );
}
