import { OnInit, Service } from "@flamework/core";
import Log, { Logger } from "@rbxts/log";
import Zircon, {
	ZirconConfigurationBuilder,
	ZirconDefaultGroup,
	ZirconFunctionBuilder,
	ZirconServer,
} from "@rbxts/zircon";
import { $compileTime, $git, $package } from "rbxts-transform-debug";

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
		ZirconServer.Registry.Init(
			new ZirconConfigurationBuilder()
				.CreateDefaultAdminGroup()
				.CreateDefaultCreatorGroup()
				.CreateDefaultUserGroup()
				.AddFunction(
					new ZirconFunctionBuilder("log_test").AddArgument("unknown").Bind((_, arg) => {
						Log.Info("{}", arg);
						Log.Warn("{}", arg);
						// note: THIS DOESNT WORK DONT USE THIS
						Log.Debug("{}", arg);
						Log.Error("{}", arg);
						Log.Fatal("{}", arg);
					}),
					[ZirconDefaultGroup.User],
				)
				.Build(),
		);
		Log.Info(
			"Version {Version} build: {BuildDate} latest commit: {Commit}, {Full}",
			$package.version,
			$compileTime("ISO-8601"),
			$git().Commit,
			$git().CommitHash,
		);
	}
}
