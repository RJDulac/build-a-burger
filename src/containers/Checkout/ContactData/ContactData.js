import React, { Component } from "react";

import Button from "../../../components/UI/Button/Button";
import classes from "./ContactData.module.css";
import axios from "../../../axios-orders";
import Spinner from "../../../components/UI/Spinner/Spinner";

class ContactData extends Component {
  state = {
    name: "",
    email: "",
    address: {
      street: "",
      postalCode: ""
    },
    loading: false
  };
  orderHandler = async e => {
    e.preventDefault();
    this.setState({ loading: true });
    //alert("You Continue");
    const order = {
      ingredients: this.props.ingredients,
      price: this.props.price,
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
      this.setState({ loading: false });
      this.props.history.push("/");
    } catch (error) {
      this.setState({ loading: false });
      console.log(error);
    }
  };
  render() {
    let form = (
      <form>
        <input type="text" name="name" placeholder="Your Name" />
        <input type="email" name="email" placeholder="Your Email" />
        <input type="text" name="street" placeholder="Street" />
        <input type="text" name="zip" placeholder="Your Zip Code" />
        <Button btnType="Success" clicked={this.orderHandler}>
          ORDER
        </Button>
      </form>
    );
    if (this.state.loading) {
      form = <Spinner />;
    }
    return (
      <div className={classes.ContactData}>
        <h4>Enter your Contact Data</h4>
        {form}
      </div>
    );
  }
}

export default ContactData;
