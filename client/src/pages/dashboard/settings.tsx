import DashboardLayout from "@/components/dashboard/layout";
import StoreSettingsForm from "@/features/stores/components/store-settings-form";

export default function StoreSettingsPage() {
  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <StoreSettingsForm />
      </div>
    </DashboardLayout>
  );
}
