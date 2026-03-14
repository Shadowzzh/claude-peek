---
name: claude-ps-session-lookup
description: claude-ps 会话查找实现逻辑
---

## 架构

**Hooks 配置** (`~/.claude/settings.json`)
```json
{
  "SessionStart": [{
    "hooks": [{
      "type": "command",
      "command": "~/.claude/hooks/claude-ps/record-session.sh"
    }]
  }],
  "SessionEnd": [{
    "hooks": [{
      "type": "command",
      "command": "~/.claude/hooks/claude-ps/cleanup-session.sh"
    }]
  }]
}
```

**Hook 脚本** (`~/.claude/hooks/claude-ps/`)
- `record-session.sh` - 遍历进程树找 claude PID，写入映射
- `cleanup-session.sh` - 清理已退出进程的映射记录
- `get-session.sh` - 通过 PID 查询 SessionID（未使用）

**代码** (`src/lib/session.ts`)
- `getSessionIdFromPid()` - 从映射文件查 PID
- `getSessionIdFromHistory()` - 从 history.jsonl fallback
- `getLastUserMessage()` - 获取用户最后提问

## 数据流

```
Claude 启动 → SessionStart hook → record-session.sh
  ↓
遍历进程树找到 claude 进程 PID
  ↓
写入 ~/.claude/session-mappings.jsonl
  ↓
claude-ps 读取映射 → 匹配 PID → 获取 SessionID
  ↓
从 history.jsonl 读取最后用户消息 → 显示
```

## 关键实现

**PID 获取** (`record-session.sh`)
```bash
find_claude_pid() {
    local current_pid=$$
    while [ $current_pid -ne 1 ]; do
        local cmd=$(ps -o command= -p $current_pid)
        if echo "$cmd" | grep -q "^claude "; then
            echo $current_pid
            return 0
        fi
        current_pid=$(ps -o ppid= -p $current_pid | tr -d ' ')
    done
}
```

**Fallback 机制**
1. 优先从 `session-mappings.jsonl` 通过 PID 精确匹配
2. 失败则从 `history.jsonl` 获取项目最新会话（可能不准确）

**会话显示**
- 不使用 `sessions-index.json` 的 summary
- 直接从 `history.jsonl` 获取用户最后一条消息

## 依赖

- `jq` - 解析 JSON（未安装时静默退出）
