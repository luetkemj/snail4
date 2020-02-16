import ECS from "../ECS/ECS";

export default function input(key) {
  switch (key) {
    case "<": {
      ECS.game.userInput = { key, type: "ASCEND", payload: {} };
      break;
    }
    case ">": {
      ECS.game.userInput = { key, type: "DESCEND", payload: {} };
      break;
    }
    case "?": {
      ECS.game.userInput = { key, type: "HELP", payload: {} };
      break;
    }
    case "B": {
      ECS.game.userInput = { key, type: "TOGGLE_BERSERK", payload: {} };
      break;
    }
    case "a": {
      ECS.game.userInput = { key, type: "APPLY", payload: {} };
      break;
    }
    case "c": {
      ECS.game.userInput = { key, type: "CONSUME", payload: {} };
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
    case "I": {
      ECS.game.userInput = { key, type: "TOGGLE_INVINCIBLE", payload: {} };
      break;
    }
    case "g": {
      ECS.game.userInput = { key, type: "GET", payload: {} };
      break;
    }
    case "O": {
      ECS.game.userInput = { key, type: "TOGGLE_OMNISCIENCE", payload: {} };
      break;
    }
    case "r": {
      ECS.game.userInput = { key, type: "REMOVE", payload: {} };
      break;
    }
    case "w": {
      ECS.game.userInput = { key, type: "WIELD", payload: {} };
      break;
    }
    case "W": {
      ECS.game.userInput = { key, type: "WEAR", payload: {} };
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
