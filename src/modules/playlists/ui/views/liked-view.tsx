import React from "react";
import LikedVideoSection from "../sections/liked-video-section";

const LikedView = () => {
  return (
    <div className="max-w-[1200px] mx-auto mb-10 px-4 pt-2.5 flex flex-col gap-y-6">
      <div>
        <h1 className="text-2xl font-bold">Liked Videos</h1>
        <p className="text-xs text-muted-foreground">Videos you have Liked</p>
      </div>
      <LikedVideoSection />
    </div>
  );
};

export default LikedView;
