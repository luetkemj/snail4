import createPlayer from "../ECS/assemblages/creature-player.assemblage";
import createLeatherArmor from "../ECS/assemblages/armor-leather.assemblage";
import createRandomWeapon from "../ECS/assemblages/weapon-random.assemblage";
import initDungeonLevel from "../initializers/dungeon-level.init";
import actions from "../lib/actions";

const initGame = () => {
  const { stairsUpPosition } = initDungeonLevel();

  // Create player
  const player = createPlayer(stairsUpPosition.x, stairsUpPosition.y);
  const armor = createLeatherArmor();
  const weapon = createRandomWeapon();
  player.components.inventory.items.push(armor.id);
  player.components.inventory.items.push(weapon.id);

  actions.wield(player, weapon);
  actions.wear(player, armor);
};

export default initGame;
