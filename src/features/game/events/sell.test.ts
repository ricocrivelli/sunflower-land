import Decimal from "decimal.js-light";
import { FieldItem, GameState } from "../types/game";
import { sell } from "./sell";

const EMPTY_FIELDS: FieldItem[] = Array(5)
  .fill(null)
  .map((_, fieldIndex) => ({ fieldIndex }));

let GAME_STATE: GameState = {
  id: 1,
  fields: EMPTY_FIELDS,
  balance: new Decimal(0),

  inventory: {},
};

describe("sell", () => {
  it("does not sell a non sellable item", () => {
    expect(() =>
      sell(GAME_STATE, {
        type: "item.sell",
        item: "Axe",
        amount: 1,
      })
    ).toThrow("Not for sale");
  });

  it("does not sell a missing item", () => {
    expect(() =>
      sell(GAME_STATE, {
        type: "item.sell",
        item: "Sunflower",
        amount: 1,
      })
    ).toThrow("Insufficient crops to sell");
  });

  it("sells an item", () => {
    const state = sell(
      {
        ...GAME_STATE,
        inventory: {
          Sunflower: 5,
        },
      },
      {
        type: "item.sell",
        item: "Sunflower",
        amount: 1,
      }
    );

    expect(state.inventory.Sunflower).toEqual(4);
    expect(state.balance).toEqual(new Decimal(0.02));
  });

  it("sell an item in bulk given sufficient quantity", () => {
    const state = sell(
      {
        ...GAME_STATE,
        inventory: {
          Sunflower: 11,
        },
      },
      {
        type: "item.sell",
        item: "Sunflower",
        amount: 10,
      }
    );

    expect(state.inventory.Sunflower).toEqual(1);
    expect(state.balance).toEqual(new Decimal(0.2));
  });

  it("does not sell an item in bulk given insufficient quantity", () => {
    expect(() =>
      sell(
        {
          ...GAME_STATE,
          inventory: {
            Sunflower: 2,
          },
        },
        {
          type: "item.sell",
          item: "Sunflower",
          amount: 10,
        }
      )
    ).toThrow("Insufficient crops to sell");
  });
});
