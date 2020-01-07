import ECS from "../ECS/ECS";
import { cellToId, getNeighborIds, idToCell } from "./grid";
import { readCacheKey } from "../ECS/cache";

export const dijkstra = (goals, weights = []) => {
  // todo: read function for getting this cache...
  const cellIdsByLocation = readCacheKey("tileLocations");

  const frontier = goals.map(cellToId);

  const distance = frontier.reduce((acc, val, idx) => {
    acc[val] = weights[idx] || 0;
    return acc;
  }, {});

  while (frontier.length) {
    const current = frontier.shift();

    // current entity position component
    const cell = idToCell(current);
    const neighbors = getNeighborIds(cell.x, cell.y);

    neighbors.forEach(neighborId => {
      if (!distance[neighborId]) {
        // need to store tiles by location id for this to be performant
        if (
          cellIdsByLocation[neighborId] &&
          !ECS.entities[cellIdsByLocation[neighborId]].components.blocking
        ) {
          let dscore = distance[current] + 1;
          distance[neighborId] = dscore;
          frontier.push(neighborId);
        }
      }
    });
  }

  // normalize goals to their weights or 0
  goals.forEach((goal, idx) => {
    const id = cellToId(goal);
    distance[id] = weights[idx] || 0;
  });

  return distance;
};
