# 代码结构重构设计

## 目标

将 claude-ps 项目从 6 个文件重构为 13 个文件，实现职责分离、单向数据流。

## 最终结构

```
src/
├── index.ts               # 入口，路由到 CLI 或 TUI
├── cli.ts                 # CLI 命令定义
├── main.tsx               # TUI 渲染入口
├── types.ts               # 类型定义
├── commands/
│   └── list.ts            # list 命令实现
├── components/
│   ├── App.tsx            # 容器组件
│   ├── ProcessList.tsx    # 进程列表
│   ├── ProcessRow.tsx     # 单行进程
│   ├── ConfirmDialog.tsx  # 确认对话框
│   └── HelpBar.tsx        # 快捷键提示
├── hooks/
│   └── useProcessManager.ts
└── lib/
    ├── process.ts         # 进程操作
    └── format.ts          # 格式化函数
```

## 各层职责

### 入口层

- `index.ts` - 程序入口，解析命令行参数，决定调用 cli.ts 还是 main.tsx
- `cli.ts` - 定义 `list` 等非交互命令，使用 commander
- `main.tsx` - 只做一件事：`render(<App />)`

### 组件层

- `App.tsx` - 纯组合层，调用 hook 获取状态，传递给子组件
- `ProcessList.tsx` - 渲染表头 + 遍历 ProcessRow
- `ProcessRow.tsx` - 单个进程行，接收 `proc` 和 `isSelected` props
- `ConfirmDialog.tsx` - 确认框，接收 `pid` 和 `visible` props
- `HelpBar.tsx` - 显示快捷键，无状态

### Hooks 层

- `useProcessManager.ts` - 核心状态管理，包含：
  - 状态：processes, selectedIndex, showConfirm
  - 方法：loadProcesses, moveUp, moveDown, confirmKill, cancelKill, executeKill
  - 键盘绑定：useInput

### Lib 层

- `process.ts` - 进程操作（getClaudeProcesses, killProcess）
- `format.ts` - 格式化函数（formatEtime, formatProcessRow）

### 类型定义

- `types.ts` - ProcessInfo, ProcessManagerState

## 数据流

```
useProcessManager (hook)
       ↓
     App.tsx
       ↓
  ┌────┴────┬──────────┐
  ↓         ↓          ↓
ProcessList ConfirmDialog HelpBar
  ↓
ProcessRow
```

所有状态集中在 hook，组件只负责渲染，单向数据流。
