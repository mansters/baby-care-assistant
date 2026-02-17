import { z } from 'zod';

const twoDecimalPlaces = (val: number) => {
  const str = val.toString();
  const parts = str.split('.');
  return !parts[1] || parts[1].length <= 2;
};

export const growthFormSchema = z.object({
  startTime: z.date(),
  weightKg: z
    .number()
    .positive('Weight must be greater than 0')
    .refine(twoDecimalPlaces, 'Maximum 2 decimal places'),
  heightCm: z
    .number()
    .min(0, 'Height must be non-negative')
    .refine(twoDecimalPlaces, 'Maximum 2 decimal places')
    .optional(),
  headCircumferenceCm: z
    .number()
    .min(0, 'Head circumference must be non-negative')
    .refine(twoDecimalPlaces, 'Maximum 2 decimal places')
    .optional(),
  note: z.string().optional().nullable(),
});

export type GrowthFormValues = z.infer<typeof growthFormSchema>;
