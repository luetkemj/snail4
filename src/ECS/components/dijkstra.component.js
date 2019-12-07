const componentDijkstra = (params = {}) => {
  const { mapName = "player", value = "1000000" } = params;
  return {
    [mapName]: value
  };
};

export default componentDijkstra;
