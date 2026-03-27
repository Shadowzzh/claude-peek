import { Box, Text } from "ink";
import React from "react";
import { COLUMN_WIDTHS, LIST_ROW_WIDTH } from "../constants/index.js";
import { t } from "../i18n/index.js";
import { padEndByWidth } from "../lib/format.js";
import type { ProcessInfo } from "../types.js";
import { ProcessRow } from "./ProcessRow.js";

interface ProcessListProps {
	processes: ProcessInfo[];
	selectedIndex: number;
}

export function ProcessList({ processes, selectedIndex }: ProcessListProps) {
	if (processes.length === 0) {
		return <Text color="yellow">{t("tui.messages.noProcess")}</Text>;
	}

	return (
		<Box flexDirection="column">
			{/* 表头 */}
			<Text bold color="gray">
				{padEndByWidth(t("tui.table.pid"), LIST_ROW_WIDTH)}
				{padEndByWidth(t("tui.table.cpu"), LIST_ROW_WIDTH)}
				{padEndByWidth(t("tui.table.mem"), LIST_ROW_WIDTH)}
				{padEndByWidth(t("tui.table.uptime"), LIST_ROW_WIDTH)}
				{padEndByWidth(t("tui.table.project"), COLUMN_WIDTHS.PROJECT)}
				{padEndByWidth(t("tui.table.session"), COLUMN_WIDTHS.SESSION)}
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
