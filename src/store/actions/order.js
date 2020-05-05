import * as actionTypes from "./actionTypes";
import axios from "../../axios-orders";

export const purchaseBurgerSuccess = (id, orderData) => {
  return {
    type: actionTypes.PURCHASE_BURGER_FAIL,
    orderId: id,
    orderData: orderData
  };
};

export const purchaseBurgerFail = error => {
  return {
    type: actionTypes.PURCHASE_BURGER_FAIL,
    error: error
  };
};

export const purchaseBurgerStart = () => {
  return {
    type: actionTypes.PURCHASE_BURGER_START
  };
};

export const purchaseBurger = orderData => {
  return async dispatch => {
    dispatch(purchaseBurgerStart());
    try {
      const data = await axios.post("/orders.json", orderData);
      console.log("purchase burger data", data);
      dispatch(purchaseBurgerSuccess(data, orderData));
    } catch (error) {
      dispatch(purchaseBurgerFail(error));
    }
  };
};
