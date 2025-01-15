import { Components } from "@flamework/components";
import { AbstractConstructorRef } from "@flamework/components/out/utility";
import { Dependency } from "@flamework/core";

/**
 * @metadata macro
 */
export async function waitForComponents<T extends object>(
	instance: Instance,
	ref?: AbstractConstructorRef<T>,
): Promise<T[]> {
	const components = Dependency<Components>();
	// eslint-disable-next-line no-constant-condition
	while (true) {
		const components_arr = components.getComponents(instance, ref);
		if (components_arr[0] !== undefined) return components_arr;
		task.wait();
	}
}

/**
 * @metadata macro
 */
export async function waitForSuperComponent<T extends object>(
	instance: Instance,
	ref?: AbstractConstructorRef<T>,
): Promise<T> {
	return waitForComponents(instance, ref).then((value) => value[0]);
}
