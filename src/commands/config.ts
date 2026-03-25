import { t } from "../i18n/index.js";
import { readConfig, writeConfig } from "../lib/config.js";

export function configCommand(
	action?: string,
	value?: string,
	options?: { show?: boolean },
) {
	if (options?.show || !action) {
		const config = readConfig();
		const lang = config.language || "en";
		console.log(t("config.current", { lang }));
		return;
	}

	if (action === "lang" || action === "language") {
		if (!value || (value !== "zh" && value !== "en")) {
			console.log(t("config.invalid"));
			return;
		}

		const config = readConfig();
		config.language = value;
		writeConfig(config);
		console.log(t("config.updated", { lang: value }));
	}
}
