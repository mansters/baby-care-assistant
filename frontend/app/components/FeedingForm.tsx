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
import {createFeedingLog} from "@/lib/api-client";

interface FeedingFormProps {
    onSuccess?: () => void; // Optional callback
}

// 1. Define the Validation Schema (Zod)
const feedingSchema = z.object({
    type: z.enum(['Bottle', 'Breast', 'Solids']),
    amountMl: z.number().min(0, 'Amount must be positive').optional(),
    durationMinutes: z.number().min(1, 'Duration must be at least 1 min'),
    feedingTime: z.string().nonempty('Time is required'),
});

// Infer the TypeScript type from the schema
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
            type: 'Bottle', // Ensure this matches your select options exactly
            amountMl: 0,
            durationMinutes: 15,
            feedingTime: new Date().toISOString().slice(0, 16)
        }
    });

    const onSubmit = async (data: FeedingFormData) => {
        try {
            // 1. Prepare the payload
            // For now, use the GUID you seeded in the database.
            const payload = {
                babyId: '3fa85f64-5717-4562-b3fc-2c963f66afa6', // <--- REPLACE WITH YOUR REAL DB BABY ID
                feedingTime: new Date(data.feedingTime).toISOString(), // Ensure ISO format
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
                flexDirection: 'column', // Stack them vertically for better mobile flow
                gap: 3,                  // consistent spacing
                mt: 1                    // tiny top margin
            }}
        >

            {/* Type Selection */}
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
                        fullWidth // 👈 Let it fill the width of the dialog
                    >
                        <MenuItem value="Bottle">Bottle</MenuItem>
                        <MenuItem value="Breast">Breast</MenuItem>
                        <MenuItem value="Solids">Solids</MenuItem>
                    </TextField>
                )}
            />

            {/* Row for Numbers: Amount & Duration */}
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

            {/* Time */}
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
                size="large" // Bigger button is easier to tap
                disabled={isSubmitting}
                fullWidth    // Full width button looks better in modals
                sx={{ py: 1.5, fontWeight: 'bold' }}
            >
                {isSubmitting ? 'Saving...' : 'Log Feed'}
            </Button>

        </Box>
    );
}