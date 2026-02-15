'use client';

import { useState, useEffect } from 'react';
import LogListContainer from '@/features/log/components/LogListContainer';
import CircularProgress from '@mui/material/CircularProgress';

export default function LogsPage() {
  const [babyId, setBabyId] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/Baby`)
      .then((res) => res.json())
      .then((data) => {
        if (data && data.length > 0) {
          setBabyId(data[0].id);
        }
      })
      .catch(console.error);
  }, []);

  if (!babyId) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#f9fafb]">
        <CircularProgress sx={{ color: '#786dce' }} />
      </div>
    );
  }

  return <LogListContainer babyId={babyId} />;
}
