const Entity = () => {
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

  return {
    id,
    components,
    addComponent,
    removeComponent,
    print
  };
};

export default Entity;
