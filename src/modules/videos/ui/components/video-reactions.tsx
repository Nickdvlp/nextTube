import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { ThumbsDownIcon, ThumbsUpIcon } from "lucide-react";
import { VideoGetOntOutput } from "../../types";
import { useClerk } from "@clerk/nextjs";
import { trpc } from "@/trpc/client";
import { toast } from "sonner";

interface VideoReactionsProps {
  videoId: string;
  likes: number;
  dislikes: number;
  viewerReaction: VideoGetOntOutput["viewerReaction"];
}
const VideoReactions = ({
  videoId,
  likes,
  dislikes,
  viewerReaction,
}: VideoReactionsProps) => {
  const clerk = useClerk();
  const utils = trpc.useUtils();

  const like = trpc.videoReactions.like.useMutation({
    onSuccess: () => {
      utils.videos.getOne.invalidate({ id: videoId });
      utils.playlists.getLiked.invalidate();
    },

    onError: (error) => {
      toast.error("Something went wrong");
      if (error.data?.code === "UNAUTHORIZED") {
        clerk.openSignIn();
      }
    },
  });
  const dislike = trpc.videoReactions.dislike.useMutation({
    onSuccess: () => {
      utils.videos.getOne.invalidate({ id: videoId });
      utils.playlists.getLiked.invalidate();
    },

    onError: (error) => {
      toast.error("Something went wrong");
      if (error.data?.code === "UNAUTHORIZED") {
        clerk.openSignIn();
      }
    },
  });

  return (
    <div className="flex items-center flex-none">
      <Button
        onClick={() => like.mutate({ videoId })}
        disabled={like.isPending || dislike.isPending}
        variant="secondary"
        className="rounded-full rounded-r-none gap-2 pr-4 cursor-pointer"
      >
        <ThumbsUpIcon
          className={cn("size-5", viewerReaction === "like" && "fill-black")}
        />
        {likes}
      </Button>
      <Separator orientation="vertical" className="h-7" />
      <Button
        variant="secondary"
        className="rounded-full rounded-l-none pl-3 cursor-pointer"
        onClick={() => dislike.mutate({ videoId })}
        disabled={like.isPending || dislike.isPending}
      >
        <ThumbsDownIcon
          className={cn("size-5", viewerReaction === "dislike" && "fill-black")}
        />
        {dislikes}
      </Button>
    </div>
  );
};

export default VideoReactions;
