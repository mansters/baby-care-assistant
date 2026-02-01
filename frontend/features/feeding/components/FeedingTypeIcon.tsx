import { ReactNode } from 'react';
import { Box } from '@mui/material';
import { FeedingType } from '@/lib/types';
import { TbBabyBottle } from "react-icons/tb";
import { FaPersonBreastfeeding } from "react-icons/fa6";
import { PiBowlSteamBold } from "react-icons/pi";

interface IconConfig {
    icon: ReactNode;
    color: string;
    label: string;
}

const ICON_SIZE_SMALL = 18;
const ICON_SIZE_LARGE = 64;

const createIconConfig = (size: number): Record<FeedingType, IconConfig> => ({
    [FeedingType.Bottle]: { icon: <TbBabyBottle size={size} />, color: '#2196F3', label: 'Formula Feed' },
    [FeedingType.Breast]: { icon: <FaPersonBreastfeeding size={size} />, color: '#E91E63', label: 'Breast Feed' },
    [FeedingType.Solids]: { icon: <PiBowlSteamBold size={size} />, color: '#4CAF50', label: 'Solids' },
});

const DEFAULT_CONFIG: IconConfig = { 
    icon: <TbBabyBottle size={ICON_SIZE_SMALL} />, 
    color: '#9E9E9E',
    label: 'Feed'
};

interface FeedingTypeIconProps {
    type: FeedingType;
}

export function FeedingTypeIcon({ type }: FeedingTypeIconProps) {
    const config = createIconConfig(ICON_SIZE_SMALL)[type] || DEFAULT_CONFIG;
    
    return (
        <Box sx={{ 
            bgcolor: config.color, 
            color: 'white',
            borderRadius: '50%',
            width: 32,
            height: 32,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
        }}>
            {config.icon}
        </Box>
    );
}

interface FeedingTypeLargeIconProps {
    type: FeedingType;
}

export function FeedingTypeLargeIcon({ type }: FeedingTypeLargeIconProps) {
    const config = createIconConfig(ICON_SIZE_LARGE)[type] || { ...DEFAULT_CONFIG, icon: <TbBabyBottle size={ICON_SIZE_LARGE} /> };
    
    return (
        <Box sx={{ color: config.color }}>
            {config.icon}
        </Box>
    );
}

export function getIconColor(type: FeedingType): string {
    return (createIconConfig(ICON_SIZE_SMALL)[type] || DEFAULT_CONFIG).color;
}

export function getFeedingLabel(type: FeedingType): string {
    return (createIconConfig(ICON_SIZE_SMALL)[type] || DEFAULT_CONFIG).label;
}
