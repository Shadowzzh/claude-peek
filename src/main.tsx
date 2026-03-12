import { render } from "ink";
import React from "react";
import { App } from "./components/App.js";

export function startTui() {
	render(<App />);
}
