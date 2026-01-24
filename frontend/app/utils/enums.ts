export enum FeedingType {
  Bottle = 0,
  Breast = 1,
  Solids = 2,
}

interface FeedingTypeConfig {
  label: string;
  color: 'primary' | 'secondary' | 'success' | 'default';
}

export const FeedingTypeStrategy: Record<number, FeedingTypeConfig> = {
  [FeedingType.Bottle]: { label: 'Bottle', color: 'secondary' },
  [FeedingType.Breast]: { label: 'Breast', color: 'primary' },
  [FeedingType.Solids]: { label: 'Solids', color: 'success' },
};

export const getFeedingTypeConfig = (type: number): FeedingTypeConfig => {
  return FeedingTypeStrategy[type] || { label: 'Unknown', color: 'default' };
};
