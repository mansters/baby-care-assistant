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
import {createFeedingLog, FeedingType} from "@/lib/api-client";

interface FeedingFormProps {
    onSuccess?: () => void; 
}

const feedingSchema = z.object({
    type: z.enum(['Bottle', 'Breast', 'Solids']),
    amountMl: z.number().min(0, 'Amount must be positive').optional(),
    durationMinutes: z.number().min(1, 'Duration must be at least 1 min'),
    feedingTime: z.string().nonempty('Time is required'),
});

type FeedingFormData = z.infer<typeof feedingSchema>;

export default function FeedingForm({ onSuccess }: FeedingFormProps) {
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
            type: 'Bottle', 
            amountMl: 0,
            durationMinutes: 15,
            feedingTime: new Date().toISOString().slice(0, 16)
        }
    });

    const onSubmit = async (data: FeedingFormData) => {
        try {
            
            
            const payload = {
                babyId: '3fa85f64-5717-4562-b3fc-2c963f66afa6', 
                feedingTime: new Date(data.feedingTime).toISOString(), 
                type: data.type,
                durationMinutes: data.durationMinutes,
                amountMl: data.amountMl || 0,
            };
            
            await createFeedingLog(payload);
            
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

            {}
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

            {}
            <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                    label="Amount (ml)"
                    type="number"
                    {...register('amountMl', { valueAsNumber: true })}
                    error={!!errors.amountMl}
                    helperText={errors.amountMl?.message}
                    fullWidth
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

            {}
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

            <Button
                type="submit"
                variant="contained"
                size="large" 
                disabled={isSubmitting}
                fullWidth    
                sx={{ py: 1.5, fontWeight: 'bold' }}
            >
                {isSubmitting ? 'Saving...' : 'Log Feed'}
            </Button>

        </Box>
    );
}