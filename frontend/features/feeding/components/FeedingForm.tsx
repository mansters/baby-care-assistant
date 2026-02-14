'use client';

import React, { useState } from 'react';
import FormPageFrame from '@/shared/components/FormPageFrame';
import FormRow from '@/shared/components/FormRow';
import { Box, Typography } from '@mui/material';
import { FeatureTheme } from '@/lib/theme';

interface FeedingFormProps {
    onBack?: () => void;
    onSave?: (data: any) => void;
    initialData?: any;
    isSaving?: boolean;
    isEditing?: boolean;
}

export default function FeedingForm({ onBack, onSave, isSaving, initialData, isEditing = false }: FeedingFormProps) {
    const [startTime, setStartTime] = useState(initialData?.startTime ? new Date(initialData.startTime) : new Date());
    const [leftDuration, setLeftDuration] = useState<number>(initialData?.leftBreastDurationMinutes || 0);
    const [rightDuration, setRightDuration] = useState<number>(initialData?.rightBreastDurationMinutes || 0);
    const [feedingType, setFeedingType] = useState<'Nursing' | 'Bottle'>(initialData?.type === 0 ? 'Bottle' : 'Nursing');
    
    const [note, setNote] = useState<string>(initialData?.note || '');
    const [isNoteVisible, setIsNoteVisible] = useState(!!initialData?.note);

    const [mounted, setMounted] = useState(false);
    React.useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <FormPageFrame
            title={isEditing ? "Edit Feeding" : "Add Feeding"}
            themeColor={FeatureTheme.feeding.primary}
            onBack={onBack}
            isSaving={isSaving}
            onSave={() => onSave?.({
                startTime,
                leftDuration,
                rightDuration,
                type: feedingType,
                note: note
            })}
        >
            <div className="p-6 flex flex-col gap-6">
                
                {!isEditing && (
                    <div className="bg-[#f3f4f6] p-[4px] rounded-full flex h-[52px]">
                        <button 
                            className={`flex-1 rounded-full text-base font-medium transition-all h-[44px] flex items-center justify-center 
                                ${feedingType === 'Nursing' ? 'bg-[#ff6b9d] text-white shadow-sm' : 'text-[#4a5565]'}
                            `}
                            onClick={() => setFeedingType('Nursing')}
                        >
                            Nursing
                        </button>
                        <button 
                            className={`flex-1 rounded-full text-base font-medium transition-all h-[44px] flex items-center justify-center 
                                ${feedingType === 'Bottle' ? 'bg-[#ff6b9d] text-white shadow-sm' : 'text-[#4a5565]'}
                            `}
                            onClick={() => setFeedingType('Bottle')}
                        >
                            Bottle
                        </button>
                    </div>
                )}

                <div className="flex flex-col gap-4 bg-white rounded-2xl">
                    <FormRow label="Start Time">
                        <Typography sx={{ color: FeatureTheme.feeding.primary, fontWeight: 500, fontSize: '16px' }}>
                            {mounted ? startTime.toLocaleTimeString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : ''}
                        </Typography>
                    </FormRow>

                    <FormRow label="Left Breast">
                         <input 
                            type="number" 
                            value={leftDuration}
                            onChange={(e) => setLeftDuration(Number(e.target.value))}
                            className="text-right font-medium text-16px text-[#ff6b9d] w-24 outline-none bg-transparent placeholder-[#ff6b9d]/50" 
                            placeholder="0"
                            style={{ fontSize: '16px', color: leftDuration === 0 ? 'rgba(255, 107, 157, 0.5)' : '#ff6b9d' }}
                        />
                    </FormRow>

                    <FormRow label="Right Breast" showDivider={false}>
                        <input 
                            type="number" 
                            value={rightDuration}
                            onChange={(e) => setRightDuration(Number(e.target.value))}
                            className="text-right font-medium text-16px text-[#ff6b9d] w-24 outline-none bg-transparent placeholder-[#ff6b9d]/50" 
                            placeholder="0" 
                            style={{ fontSize: '16px', color: rightDuration === 0 ? 'rgba(255, 107, 157, 0.5)' : '#ff6b9d' }}
                        />
                    </FormRow>
                </div>

                {isNoteVisible ? (
                    <div className="flex flex-col gap-2">
                        <textarea
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder="Add a note..."
                            className="w-full p-4 bg-[#f9fafb] rounded-xl border border-[#e5e7eb] outline-none text-[#101828] text-base resize-none focus:border-[#ff6b9d] focus:ring-1 focus:ring-[#ff6b9d] transition-all"
                            rows={3}
                        />
                    </div>
                ) : (
                    <button 
                        onClick={() => setIsNoteVisible(true)}
                        className="text-[#99a1af] text-sm font-normal flex items-center gap-1 self-start ml-2 mt-4 hover:opacity-80 transition-opacity"
                    >
                        + add note
                    </button>
                )}

            </div>
        </FormPageFrame>
    );
}
