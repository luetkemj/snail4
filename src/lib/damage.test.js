import { divvyDamage, damageAnatomy } from "./damage";
import componentAnatomyHumanoid from "../ECS/components/anatomy/types/humanoid.component";

const humanoidEntity = {
  components: {
    anatomy: {
      ...componentAnatomyHumanoid()
    }
  }
};

describe("damage humanoid anatomy", () => {
  let entity;
  beforeEach(() => {
    entity = JSON.parse(JSON.stringify(humanoidEntity));
  });

  it("should work", () => {
    expect(damageAnatomy(entity, { type: "bludgeon", amount: 10 })).toEqual({});
  });

  // describe("when pierced", () => {
  //   it("should work", () => {
  //     const group = entity.components.anatomy.groups.face;
  //     const dmg = { type: "pierce", amount: 10 };

  //     expect(divvyDamage(group, dmg)).toEqual(
  //       entity.components.anatomy.groups.face
  //     );
  //   });
  // });

  // describe("when bludgeoned", () => {
  //   it("should work", () => {
  //     const group = entity.components.anatomy.groups.face;
  //     const dmg = { type: "slash", amount: 152 };

  //     expect(divvyDamage(group, dmg)).toEqual(
  //       entity.components.anatomy.groups.face
  //     );
  //   });
  // });
});
