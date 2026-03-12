import { Box, Text } from "ink";
import React from "react";

interface ConfirmDialogProps {
	pid: number;
	visible: boolean;
}

export function ConfirmDialog({ pid, visible }: ConfirmDialogProps) {
	if (!visible) return null;

	return (
		<Box borderStyle="round" borderColor="red" padding={1}>
			<Text color="red">确认杀死进程 {pid}? (y/n)</Text>
		</Box>
	);
}
