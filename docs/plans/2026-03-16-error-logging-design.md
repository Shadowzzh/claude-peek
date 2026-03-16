# Error Logging Design

**Date:** 2026-03-16
**Status:** Approved

## Overview

Add error logging functionality to ccpeek for collecting and debugging runtime errors.

## Requirements

- Collect: uncaught exceptions, runtime errors, command execution failures
- Storage: Daily rotating log files in `~/.claude/ccpeek/logs/YYYY-MM-DD.log`
- Access: `ccpeek logs` command for viewing logs
- Cleanup: Auto-remove logs older than 30 days

## Architecture

### Dependencies

- `pino` - Core logging library
- `pino-pretty` - For `ccpeek logs` command output formatting

### New Files

```
src/
  lib/
    logger.ts           # Logger initialization and configuration
  utils/
    errorBoundary.ts    # Error capture decorator
  commands/
    logs.ts             # ccpeek logs command
```

### Log Format

```json
{
  "level": "error",
  "time": 1678923456789,
  "msg": "execSync failed: ps command",
  "err": {
    "type": "Error",
    "message": "...",
    "stack": "..."
  },
  "context": {
    "command": "getClaudeProcesses",
    "pid": 12345
  }
}
```

## Error Capture Points

1. **Global handlers** (`src/index.ts`)
   - `uncaughtException`
   - `unhandledRejection`

2. **ProcessService** (`src/services/ProcessService.ts`)
   - Process data retrieval errors
   - Session data parsing errors

3. **Process queries** (`src/lib/process.ts`)
   - `execSync` failures in `getClaudeProcesses`
   - `lsof` failures in `getCwd`

4. **Session parsing** (`src/lib/session.ts`, `src/lib/sessionParser.ts`)
   - File not found / format errors
   - JSON parse errors

5. **Commands** (`src/commands/*.ts`)
   - Try-catch errors in command handlers

## logs Command

```bash
ccpeek logs                  # Show today's errors
ccpeek logs -f               # Tail -f mode
ccpeek logs -n 20            # Last 20 entries
ccpeek logs --date 2026-03-15 # Specific date
ccpeek logs --clear          # Clear all logs
```

## Log Rotation & Cleanup

- Daily file rotation by date
- Auto-cleanup: delete logs older than 30 days on startup
- Manual cleanup via `--clear` flag

## Directory Structure

```
~/.claude/ccpeek/logs/
  ├── 2026-03-15.log
  ├── 2026-03-16.log
  └── 2026-03-17.log
```
