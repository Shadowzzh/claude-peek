import { Box, Text } from "ink";
import React from "react";
import { t } from "../i18n/index.js";
import { padEndByWidth } from "../lib/format.js";
import type { ProcessInfo } from "../types.js";
import { ProcessRow } from "./ProcessRow.js";

interface ProcessListProps {
	processes: ProcessInfo[];
	selectedIndex: number;
}

export function ProcessList({ processes, selectedIndex }: ProcessListProps) {
	const rowWidth = 10;

	if (processes.length === 0) {
		return <Text color="yellow">{t("tui.messages.noProcess")}</Text>;
	}

	return (
		<Box flexDirection="column">
			{/* 表头 */}
			<Text bold color="gray">
				{padEndByWidth(t("tui.table.pid"), rowWidth)}
				{padEndByWidth(t("tui.table.cpu"), rowWidth)}
				{padEndByWidth(t("tui.table.mem"), rowWidth)}
				{padEndByWidth(t("tui.table.uptime"), rowWidth)}
				{padEndByWidth(t("tui.table.project"), 20)}
				{padEndByWidth(t("tui.table.session"), 40)}
			</Text>

			{/* 进程列表 */}
			{processes.map((proc, index) => (
				<ProcessRow
					key={proc.pid}
					proc={proc}
					isSelected={index === selectedIndex}
				/>
			))}
		</Box>
	);
}
