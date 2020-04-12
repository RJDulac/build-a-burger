import React from "react";

import classes from "./Modal.module.css";
import Aux from "../../../HOC/Aux";
import Backdrop from "../Backdrop/Backdrop";

const Modal = props => (
  <Aux>
    <Backdrop show={props.show} clicked={props.modalClosed} />
    <div
      style={{
        //my be better as a class
        transform: props.show ? "translateY(0)" : "translateY(-100vh)",
        opacity: props.show ? "1" : "0"
      }}
      className={classes.Modal}
    >
      {props.children}
    </div>
  </Aux>
);

export default Modal;