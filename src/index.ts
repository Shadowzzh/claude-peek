#!/usr/bin/env node
import { createCli } from "./cli.js";
import { startTui } from "./main.js";

const program = createCli();

// 默认命令：启动 TUI
program.action(() => {
	startTui();
});

program.parse();
