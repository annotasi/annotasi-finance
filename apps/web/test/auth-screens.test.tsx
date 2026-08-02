import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

vi.mock("@clerk/nextjs", () => ({
  useSignUp: () => ({
    signUp: {
      status: "missing_requirements",
      password: async () => ({ error: null }),
      verifications: {
        sendEmailCode: async () => ({ error: null }),
        verifyEmailCode: async () => ({ error: null }),
      },
      finalize: async () => ({ error: null }),
    },
  }),
  useSignIn: () => ({
    signIn: {
      status: "needs_first_factor",
      password: async () => ({ error: null }),
      finalize: async () => ({ error: null }),
      create: async () => ({ error: null }),
      resetPasswordEmailCode: {
        sendCode: async () => ({ error: null }),
        verifyCode: async () => ({ error: null }),
        submitPassword: async () => ({ error: null }),
      },
    },
  }),
  useAuth: () => ({ getToken: async () => null }),
}));

const { default: SignUpPage } = await import("../app/signup/page");
const { default: LoginPage } = await import("../app/login/page");
const { default: ForgotPasswordPage } =
  await import("../app/forgot-password/page");

describe("auth screens (static render smoke tests)", () => {
  it("renders the signup screen with labelled, accessible fields and Indonesian copy", () => {
    const html = renderToStaticMarkup(<SignUpPage />);

    expect(html).toContain("Buat akun Annotasi Finance");
    expect(html).toContain('for="signup-email"');
    expect(html).toContain('for="signup-password"');
    expect(html).toContain('id="clerk-captcha"');
    expect(html).toContain("Daftar");
    expect(html).not.toContain("dashboard");
    expect(html).not.toContain("Workspace");
  });

  it("renders the login screen with labelled, accessible fields and a recovery link", () => {
    const html = renderToStaticMarkup(<LoginPage />);

    expect(html).toContain("Masuk ke Annotasi Finance");
    expect(html).toContain('for="login-email"');
    expect(html).toContain('for="login-password"');
    expect(html).toContain("/forgot-password");
    expect(html).not.toContain("dashboard");
  });

  it("renders the forgot-password screen with a generic, safe request-stage message", () => {
    const html = renderToStaticMarkup(<ForgotPasswordPage />);

    expect(html).toContain("Pulihkan kata sandi");
    expect(html).toContain('for="recovery-email"');
    expect(html).not.toContain("tidak terdaftar");
    expect(html).not.toContain("dashboard");
  });
});
