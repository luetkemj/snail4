import ECS from "../ECS/ECS";

export default function input(key) {
  console.log(key);
  switch (key) {
    case "?": {
      ECS.game.userInput = { key, type: "HELP", payload: {} };
      break;
    }
    case "d": {
      ECS.game.userInput = { key, type: "DROP", payload: {} };
      break;
    }
    case "i": {
      ECS.game.userInput = { key, type: "INVENTORY", payload: {} };
      break;
    }
    case "g": {
      ECS.game.userInput = { key, type: "GET", payload: {} };
      break;
    }
    case "o": {
      ECS.game.userInput = { key, type: "TOGGLE_OMNISCIENCE", payload: {} };
      break;
    }
    case "z": {
      ECS.game.userInput = { key, type: "REST", payload: {} };
      break;
    }
    case "ArrowUp":
      ECS.game.userInput = { key, type: "MOVE", payload: { x: 0, y: -1 } };
      break;
    case "ArrowDown":
      ECS.game.userInput = { key, type: "MOVE", payload: { x: 0, y: 1 } };
      break;
    case "ArrowLeft":
      ECS.game.userInput = { key, type: "MOVE", payload: { x: -1, y: 0 } };
      break;
    case "ArrowRight":
      ECS.game.userInput = { key, type: "MOVE", payload: { x: 1, y: 0 } };
      break;
    case "Escape": {
      ECS.game.userInput = { key, type: "ESCAPE", payload: {} };
      break;
    }
  }
}
