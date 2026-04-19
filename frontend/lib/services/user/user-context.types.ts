export interface BabyDto {
  id: string;
  firstName: string;
  lastName: string;
  preferredName?: string;
  dateOfBirth: string;
  timeZone: string;
  gender: string;
}

export interface ContextFamilyDto {
  id: string;
  name: string;
  role: number;
  babies: BabyDto[];
}

export interface UserProfileDto {
  id: string;
  cognitoSubjectId: string;
  email: string;
  displayName: string;
}

export interface UserContextDto {
  status: string;
  userProfile: UserProfileDto;
  families: ContextFamilyDto[];
}
