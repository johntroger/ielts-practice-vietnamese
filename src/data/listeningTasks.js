/**
 * IELTS Listening Practice Tasks Dataset (Standard Cambridge Academic / General Training Format)
 * Full 4 Parts, 40 Questions, Exact Answer Keys, Evidence Locators & Audio Timestamps.
 */

import { cambridge18Test1 } from './listening/cambridge18Test1';
import { cambridge8Test1 } from './listening/cambridge8Test1';
import { cambridge8Test2 } from './listening/cambridge8Test2';
import { cambridge8Test3 } from './listening/cambridge8Test3';

// Cambridge IELTS Listening Raw Score to Band Score Conversion Table
export function calculateListeningBandScore(rawScore) {
  const score = Math.max(0, Math.min(40, Number(rawScore) || 0));
  if (score >= 39) return 9.0;
  if (score >= 37) return 8.5;
  if (score >= 35) return 8.0;
  if (score >= 32) return 7.5;
  if (score >= 30) return 7.0;
  if (score >= 26) return 6.5;
  if (score >= 23) return 6.0;
  if (score >= 18) return 5.5;
  if (score >= 16) return 5.0;
  if (score >= 13) return 4.5;
  if (score >= 10) return 4.0;
  if (score >= 6) return 3.5;
  if (score >= 4) return 3.0;
  return 2.5;
}

// Master collection of pre-loaded official Cambridge simulation tests
export const INITIAL_LISTENING_TESTS = [
  cambridge18Test1,
  cambridge8Test1,
  cambridge8Test2,
  cambridge8Test3
];
