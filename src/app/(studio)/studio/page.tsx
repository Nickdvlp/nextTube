import { DEFAULT_LIMIT } from "@/constants";
import StudioView from "@/modules/studio/ui/view/studio-view";
import { trpc } from "@/trpc/server";
import { HydrateClient } from "@/trpc/server";
import React from "react";

export const dynamic = "force-dynamic";

const Page = async () => {
  void trpc.studio.getMany.prefetchInfinite({
    limit: DEFAULT_LIMIT,
  });
  return (
    <HydrateClient>
      <StudioView />
    </HydrateClient>
  );
};

export default Page;
