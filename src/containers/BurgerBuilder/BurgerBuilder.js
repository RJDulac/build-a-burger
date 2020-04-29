import React, { Component } from "react";
import { connect } from "react-redux";

import Aux from "../../HOC/Aux";

import Burger from "../../components/Burger/Burger";
import BuildControls from "../../components/Burger/BuildControls/BuildControls";
import Modal from "../../components/UI/Modal/Modal";
import OrderSummary from "../../components/Burger/OrderSummary/OrderSummary";
import Spinner from "../../components/UI/Spinner/Spinner";
import withErrorHandler from "../../HOC/WithErrorHandler/WithErrorHandler";
import * as actionTypes from "../../store/actions";

import axios from "../../axios-orders";
const INGREDIENT_PRICES = {
  salad: 0.5,
  cheese: 0.4,
  meat: 1.3,
  bacon: 0.7
};

class BurgerBuilder extends Component {
  state = {
    totalPrice: 4,
    canPurchase: false,
    ordering: false,
    loading: false,
    error: false
  };
  // componentDidMount = async () => {
  //   try {
  //     const response = await axios.get(
  //       "https://react-my-burger-29e0f.firebaseio.com/ingredients.json"
  //     );
  //     this.setState({ ingredients: response.data });
  //   } catch (error) {
  //     this.setState({ error: true });
  //   }
  // };
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
    //go to this page
    const queryParams = [];
    for (let i in this.state.ingredients) {
      queryParams.push(
        encodeURI(i) + "=" + encodeURIComponent(this.state.ingredients[i])
      );
    }
    queryParams.push(`price=${this.state.totalPrice}`);
    const querString = queryParams.join("&");
    this.props.history.push({
      pathname: "/checkout",
      search: "?" + querString
    });
  };
  render() {
    const disableInfo = {
      ...this.props.ings
    };
    for (let key in disableInfo) {
      disableInfo[key] = disableInfo[key] <= 0;
    }
    return (
      <Aux>
        {this.state.error ? <p>Error: Ingredients Can't be displayed</p> : null}
        {this.props.ings ? (
          <Aux>
            <Modal
              show={this.state.ordering}
              modalClosed={this.orderCancelHandler}
            >
              {!this.state.loading ? (
                <OrderSummary
                  ingredients={this.props.ings}
                  orderCanceled={this.orderCancelHandler}
                  orderContinue={this.orderContinueHandler}
                  price={this.state.totalPrice.toFixed(2)}
                />
              ) : (
                <Spinner />
              )}
            </Modal>
            <Burger ingredients={this.props.ings} />
            <BuildControls
              ingredientAdded={this.props.onIngredientAdded}
              ingredientRemoved={this.props.onIngredientRemoved}
              disabled={disableInfo}
              price={this.state.totalPrice}
              canPurchase={this.state.canPurchase}
              ordering={this.orderHandler}
            />
          </Aux>
        ) : (
          <Spinner />
        )}
      </Aux>
    );
  }
}
const mapStateToProps = state => {
  return {
    ings: state.ingredients
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onIngredientAdded: ingName =>
      dispatch({ type: actionTypes.ADD_INGREDIENT, ingredientName: ingName }),
    onIngredientRemoved: ingName =>
      dispatch({ type: actionTypes.REMOVE_INGREDIENT, ingredientName: ingName })
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withErrorHandler(BurgerBuilder, axios));
