import { Box } from "ink";
import React from "react";
import { COLUMN_WIDTHS } from "../constants/index.js";
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
			<TableCell width={COLUMN_WIDTHS.PID} isSelected={isSelected}>
				{truncateAndPad(String(proc.pid), COLUMN_WIDTHS.PID)}
			</TableCell>
			<TableCell width={COLUMN_WIDTHS.CPU} isSelected={isSelected}>
				{truncateAndPad(String(proc.cpu), COLUMN_WIDTHS.CPU)}
			</TableCell>
			<TableCell width={COLUMN_WIDTHS.MEM} isSelected={isSelected}>
				{truncateAndPad(String(proc.mem), COLUMN_WIDTHS.MEM)}
			</TableCell>
			<TableCell width={COLUMN_WIDTHS.UPTIME} isSelected={isSelected}>
				{truncateAndPad(String(proc.etime), COLUMN_WIDTHS.UPTIME)}
			</TableCell>
			<TableCell width={COLUMN_WIDTHS.PROJECT} isSelected={isSelected}>
				{truncateAndPad(proc.projectName, COLUMN_WIDTHS.PROJECT)}
			</TableCell>
			<TableCell width={COLUMN_WIDTHS.SESSION} isSelected={isSelected}>
				{truncateAndPad(summary, COLUMN_WIDTHS.SESSION)}
			</TableCell>
		</Box>
	);
}
