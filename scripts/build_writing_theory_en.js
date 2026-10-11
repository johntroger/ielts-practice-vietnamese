/**
 * scripts/build_writing_theory_en.js
 * Merges Part 1, Part 2, Part 3, and Part 4 into src/data/theoryHandbook/writingTheoryDataEn.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { PART1_ARTICLES_EN } from './generate_writing_en_part1.js';
import { PART2_ARTICLES_EN } from './generate_writing_en_part2.js';
import { PART3_ARTICLES_EN } from './generate_writing_en_part3.js';
import { PART4_ARTICLES_EN } from './generate_writing_en_part4.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ALL_WRITING_EN = {
  ...PART1_ARTICLES_EN,
  ...PART2_ARTICLES_EN,
  ...PART3_ARTICLES_EN,
  ...PART4_ARTICLES_EN
};

const keys = Object.keys(ALL_WRITING_EN);
console.log(`Aggregated ${keys.length} English writing theory articles.`);

const targetFile = path.resolve(__dirname, '../src/data/theoryHandbook/writingTheoryDataEn.js');

const fileHeader = `/**
 * src/data/theoryHandbook/writingTheoryDataEn.js
 * Complete English edition of all 34 IELTS Writing Theory & Strategy articles.
 * Contains authentic academic English translations for titles, summaries, stages, and full Markdown content.
 */

export const WRITING_THEORY_ARTICLES_EN = ${JSON.stringify(ALL_WRITING_EN, null, 2)};
`;

fs.writeFileSync(targetFile, fileHeader, 'utf-8');
console.log(`Successfully generated: ${targetFile} (${fs.statSync(targetFile).size} bytes)`);
