import { ReactNode } from 'react';
import { Box } from '@mui/material';
import { FeedingType } from '@/lib/api-client';
import { TbBabyBottle } from "react-icons/tb";
import { FaPersonBreastfeeding } from "react-icons/fa6";
import { PiBowlSteamBold } from "react-icons/pi";

interface IconConfig {
    icon: ReactNode;
    color: string;
}

const FEEDING_ICON_CONFIG: Record<FeedingType, IconConfig> = {
    [FeedingType.Bottle]: { icon: <TbBabyBottle size={18} />, color: '#2196F3' },
    [FeedingType.Breast]: { icon: <FaPersonBreastfeeding size={18} />, color: '#E91E63' },
    [FeedingType.Solids]: { icon: <PiBowlSteamBold size={18} />, color: '#4CAF50' },
};

const DEFAULT_ICON_CONFIG: IconConfig = { 
    icon: <TbBabyBottle size={18} />, 
    color: '#9E9E9E' 
};

interface FeedingTypeIconProps {
    type: FeedingType;
}

export function FeedingTypeIcon({ type }: FeedingTypeIconProps) {
    const config = FEEDING_ICON_CONFIG[type] || DEFAULT_ICON_CONFIG;
    
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

export function getIconColor(type: FeedingType): string {
    return (FEEDING_ICON_CONFIG[type] || DEFAULT_ICON_CONFIG).color;
}
