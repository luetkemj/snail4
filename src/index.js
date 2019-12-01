import ECS from "./ECS/ECS";
import userInput from "./lib/key-bindings";
import { generateDungeon } from "./lib/dungeon";
import { colors } from "./lib/graphics";

const dungeon = generateDungeon({
  x: 0,
  y: 0,
  width: ECS.game.grid.width,
  height: ECS.game.grid.height,
  maxRoomCount: 30,
  minRoomSize: 6,
  maxRoomSize: 12
});

Object.keys(dungeon.tiles).forEach(tileId => {
  const entity = ECS.Entity();
  const currTile = dungeon.tiles[tileId];
  let char;
  let color;
  if (currTile.sprite === "FLOOR") {
    char = "•";
    color = colors.floor;
  }
  if (currTile.sprite === "WALL") {
    char = "#";
    color = colors.wall;
  }
  if (currTile.sprite === "CAVERN_FLOOR") {
    char = "ʘ";
    color = colors.cavernFloor;
  }
  entity.addComponent(ECS.components.appearance({ char, color }));
  entity.addComponent(
    ECS.components.position({ x: currTile.x, y: currTile.y })
  );

  ECS.entities[entity.id] = entity;
});

const player = ECS.Entity();
player.addComponent(ECS.components.appearance({ char: "@", color: "#daa520" }));
player.addComponent(ECS.components.playerControlled());
player.addComponent(
  ECS.components.position({ x: dungeon.start.x, y: dungeon.start.y })
);
ECS.entities[player.id] = player;

document.addEventListener("keydown", ev => userInput(ev.key));

function gameTick() {
  for (let i = 0; i < ECS.systems.length; i++) {
    ECS.systems[i](ECS.entities);
  }
}

// initialize the game by running systems out of the gate
gameTick();

function update() {
  if (ECS.game.userInput && ECS.game.playerTurn) {
    gameTick();
    ECS.game.userInput = null;
    ECS.game.playerTurn = false;
  }

  if (!ECS.game.playerTurn) {
    gameTick();
    ECS.game.playerTurn = true;
  }
}

function gameLoop() {
  update();
  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);
