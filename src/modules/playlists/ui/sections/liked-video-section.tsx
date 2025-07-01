"use client";

import { InfiniteScroll } from "@/components/infinite-scroll";
import { DEFAULT_LIMIT } from "@/constants";
import {
  VideoGridCard,
  VideoGridCardSkeleton,
} from "@/modules/videos/ui/components/video-grid-card";
import {
  VideoRowCard,
  VideoRowCardSkeleton,
} from "@/modules/videos/ui/components/video-row-card";
import { trpc } from "@/trpc/client";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

const LikedVideoSection = () => {
  return (
    <Suspense fallback={<LikedVideoSectionSkeleton />}>
      <ErrorBoundary fallback={<p>Error</p>}>
        <LikedVideoSectionSuspense />
      </ErrorBoundary>
    </Suspense>
  );
};

const LikedVideoSectionSkeleton = () => {
  return (
    <div>
      <div className="gap-4 w-screen gap-y-10 md:grid md:grid-cols-3  hidden">
        {Array.from({ length: 18 }).map((_, i) => (
          <VideoGridCardSkeleton key={i} />
        ))}
      </div>
      <div className="flex flex-col gap-4 md:hidden w-2xl ">
        {Array.from({ length: 18 }).map((_, i) => (
          <VideoRowCardSkeleton key={i} size="compact" />
        ))}
      </div>
    </div>
  );
};
const LikedVideoSectionSuspense = () => {
  const [videos, query] = trpc.playlists.getLiked.useSuspenseInfiniteQuery(
    {
      limit: DEFAULT_LIMIT,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );
  return (
    <div>
      <div className="md:grid grid-cols-1 md:grid-cols-3 gap-4 gap-y-10 hidden">
        {videos.pages
          .flatMap((page) => page.items)
          .map((video) => (
            <VideoGridCard data={video} key={video.id} />
          ))}
      </div>
      <div className="md:hidden flex-col gap-4 flex">
        {videos.pages
          .flatMap((page) => page.items)
          .map((video) => (
            <VideoRowCard data={video} key={video.id} size="compact" />
          ))}
      </div>
      <InfiniteScroll
        hasNextPage={query.hasNextPage}
        isFetchNextPage={query.isFetchingNextPage}
        fetchNextPage={query.fetchNextPage}
      />
    </div>
  );
};

export default LikedVideoSection;
