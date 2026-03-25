#!/usr/bin/env node
import { createCli } from "./cli.js";
import { initLanguage } from "./i18n/index.js";
import { startTui } from "./main.js";

// Extract --lang parameter before creating CLI
const langIndex = process.argv.indexOf("--lang");
const lang = langIndex !== -1 ? process.argv[langIndex + 1] : undefined;

// Initialize language first
initLanguage(lang);

const program = createCli();

// 默认命令：启动 TUI
program.action(() => {
	startTui();
});

program.parse();
