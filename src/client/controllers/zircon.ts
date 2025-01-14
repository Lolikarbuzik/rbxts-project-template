import { Controller, OnInit } from "@flamework/core";
import Log, { Logger } from "@rbxts/log";
import Zircon, { ZirconClient } from "@rbxts/zircon";
import { $compileTime, $git, $package } from "rbxts-transform-debug";

@Controller()
export default class ZirconController implements OnInit {
	onInit(): void | Promise<void> {
		// Set the logger to output to Zircon
		Log.SetLogger(Logger.configure().WriteTo(Zircon.Log.Console()).Create());

		// This binds the console to the F2 key.
		ZirconClient.Init({
			Keys: [Enum.KeyCode.F2],
		});
		Log.Info(
			"Version {Version} build: {BuildDate} latest commit: {Commit}",
			$package.version,
			$compileTime("ISO-8601"),
			$git().Commit,
		);
	}
}
