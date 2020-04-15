import React, { Component } from "react";

import Aux from "../../HOC/Aux";

import Burger from "../../components/Burger/Burger";
import BuildControls from "../../components/Burger/BuildControls/BuildControls";
import Modal from "../../components/UI/Modal/Modal";
import OrderSummary from "../../components/Burger/OrderSummary/OrderSummary";
import Spinner from "../../components/UI/Spinner/Spinner";
import withErrorHandler from "../../HOC/WithErrorHandler/WithErrorHandler";

import axios from "../../axios-orders";
const INGREDIENT_PRICES = {
  salad: 0.5,
  cheese: 0.4,
  meat: 1.3,
  bacon: 0.7
};

class BurgerBuilder extends Component {
  state = {
    ingredients: {
      salad: 0,
      bacon: 0,
      cheese: 0,
      meat: 0
    },
    totalPrice: 4,
    canPurchase: false,
    ordering: false,
    loading: false
  };

  updatePurchaseState(ingredients) {
    const sum = Object.keys(ingredients)
      .map(igkey => {
        return ingredients[igkey];
      })
      .reduce((sum, el) => {
        return sum + el;
      }, 0);
    this.setState({ canPurchase: sum > 0 });
  }
  addIngredientHandler = type => {
    const oldCount = this.state.ingredients[type];
    const updatedCount = oldCount + 1;
    const updatedIngredients = {
      ...this.state.ingredients
    };
    updatedIngredients[type] = updatedCount;

    const priceAddition = INGREDIENT_PRICES[type];
    const oldPrice = this.state.totalPrice;
    const newPrice = oldPrice + priceAddition;

    this.setState({ totalPrice: newPrice, ingredients: updatedIngredients });

    this.updatePurchaseState(updatedIngredients);
  };
  removeIngredientHandler = type => {
    const oldCount = this.state.ingredients[type];
    if (oldCount <= 0) {
      return;
    }
    const updatedCount = oldCount - 1;
    const updatedIngredients = {
      ...this.state.ingredients
    };
    updatedIngredients[type] = updatedCount;

    const priceDeduction = INGREDIENT_PRICES[type];
    const oldPrice = this.state.totalPrice;
    const newPrice = oldPrice - priceDeduction;

    this.setState({ totalPrice: newPrice, ingredients: updatedIngredients });

    this.updatePurchaseState(updatedIngredients);
  };
  orderHandler = () => {
    this.setState({ ordering: true });
  };
  orderCancelHandler = () => {
    this.setState({ ordering: false });
  };
  orderContinueHandler = async () => {
    this.setState({ loading: true });
    //alert("You Continue");
    const order = {
      ingredients: this.state.ingredients,
      price: this.state.totalPrice,
      customer: {
        name: "Ryan Dulac",
        address: {
          street: "Test Street",
          zipCode: "35284",
          country: "United States"
        },
        email: "test@test.com"
      },
      deliveryMethod: "fastest"
    };
    try {
      const data = await axios.post("/orders.json", order);
      console.log(data);
      this.setState({ loading: false, ordering: false });
    } catch (error) {
      this.setState({ loading: false, ordering: false });
      console.log(error);
    }
  };
  render() {
    const disableInfo = {
      ...this.state.ingredients
    };
    for (let key in disableInfo) {
      disableInfo[key] = disableInfo[key] <= 0;
    }
    return (
      <Aux>
        <Modal show={this.state.ordering} modalClosed={this.orderCancelHandler}>
          {!this.state.loading ? (
            <OrderSummary
              ingredients={this.state.ingredients}
              orderCanceled={this.orderCancelHandler}
              orderContinue={this.orderContinueHandler}
              price={this.state.totalPrice.toFixed(2)}
            />
          ) : (
            <Spinner />
          )}
        </Modal>
        <Burger ingredients={this.state.ingredients} />
        <BuildControls
          ingredientAdded={this.addIngredientHandler}
          ingredientRemoved={this.removeIngredientHandler}
          disabled={disableInfo}
          price={this.state.totalPrice}
          canPurchase={this.state.canPurchase}
          ordering={this.orderHandler}
        />
      </Aux>
    );
  }
}
export default withErrorHandler(BurgerBuilder, axios);
