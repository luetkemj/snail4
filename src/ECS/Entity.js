import uniq from "lodash";
import { setCacheId } from "./cache";

// caches is an array of cache keys to store this entity.id in
const Entity = (cacheKeys = []) => {
  const id =
    (+new Date()).toString(16) + ((Math.random() * 100000000) | 0).toString(16);

  const components = {};

  const addComponent = component => {
    components[component.name] = component;
  };

  const removeComponent = componentName => {
    delete components[componentName];
  };

  const print = function print() {
    console.log(JSON.stringify(this, null, 2));
  };

  // set caches
  const cacheKeysSet = uniq([...cacheKeys, "entityIds"]);
  [...cacheKeysSet].forEach(cacheKey => setCacheId(id, cacheKey));

  return {
    id,
    components,
    addComponent,
    removeComponent,
    print
  };
};

export default Entity;
