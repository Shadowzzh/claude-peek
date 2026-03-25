import { Box, Text } from "ink";
import React from "react";
import { t } from "../i18n/index.js";

interface ConfirmDialogProps {
	pid: number;
	visible: boolean;
}

export function ConfirmDialog({ pid, visible }: ConfirmDialogProps) {
	if (!visible) return null;

	return (
		<Box borderStyle="round" borderColor="red" padding={1}>
			<Text color="red">{t("tui.confirm.kill", { pid })}</Text>
		</Box>
	);
}
