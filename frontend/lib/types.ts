export enum FeedingType {
  Bottle = 'Bottle',
  Breast = 'Breast',
  Solids = 'Solids'
}

export interface FeedingLog {
  sk: string;
  babyId: string;
  feedingTime?: string; // Legacy
  eventTimeUtc: string;
  localDateTime: string;

  type: FeedingType;
  amountMl: number;
  leftBreastDurationMinutes?: number;
  rightBreastDurationMinutes?: number;
  note?: string;
}

export interface CreateFeedingLogRequest {
  babyId: string; 
  localDateTime: string;

  type: FeedingType;
  amountMl: number;
  leftBreastDurationMinutes?: number;
  rightBreastDurationMinutes?: number;
  note?: string;
}

export interface UpdateFeedingLogRequest extends CreateFeedingLogRequest {
  sk: string;
}

export interface GrowthLog {
  sk: string;
  babyId: string;
  dateMeasured?: string; // Legacy
  eventTimeUtc: string;
  localDateTime: string;
  weightKg: number;
  heightCm?: number;
  headCircumferenceCm?: number;
  note?: string;
}

export interface CreateGrowthLogRequest {
  babyId: string;
  localDateTime: string;
  weightKg: number;
  heightCm?: number;
  headCircumferenceCm?: number;
  note?: string;
}

export interface UpdateGrowthLogRequest extends CreateGrowthLogRequest {
  sk: string;
}

export interface Baby {
  babyId: string;
  name: string;
  dateOfBirth: string;
  gender?: string;
  timeZone?: string;
}

export interface CreateBabyRequest {
  name: string;
  dateOfBirth: string;
  gender?: string;
}

export interface UpdateBabyRequest extends CreateBabyRequest {
  babyId: string;
}
