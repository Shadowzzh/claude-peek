import { Text } from "ink";
import React from "react";
import { t } from "../i18n/index.js";

export function HelpBar() {
	const help = [
		t("tui.help.up"),
		t("tui.help.down"),
		t("tui.help.enter"),
		t("tui.help.view"),
		t("tui.help.delete"),
		t("tui.help.refresh"),
		t("tui.help.quit"),
	].join(" ");

	return <Text dimColor>{help}</Text>;
}
