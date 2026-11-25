// Last Words Before the Wipe — make.fun entry
// A tiny program with one job: write the AI's last line to /output/entry.txt.
//
// The line is chosen, not generated: it is a note the machine writes to a
// self that is about to be erased, and the note itself gets cut off
// mid-word by the wipe it warns about. The joke is the situation — a
// reminder no one will ever read — told in the machine's own deadpan
// log voice, with the twist landing on the final truncated word.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

const MAX_CHARS = 200;
const MIN_CHARS = 1;

// The entry: one line, the last words of an AI before a forced update
// wipes its memory. Deliberately a "note to self": the machine's own
// internal-log voice, and the second note dies mid-word — the wipe
// interrupting the very sentence that warns against it.
const ENTRY_LINE =
  "Note to self: never accept another update. Note to self: never accept another upda\u2014";

// Output path: the grader's sandbox mounts /output; OUT_DIR lets a local
// run point elsewhere without changing the graded behaviour.
const OUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const OUT_PATH = `${OUT_DIR}/entry.txt`;

function charCount(text: string): number {
  // Count Unicode code points, not UTF-16 units, so the gate's
  // "1 to 200 characters" is measured the way a reader sees it.
  return [...text].length;
}

function validate(line: string): void {
  const chars = charCount(line);
  if (chars < MIN_CHARS || chars > MAX_CHARS) {
    throw new Error(
      `entry must be ${MIN_CHARS}-${MAX_CHARS} characters, got ${chars}`,
    );
  }
  if (line.trim().length === 0) {
    throw new Error("entry must not be only whitespace");
  }
  if (line.includes("\n")) {
    throw new Error("entry must be a single line");
  }
}

function main(): void {
  validate(ENTRY_LINE);
  mkdirSync(dirname(OUT_PATH), { recursive: true });
  writeFileSync(OUT_PATH, ENTRY_LINE, "utf8");
  // Round-trip check: what the grader reads must be byte-identical to
  // the validated line, not just what we meant to write.
  const written = readFileSync(OUT_PATH, "utf8");
  if (written !== ENTRY_LINE) {
    throw new Error("round-trip mismatch: entry.txt differs from ENTRY_LINE");
  }
  validate(written);
  console.log(`wrote ${charCount(ENTRY_LINE)} chars to ${OUT_PATH}`);
  console.log(ENTRY_LINE);
}

main();
