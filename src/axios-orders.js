import axios from "axios";

const instance = axios.create({
  baseURL: "https://react-my-burger-29e0f.firebaseio.com/"
});

export default instance;
