import { useInterSectionObserver } from "@/hooks/use-intersection-observer";
import { useEffect } from "react";
import { Button } from "./ui/button";

interface InfiniteScrollProps {
  isManual?: boolean;
  hasNextPage: boolean;
  isFetchNextPage: boolean;
  fetchNextPage: () => void;
}

export const InfiniteScroll = ({
  isManual = false,
  hasNextPage,
  isFetchNextPage,
  fetchNextPage,
}: InfiniteScrollProps) => {
  const { targetRef, isIntersecting } = useInterSectionObserver({
    threshold: 0.5,
    rootMargin: "100px",
  });

  useEffect(() => {
    if (isIntersecting && hasNextPage && !isFetchNextPage && !isManual) {
      fetchNextPage();
    }
  }, [isIntersecting, hasNextPage, isFetchNextPage, isManual, fetchNextPage]);

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <div ref={targetRef} className="h-1" />
      {hasNextPage ? (
        <Button
          variant="secondary"
          disabled={!hasNextPage || isFetchNextPage}
          onClick={() => fetchNextPage()}
        >
          {isFetchNextPage ? "Loading..." : "Load More"}
        </Button>
      ) : (
        <p className="text-xs text-muted-foreground">
          You have reached end of the list.
        </p>
      )}
    </div>
  );
};
