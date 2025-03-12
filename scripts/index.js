import { system, world } from "@minecraft/server";
import playerMoveAfterEvent, { PlayerInputKey } from "./events/playerMoveAfterEvent";

world.afterEvents.playerSpawn.subscribe(ev => {
    const { initialSpawn, player } = ev;

    if (initialSpawn) {
        player.setDynamicProperty("firstInput", false);
        player.setDynamicProperty("tick", 0);

        const intervalId = system.runInterval(() => {
            const tick = player.getDynamicProperty("tick");

            player.setDynamicProperty("tick", tick + 1);
        });

        player.setDynamicProperty("tick-id", intervalId);
    }
});

playerMoveAfterEvent.subscribe(ev => {
    const { player, firstKeys } = ev;

    if (!player.getDynamicProperty("firstInput") && anyIncludes(firstKeys, PlayerInputKey.A, PlayerInputKey.S, PlayerInputKey.D, PlayerInputKey.W)) {
        const tickId = player.getDynamicProperty("tick-id");
        const tick = player.getDynamicProperty("tick");
        
        system.clearRun(tickId);
        player.setDynamicProperty("tick-id");
        player.setDynamicProperty("firstInput", true);
        world.sendMessage(`move: ${tick}tick`);
    }
});

/**
 * @param {any[]} array 
 * @param  {...any} elements 
 * @returns {boolean}
 */
function anyIncludes(array, ...elements) {
    for (const element of elements) {
        if (array.includes(element)) return true;
    }

    return false;
}
