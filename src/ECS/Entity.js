const Entity = function Entity() {
  this.id =
    (+new Date()).toString(16) + ((Math.random() * 100000000) | 0).toString(16);

  this.components = {};

  this.addComponent = function addComponent(component) {
    this.components[component.name] = component;
  };

  this.removeComponent = function componentName() {
    delete this.components[componentName];
  };

  this.print = function print() {
    console.log(JSON.stringify(this, null, 2));
  };

  return this;
};

export default Entity;
