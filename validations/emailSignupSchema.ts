// validation/emailSignupSchema.ts
import { z } from "zod";

export const EmailSignupSchema = z.object({
  email: z.string().email("Please enter a valid email."),
});

export type EmailSignupType = z.infer<typeof EmailSignupSchema>;
