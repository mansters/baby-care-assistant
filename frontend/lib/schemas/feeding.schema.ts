import { z } from 'zod';

// Discriminated Union for robustness
const baseSchema = z.object({
  babyId: z.string().optional(),
  startTime: z.date(),
  note: z.string().optional().nullable(),
});

export const feedingFormSchema = z.discriminatedUnion('type', [
    baseSchema.extend({
      type: z.literal('Nursing'),
      leftDuration: z.number().min(0).optional(),
      rightDuration: z.number().min(0).optional(),
      // Allow amountMl to be present but ignored
      amountMl: z.number().optional(), 
    }).refine(data => (data.leftDuration || 0) + (data.rightDuration || 0) > 0, {
      message: "Total nursing duration must be greater than 0",
      path: ["root"]
    }),
    baseSchema.extend({
      type: z.literal('Bottle'),
      amountMl: z.number().min(1, "Amount must be greater than 0"), 
      leftDuration: z.number().optional(),
      rightDuration: z.number().optional(),
    })
  ]);

export type FeedingFormValues = z.infer<typeof feedingFormSchema>;
