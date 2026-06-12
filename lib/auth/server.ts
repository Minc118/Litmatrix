import { createNeonAuth } from "@neondatabase/auth/next/server";
import { headers as getNextHeaders } from "next/headers";

const baseUrl = process.env.NEON_AUTH_BASE_URL || "http://localhost:3000/api/auth";
const cookieSecret = process.env.NEON_AUTH_COOKIE_SECRET || "a-dummy-cookie-secret-for-development-32-chars-long";

const originalAuth = createNeonAuth({
  baseUrl,
  cookies: {
    secret: cookieSecret,
  },
});

export const auth = {
  ...originalAuth,
  getSession: async (options?: Parameters<typeof originalAuth.getSession>[0]) => {
    let testHeader: string | null = null;

    // 1. Try to read from options parameter (e.g. from middleware)
    const headers = options?.fetchOptions?.headers;
    if (headers) {
      if (headers instanceof Headers) {
        testHeader = headers.get("x-mock-user-id");
      } else if (typeof headers === "object") {
        testHeader = (headers as Record<string, string>)["x-mock-user-id"] || null;
      }
    }

    // 2. If not found in options, try to read from Next.js request context headers
    if (!testHeader) {
      try {
        const nextHeaders = await getNextHeaders();
        testHeader = nextHeaders.get("x-mock-user-id");
      } catch {
        // next/headers might throw if called outside Next.js request context
      }
    }

    if (testHeader || process.env.NEXT_PUBLIC_MOCK_AUTH === "true") {
      return {
        data: {
          user: {
            id: testHeader || "test-user-id",
            name: "Test Researcher",
            email: "test@example.com",
            emailVerified: true,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          session: {
            id: "test-session-id",
            userId: testHeader || "test-user-id",
            expiresAt: new Date(Date.now() + 3600 * 1000),
            token: "test-token",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        },
        error: null,
      };
    }

    // If Neon Auth is unconfigured or fails (e.g. in test envs), return null session gracefully
    try {
      if (!process.env.NEON_AUTH_BASE_URL) {
        return { data: null, error: null };
      }
      return await originalAuth.getSession(options);
    } catch (err) {
      console.warn("Neon Auth getSession failed or is unconfigured, returning null session:", err);
      return { data: null, error: null };
    }
  },
};
