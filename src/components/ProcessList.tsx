import { Box, Text } from "ink";
import React from "react";
import type { ProcessInfo } from "../types.js";
import { ProcessRow } from "./ProcessRow.js";

interface ProcessListProps {
	processes: ProcessInfo[];
	selectedIndex: number;
}

export function ProcessList({ processes, selectedIndex }: ProcessListProps) {
	if (processes.length === 0) {
		return <Text color="yellow">未找到运行中的 Claude Code 进程</Text>;
	}

	return (
		<Box flexDirection="column">
			{/* 表头 */}
			<Text bold color="gray">
				{"PID".padEnd(8)}
				{"CPU".padEnd(8)}
				{"MEM".padEnd(8)}
				{"运行时长".padEnd(12)}工作目录
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
