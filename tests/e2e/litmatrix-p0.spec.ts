import { test, expect } from "@playwright/test";
import * as fs from "node:fs";
import * as path from "node:path";

test.describe("LitMatrix P0 Workflow E2E", () => {
  const pageErrors: Error[] = [];

  test.beforeEach(({ page }) => {
    pageErrors.length = 0;
    // Track runtime exceptions
    page.on("pageerror", (exception) => {
      pageErrors.push(exception);
    });
  });

  test.afterEach(() => {
    // Assert no runtime exceptions occurred during test
    expect(pageErrors).toEqual([]);
  });

  test("1. Project Skill / Contract UI Page", async ({ page }) => {
    await page.goto("/projects/ocpm-demo/skill");

    // Check topbar header h2 title
    await expect(page.locator("header h2")).toContainText("Project Skill & Contract");

    // Verify tabs exist with exact text
    const tabs = ["Skill Markdown", "Research Questions", "Extraction Schema", "Command Pack"];
    for (const tab of tabs) {
      await expect(page.locator("button", { hasText: tab })).toBeVisible();
    }

    // Verify download actions exist
    await expect(page.locator("button", { hasText: "project-skill.md" })).toBeVisible();
    await expect(page.locator("button", { hasText: "project-contract.json" })).toBeVisible();

    // Click tabs and verify content loads
    await page.click("button:has-text('Research Questions')");
    await expect(page.locator("h2", { hasText: "Project Research Questions" })).toBeVisible();
    
    await page.click("button:has-text('Extraction Schema')");
    await expect(page.locator("h2", { hasText: "Project Extraction Fields" })).toBeVisible();

    await page.click("button:has-text('Command Pack')");
    await expect(page.locator("h2", { hasText: "Skill-defined Analysis Commands" })).toBeVisible();
  });

  test("2. Import Console (Validate & Dry-run)", async ({ page }) => {
    await page.goto("/projects/ocpm-demo/tools/import");

    // Verify topbar header h2 title
    await expect(page.locator("header h2")).toContainText("Import Console");

    // Load valid mock payload
    const payloadPath = path.join(process.cwd(), "tests", "fixtures", "antigravity-valid-ocpm-demo.json");
    expect(fs.existsSync(payloadPath)).toBe(true);
    const payloadContent = fs.readFileSync(payloadPath, "utf-8");

    // Fill paste textarea
    const textarea = page.locator("#json-paste-area");
    await expect(textarea).toBeVisible();
    await textarea.fill(payloadContent);

    // Click Validate Schema
    await page.click("button:has-text('Validate Schema')");

    // Verify validation message
    await expect(page.locator("h3", { hasText: "Schema Validation Successful" })).toBeVisible();

    // Click Dry-Run Preview
    await page.click("button:has-text('Dry-Run Preview')");

    // Verify Dry-Run count preview appears
    await expect(page.locator("h3", { hasText: "Dry-Run Preview Successful" })).toBeVisible();
    await expect(page.locator("p", { hasText: "To Create" })).toBeVisible();
  });

  test("3. Overview and Screening Page", async ({ page }) => {
    await page.goto("/projects/ocpm-demo/overview");

    // Header check
    await expect(page.locator("header h2")).toContainText("Paper Overview");

    // Decision gate actions checking
    await expect(page.locator("button", { hasText: "Mark as Core Paper" }).first()).toBeVisible();
    await expect(page.locator("button", { hasText: "Mark as Background" }).first()).toBeVisible();
    await expect(page.locator("button", { hasText: "Skip / Exclude" }).first()).toBeVisible();
  });

  test("4. Workspace Review UI", async ({ page }) => {
    await page.goto("/projects/ocpm-demo/review");

    // Title check
    await expect(page.locator("header h2")).toContainText("Review AI Suggestions");

    // Switch dropdown check
    await expect(page.locator("select")).toBeVisible();

    // Decision block check
    await expect(page.locator("button", { hasText: "Batch save confirmed values" })).toBeVisible();
  });

  test("5. Extraction Matrix, Cell Expansion & Selection", async ({ page }) => {
    await page.goto("/projects/ocpm-demo/matrix");

    // Matrix Title
    await expect(page.locator("header h2")).toContainText("Extraction Matrix");

    // Verify matrix table structure
    await expect(page.locator("table")).toBeVisible();

    // Check cells exist
    const tableCells = page.locator("td");
    await expect(tableCells.first()).toBeVisible();

    // Select a row checkbox (the first input checkbox in the table body)
    const firstRowSelectionButton = page.locator("table tbody tr td button").first();
    await expect(firstRowSelectionButton).toBeVisible();
    await firstRowSelectionButton.click();

    // Check expanded details (click 'Inspect Evidence')
    const cellExpandTrigger = page.locator("button:has-text('Inspect Evidence')").first();
    if (await cellExpandTrigger.isVisible()) {
      await cellExpandTrigger.click();
      // Expanded details panel shows quotes
      await expect(page.locator("h4", { hasText: "AI Suggested Extraction" })).toBeVisible();
    }
  });

  test("6. Export Workspace View", async ({ page }) => {
    await page.goto("/projects/ocpm-demo/export");

    // Title Check
    await expect(page.locator("header h2")).toContainText("Export Workspace");

    // Action buttons visible
    await expect(page.locator("button", { hasText: "Export JSON" })).toBeVisible();
    await expect(page.locator("button", { hasText: "Export CSV" })).toBeVisible();
    await expect(page.locator("button", { hasText: "Export Markdown" })).toBeVisible();
  });
});
