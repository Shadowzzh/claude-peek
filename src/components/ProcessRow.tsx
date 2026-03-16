import { Box } from "ink";
import React from "react";
import { truncateAndPad } from "../lib/format.js";
import type { ProcessInfo } from "../types.js";
import { TableCell } from "./TableCell.js";

interface ProcessRowProps {
	proc: ProcessInfo;
	isSelected: boolean;
}

export function ProcessRow({ proc, isSelected }: ProcessRowProps) {
	const summary = (proc.session?.summary || "N/A").replace(/\s+/g, " ");

	return (
		<Box flexDirection="row">
			<TableCell width={10} isSelected={isSelected}>
				{truncateAndPad(String(proc.pid), 10)}
			</TableCell>
			<TableCell width={10} isSelected={isSelected}>
				{truncateAndPad(String(proc.cpu), 10)}
			</TableCell>
			<TableCell width={10} isSelected={isSelected}>
				{truncateAndPad(String(proc.mem), 10)}
			</TableCell>
			<TableCell width={10} isSelected={isSelected}>
				{truncateAndPad(String(proc.etime), 10)}
			</TableCell>
			<TableCell width={20} isSelected={isSelected}>
				{truncateAndPad(proc.projectName, 20)}
			</TableCell>
			<TableCell width={40} isSelected={isSelected}>
				{truncateAndPad(summary, 40)}
			</TableCell>
		</Box>
	);
}
