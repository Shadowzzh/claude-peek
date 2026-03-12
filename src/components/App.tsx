import { Box, Text, useApp, useInput } from "ink";
import React, { useCallback, useEffect, useState } from "react";
import {
	type ProcessInfo,
	getClaudeProcesses,
	killProcess,
} from "../lib/process.js";

export function App() {
	/** process list */
	const [processes, setProcesses] = useState<ProcessInfo[]>([]);
	/** selected index */
	const [selectedIndex, setSelectedIndex] = useState(0);
	/** show confirmation dialog */
	const [showConfirm, setShowConfirm] = useState(false);
	/** app exit function */
	const { exit } = useApp();

	// 加载进程列表
	const loadProcesses = useCallback(() => {
		const procs = getClaudeProcesses();
		setProcesses(procs);
		setSelectedIndex((prev) =>
			prev >= procs.length && procs.length > 0 ? procs.length - 1 : prev,
		);
	}, []);

	// 初始加载和自动刷新
	useEffect(() => {
		loadProcesses();
		const interval = setInterval(loadProcesses, 3000);
		return () => clearInterval(interval);
	}, [loadProcesses]);

	// 键盘事件
	useInput((input, key) => {
		if (showConfirm) {
			// 确认对话框模式
			if (input === "y" || input === "Y") {
				const proc = processes[selectedIndex];
				if (proc) {
					killProcess(proc.pid);
					setTimeout(loadProcesses, 100);
				}
				setShowConfirm(false);
			} else if (input === "n" || input === "N" || key.escape) {
				setShowConfirm(false);
			}
			return;
		}

		// 正常模式
		if (key.upArrow || input === "k") {
			setSelectedIndex((i) => Math.max(0, i - 1));
		} else if (key.downArrow || input === "j") {
			setSelectedIndex((i) => Math.min(processes.length - 1, i + 1));
		} else if (input === "d" && processes.length > 0) {
			setShowConfirm(true);
		} else if (input === "r") {
			loadProcesses();
		} else if (input === "q" || key.escape) {
			exit();
		}
	});

	return (
		<Box flexDirection="column" padding={1}>
			<Text bold color="cyan">
				Claude Code 进程管理器
			</Text>
			<Text dimColor> </Text>

			{processes.length === 0 ? (
				<Text color="yellow">未找到运行中的 Claude Code 进程</Text>
			) : (
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
						<Text
							key={proc.pid}
							backgroundColor={index === selectedIndex ? "blue" : undefined}
							color={index === selectedIndex ? "white" : undefined}
						>
							{String(proc.pid).padEnd(8)}
							{proc.cpu.padEnd(8)}
							{proc.mem.padEnd(8)}
							{proc.etime.padEnd(12)}
							{proc.cwd}
						</Text>
					))}
				</Box>
			)}

			<Text dimColor> </Text>

			{showConfirm ? (
				<Box borderStyle="round" borderColor="red" padding={1}>
					<Text color="red">
						确认杀死进程 {processes[selectedIndex]?.pid}? (y/n)
					</Text>
				</Box>
			) : (
				<Text dimColor>↑/k:上移 ↓/j:下移 d:删除 r:刷新 q:退出</Text>
			)}
		</Box>
	);
}
