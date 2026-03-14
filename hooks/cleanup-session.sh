#!/bin/bash

MAPPING_FILE="$HOME/.claude/session-mappings.jsonl"

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
