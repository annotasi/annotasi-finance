import { z } from "zod";

export const signUpSchema = z.object({
  email: z
    .string()
    .min(1, "Email wajib diisi.")
    .email("Format email tidak valid."),
  password: z.string().min(8, "Kata sandi minimal 8 karakter."),
});
export type SignUpValues = z.infer<typeof signUpSchema>;

export const verifyCodeSchema = z.object({
  code: z.string().min(1, "Kode verifikasi wajib diisi."),
});
export type VerifyCodeValues = z.infer<typeof verifyCodeSchema>;

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email wajib diisi.")
    .email("Format email tidak valid."),
  password: z.string().min(1, "Kata sandi wajib diisi."),
});
export type LoginValues = z.infer<typeof loginSchema>;

export const forgotPasswordRequestSchema = z.object({
  email: z
    .string()
    .min(1, "Email wajib diisi.")
    .email("Format email tidak valid."),
});
export type ForgotPasswordRequestValues = z.infer<
  typeof forgotPasswordRequestSchema
>;

export const forgotPasswordResetSchema = z.object({
  code: z.string().min(1, "Kode verifikasi wajib diisi."),
  password: z.string().min(8, "Kata sandi minimal 8 karakter."),
});
export type ForgotPasswordResetValues = z.infer<
  typeof forgotPasswordResetSchema
>;
