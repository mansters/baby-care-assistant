"use client";

import { ReactNode } from "react";
import { TbBabyBottle } from "react-icons/tb";
import { FaPersonBreastfeeding } from "react-icons/fa6";
import {
  ILogRendererStrategy,
  ILogDrawerStrategy,
  FeedingDetails,
} from "@/features/log/types";
import { deleteFeedingLog } from "@/app/feeding/actions";

export class FeedingLogRenderer
  implements ILogRendererStrategy, ILogDrawerStrategy
{
  private details: FeedingDetails;

  constructor(details: FeedingDetails) {
    this.details = details;
  }

  getIcon(details: FeedingDetails): ReactNode {
    if (details.feedingType === "Breast") {
      return <FaPersonBreastfeeding size={18} />;
    }

    return <TbBabyBottle size={18} />;
  }

  getFeatureKey(): string {
    return "feeding";
  }

  renderContent(): string {
    const {
      feedingType,
      leftBreastDurationMinutes,
      rightBreastDurationMinutes,
      amountMl,
    } = this.details;

    if (feedingType === "Breast") {
      const parts: string[] = [];
      if (leftBreastDurationMinutes != null)
        parts.push(`L: ${leftBreastDurationMinutes}min`);
      if (rightBreastDurationMinutes != null)
        parts.push(`R: ${rightBreastDurationMinutes}min`);
      return parts.join(" | ");
    }

    if (feedingType === "Bottle") {
      return `${amountMl}ml Formula`;
    }

    return `${amountMl}ml ${feedingType}`;
  }

  getDrawerIcon(details: FeedingDetails): ReactNode {
    if (details.feedingType === "Breast") {
      return <FaPersonBreastfeeding size={40} color="#ffffff" />;
    }
    return <TbBabyBottle size={40} color="#ffffff" />;
  }

  getPrimaryInfo(): string {
    const {
      feedingType,
      leftBreastDurationMinutes,
      rightBreastDurationMinutes,
      amountMl,
    } = this.details;

    if (feedingType === "Breast") {
      const total =
        (leftBreastDurationMinutes || 0) + (rightBreastDurationMinutes || 0);
      return `${total} min`;
    }

    return `${amountMl} ml`;
  }

  getSecondaryInfo(): string {
    const {
      feedingType,
      leftBreastDurationMinutes,
      rightBreastDurationMinutes,
      amountMl,
    } = this.details;

    if (feedingType === "Breast") {
      const parts: string[] = [];
      if (leftBreastDurationMinutes != null)
        parts.push(`L: ${leftBreastDurationMinutes}m`);
      if (rightBreastDurationMinutes != null)
        parts.push(`R: ${rightBreastDurationMinutes}m`);
      return `Nursing • ${parts.join(" | ")}`;
    }

    return `Bottle • ${amountMl}ml Formula`;
  }

  getUpdatePath(babyId: string, sk: string): string {
    return `/feeding/edit?babyId=${babyId}&sk=${encodeURIComponent(sk)}`;
  }

  async deleteEntry(babyId: string, sk: string): Promise<void> {
    await deleteFeedingLog(babyId, sk);
  }
}
