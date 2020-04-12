import React from "react";

import classes from "./Modal.module.css";

const Modal = props => (
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
);

export default Modal;
