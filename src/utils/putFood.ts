import { FOOD_PRESENCE_COUNT } from "../constants";

export default function putFood(food: string[], size: number) {
  const populatedFOOD = [];

  let currentFoodId = 0;
  let foodAddedCount = 0;

  for (let i = 0; i < size; i++) {
    if (foodAddedCount === FOOD_PRESENCE_COUNT) {
      currentFoodId += 1;
      foodAddedCount = 0;
    }

    populatedFOOD.push({
      id: i,
      label: food[currentFoodId],
      isPicked: false,
    });

    foodAddedCount += 1;
  }

  return populatedFOOD;
}
