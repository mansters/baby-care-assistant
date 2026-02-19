export interface TimezoneOption {
  id: string;
  label: string;
  flag: string;
}

export const TIMEZONE_OPTIONS: TimezoneOption[] = [
  { id: 'Asia/Shanghai', label: 'Beijing', flag: '🇨🇳' },
  { id: 'Pacific/Auckland', label: 'Auckland', flag: '🇳🇿' },
];

export const DEFAULT_TIMEZONE = 'Asia/Shanghai';
export const TIMEZONE_STORAGE_KEY = 'app_timezone';
