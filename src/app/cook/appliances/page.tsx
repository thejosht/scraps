import { AppShell, PageHeader, StepProgress } from "@/components/layout";
import { SecondaryButton, SurfaceCard } from "@/components/ui";

export default function AppliancesPlaceholderPage() {
  return (
    <AppShell showBottomNav={false} showDesktopNav={false}>
      <div className="space-y-5">
        <PageHeader
          eyebrow="Appliances"
          title="Appliance selection coming next."
          description="This placeholder keeps the flow target in place without building the appliance screen yet."
        />
        <SurfaceCard warm className="p-5 sm:p-6">
          <StepProgress currentStep={2} />
          <div className="mt-6">
            <SecondaryButton href="/cook">Back to situation</SecondaryButton>
          </div>
        </SurfaceCard>
      </div>
    </AppShell>
  );
}
