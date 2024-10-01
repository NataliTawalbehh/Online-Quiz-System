import DataObject from "./DataObject";

export default interface Recipe extends DataObject {
  id: number;
  name: string;
  ingredients: string[];
  instructions: string[];
  cookingTime: string;
  servings: number;
  image: string;
}
