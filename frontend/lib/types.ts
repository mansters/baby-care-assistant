export enum FeedingType {
  Bottle,
  Breast,
  Solids
}

export interface FeedingLog {
  id: string;
  babyId: string;
  feedingTime: string;    
  durationMinutes: number;
  type: FeedingType;
  amountMl: number;
  note?: string;
}

export interface CreateFeedingLogRequest {
  babyId: string; 
  feedingTime: string;
  durationMinutes: number;
  type: FeedingType;
  amountMl: number;
  note?: string;
}

export interface UpdateFeedingLogRequest extends CreateFeedingLogRequest {
  id: string;
}

export interface GrowthLog {
  id: string;
  babyId: string;
  dateMeasured: string;
  weightKg: number;
  heightCm?: number;
  headCircumferenceCm?: number;
  note?: string;
}

export interface CreateGrowthLogRequest {
  babyId: string;
  dateMeasured: string;
  weightKg: number;
  heightCm?: number;
  headCircumferenceCm?: number;
  note?: string;
}

export interface UpdateGrowthLogRequest extends CreateGrowthLogRequest {
  id: string;
}

export interface Baby {
  id: string;
  name: string;
  dateOfBirth: string;
  gender?: string;
}

export interface CreateBabyRequest {
  name: string;
  dateOfBirth: string;
  gender?: string;
}

export interface UpdateBabyRequest extends CreateBabyRequest {
  id: string;
}
