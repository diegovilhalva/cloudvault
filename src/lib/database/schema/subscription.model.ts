import mongoose, { Model, Schema } from "mongoose";
import { Document } from "mongoose";

export interface ISubscription {
  subscriptionType: "free" | "paid";
  subscriber: mongoose.Types.ObjectId | string; // User who subscribed
  selectedStorage: number; // Storage in Bytes
  usedStorage: number; // Storage in Bytes
  pricePerGB: number; // Price per GB
  totalPrice: number; // Calculated total price
  billing: {
    cycle: "month" | "year";
    billingStart: Date;
    billingEnd: Date;
  };
  status: "activated" | "canceled";
  gateway?: {
    provider: "stripe" | "paddle";
    paddle: {
      priceId: string;
      subscription: {
        id: string;
        entityType: string;
      };
    };
  };
  createdAt: Date;
  updatedAt: Date;
}

interface SubscriptionModel extends ISubscription, Document {}

const subscriptionSchema: Schema<SubscriptionModel> = new Schema(
  {
    subscriber: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    subscriptionType: {
      type: String,
      enum: ["free", "paid"],
      required: true,
      default: "free",
    },
    selectedStorage: { type: Number, required: true, default: 16105174016 }, // in Bites
    usedStorage: { type: Number, required: true, default: 0 }, // in Bites
    pricePerGB: { type: Number, default: 0.23 }, // $0.2 per GB
    totalPrice: {
      type: Number,
      required: true,
      default: 0,
    },
    billing: {
      cycle: { type: String, enum: ["month", "year"] },
      billingStart: { type: Date },
      billingEnd: { type: Date },
    },
    status: {
      type: String,
      required: true,
      enum: ["activated", "canceled"],
    },
    gateway: {
      provider: {
        type: String,
        enum: ["stripe", "paddle"],
      },
      paddle: {
        priceId: { type: String },
        subscription: {
          id: { type: String },
          entityType: { type: String },
        },
      },
    },
  },
  { timestamps: true }
);

export const Subscription: Model<SubscriptionModel> =
  mongoose.models.Subscription ||
  mongoose.model<SubscriptionModel>("Subscription", subscriptionSchema);