"use client";

import { useRouter } from "next/navigation";
import { SecondaryButton } from "@/components/ui";
import { clearFlowSession } from "@/lib/flow/localSession";

type ClearFlowButtonProps = {
  className?: string;
  label?: string;
  redirectTo?: string;
};

export function ClearFlowButton({
  className,
  label = "Start over",
  redirectTo = "/",
}: ClearFlowButtonProps) {
  const router = useRouter();

  return (
    <SecondaryButton
      className={className}
      onClick={() => {
        clearFlowSession();
        router.push(redirectTo);
      }}
    >
      {label}
    </SecondaryButton>
  );
}
