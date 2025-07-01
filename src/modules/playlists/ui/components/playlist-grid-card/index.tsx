import { PlaylistGetManyOutput } from "@/modules/playlists/types";
import { FALLBACK_THUMBNAIL } from "@/modules/videos/constants";
import Link from "next/link";
import { PlaylistThumbnail } from "./playlist-thumbnail";
import { PlaylistInfo } from "./playlist-info";

interface PlaylistsGridCardProps {
  data: PlaylistGetManyOutput["items"][number];
}

export const PlaylistsGridCard = ({ data }: PlaylistsGridCardProps) => {
  return (
    <Link href={`/playlists/${data.id}`}>
      <div className="flex flex-col gap-2 w-full group">
        <PlaylistThumbnail
          thumbnailUrl={data.thumbnailUrl || FALLBACK_THUMBNAIL}
          title={data.name}
          videoCount={data.videoCount}
        />
        <PlaylistInfo data={data} />
      </div>
    </Link>
  );
};
