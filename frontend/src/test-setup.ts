// Loaded by Vitest before every test file (see `test.setupFiles` in vite.config.ts).
//
// jest-dom adds the matchers a component test is actually written in --
// toBeInTheDocument, toBeDisabled, toHaveValue -- for the DOM a mounted component renders.
import "@testing-library/jest-dom/vitest";

import { enableAutoUnmount } from "@vue/test-utils";
import { afterEach } from "vitest";

// Every test starts on an empty document: a component left mounted makes the next query
// ambiguous, which reads as a broken component rather than a dirty fixture.
enableAutoUnmount(afterEach);
