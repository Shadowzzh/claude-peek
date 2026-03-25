export default {
	cli: {
		description:
			"TUI application for viewing and managing Claude Code processes",
		commands: {
			list: "列出所有 Claude Code 进程",
			show: "查看进程详细信息",
			messages: "查看会话对话详情 (支持 PID、项目路径或项目路径+历史会话ID)",
			sessions: "列出项目的所有历史会话",
			kill: "终止进程",
			setup: "安装 hook 脚本到 ~/.claude/hooks/ccpeek",
			uninstall: "卸载 hook 脚本和相关配置",
			config: "配置 ccpeek 设置",
		},
		options: {
			json: "以 JSON 格式输出",
			md: "以 Markdown 格式输出到 stdout",
			save: "保存为 Markdown 文件",
			copy: "复制 Markdown 到剪贴板",
			show: "显示当前配置",
		},
	},
	tui: {
		help: {
			up: "↑:上移",
			down: "↓:下移",
			enter: "Enter:会话",
			view: "v:详情",
			delete: "d:删除",
			refresh: "r:刷新",
			quit: "q:退出",
		},
		table: {
			pid: "PID",
			cpu: "CPU",
			mem: "MEM",
			uptime: "进程运行",
			project: "项目名",
			session: "会话",
		},
		confirm: {
			kill: "确认杀死进程 {pid}? (y/回车:确认 n/Esc:取消)",
		},
		messages: {
			noProcess: "未找到运行中的 Claude Code 进程",
			total: "总计: {count} 个进程",
		},
	},
	install: {
		dirCreated: "✓ 已创建脚本目录: {path}",
		dirExists: "- 脚本目录已存在: {path}",
		dataCreated: "✓ 已创建数据目录: {path}",
		dataExists: "- 数据目录已存在: {path}",
		mappingCleared: "✓ 已清空映射文件: {path}",
		mappingCreated: "✓ 已创建映射文件: {path}",
		scriptInstalled: "✓ 已安装: {path}",
		configUpdated: "\n✓ 已更新配置: {path}",
	},
	uninstall: {
		dirRemoved: "✓ 已删除目录: {path}",
		dirNotFound: "- 目录不存在: {path}",
		configUpdated: "✓ 已更新配置: {path}",
		configNotFound: "- 配置文件不存在: {path}",
		complete: "\n✓ 卸载完成",
	},
	config: {
		updated: "✓ 语言已设置为: {lang}",
		current: "当前语言: {lang}",
		invalid: "无效的语言。请使用: zh 或 en",
	},
};
