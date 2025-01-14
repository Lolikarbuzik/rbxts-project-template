import { OnInit, Service } from "@flamework/core";
import Log, { Logger } from "@rbxts/log";
import Zircon, { ZirconConfigurationBuilder, ZirconServer } from "@rbxts/zircon";
import { $compileTime, $package } from "rbxts-transform-debug";

@Service()
export default class ZirconService implements OnInit {
	onInit(): void | Promise<void> {
		Log.SetLogger(
			Logger.configure()
				.EnrichWithProperty("Version", $package.version)
				.EnrichWithProperty("BuildDate", $compileTime("ISO-8601"))
				.WriteTo(Zircon.Log.Console())
				.Create(),
		);
		ZirconServer.Registry.Init(new ZirconConfigurationBuilder().Build());
	}
}
