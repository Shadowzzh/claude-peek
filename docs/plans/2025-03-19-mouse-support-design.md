# 鼠标点击选中支持设计文档

**日期:** 2025-03-19
**状态:** 设计完成，待实现

## 概述

为 TUI 模式的进程列表添加鼠标交互支持，允许用户通过单击选中行、双击快速打开详情。

## 功能需求

1. **单击选中** - 点击列表中的某一行，将其设为选中状态
2. **双击快速打开** - 双击某一行，直接打开该进程的会话详情
3. **优雅降级** - 终端不支持鼠标时，静默回退到纯键盘操作

## 技术方案

### 核心技术

- 使用 SGR (1006) 鼠标扩展协议，兼容现代终端
- 通过 Ink 的 `useStdin` hook 获取底层 stdin 流
- 手动解析 escape 序列获取鼠标坐标

### 新增文件

```
src/hooks/useMouseTracking.ts  # 鼠标事件监听和处理
src/lib/mouse.ts                # 鼠标协议解析工具
```

### 修改文件

```
src/hooks/useProcessManager.ts  # 集成鼠标选中逻辑
src/components/ProcessList.tsx  # 传递坐标信息
src/components/HelpBar.tsx      # 更新操作提示
```

## 数据流

```
stdin → useMouseTracking → 解析 SGR 序列 → 计算点击行号
  → setSelectedPid → 更新 selectedIndex → ProcessList 重绘
```

## API 设计

### useMouseTracking Hook

```typescript
interface MouseEvent {
  row: number;
  col: number;
  type: 'click' | 'dblclick' | 'release' | 'motion';
}

interface UseMouseTrackingOptions {
  enabled: boolean;
  onRowClick?: (rowIndex: number) => void;
  onRowDoubleClick?: (rowIndex: number) => void;
  listTopRow: number;  // 列表在终端中的起始行
  listHeight: number;  // 列表行数
}
```

## 实现要点

### 鼠标模式控制

- 启用：`\x1b[?1000h\x1b[?1002h\x1b[?1006h`
- 禁用：`\x1b[?1000l\x1b[?1002l`
- 组件卸载时必须恢复终端状态

### 双击检测

- 记录上次点击的行号和时间戳
- 300ms 内同一行再次点击视为双击
- 使用防抖避免误触发

### 坐标计算

- SGR 报告绝对行号，需减去列表起始行号
- 校验结果：`0 <= rowIndex < processes.length`
- 点击表头或列表外区域时忽略

## 边界情况

| 场景 | 处理方式 |
|------|----------|
| 终端不支持鼠标 | 静默降级，不影响键盘操作 |
| 点击表头 | 忽略 |
| 点击列表外 | 忽略 |
| 进程列表刷新 | 行号越界时取消选中 |
| 终端 resize | 无需处理，坐标基于行号 |

## 用户界面更新

HelpBar 添加鼠标提示：
```
↑↓:移动  Enter:详情  v:信息  d:删除  r:刷新  q:退出  | 鼠标:单击选中/双击打开
```

## 实现优先级

1. 核心：鼠标协议解析和单击选中
2. 增强：双击快速打开
3. 完善：边界情况处理和优雅降级

## 测试计划

- [ ] iTerm2 / Terminal.app 测试
- [ ] 不同列表长度场景
- [ ] 快速单击/双击
- [ ] 不支持鼠标的终端
- [ ] 终端 resize 场景
