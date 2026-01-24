'use client';

import { useState } from 'react';
import { SpeedDial, SpeedDialIcon, SpeedDialAction } from '@mui/material';
import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import FeedingLogDialog from './FeedingLogDialog';

export default function DashboardFab() {
  const [openFeeding, setOpenFeeding] = useState(false);

  const actions = [
    { icon: <RestaurantMenuIcon />, name: 'Feeding', action: () => setOpenFeeding(true) },
    // Future: Growth, Excretion, Vacation
  ];

  return (
    <>
      <SpeedDial
        ariaLabel="Log Action"
        sx={{ position: 'fixed', bottom: 24, right: 24 }}
        icon={<SpeedDialIcon />}
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            onClick={action.action}
          />
        ))}
      </SpeedDial>

      <FeedingLogDialog 
        open={openFeeding} 
        onClose={() => setOpenFeeding(false)} 
      />
    </>
  );
}
