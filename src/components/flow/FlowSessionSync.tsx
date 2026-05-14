"use client";

import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  buildFlowHrefFromSession,
  getFlowStateFromSearchParams,
  hasFlowParams,
  readFlowSession,
  writeFlowSession,
} from "@/lib/flow/localSession";

export function FlowSessionSync() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());

    if (hasFlowParams(params)) {
      writeFlowSession(getFlowStateFromSearchParams(params));
      return;
    }

    const storedSession = readFlowSession();

    if (!storedSession) {
      return;
    }

    router.replace(
      buildFlowHrefFromSession({
        existingSearch: searchParams.toString(),
        path: pathname,
        state: storedSession,
      }),
      { scroll: false },
    );
  }, [pathname, router, searchParams]);

  return null;
}
