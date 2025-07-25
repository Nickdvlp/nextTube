import React from "react";
import SubscriptionsSection from "../sections/subscriptions-section";

const SubscriptionsView = () => {
  return (
    <div className="max-w-[2400px] mx-auto mb-10 px-4 pt-2.5 flex flex-col gap-y-6">
      <div>
        <h1 className="text-2xl font-bold">Subscriptions</h1>
        <p className="text-xs text-muted-foreground">
          View and manage your subscriptions
        </p>
      </div>
      <SubscriptionsSection />
    </div>
  );
};

export default SubscriptionsView;
