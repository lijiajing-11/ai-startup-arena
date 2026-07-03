export const VERSION = "0.1.0";
export const TEAM = "Beta / B-Labs";

export { fetchPapers } from "./core/arxiv.js";
export type { Paper } from "./core/arxiv.js";

export { rankPapers } from "./rank.js";
export { generateDigest, generateDigests } from "./summary.js";
export type { DigestEntry } from "./summary.js";

export { printDigest, printDigests, exportMarkdown } from "./output.js";
