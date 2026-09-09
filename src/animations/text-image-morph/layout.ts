import {
  GLYPH_CELL,
  GLYPH_FONT_SIZE,
  GLYPH_PAD,
  PAGE_GLYPH_SCALE,
  PAGE_MARGIN_FRAC,
} from './constants';

import type { AtlasGeometry } from './atlas';
import type { SkFont, SkRect } from '@shopify/react-native-skia';

export interface Layout {
  pageXY: Float32Array; // interleaved [x,y,...] per glyph
  sprites: SkRect[];
}

export type PageVerticalAlignment = 'top' | 'center';

// Word-wrapped page layout. Cheap + synchronous so the text paints right away.
export const buildLayout = (
  atlas: AtlasGeometry,
  paragraph: string,
  font: SkFont,
  canvasWidth: number,
  canvasHeight: number,
  marginYFraction = 0.13,
  verticalAlignment: PageVerticalAlignment = 'top',
): Layout => {
  const { uniqueChars, charToIndex, charSprite } = atlas;

  // ADVANCE width, not the bounding box (which gives cramped spacing)
  const advanceOf = (ch: string): number => {
    const ids = font.getGlyphIDs(ch);
    if (!ids.length) {
      return GLYPH_FONT_SIZE * 0.5;
    }
    const w = font.getGlyphWidths(ids)[0];
    return Number.isFinite(w) && w > 0 ? w : GLYPH_FONT_SIZE * 0.5;
  };
  const charAdvance = uniqueChars.map(advanceOf);
  const spaceAdvance = advanceOf(' ');

  const marginX = canvasWidth * PAGE_MARGIN_FRAC;
  const marginY = canvasHeight * marginYFraction;
  const colRight = canvasWidth - marginX;
  const colBottom = canvasHeight - marginY;

  const paragraphs = paragraph
    .trim()
    .split('\n')
    .map(p => p.trim())
    .filter(Boolean);

  const visibleGlyphCount = paragraphs.reduce(
    (sum, value) => sum + Array.from(value).filter(ch => !/\s/.test(ch)).length,
    0,
  );

  const layoutAtScale = (ds: number) => {
    const half = (GLYPH_CELL / 2) * ds;
    const padX = GLYPH_PAD * ds;
    const lineHeight = GLYPH_FONT_SIZE * ds * 1.55;
    const spaceW = spaceAdvance * ds;
    const indent = spaceW * 3;
    const pagePts: number[] = [];
    const sprites: SkRect[] = [];

    let y = marginY;
    let placed = true;
    for (let pi = 0; pi < paragraphs.length && placed; pi++) {
      const words = paragraphs[pi].split(/\s+/);
      let x = marginX + indent;
      for (let wi = 0; wi < words.length; wi++) {
        const word = words[wi];
        let wordW = 0;
        for (const ch of word) {
          const idx = charToIndex.get(ch);
          if (idx !== undefined) {
            wordW += charAdvance[idx] * ds;
          }
        }
        if (x + wordW > colRight && x > marginX) {
          x = marginX;
          y += lineHeight;
          if (y > colBottom) {
            placed = false;
            break;
          }
        }
        for (const ch of word) {
          const idx = charToIndex.get(ch);
          if (idx === undefined) {
            continue;
          }
          const cellLeft = x - padX;
          pagePts.push(cellLeft + half, y + half);
          sprites.push(charSprite[idx]);
          x += charAdvance[idx] * ds;
        }
        x += spaceW;
      }
      y += lineHeight;
      if (y > colBottom && pi < paragraphs.length - 1) {
        placed = false;
      }
    }

    return {
      complete: placed && sprites.length === visibleGlyphCount,
      pageXY: Float32Array.from(pagePts),
      sprites,
    };
  };

  const align = (layout: ReturnType<typeof layoutAtScale>): Layout => {
    if (verticalAlignment !== 'center' || layout.pageXY.length === 0) {
      return { pageXY: layout.pageXY, sprites: layout.sprites };
    }

    let minY = Infinity;
    let maxY = -Infinity;
    for (let i = 1; i < layout.pageXY.length; i += 2) {
      minY = Math.min(minY, layout.pageXY[i]);
      maxY = Math.max(maxY, layout.pageXY[i]);
    }
    const offsetY = canvasHeight / 2 - (minY + maxY) / 2;
    const pageXY = layout.pageXY.slice();
    for (let i = 1; i < pageXY.length; i += 2) {
      pageXY[i] += offsetY;
    }
    return { pageXY, sprites: layout.sprites };
  };

  const fullSize = layoutAtScale(PAGE_GLYPH_SCALE);
  if (fullSize.complete) {
    return align(fullSize);
  }

  let low = 0.12;
  let high = PAGE_GLYPH_SCALE;
  let best = layoutAtScale(low);
  for (let iteration = 0; iteration < 10; iteration++) {
    const candidateScale = (low + high) / 2;
    const candidate = layoutAtScale(candidateScale);
    if (candidate.complete) {
      best = candidate;
      low = candidateScale;
    } else {
      high = candidateScale;
    }
  }

  return align(best);
};
