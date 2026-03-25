export default {
	cli: {
		description: "Process manager for Claude Code with TUI and CLI interface",
		commands: {
			list: "List all Claude Code processes",
			show: "Show process details",
			messages:
				"View session messages (supports PID, project path, or project path + session ID)",
			sessions: "List all historical sessions for a project",
			kill: "Kill a process",
			setup: "Install hook scripts to ~/.claude/hooks/ccpeek",
			uninstall: "Uninstall hook scripts and configurations",
			config: "Configure ccpeek settings",
		},
		options: {
			json: "Output in JSON format",
			md: "Output as Markdown to stdout",
			save: "Save as Markdown file",
			copy: "Copy Markdown to clipboard",
			show: "Show current configuration",
		},
	},
	tui: {
		help: {
			up: "↑:Up",
			down: "↓:Down",
			enter: "Enter:Session",
			view: "v:Detail",
			delete: "d:Kill",
			refresh: "r:Refresh",
			quit: "q:Quit",
		},
		table: {
			pid: "PID",
			cpu: "CPU",
			mem: "MEM",
			uptime: "Uptime",
			project: "Project",
			session: "Session",
		},
		confirm: {
			kill: "Kill process {pid}? (y/Enter:Yes n/Esc:No)",
		},
		messages: {
			noProcess: "No running Claude Code processes found",
			total: "Total: {count} process(es)",
		},
	},
	install: {
		dirCreated: "✓ Created directory: {path}",
		dirExists: "- Directory exists: {path}",
		dataCreated: "✓ Created data directory: {path}",
		dataExists: "- Data directory exists: {path}",
		mappingCleared: "✓ Cleared mapping file: {path}",
		mappingCreated: "✓ Created mapping file: {path}",
		scriptInstalled: "✓ Installed: {path}",
		configUpdated: "\n✓ Updated configuration: {path}",
	},
	uninstall: {
		dirRemoved: "✓ Removed directory: {path}",
		dirNotFound: "- Directory not found: {path}",
		configUpdated: "✓ Updated configuration: {path}",
		configNotFound: "- Configuration file not found: {path}",
		complete: "\n✓ Uninstall complete",
	},
	config: {
		updated: "✓ Language set to: {lang}",
		current: "Current language: {lang}",
		invalid: "Invalid language. Use: zh or en",
	},
};
