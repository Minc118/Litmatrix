import { test, expect } from "@playwright/test";

test.describe("LitMatrix Authentication & Route Protection E2E", () => {
  test("1. Sign In Page renders successfully", async ({ page }) => {
    await page.goto("/auth/sign-in");

    // Check title and description
    await expect(page.locator("h1")).toContainText("LitMatrix");
    await expect(page.locator("h2")).toContainText("Sign in to your account");

    // Check input elements and buttons
    await expect(page.locator("input[type='email']")).toBeVisible();
    await expect(page.locator("input[type='password']")).toBeVisible();
    await expect(page.locator("button[type='submit']")).toContainText("Sign In");
  });

  test("2. Sign Up Page renders successfully", async ({ page }) => {
    await page.goto("/auth/sign-up");

    // Check title and header
    await expect(page.locator("h1")).toContainText("LitMatrix");
    await expect(page.locator("h2")).toContainText("Create your account");

    // Check inputs
    await expect(page.locator("input[placeholder='Jane Doe']")).toBeVisible();
    await expect(page.locator("input[type='email']")).toBeVisible();
    await expect(page.locator("input[type='password']")).toBeVisible();
  });

  test("3. Unauthenticated users are redirected to Sign In", async ({ page }) => {
    // Attempt accessing /new
    await page.goto("/new");
    await page.waitForURL(/\/auth\/sign-in/);
    expect(page.url()).toContain("callbackUrl=%2Fnew");

    // Attempt accessing /projects
    await page.goto("/projects");
    await page.waitForURL(/\/auth\/sign-in/);
    expect(page.url()).toContain("callbackUrl=%2Fprojects");
  });

  test("4. Public ocpm-demo workspace remains accessible without authentication", async ({ page }) => {
    // Access OCPM Demo project dashboard
    await page.goto("/projects/ocpm-demo");
    await expect(page.locator("header h2")).toContainText("Project Workspace");
    await expect(page.locator("h1")).toContainText("OCPM Survey");

    // Access OCPM Demo matrix
    await page.goto("/projects/ocpm-demo/matrix");
    await expect(page.locator("header h2")).toContainText("Extraction Matrix");
  });
});
