import { describe, it } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';

describe('Step 123: Arena Question Viewport Overflow & Scroll Clipping Fix', () => {
  it('1. AtlasEnglishArenaModal uses justify-start and min-h-0 to prevent flexbox centering clipping bug', () => {
    const modalPath = path.resolve('src/components/arena/AtlasEnglishArenaModal.jsx');
    const modalCode = fs.readFileSync(modalPath, 'utf-8');

    // Must NOT have justify-center in active sprint question container
    assert.ok(
      !modalCode.includes('justify-center items-center overflow-y-auto'),
      'Must not use justify-center on scrollable question container to avoid top cut-off'
    );
    // Must have justify-start and min-h-0
    assert.ok(
      modalCode.includes('items-center justify-start overflow-y-auto'),
      'Must use justify-start so question prompt and badges start at top'
    );
    assert.ok(
      modalCode.includes('min-h-0'),
      'Must use min-h-0 on flex child so overflow-y-auto scrolls properly without pushing header'
    );
  });

  it('2. ArenaHeaderBar is fixed at the top with shrink-0 inside active sprint state', () => {
    const headerPath = path.resolve('src/components/arena/ArenaHeaderBar.jsx');
    const headerCode = fs.readFileSync(headerPath, 'utf-8');

    assert.ok(headerCode.includes('shrink-0'), 'ArenaHeaderBar must have shrink-0');
  });

  it('3. ArenaQuestionCard maintains compact vertical density and legible font hierarchy', () => {
    const cardPath = path.resolve('src/components/arena/ArenaQuestionCard.jsx');
    const cardCode = fs.readFileSync(cardPath, 'utf-8');

    assert.ok(cardCode.includes('ArenaMediaViewer'), 'ArenaQuestionCard embeds media viewer');
    assert.ok(cardCode.includes('question.prompt'), 'ArenaQuestionCard renders question.prompt');
    assert.ok(cardCode.includes('max-w-2xl'), 'ArenaQuestionCard uses max-w-2xl for optimal readability');
  });

  it('4. ArenaMediaViewer bounds max-height so charts and maps do not overwhelm viewport', () => {
    const mediaPath = path.resolve('src/components/arena/ArenaMediaViewer.jsx');
    const mediaCode = fs.readFileSync(mediaPath, 'utf-8');

    assert.ok(mediaCode.includes('max-h-48') || mediaCode.includes('max-h-52'), 'ArenaMediaViewer sets max-h constraints');
  });
});
