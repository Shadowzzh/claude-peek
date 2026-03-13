import { Text } from "ink";
import React from "react";
import type { ProcessInfo } from "../types.js";

interface ProcessRowProps {
	proc: ProcessInfo;
	isSelected: boolean;
}

export function ProcessRow({ proc, isSelected }: ProcessRowProps) {
	const rowWidth = 10;
	return (
		<Text
			backgroundColor={isSelected ? "blue" : undefined}
			color={isSelected ? "white" : undefined}
		>
			{String(proc.pid).padEnd(rowWidth)}
			{String(proc.cpu).padEnd(rowWidth)}
			{String(proc.mem).padEnd(rowWidth)}
			{String(proc.etime).padEnd(rowWidth)}
			{String(proc.cwd).padEnd(0)}
		</Text>
	);
}
