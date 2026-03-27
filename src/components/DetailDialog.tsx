import { Box, Text } from "ink";
import React, { useEffect, useMemo } from "react";
import { BORDER_STYLE, COLORS, INTERVALS } from "../constants/index.js";
import { t } from "../i18n/index.js";
import { ProcessService, isProcessFound } from "../services/ProcessService.js";

interface DetailDialogProps {
	pid: number;
	visible: boolean;
	onClose: () => void;
}

const service = new ProcessService();

export function DetailDialog({ pid, visible, onClose }: DetailDialogProps) {
	const result = useMemo(() => service.selectProcess(String(pid)), [pid]);

	useEffect(() => {
		if (!visible) return;

		const interval = setInterval(() => {
			const check = service.selectProcess(String(pid));
			if (!isProcessFound(check)) {
				onClose();
			}
		}, INTERVALS.PROCESS_CHECK);

		return () => clearInterval(interval);
	}, [pid, visible, onClose]);

	if (!visible || !isProcessFound(result)) return null;

	const proc = result.process;

	return (
		<Box
			flexDirection="column"
			borderStyle={BORDER_STYLE}
			borderColor={COLORS.PRIMARY}
			padding={1}
		>
			<Text bold color={COLORS.PRIMARY}>
				{t("tui.detail.title")}
			</Text>
			<Text dimColor> </Text>

			<Text>
				<Text bold>PID:</Text> {proc.pid}
			</Text>
			<Text>
				<Text bold>CPU:</Text> {proc.cpu}
			</Text>
			<Text>
				<Text bold>内存:</Text> {proc.mem}
			</Text>
			<Text>
				<Text bold>进程运行:</Text> {proc.etime}
			</Text>
			<Text>
				<Text bold>项目名:</Text> {proc.projectName}
			</Text>
			<Text>
				<Text bold>完整路径:</Text> {proc.cwd}
			</Text>
			<Text>
				<Text bold>Claude 项目路径:</Text> {proc.claudeProjectPath}
			</Text>

			<Text dimColor> </Text>
			<Text bold color={COLORS.PRIMARY}>
				{t("tui.detail.sessionInfo")}
			</Text>
			<Text dimColor> </Text>

			{proc.session ? (
				<>
					<Text>
						<Text bold>会话名称:</Text> {proc.session.summary}
					</Text>
					<Text>
						<Text bold>消息数:</Text> {proc.session.messageCount}
					</Text>
					<Text>
						<Text bold>创建时间:</Text>{" "}
						{new Date(proc.session.created).toLocaleString()}
					</Text>
					<Text>
						<Text bold>修改时间:</Text>{" "}
						{new Date(proc.session.modified).toLocaleString()}
					</Text>
				</>
			) : (
				<Text color={COLORS.WARNING}>{t("tui.detail.sessionNotFound")}</Text>
			)}

			<Text dimColor> </Text>
			<Text dimColor>{t("tui.detail.closeHint")}</Text>
		</Box>
	);
}
