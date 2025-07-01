import SubscriptionsView from "@/modules/subscriptions/ui/views/subscriptions-view";
import { HydrateClient, trpc } from "@/trpc/server";

const Page = async () => {
  void trpc.subscriptions.getMany.prefetchInfinite({
    limit: 5,
  });
  return (
    <HydrateClient>
      <SubscriptionsView />
    </HydrateClient>
  );
};

export default Page;
