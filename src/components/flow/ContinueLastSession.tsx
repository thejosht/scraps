"use client";

import { useSyncExternalStore } from "react";
import { SecondaryButton } from "@/components/ui";
import {
  buildFlowHrefFromSession,
  getResumeFlowPath,
  readFlowSession,
  subscribeToFlowSession,
  type FlowSessionState,
} from "@/lib/flow/localSession";

function getServerSessionSnapshot(): FlowSessionState | null {
  return null;
}

export function ContinueLastSession() {
  const session = useSyncExternalStore(
    subscribeToFlowSession,
    readFlowSession,
    getServerSessionSnapshot,
  );

  if (!session) {
    return null;
  }

  const resumeHref = buildFlowHrefFromSession({
    path: getResumeFlowPath(session),
    state: session,
  });

  return (
    <div className="mt-5 rounded-2xl border border-border bg-surface/75 p-4 shadow-[0_10px_24px_rgb(31_31_31/0.04)]">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-text-primary">
            Continue last session
          </p>
          <p className="mt-1 text-sm leading-6 text-text-secondary">
            Pick up with your saved choices in this browser.
          </p>
        </div>
        <SecondaryButton className="shrink-0" href={resumeHref}>
          Continue
        </SecondaryButton>
      </div>
    </div>
  );
}
