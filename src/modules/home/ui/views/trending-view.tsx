import React from "react";

import TrendingVideosSection from "../sections/trending-videos-section";

const TrendingView = () => {
  return (
    <div className="max-w-[1200px] mx-auto mb-10 px-4 pt-2.5 flex flex-col gap-y-6">
      <div>
        <h1 className="text-2xl font-bold">Trending</h1>
        <p className="text-xs text-muted-foreground">
          Most Popular videos at the moment
        </p>
      </div>
      <TrendingVideosSection />
    </div>
  );
};

export default TrendingView;
