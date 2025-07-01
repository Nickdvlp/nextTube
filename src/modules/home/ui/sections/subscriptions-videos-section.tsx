"use client";

import { InfiniteScroll } from "@/components/infinite-scroll";
import { DEFAULT_LIMIT } from "@/constants";
import {
  VideoGridCard,
  VideoGridCardSkeleton,
} from "@/modules/videos/ui/components/video-grid-card";
import { trpc } from "@/trpc/client";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

const SubscriptionsVideosSection = () => {
  return (
    <Suspense fallback={<SubscriptionsVideosSectionSkeleton />}>
      <ErrorBoundary fallback={<p>Error</p>}>
        <SubscriptionsVideosSectionSuspense />
      </ErrorBoundary>
    </Suspense>
  );
};

const SubscriptionsVideosSectionSkeleton = () => {
  return (
    <div className="gap-4 w-2xl gap-y-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4">
      {Array.from({ length: 18 }).map((_, i) => (
        <VideoGridCardSkeleton key={i} />
      ))}
    </div>
  );
};
const SubscriptionsVideosSectionSuspense = () => {
  const [videos, query] =
    trpc.videos.getManySubscribed.useSuspenseInfiniteQuery(
      {
        limit: DEFAULT_LIMIT,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      }
    );
  return (
    <div className="">
      <div className="gap-4 gap-y-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4">
        {videos.pages
          .flatMap((page) => page.items)
          .map((video) => (
            <VideoGridCard data={video} key={video.id} />
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

export default SubscriptionsVideosSection;
