import React from "react";

import { PlaylistHeaderSection } from "../sections/playlist-header-section";
import PlaylistVideosSection from "../sections/playlist-videos-section";
interface VideosViewProps {
  playlistId: string;
}
const VideosView = ({ playlistId }: VideosViewProps) => {
  return (
    <div className="max-w-[2400px] mx-auto mb-10 px-4 pt-2.5 flex flex-col gap-y-6">
      <PlaylistHeaderSection playlistId={playlistId} />
      <PlaylistVideosSection playlistId={playlistId} />
    </div>
  );
};

export default VideosView;
