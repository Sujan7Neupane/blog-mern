import React, { useEffect, useState } from "react";
import "./App.css";

import { useDispatch } from "react-redux";
import { Outlet } from "react-router-dom";

import { login, logout } from "./store/userSlice";
import { Header, Footer } from "./components";
import api from "./utils/api.js";

function App() {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  const fetchCurrentUser = async () => {
    try {
      const res = await api.get("/v1/users/current-user");

      const user = res?.data?.data?.user;

      if (user) {
        dispatch(login(user));
      } else {
        dispatch(logout());
      }
    } catch (error) {
      console.error("Error fetching current user:", error);
      dispatch(logout());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  if (loading) return null;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-6">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default App;
