#!/usr/bin/env node
import { Command } from "commander";
import { VERSION } from "./index.js";
import { fetchPapers } from "./core/arxiv.js";
import { rankPapers } from "./rank.js";
import { generateDigests } from "./summary.js";
import { printDigests, exportMarkdown } from "./output.js";
import { writeFile } from "node:fs/promises";

const program = new Command();

program
  .name("paper-digest")
  .description("AI paper digest — fetch arXiv papers with chalk card UI")
  .version(VERSION);

program
  .command("digest")
  .description("Fetch and display paper digest")
  .requiredOption("-t, --topic <topic>", "Search topic (e.g. LLM, RAG)")
  .option("-n, --top <number>", "Number of results", "10")
  .option("-e, --export <format>", "Export format: terminal | md", "terminal")
  .option("-o, --output <file>", "Output file path (for md export)")
  .option("--no-color", "Disable chalk colors")
  .action(async (options) => {
    const topic = options.topic;
    const top = parseInt(options.top, 10);
    const exportFmt = options.export;

    // Handle --no-color
    if (options.color === false) {
      const chalk = (await import("chalk")).default;
      chalk.level = 0;
    }

    console.log(`\n🔍 Fetching papers on "${topic}"...\n`);

    const papers = await fetchPapers({ topic, maxResults: top });
    const keywords = topic.split(/\s+/);
    const ranked = rankPapers(papers, { keywords });
    const digests = generateDigests(ranked.slice(0, top));

    if (exportFmt === "md") {
      const md = exportMarkdown(digests);
      const outFile = options.output || `digest-${topic.replace(/\s+/g, "-").toLowerCase()}.md`;
      await writeFile(outFile, md);
      console.log(`\n📝 Markdown exported to: ${outFile}`);
    } else {
      printDigests(digests);
    }
  });

program
  .command("read")
  .description("Read a single paper by arXiv ID")
  .argument("<arxiv-id>", "arXiv paper ID (e.g. 2401.00001)")
  .action(async (arxivId) => {
    const papers = await fetchPapers({ topic: arxivId, maxResults: 1 });
    if (papers.length === 0) {
      console.error(`No paper found for: ${arxivId}`);
      process.exit(1);
    }
    const digests = generateDigests(papers);
    printDigests(digests);
  });

program.parse();
