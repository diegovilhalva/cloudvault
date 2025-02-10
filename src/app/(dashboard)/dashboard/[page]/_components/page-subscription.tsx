"use client"
import { getSubscription } from "@/action/subscription.action";
import { StorageCard, SubscriptionCancellationWidget } from "@/app/(dashboard)/_components/subscription/subs-widget";
import { P } from "@/components/custom/p";
import { ISubscription } from "@/lib/database/schema/subscription.model";
import { useQuery } from "@tanstack/react-query"


const SubscriptionPage = () => {
    const { data:subscription,isLoading,error } = useQuery({
        queryKey: ["subscription"],
        queryFn: getSubscription,
        refetchOnMount: false,
        refetchOnReconnect: false,
        refetchOnWindowFocus: false,
    })

    if (error)
        return (
          <P weight="bold" size="large">
            {error.message}
          </P>
        );
    return (
      <div className="space-y-6">
          <StorageCard
        subs={subscription?.data as ISubscription}
        isLoading={isLoading}
      />
        <SubscriptionCancellationWidget
        subs={subscription?.data as ISubscription}
        isLoading={isLoading}
      />
      </div>
    )
}

export default SubscriptionPage