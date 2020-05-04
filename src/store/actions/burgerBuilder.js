import * as actionTypes from "./actionTypes";
import axios from "../../axios-orders";
export const addIngredient = name => {
  return {
    type: actionTypes.ADD_INGREDIENT,
    ingredient: name
  };
};
export const removeIngredient = name => {
  return {
    type: actionTypes.REMOVE_INGREDIENT,
    ingredient: name
  };
};

export const setIngredients = ingredients => {
  return {
    type: actionTypes.ADD_INGREDIENT,
    ingredients: ingredients
  };
};

export const fetchIngredientsFailed = () => {
  return {
    type: actionTypes.FETCH_INGREDIENTS_FAILED
  };
};
export const initIngredients = () => {
  return async dispatch => {
    //can put async code here
    try {
      const response = await axios.get(
        "https://react-my-burger-29e0f.firebaseio.com/ingredients.json"
      );
      dispatch(setIngredients(response.data));
    } catch (error) {
      dispatch(actionTypes.FETCH_INGREDIENTS_FAILED());
    }
  };
};
