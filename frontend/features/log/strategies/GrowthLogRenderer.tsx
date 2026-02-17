"use client";

import { ReactNode } from "react";
import { FiTrendingUp } from "react-icons/fi";
import {
  ILogRendererStrategy,
  ILogDrawerStrategy,
  GrowthDetails,
} from "@/features/log/types";
import { deleteGrowthLog } from "@/app/growth/actions";

export class GrowthLogRenderer
  implements ILogRendererStrategy, ILogDrawerStrategy
{
  private details: GrowthDetails;

  constructor(details: GrowthDetails) {
    this.details = details;
  }

  getIcon(): ReactNode {
    return <FiTrendingUp size={18} />;
  }

  getFeatureKey(): string {
    return "growth";
  }

  renderContent(): string {
    let content = `${this.details.weightKg} kg`;

    if (this.details.heightCm) {
      content += `　H: ${this.details.heightCm} cm`;
    }

    if (this.details.headCircumferenceCm) {
      content += `　HC: ${this.details.headCircumferenceCm} cm`;
    }

    return content;
  }

  getDrawerIcon(): ReactNode {
    return <FiTrendingUp size={40} color="#ffffff" />;
  }

  getPrimaryInfo(): string {
    return `${this.details.weightKg} kg`;
  }

  getSecondaryInfo(): string {
    const parts: string[] = [];
    if (this.details.heightCm != null) {
      parts.push(`Height: ${this.details.heightCm}cm`);
    }
    if (this.details.headCircumferenceCm != null) {
      parts.push(`HC: ${this.details.headCircumferenceCm}cm`);
    }
    return parts.join(" • ") || "Growth Record";
  }

  getUpdatePath(id: string): string {
    return `/growth/${id}`;
  }

  async deleteEntry(id: string): Promise<void> {
    await deleteGrowthLog(id);
  }
}
