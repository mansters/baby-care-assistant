'use client';

import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LocalizationProvider } from '@mui/x-date-pickers';
import type {} from '@mui/x-date-pickers/themeAugmentation';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { MobileDateTimePicker } from '@mui/x-date-pickers/MobileDateTimePicker';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { InputBase, Box } from '@mui/material';
import FormRow from '@/shared/components/FormRow';
import { FeatureTheme } from '@/lib/theme';
import { growthFormSchema, GrowthFormValues } from '@/lib/schemas/growth.schema';

interface GrowthFormProps {
    onSubmit: (data: GrowthFormValues) => void;
    initialData?: Partial<GrowthFormValues>;
    isEditing?: boolean;
}

const growthTheme = createTheme({
    palette: {
        primary: {
            main: FeatureTheme.growth.primary,
        },
    },
    components: {
        MuiPickersDay: {
            styleOverrides: {
                root: {
                    '&.Mui-selected': {
                        backgroundColor: FeatureTheme.growth.primary,
                        color: '#fff',
                        '&:hover': {
                            backgroundColor: FeatureTheme.growth.primary,
                        },
                        '&:focus': {
                            backgroundColor: FeatureTheme.growth.primary,
                        },
                    },
                },
            },
        },
    },
});

const datePickerSlotProps = {
    textField: {
        variant: 'standard' as const,
        InputProps: {
            disableUnderline: true,
            sx: {
                fontSize: '18px',
                fontWeight: 500,
                color: `${FeatureTheme.growth.primary} !important`,
                width: 'fit-content',
                display: 'inline-flex',
                '& .MuiInputBase-input': {
                    textAlign: 'right',
                    padding: 0,
                    color: `${FeatureTheme.growth.primary} !important`,
                    WebkitTextFillColor: `${FeatureTheme.growth.primary} !important`,
                    cursor: 'pointer',
                    width: 'auto',
                },
                '& .MuiInputAdornment-root': {
                    marginLeft: '4px',
                },
                '& .MuiPickersSectionList-root': {
                    justifyContent: 'flex-end',
                    flexGrow: '0 !important',
                },
            },
        },
        sx: {
            width: 'auto',
            '& .MuiInputBase-root': {
                width: 'fit-content',
                display: 'inline-flex',
                justifyContent: 'flex-end !important',
            },
        },
    },
};

const numberInputSx = (hasValue: boolean) => ({
    fontSize: '18px',
    fontWeight: 500,
    color: hasValue ? FeatureTheme.growth.primary : 'text.disabled',
    textAlign: 'right' as const,
    '& input': { textAlign: 'right', p: 0 },
});

const unitSx = {
    ml: 0.5,
    fontSize: '18px',
    fontWeight: 500,
    color: FeatureTheme.growth.primary,
};

export default function GrowthForm({ onSubmit, initialData, isEditing = false }: GrowthFormProps) {
    const { control, handleSubmit, reset } = useForm<GrowthFormValues>({
        resolver: zodResolver(growthFormSchema),
        mode: 'onChange',
        defaultValues: {
            weightKg: undefined,
            heightCm: undefined,
            headCircumferenceCm: undefined,
            note: '',
            ...initialData,
            startTime: initialData?.startTime ? new Date(initialData.startTime) : new Date(),
        },
    });

    useEffect(() => {
        if (initialData) {
            reset({
                weightKg: undefined,
                heightCm: undefined,
                headCircumferenceCm: undefined,
                note: '',
                ...initialData,
                startTime: initialData?.startTime ? new Date(initialData.startTime) : new Date(),
            });
        }
    }, [initialData, reset]);

    const [isNoteVisible, setIsNoteVisible] = React.useState(!!initialData?.note);

    const handleNumberChange = (
        onChange: (val: number | undefined) => void,
        rawValue: string
    ) => {
        if (rawValue === '') {
            onChange(undefined);
            return;
        }
        const num = parseFloat(rawValue);
        if (!isNaN(num)) {
            onChange(num);
        }
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <form id="growth-form" onSubmit={handleSubmit(onSubmit)} className="p-6 flex flex-col gap-6">

                <div className="flex flex-col bg-white rounded-2xl overflow-hidden px-4">

                    <Controller
                        name="startTime"
                        control={control}
                        render={({ field }) => (
                            <FormRow label="Start Time" required showDivider={true}>
                                <ThemeProvider theme={growthTheme}>
                                    <MobileDateTimePicker
                                        value={field.value}
                                        onChange={(newValue) => field.onChange(newValue)}
                                        format="MMM d, hh:mm a"
                                        ampm={true}
                                        slotProps={datePickerSlotProps}
                                    />
                                </ThemeProvider>
                            </FormRow>
                        )}
                    />

                    <Controller
                        name="weightKg"
                        control={control}
                        render={({ field, fieldState }) => (
                            <FormRow
                                label="Weight (kg)"
                                required
                                showDivider={true}
                                error={!!fieldState.error}
                                helperText={fieldState.error?.message}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', width: '100%' }}>
                                    <InputBase
                                        value={field.value ?? ''}
                                        onChange={(e) => handleNumberChange(field.onChange, e.target.value)}
                                        onBlur={field.onBlur}
                                        type="number"
                                        placeholder="0"
                                        inputProps={{ step: '0.01', inputMode: 'decimal' }}
                                        sx={numberInputSx(!!field.value && field.value > 0)}
                                    />
                                    <Box component="span" sx={unitSx}>kg</Box>
                                </Box>
                            </FormRow>
                        )}
                    />

                    <Controller
                        name="heightCm"
                        control={control}
                        render={({ field, fieldState }) => (
                            <FormRow
                                label="Height (cm)"
                                sublabel="optional"
                                showDivider={true}
                                error={!!fieldState.error}
                                helperText={fieldState.error?.message}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', width: '100%' }}>
                                    <InputBase
                                        value={field.value ?? ''}
                                        onChange={(e) => handleNumberChange(field.onChange, e.target.value)}
                                        onBlur={field.onBlur}
                                        type="number"
                                        placeholder="0"
                                        inputProps={{ step: '0.01', inputMode: 'decimal' }}
                                        sx={numberInputSx(!!field.value && field.value > 0)}
                                    />
                                    <Box component="span" sx={unitSx}>cm</Box>
                                </Box>
                            </FormRow>
                        )}
                    />

                    <Controller
                        name="headCircumferenceCm"
                        control={control}
                        render={({ field, fieldState }) => (
                            <FormRow
                                label="Head Circumference (cm)"
                                sublabel="optional"
                                showDivider={false}
                                error={!!fieldState.error}
                                helperText={fieldState.error?.message}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', width: '100%' }}>
                                    <InputBase
                                        value={field.value ?? ''}
                                        onChange={(e) => handleNumberChange(field.onChange, e.target.value)}
                                        onBlur={field.onBlur}
                                        type="number"
                                        placeholder="0"
                                        inputProps={{ step: '0.01', inputMode: 'decimal' }}
                                        sx={numberInputSx(!!field.value && field.value > 0)}
                                    />
                                    <Box component="span" sx={unitSx}>cm</Box>
                                </Box>
                            </FormRow>
                        )}
                    />
                </div>

                <div className="bg-white rounded-2xl overflow-hidden px-4">
                    <Controller
                        name="note"
                        control={control}
                        render={({ field }) => {
                            const hasValue = field.value && field.value.length > 0;

                            if (isNoteVisible || hasValue) {
                                return (
                                    <FormRow label="Note" layout="vertical" showDivider={false}>
                                        <InputBase
                                            {...field}
                                            value={field.value ?? ''}
                                            placeholder="Add a note..."
                                            multiline
                                            minRows={3}
                                            fullWidth
                                            sx={{
                                                fontSize: '16px',
                                                color: '#101828',
                                                backgroundColor: '#f9fafb',
                                                borderRadius: '12px',
                                                padding: '12px',
                                            }}
                                        />
                                    </FormRow>
                                );
                            }

                            return (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsNoteVisible(true);
                                        field.onChange('');
                                    }}
                                    className="text-[#99a1af] text-sm font-normal flex items-center gap-1 py-4 hover:opacity-80 transition-opacity"
                                >
                                    + add note
                                </button>
                            );
                        }}
                    />
                </div>
            </form>
        </LocalizationProvider>
    );
}
