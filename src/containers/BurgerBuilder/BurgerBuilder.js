import React, { Component } from "react";
import { connect } from "react-redux";

import Aux from "../../HOC/Aux";

import Burger from "../../components/Burger/Burger";
import BuildControls from "../../components/Burger/BuildControls/BuildControls";
import Modal from "../../components/UI/Modal/Modal";
import OrderSummary from "../../components/Burger/OrderSummary/OrderSummary";
import Spinner from "../../components/UI/Spinner/Spinner";
import withErrorHandler from "../../HOC/WithErrorHandler/WithErrorHandler";
import * as burgerBuilderActions from "../../store/actions/burgerBuilder";
import axios from "../../axios-orders";

class BurgerBuilder extends Component {
  state = {
    ordering: false
  };
  componentDidMount() {
    this.props.onInitIngredients();
  }
  updatePurchaseState(ingredients) {
    const sum = Object.keys(ingredients)
      .map(igkey => {
        return ingredients[igkey];
      })
      .reduce((sum, el) => {
        return sum + el;
      }, 0);
    return sum > 0;
  }
  orderHandler = () => {
    this.setState({ ordering: true });
  };
  orderCancelHandler = () => {
    this.setState({ ordering: false });
  };
  orderContinueHandler = async () => {
    this.props.history.push("/checkout");
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
        {this.props.error ? <p>Error: Ingredients Can't be displayed</p> : null}
        {this.props.ings ? (
          <Aux>
            <Modal
              show={this.state.ordering}
              modalClosed={this.orderCancelHandler}
            >
              <OrderSummary
                ingredients={this.props.ings}
                orderCanceled={this.orderCancelHandler}
                orderContinue={this.orderContinueHandler}
                price={this.props.price.toFixed(2)}
              />
              )}
            </Modal>
            <Burger ingredients={this.props.ings} />
            <BuildControls
              ingredientAdded={this.props.onIngredientAdded}
              ingredientRemoved={this.props.onIngredientRemoved}
              disabled={disableInfo}
              price={this.props.price}
              canPurchase={this.updatePurchaseState(this.props.ings)}
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
    ings: state.ingredients,
    price: state.totalPrice,
    error: state.error
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onIngredientAdded: ingName =>
      dispatch(burgerBuilderActions.addIngredient(ingName)),
    onIngredientRemoved: ingName =>
      dispatch(burgerBuilderActions.removeIngredient(ingName)),
    onInitIngredients: () => dispatch(burgerBuilderActions.initIngredients())
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withErrorHandler(BurgerBuilder, axios));
