'use client';

import {useForm, Controller} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {z} from 'zod';
import {
    Box,
    Button,
    TextField,
    MenuItem,
    Paper,
    Typography
} from '@mui/material';
import {useRouter} from "next/navigation";
import { feedingService } from "@/lib/services/feeding/feeding.service.client";
import { FeedingType, FeedingLog } from "@/lib/types";
import { toUTCISO, getCurrentLocalForInput, toLocalInput } from "@shared/utils/date-utils";

interface FeedingFormProps {
    onSuccess?: () => void;
    initialData?: FeedingLog;
}

const feedingSchema = z.object({
    type: z.nativeEnum(FeedingType),
    amountMl: z.number().min(0, 'Amount must be positive').optional(),
    durationMinutes: z.number().min(1, 'Duration must be at least 1 min'),
    feedingTime: z.string().nonempty('Time is required'),
    note: z.string().max(3000, 'Note must be less than 3000 characters').optional(),
});

type FeedingFormData = z.infer<typeof feedingSchema>;

export default function FeedingForm({ onSuccess, initialData }: FeedingFormProps) {
    const router = useRouter();

    const {
        register,
        control,
        handleSubmit,
        formState: {errors, isSubmitting},
        reset
    } = useForm<FeedingFormData>({
        resolver: zodResolver(feedingSchema),
        defaultValues: {
            type: initialData ? initialData.type : FeedingType.Bottle, 
            amountMl: initialData?.amountMl ?? 0,
            durationMinutes: initialData?.durationMinutes ?? 15,
            feedingTime: initialData ? toLocalInput(initialData.feedingTime) : getCurrentLocalForInput(),
            note: initialData?.note ?? ''
        }
    });

    const onSubmit = async (data: FeedingFormData) => {
        try {
            const payload = {
                babyId: '3fa85f64-5717-4562-b3fc-2c963f66afa6', 
                feedingTime: toUTCISO(data.feedingTime), 
                type: Number(data.type),
                durationMinutes: data.durationMinutes,
                amountMl: data.amountMl || 0, // Ensure 0 if undefined/null
                note: data.note || undefined,
            };
            
            if (initialData) {
                await feedingService.update(initialData.id, { ...payload, id: initialData.id });
            } else {
                await feedingService.create(payload);
            }
            
            reset();
            router.refresh();

            onSuccess?.();
        } catch (error) {
            console.error('Failed to log feed', error);
            alert('Error saving data. Is the backend running?');
        }
    };

    return (
        <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{
                display: 'flex',
                flexDirection: 'column', 
                gap: 3,                  
                mt: 1                    
            }}
        >

            {/* Type Selector */}
            <Controller
                name="type"
                control={control}
                render={({ field }) => (
                    <TextField
                        {...field}
                        select
                        label="Type"
                        error={!!errors.type}
                        helperText={errors.type?.message}
                        fullWidth
                    >
                        <MenuItem value={FeedingType.Bottle}>Bottle</MenuItem>
                        <MenuItem value={FeedingType.Breast}>Breast</MenuItem>
                        <MenuItem value={FeedingType.Solids}>Solids</MenuItem>
                    </TextField>
                )}
            />

            {/* Amount and Duration */}
            <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                    label="Amount (ml)"
                    type="number"
                    {...register('amountMl', { valueAsNumber: true })}
                    error={!!errors.amountMl}
                    helperText={errors.amountMl?.message}
                    fullWidth
                    slotProps={{ htmlInput: { step: "1" } }}
                />

                <TextField
                    label="Duration (min)"
                    type="number"
                    {...register('durationMinutes', { valueAsNumber: true })}
                    error={!!errors.durationMinutes}
                    helperText={errors.durationMinutes?.message}
                    fullWidth
                />
            </Box>

            {/* Time Picker */}
            <TextField
                type="datetime-local"
                label="Time"
                {...register('feedingTime')}
                error={!!errors.feedingTime}
                helperText={errors.feedingTime?.message}
                slotProps={{
                    inputLabel: { shrink: true }
                }}
                fullWidth
            />

            {/* Note Field */}
            <TextField
                label="Note (Optional)"
                multiline
                rows={3}
                {...register('note')}
                error={!!errors.note}
                helperText={errors.note?.message}
                fullWidth
                placeholder="Add any additional details here..."
            />

            <Button
                type="submit"
                variant="contained"
                size="large" 
                disabled={isSubmitting}
                fullWidth    
                sx={{ py: 1.5, fontWeight: 'bold' }}
            >
                {isSubmitting ? 'Saving...' : (initialData ? 'Update Feed' : 'Log Feed')}
            </Button>
        </Box>
    );
}