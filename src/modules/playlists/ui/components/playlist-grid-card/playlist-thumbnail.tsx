import { cn } from "@/lib/utils";
import { FALLBACK_THUMBNAIL } from "@/modules/videos/constants";
import { ListVideoIcon, PlayIcon } from "lucide-react";
import Image from "next/image";

interface PlaylistThumbnailProps {
  thumbnailUrl?: string | null;
  title: string;
  videoCount: number;
  className?: string;
}

export const PlaylistThumbnail = ({
  thumbnailUrl,
  title,
  videoCount,
  className,
}: PlaylistThumbnailProps) => {
  return (
    <div className={cn("relative pt-3 group", className)}>
      <div className="relative">
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-[97%] overflow-hidden rounded-xl  bg-black/20 aspect-video" />
        <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-[98.5%] overflow-hidden rounded-xl  bg-black/25 aspect-video" />

        <div className="relative overflow-hidden w-full  rounded-xl aspect-video">
          <Image
            src={thumbnailUrl || FALLBACK_THUMBNAIL}
            className="w-full h-full object-cover"
            alt={title}
            fill
          />
          <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <div className="flex items-center gap-x-2">
              <PlayIcon className="text-white size-5 fill-white" />
              <span className="text-white font-medium">Play all</span>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-2 right-2 px-1 py-0.5 rounded bg-black/80 text-white text-xs font-medium flex items-center gap-x-1 ">
        <ListVideoIcon className="size-4" />
        {videoCount} videos
      </div>
    </div>
  );
};
