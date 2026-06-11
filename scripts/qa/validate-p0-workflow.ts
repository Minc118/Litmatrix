// Mock server-only package to run in Node directly
require.cache[require.resolve("server-only")] = {
  id: require.resolve("server-only"),
  exports: {},
  loaded: true,
} as any;

import { importAntigravityJson } from "../../lib/server/importers/antigravityJsonImporter";
import { getProjectContract } from "../../lib/server/skills/projectSkills";

async function runTests() {
  console.log("=== STARTING LITMATRIX P0 WORKFLOW VALIDATION TESTS ===");

  let passCount = 0;
  let failCount = 0;

  function assert(condition: boolean, message: string) {
    if (condition) {
      console.log(`[PASS] ${message}`);
      passCount++;
    } else {
      console.error(`[FAIL] ${message}`);
      failCount++;
    }
  }

  // Test 1: Contract Generation
  try {
    const contract = getProjectContract("ocpm-demo");
    assert(contract.projectId === "ocpm-demo", "Contract projectId matches");
    assert(contract.skillVersion === "1.0.0", "Contract skillVersion matches");
    assert(contract.extractionFields.length > 0, "Contract extractionFields are populated");
    assert(
      contract.extractionFields.some((f) => f.key === "researchProblem" && f.required),
      "Contract identifies required field researchProblem"
    );
  } catch (err) {
    assert(false, `Test 1 failed with error: ${err}`);
  }

  // Test 2: Project ID Validation (Mismatch)
  try {
    const invalidPayload = {
      projectId: "non-existent-project",
      papers: [],
      extractionMatrixRows: [],
    };
    const result = await importAntigravityJson(invalidPayload, true);
    assert(!result.ok && result.code === "NOT_FOUND", "Fails validation for invalid/non-existent projectId");
  } catch (err) {
    assert(false, `Test 2 failed with error: ${err}`);
  }

  // Test 3: Version mismatch validation
  try {
    const versionMismatchPayload = {
      projectId: "ocpm-demo",
      skillVersion: "2.0.0", // contract is 1.0.0
      papers: [],
      extractionMatrixRows: [],
    };
    const result = await importAntigravityJson(versionMismatchPayload, true);
    assert(
      Boolean(!result.ok &&
        result.code === "IMPORT_VALIDATION_FAILED" &&
        result.validationErrors?.some((e) => e.path === "skillVersion")),
      "Catches skillVersion mismatch"
    );
  } catch (err) {
    assert(false, `Test 3 failed with error: ${err}`);
  }

  // Test 4: Missing required fields
  try {
    const missingFieldsPayload = {
      projectId: "ocpm-demo",
      skillVersion: "1.0.0",
      papers: [
        {
          id: "paper-test-1",
          projectId: "ocpm-demo",
          title: "Test Paper",
        },
      ],
      extractionMatrixRows: [], // missing researchProblem and method which are required
    };
    const result = await importAntigravityJson(missingFieldsPayload, true);
    assert(
      Boolean(!result.ok &&
        result.code === "IMPORT_VALIDATION_FAILED" &&
        result.validationErrors?.some((e) => e.message.includes("researchProblem"))),
      "Catches missing required researchProblem field"
    );
  } catch (err) {
    assert(false, `Test 4 failed with error: ${err}`);
  }

  // Test 5: Unknown extraction field
  try {
    const unknownFieldPayload = {
      projectId: "ocpm-demo",
      skillVersion: "1.0.0",
      papers: [
        {
          id: "paper-test-2",
          projectId: "ocpm-demo",
          title: "Test Paper 2",
        },
      ],
      extractionMatrixRows: [
        {
          id: "row-1",
          projectId: "ocpm-demo",
          paperId: "paper-test-2",
          fieldKey: "invalidFieldKey", // unknown field
          fieldLabel: "Invalid Field",
          suggestedValue: "Value",
          status: "pending-review",
          evidence: [],
        },
        // add required fields to avoid missing required field errors
        {
          id: "row-2",
          projectId: "ocpm-demo",
          paperId: "paper-test-2",
          fieldKey: "researchProblem",
          fieldLabel: "Research Problem",
          suggestedValue: "Problem value",
          status: "pending-review",
          evidence: [],
        },
        {
          id: "row-3",
          projectId: "ocpm-demo",
          paperId: "paper-test-2",
          fieldKey: "method",
          fieldLabel: "Method",
          suggestedValue: "Method value",
          status: "pending-review",
          evidence: [],
        },
      ],
    };
    const result = await importAntigravityJson(unknownFieldPayload, true);
    assert(
      Boolean(!result.ok &&
        result.code === "IMPORT_VALIDATION_FAILED" &&
        result.validationErrors?.some((e) => e.path?.includes("fieldKey"))),
      "Catches unknown extraction field key"
    );
  } catch (err) {
    assert(false, `Test 5 failed with error: ${err}`);
  }

  // Test 6: Valid import passes
  try {
    const validPayload = {
      projectId: "ocpm-demo",
      skillVersion: "1.0.0",
      papers: [
        {
          id: "paper-test-3",
          projectId: "ocpm-demo",
          title: "Test Paper 3",
        },
      ],
      extractionMatrixRows: [
        {
          id: "row-1",
          projectId: "ocpm-demo",
          paperId: "paper-test-3",
          fieldKey: "researchProblem",
          fieldLabel: "Research Problem",
          suggestedValue: "Problem value",
          status: "pending-review",
          evidence: [],
        },
        {
          id: "row-2",
          projectId: "ocpm-demo",
          paperId: "paper-test-3",
          fieldKey: "method",
          fieldLabel: "Method",
          suggestedValue: "Method value",
          status: "pending-review",
          evidence: [],
        },
        {
          id: "row-3",
          projectId: "ocpm-demo",
          paperId: "paper-test-3",
          fieldKey: "findings",
          fieldLabel: "Findings",
          suggestedValue: "Findings value",
          status: "pending-review",
          evidence: [],
        },
      ],
    };
    const result = await importAntigravityJson(validPayload, true);
    if (!result.ok) {
      console.error("Test 6 failed validation result:", JSON.stringify(result, null, 2));
    }
    assert(result.ok, "Valid payload successfully validated and processed");
  } catch (err) {
    assert(false, `Test 6 failed with error: ${err}`);
  }

  console.log(`\n=== TESTS COMPLETED. PASSED: ${passCount}, FAILED: ${failCount} ===`);
  if (failCount > 0) {
    process.exit(1);
  }
}

runTests();
