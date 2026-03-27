export const RECORD_SESSION_SCRIPT = `#!/bin/bash

MAPPING_FILE="$HOME/.claude/ccpeek/session-mappings.jsonl"

if ! command -v jq &> /dev/null; then
    exit 0
fi

# Read stdin to get session info
stdin_data=$(cat)
session_id=$(echo "$stdin_data" | jq -r '.session_id // empty' 2>/dev/null)
[ -z "$session_id" ] && exit 0

find_claude_pid() {
    local current_pid=$$
    while [ "$current_pid" -ne 1 ] && [ -n "$current_pid" ]; do
        local cmd=$(ps -o comm= -p "$current_pid" 2>/dev/null | tr -d ' ')
        if [ "$cmd" = "claude" ]; then
            echo "$current_pid"
            return 0
        fi
        current_pid=$(ps -o ppid= -p "$current_pid" 2>/dev/null | tr -d ' ')
    done
    return 1
}

claude_pid=$(find_claude_pid)
[ -z "$claude_pid" ] && exit 0

mkdir -p "$(dirname "$MAPPING_FILE")"
echo "{\\"pid\\":$claude_pid,\\"sessionId\\":\\"$session_id\\",\\"timestamp\\":$(date +%s)}" >> "$MAPPING_FILE"
`;

export const CLEANUP_SESSION_SCRIPT = `#!/bin/bash

MAPPING_FILE="$HOME/.claude/ccpeek/session-mappings.jsonl"

if ! command -v jq &> /dev/null; then
    exit 0
fi

[ ! -f "$MAPPING_FILE" ] && exit 0

temp_file=$(mktemp)
while IFS= read -r line; do
    pid=$(echo "$line" | jq -r '.pid')
    if ps -p "$pid" > /dev/null 2>&1; then
        echo "$line" >> "$temp_file"
    fi
done < "$MAPPING_FILE"

mv "$temp_file" "$MAPPING_FILE"
`;
