import ECS from "../ECS";

const attemptMove = (entity, x, y) => {
  const {
    components: { position }
  } = entity;

  const {
    game: {
      grid: { width, height }
    }
  } = ECS;

  // observe map boundaries
  const mx = Math.min(width - 1, Math.max(0, position.x + x));
  const my = Math.min(height - 1, Math.max(0, position.y + y));

  position.x = mx;
  position.y = my;
};

const move = entities => {
  Object.keys(entities).forEach(key => {
    const {
      components: { position, playerControlled }
    } = entities[key];

    if (position && playerControlled) {
      if (ECS.game.userInput && ECS.game.userInput.type === "MOVE") {
        const { x, y } = ECS.game.userInput.payload;

        attemptMove(entities[key], x, y);
      }
    }
  });
};

export default move;
