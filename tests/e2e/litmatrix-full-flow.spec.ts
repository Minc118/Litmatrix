import { test, expect } from "@playwright/test";

test.describe("LitMatrix Full Flow E2E", () => {
  const pageErrors: Error[] = [];

  test.beforeEach(async ({ page, context }) => {
    pageErrors.length = 0;
    page.on("pageerror", (exception) => {
      pageErrors.push(exception);
    });
    await context.setExtraHTTPHeaders({
      "x-mock-user-id": "test-user-id",
    });
  });

  test.afterEach(() => {
    expect(pageErrors).toEqual([]);
  });

  test("Run through the entire literature review lifecycle", async ({ page }) => {
    test.setTimeout(90000);
    // 1. Load /new entry point
    await page.goto("/new");
    await expect(page.locator("h1")).toContainText("Create Literature Review Project");

    // 2. Fill step 1: Project Info
    await page.fill("#project-title", "Dynamic Full Flow Project");
    await page.fill("#project-topic", "Quantum computing algorithms for portfolio optimization");
    await page.fill("#writing-goal", "Survey Paper for ACM Computing Surveys");

    // Click Continue to step 2
    await page.click("button:has-text('Continue')");

    // Fill step 2: Research Questions (add a question)
    await page.fill("input[placeholder*='e.g., What neural network architectures']", "What is the computational speedup compared to classical algorithms?");
    await page.click("button:has-text('Add Research Question')");
    await page.fill("input[placeholder*='e.g., What neural network architectures'] >> nth=1", "What are the physical qubit overhead requirements?");

    // Click Continue to step 3
    await page.click("button:has-text('Continue')");

    // Step 3: Add a custom field to the schema
    await page.fill("#custom-label", "Qubit Count");
    await page.fill("#custom-desc", "Number of physical qubits required");
    await page.click("form button:has-text('Add')");

    // Verify custom field was added
    await expect(page.locator("span", { hasText: "Qubit Count" })).toBeVisible();

    // Click "Create Project"
    await page.click("button:has-text('Create Project')");

    // 3. Verify redirect to the new project dashboard works
    await expect(page).toHaveURL(/\/projects\/dynamic-full-flow-project/);
    await expect(page.locator("header h2")).toContainText("Project Workspace");
    await expect(page.locator(".min-w-0 h1")).toContainText("Dynamic Full Flow Project");

    // 4. Verify generated skill page loads
    await page.goto("/projects/dynamic-full-flow-project/skill");
    await expect(page.locator("header h2")).toContainText("Project Skill & Contract");
    await expect(page.locator("pre")).toContainText("# Project Skill: Quantum computing algorithms for portfolio optimization Systematic Literature Review");

    // Verify custom questions exist on skill page
    await page.click("button:has-text('Research Questions')");
    await expect(page.locator("p", { hasText: "What is the computational speedup compared to classical algorithms?" })).toBeVisible();
    await expect(page.locator("p", { hasText: "What are the physical qubit overhead requirements?" })).toBeVisible();

    // Verify custom schema fields exist on skill page
    await page.click("button:has-text('Extraction Schema')");
    await expect(page.locator("span", { hasText: "Qubit Count" })).toBeVisible();

    // 5. Navigate to Papers Inbox & test file upload UI with mock PDF
    await page.goto("/projects/dynamic-full-flow-project/papers");
    await expect(page.locator(".min-w-0 h1")).toContainText("Paper Inbox & Screening");

    // Mock PDF File Upload
    const [fileChooserPdf] = await Promise.all([
      page.waitForEvent("filechooser"),
      page.click("button:has-text('Select File')"),
    ]);
    await fileChooserPdf.setFiles({
      name: "quantum-finance-review.pdf",
      mimeType: "application/pdf",
      buffer: Buffer.from("%PDF-1.4 ... mock PDF ..."),
    });

    // Wait for reload and verify the mock PDF paper is listed in the inbox
    await expect(page.locator("h2", { hasText: "quantum-finance-review" })).toBeVisible({ timeout: 10000 });
    await expect(page.locator("span", { hasText: "PDF Upload" })).toBeVisible();
    await expect(page.locator("span", { hasText: "Metadata-only overview" })).toBeVisible();

    // 6. Navigate to Tools/Import page and check Zotero RDF upload & simulator UI
    await page.goto("/projects/dynamic-full-flow-project/tools/import");
    await expect(page.locator("header h2")).toContainText("Import Console");

    // Toggle Zotero Importer tab
    await page.click("button:has-text('Zotero Importer')");
    await expect(page.locator("h2", { hasText: "Import Zotero RDF XML" })).toBeVisible();
    await expect(page.locator("h2", { hasText: "Connect Zotero Local API" })).toBeVisible();

    // Mock RDF upload
    const rdfContent = `<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:bib="http://purl.org/rss/1.0/modules/biblio/"><bib:Article><dc:title>Quantum Portfolio Selection via QAOA</dc:title><dc:date>2025</dc:date><dc:creator>Jane Doe</dc:creator></bib:Article></rdf:RDF>`;
    
    const [fileChooserRdf] = await Promise.all([
      page.waitForEvent("filechooser"),
      page.click("button:has-text('Select Zotero RDF File')"),
    ]);
    await fileChooserRdf.setFiles({
      name: "zotero-collection-export.rdf",
      mimeType: "application/xml",
      buffer: Buffer.from(rdfContent),
    });

    // Verify success banner appears
    await expect(page.locator("div.bg-\\[\\#f6ffed\\]", { hasText: "Zotero RDF references successfully imported" })).toBeVisible({ timeout: 10000 });

    // 7. Verify Paper Inbox contains the newly imported Zotero paper & check Decision Gate
    await page.goto("/projects/dynamic-full-flow-project/papers");
    await expect(page.locator("h2", { hasText: "Quantum Portfolio Selection via QAOA" })).toBeVisible();
    await expect(page.locator("span", { hasText: "Zotero RDF" })).toBeVisible();

    // Check screening decision control exists and select a screening decision
    const screeningSelect = page.locator("select >> nth=0");
    await expect(screeningSelect).toBeVisible();
    await screeningSelect.selectOption("Continue to Deep Extraction");

    // Navigate to Paper Overview page and inspect decision gate controls
    await page.goto("/projects/dynamic-full-flow-project/overview");
    await expect(page.locator("header h2")).toContainText("Paper Overview");
    await expect(page.locator("button", { hasText: "Continue to Deep Extraction" })).toBeVisible();
    await expect(page.locator("button", { hasText: "Mark as Core Paper" })).toBeVisible();
    await expect(page.locator("button", { hasText: "Skip / Exclude" })).toBeVisible();

    // 8. Verify Matrix page loads with schema-driven empty state displaying schema fields
    await page.goto("/projects/dynamic-full-flow-project/matrix");
    await expect(page.locator("header h2")).toContainText("Extraction Matrix");
    await expect(page.locator("h2", { hasText: "No Extraction Records Yet" })).toBeVisible();
    
    // Verify the columns/fields are dynamically displayed from the custom project schema
    await expect(page.locator("span", { hasText: "Qubit Count" })).toBeVisible();
    await expect(page.locator("span", { hasText: "Method / Approach" })).toBeVisible();

    // 9. Verify Export page loads
    await page.goto("/projects/dynamic-full-flow-project/export");
    await expect(page.locator("header h2")).toContainText("Export Workspace");
    await expect(page.locator("h2", { hasText: "Markdown" })).toBeVisible();
    await expect(page.locator("h2", { hasText: "CSV" })).toBeVisible();
    await expect(page.locator("h2", { hasText: "JSON" })).toBeVisible();
  });
});
