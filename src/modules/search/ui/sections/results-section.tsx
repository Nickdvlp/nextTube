"use client";

import { InfiniteScroll } from "@/components/infinite-scroll";
import { DEFAULT_LIMIT } from "@/constants";
import { useIsMobile } from "@/hooks/use-mobile";
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

interface ResultsSectionProps {
  query: string | undefined;
  categoryId: string | undefined;
}

const ResultsSection = ({ query, categoryId }: ResultsSectionProps) => {
  return (
    <Suspense
      fallback={<ResultsSectionSkeleton />}
      key={`${query}-${categoryId}`}
    >
      <ErrorBoundary fallback={<p>Error</p>}>
        <ResultsSectionSuspense query={query} categoryId={categoryId} />
      </ErrorBoundary>
    </Suspense>
  );
};

const ResultsSectionSkeleton = () => {
  return (
    <div>
      <div className="hidden flex-col gap-4 md:flex">
        {Array.from({ length: 5 }).map((_, i) => (
          <VideoRowCardSkeleton key={i} />
        ))}
      </div>
      <div className="md:hidden flex flex-col gap-4 gap-y-10 pt-6 ">
        {Array.from({ length: 5 }).map((_, i) => (
          <VideoGridCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
};

const ResultsSectionSuspense = ({ query, categoryId }: ResultsSectionProps) => {
  const isMobile = useIsMobile();
  const [results, resultQuery] = trpc.search.getMany.useSuspenseInfiniteQuery(
    {
      query,
      categoryId,
      limit: DEFAULT_LIMIT,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );
  return (
    <>
      {isMobile ? (
        <div className="flex flex-col gap-4 gap-y-10">
          {results.pages
            .flatMap((page) => page.items)
            .map((video) => (
              <VideoGridCard key={video.id} data={video} />
            ))}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {results.pages
            .flatMap((page) => page.items)
            .map((video) => (
              <VideoRowCard key={video.id} data={video} />
            ))}
        </div>
      )}
      <InfiniteScroll
        hasNextPage={resultQuery.hasNextPage}
        isFetchNextPage={resultQuery.isFetchingNextPage}
        fetchNextPage={resultQuery.fetchNextPage}
      />
    </>
  );
};

export default ResultsSection;
