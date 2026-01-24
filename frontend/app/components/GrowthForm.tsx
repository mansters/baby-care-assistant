'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
    Box,
    Button,
    TextField,
} from '@mui/material';
import { useRouter } from "next/navigation";
import { createGrowthLog, updateGrowthLog, GrowthLog } from "@/lib/api-client";
import { toUTCISO, getCurrentLocalForInput } from "@/lib/date-utils";

interface GrowthFormProps {
    onSuccess?: () => void;
    initialData?: GrowthLog;
}

const growthSchema = z.object({
    dateMeasured: z.string().nonempty('Date is required'),
    weightKg: z.number().min(0, 'Weight must be non-negative'),
    heightCm: z.number().min(0, 'Height must be non-negative').optional().or(z.nan()),
    headCircumferenceCm: z.number().min(0, 'Head must be non-negative').optional().or(z.nan()),
});

type GrowthFormData = z.infer<typeof growthSchema>;

export default function GrowthForm({ onSuccess, initialData }: GrowthFormProps) {
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset
    } = useForm<GrowthFormData>({
        resolver: zodResolver(growthSchema),
        defaultValues: {
            dateMeasured: initialData ? initialData.dateMeasured.slice(0, 16) : getCurrentLocalForInput(),
            weightKg: initialData?.weightKg ?? 0,
            heightCm: initialData?.heightCm ?? 0,
            headCircumferenceCm: initialData?.headCircumferenceCm ?? 0,
        }
    });

    const onSubmit = async (data: GrowthFormData) => {
        try {
            const payload = {
                babyId: '3fa85f64-5717-4562-b3fc-2c963f66afa6', // Hardcoded for now
                dateMeasured: toUTCISO(data.dateMeasured),
                weightKg: data.weightKg,
                heightCm: isNaN(data.heightCm as number) ? undefined : data.heightCm,
                headCircumferenceCm: isNaN(data.headCircumferenceCm as number) ? undefined : data.headCircumferenceCm,
            };

            if (initialData) {
                await updateGrowthLog(initialData.id, { ...payload, id: initialData.id });
            } else {
                await createGrowthLog(payload);
            }

            reset();
            router.refresh();

            onSuccess?.();
            const action = initialData ? 'updated' : 'created';
        } catch (error) {
            console.error('Failed to log growth', error);
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
            <TextField
                type="datetime-local"
                label="Date & Time"
                {...register('dateMeasured')}
                error={!!errors.dateMeasured}
                helperText={errors.dateMeasured?.message}
                slotProps={{
                    inputLabel: { shrink: true }
                }}
                fullWidth
            />

            <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                    label="Weight (kg)"
                    type="number"
                    {...register('weightKg', { valueAsNumber: true })}
                    error={!!errors.weightKg}
                    helperText={errors.weightKg?.message}
                    fullWidth
                    slotProps={{ htmlInput: { step: "0.01" } }}
                />
                <TextField
                    label="Height (cm)"
                    type="number"
                    {...register('heightCm', { valueAsNumber: true })}
                    error={!!errors.heightCm}
                    helperText={errors.heightCm?.message}
                    fullWidth
                    slotProps={{ htmlInput: { step: "0.1" } }}
                />
            </Box>

            <TextField
                label="Head Circumference (cm)"
                type="number"
                {...register('headCircumferenceCm', { valueAsNumber: true })}
                error={!!errors.headCircumferenceCm}
                helperText={errors.headCircumferenceCm?.message}
                fullWidth
                slotProps={{ htmlInput: { step: "0.1" } }}
            />

            <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={isSubmitting}
                fullWidth
                sx={{ py: 1.5, fontWeight: 'bold' }}
            >
                {isSubmitting ? 'Saving...' : (initialData ? 'Update Log' : 'Log Growth')}
            </Button>
        </Box>
    );
}
