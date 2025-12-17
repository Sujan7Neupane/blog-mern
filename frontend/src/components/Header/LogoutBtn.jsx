import React from "react";
import { logout } from "../../store/userSlice.js";
import { useDispatch } from "react-redux";
import Button from "../Button.jsx";

import api from "../../utils/api.js";

const LogoutBtn = () => {
  const dispatch = useDispatch();

  const logoutHandler = async () => {
    try {
      await api.post("/v1/users/logout");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      dispatch(logout());
    }
  };

  return (
    <Button
      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-500 transition cursor-pointer"
      onClick={logoutHandler}
    >
      Logout
    </Button>
  );
};

export default LogoutBtn;
