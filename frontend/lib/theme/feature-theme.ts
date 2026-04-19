/**
 * Feature Theme Colors
 *
 * Each feature has:
 * - primary: Main accent color for headers, buttons, icons
 * - primaryLight: Muted version for optional/inactive states (50% opacity = 80 hex)
 * - surface: Light background for cards and containers (12% opacity = 1F hex)
 * - surfaceLight: Very subtle background (7% opacity = 12 hex)
 */

export const FeatureTheme = {
  feeding: {
    primary: "#FF6B9D",
    primaryLight: "#FF6B9D80",
    surface: "#FF6B9D1F",
    surfaceLight: "#FF6B9D12",
  },
  insight: {
    primary: "#4ECDC4",
    primaryLight: "#4ECDC480",
    surface: "#4ECDC41F",
    surfaceLight: "#4ECDC412",
  },
  diaper: {
    primary: "#FFB347",
    primaryLight: "#FFB34780",
    surface: "#FFB3471F",
    surfaceLight: "#FFB34712",
  },
  growth: {
    primary: "#66BB6A",
    primaryLight: "#66BB6A80",
    surface: "#66BB6A1F",
    surfaceLight: "#66BB6A12",
  },
  vaccine: {
    primary: "#786DCE",
    primaryLight: "#786DCE80",
    surface: "#786DCE1F",
    surfaceLight: "#786DCE12",
  },
  milestone: {
    primary: "#E91E63",
    primaryLight: "#E91E6380",
    surface: "#E91E631F",
    surfaceLight: "#E91E6312",
  },
} as const;

export type FeatureType = keyof typeof FeatureTheme;

/** CSS class names for each feature */
export const FeatureClassName: Record<FeatureType, string> = {
  feeding: "feature-feeding",
  insight: "feature-insight",
  diaper: "feature-diaper",
  growth: "feature-growth",
  vaccine: "feature-vaccine",
  milestone: "feature-milestone",
};
