import React, { Component } from "react";

import Order from "../../components/Order/Order";
import axios from "../../axios-orders";
import withErrorHandler from "../../HOC/WithErrorHandler/WithErrorHandler";

class Orders extends Component {
  state = {
    orders: [],
    loading: true
  };
  componentDidMount = async () => {
    try {
      const response = await axios.get("/orders.json");

      const fetchedOrders = [];
      for (let key in response.data) {
        fetchedOrders.push({ ...response.data[key], id: key });
      }
      this.setState({ loading: false, orders: fetchedOrders });
      console.log(response.data);
    } catch (error) {
      this.setState({ loading: true });
    }
    console.log(this.state.orders);
  };
  render() {
    return (
      <div>
        {this.state.orders.map(order => (
          <Order
            key={order.id}
            ingredients={order.ingredients}
            price={order.price}
          />
        ))}
      </div>
    );
  }
}

export default withErrorHandler(Orders, axios);
