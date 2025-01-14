import { OnInit, Service } from "@flamework/core";
import { GetProfileStore } from "@rbxts/profileservice";
import { Profile } from "@rbxts/profileservice/globals";
import { Players } from "@rbxts/services";

type ModifiedProfile<D extends object, T extends object> = Profile<D> & {
	Temp: T;
};

interface ProfileData {}
interface ProfileTemp {}

const DataTemplate: ProfileData = {};
const TempTemplate: ProfileTemp = {};

const ProfileStore = GetProfileStore("PlayerData", DataTemplate);

type PlayerProfile = ModifiedProfile<ProfileData, ProfileTemp>;

@Service()
export default class ProfileStoreService implements OnInit {
	profiles: Map<Player, PlayerProfile> = new Map();
	onInit(): void | Promise<void> {
		Players.PlayerAdded.Connect((player) => this.playerAdded(player));
		Players.PlayerRemoving.Connect((player) => this.profiles.get(player)?.Release());
	}

	playerAdded(player: Player) {
		const profile = ProfileStore.LoadProfileAsync(`player_${player.UserId}`) as PlayerProfile | undefined;
		if (profile) {
			profile.AddUserId(player.UserId);
			profile.Reconcile();
			// note: maybe use setmetatable(<ProfileData>, { __index = TempData, __setIndex = TempData})
			//       so u dont have to index profile.Temp
			profile.Temp = table.clone(TempTemplate);
			// todo
			// setmetatable(profile.Data, {
			// 	__iter: (tbl) => {
			// 		return $tuple(tbl, pairs, 1);
			// 	},
			// 	__index: (_, key) => {
			// 		return profile.Temp[key as keyof ProfileTemp];
			// 	},
			// 	__newindex: (_, key, value) => {
			// 		profile.Temp[key as keyof ProfileTemp] = value as ProfileTemp[keyof ProfileTemp];
			// 	},
			// } as LuaMetatable<ProfileData> & { __iter: (table: ProfileData, iter: unknown) => LuaTuple<[ProfileData, unknown, number]> });
			profile.ListenToRelease(() => {
				this.profiles.delete(player);
				player.Kick("The profile could've been loaded on another Roblox server");
			});
			if (player.IsDescendantOf(Players)) {
				this.profiles.set(player, profile);
			} else {
				profile.Release();
			}
		} else {
			player.Kick(
				"The profile couldn't be loaded possibly due to other Roblox servers trying to load this profile at the same time",
			);
		}
	}
}
