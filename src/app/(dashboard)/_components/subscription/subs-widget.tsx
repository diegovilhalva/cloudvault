"use client";

import { P, paragraphVariants } from "@/components/custom/p";

import { Button } from "@/components/ui/button";
import { RiHardDrive2Fill, RiLoader3Fill } from "@remixicon/react";
import { Dispatch, SetStateAction, useState } from "react";

import { z } from "zod";

import { Card, CardContent } from "@/components/ui/card";
import { cn, formatFileSize, parseError } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { ISubscription } from "@/lib/database/schema/subscription.model";
import { Skeleton } from "@/components/ui/skeleton";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import usePaddle from "@/hooks/use-paddle";

import { cancelSubscription, createPaddlePrice } from "@/action/paddle.action";
import { APP_URL } from "@/lib/env";

interface Props {
  isLoading: boolean;
  subs: ISubscription;
}

const SubscriptionCancellationWidget = ({ isLoading, subs }: Props) => {
  async function handleCancelSubscription() {
    try {
      const res = await cancelSubscription(subs);

      const { description, status, message } = res;

      if (status !== 200) {
        throw description;
      }

      toast(message, {
        description,
      });
    } catch (error) {
      console.log("Error in subscription cancellation widget: ", error);

      const err = parseError(error);

      toast("Error", {
        description: err,
      });
    }
  }

  return (
    <>
      <div className="relative overflow-hidden rounded-lg border-2 border-red-500/20 bg-gradient-to-r from-red-500/5 to-background p-6 shadow-lg transition-all hover:shadow-xl group">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-dark/10" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <h4 className="font-semibold text-lg tracking-tight text-red-500/80">
              Cancel Subscription
            </h4>
            <P className="text-muted-foreground">
              Schedule your subscription cancellation for the end of your
              current billing cycle.
              <span className="block mt-1 text-sm opacity-75">
                ⚠️ This action cannot be undone after the billing cycle ends.
              </span>
            </P>
          </div>

          <Button
            variant="lift"
            className="w-[180px]"
            disabled={isLoading || subs?.subscriptionType === "free"}
            onClick={handleCancelSubscription}
          >
            {!isLoading ? (
              <span className="flex items-center gap-2">
                🚫 Cancel Subscription
              </span>
            ) : (
              <RiLoader3Fill className="animate-spin" />
            )}
          </Button>
        </div>
      </div>
    </>
  );
};

const StorageCard = ({ isLoading, subs }: Props) => {
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const usedStorage = formatFileSize(subs?.usedStorage);
  const selectedStorage = formatFileSize(subs?.selectedStorage);
  const percentageUsedStorage =
    (subs?.usedStorage / subs?.selectedStorage) * 100;

  return (
    <>
      <Card className="bg-primary text-white border-none shadow-lg transition-all hover:shadow-xl rounded-lg">
        <CardContent className="space-y-2 py-8">
          <div className="flex gap-x-6 items-center justify-between">
            <div className="space-y-4">
              <P
                className="flex items-center justify-start gap-2 w-full h-fit"
                size="large"
                weight="bold"
              >
                {!isLoading ? (
                  <RiHardDrive2Fill />
                ) : (
                  <RiLoader3Fill className="animate-spin" />
                )}{" "}
                Storage
              </P>
              {!isLoading ? (
                <>
                  <span
                    className={cn(
                      paragraphVariants({ size: "small", weight: "medium" }),
                      "text-start w-full inline-block"
                    )}
                  >
                    <b>Available Storage</b> {usedStorage} / {selectedStorage}
                  </span>
                  <Progress
                    value={percentageUsedStorage}
                    className="bg-white/20"
                  />
                </>
              ) : (
                <Skeleton className="w-40 h-5 rounded-md bg-white/50" />
              )}
            </div>

            <div>
              <Button
                variant="secondary"
                className="w-full"
                disabled={isLoading}
                onClick={() => {
                  if (
                    subs.status === "activated" &&
                    subs.subscriptionType !== "free"
                  ) {
                    toast("⚠️ Warning", {
                      description:
                        "To upgrade your storage, please cancel your existing subscription first.",
                    });

                    return;
                  }
                  setIsAlertOpen(true);
                }}
              >
                {!isLoading ? (
                  "Get more Storage"
                ) : (
                  <RiLoader3Fill className="animate-spin" />
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <AddStorageAlert
        isAlertOpen={isAlertOpen}
        setIsAlertOpen={setIsAlertOpen}
      />
    </>
  );
};

const formSchema = z.object({
  storage: z.string().min(1, "Please select storage"),
});

const AddStorageAlert = ({
  isAlertOpen,
  setIsAlertOpen,
}: {
  isAlertOpen: boolean;
  setIsAlertOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const paddle = usePaddle();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      storage: "",
    },
  });

  const {
    formState: { isSubmitting },
  } = form;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const storage = Number(values.storage);
    const storageInByte = Number(values.storage) * 1073741824;

    try {
      const res = await createPaddlePrice(storage, storageInByte);
      const { data, status, description, user } = res;

      if (status !== 201 || !data || !user) {
        throw description;
      }

      const { id } = data;

      paddle?.Checkout.open({
        settings: {
          displayMode: "overlay",
          theme: "light",
          locale: "en",
          successUrl: `${APP_URL}/dashboard/`,
        },
        customer: {
          email: user.email,
        },
        items: [
          {
            priceId: id,
            quantity: 1,
          },
        ],
        customData: {
          entityType: "subscription",
          customer: {
            id: user.id,
            email: user.email,
            entityType: "customer",
            extraStorageInByte: storageInByte,
            extraStorageInGB: storage,
          },
        },
      });
    } catch (error) {
      console.log("Error in opening checkout page: ", error);

      toast("Error", {
        description: `${error}`,
      });
    }
  }

  return (
    <Dialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select Extra storage you want</DialogTitle>
        </DialogHeader>
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="storage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Storage</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="select storage"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button variant="lift" type="submit" disabled={isSubmitting}>
                {!isSubmitting ? (
                  "Get now"
                ) : (
                  <RiLoader3Fill className="animate-spin" />
                )}
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export { SubscriptionCancellationWidget, StorageCard };