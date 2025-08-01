import React from "react";
import SubscriptionsVideosSection from "../sections/subscriptions-videos-section";

const SubscriptionsView = () => {
  return (
    <div className="max-w-[1200px] mx-auto mb-10 px-4 pt-2.5 flex flex-col gap-y-6">
      <div>
        <h1 className="text-2xl font-bold">Subscribed</h1>
        <p className="text-xs text-muted-foreground">
          Videos from your favourite creators
        </p>
      </div>
      <SubscriptionsVideosSection />
    </div>
  );
};

export default SubscriptionsView;
