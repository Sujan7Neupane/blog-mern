import authReducer from "../store/userSlice.js";
import postReducer from "../store/postSlice.js";
import { configureStore } from "@reduxjs/toolkit";

const store = configureStore({
  reducer: {
    auth: authReducer,
    post: postReducer,
  },
});

export default store;
