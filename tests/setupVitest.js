/**
 * Vitest Environment Setup Bootstrap
 * Automatically injects the zero-dependency DOM Simulation Harness before tests run.
 */

import { DomSimulationHarness } from './utils/domSimulationHarness.js';

// Setup global browser simulation
const { cleanup } = DomSimulationHarness.setupEnvironment();

if (typeof afterAll === 'function') {
  afterAll(() => {
    cleanup();
  });
}
