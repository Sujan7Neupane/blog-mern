import React from "react";
import { createRoot } from "react-dom/client";

import { Provider } from "react-redux";
import store from "./store/store.js";

import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";

import App from "./App.jsx";
import { AuthLayout } from "./components/index.js";
import {
  LoginPage,
  SignupPage,
  AddPost,
  IndividualPost,
  AllPosts,
  HomePage,
  EditPosts,
} from "./pages/index.js";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      {/* Public routes */}
      <Route index element={<HomePage />} />
      <Route path="post/:id" element={<IndividualPost />} />

      {/* Guest-only routes */}
      <Route
        path="login"
        element={
          <AuthLayout authentication={false}>
            <LoginPage />
          </AuthLayout>
        }
      />

      <Route
        path="register"
        element={
          <AuthLayout authentication={false}>
            <SignupPage />
          </AuthLayout>
        }
      />

      {/* Protected routes */}
      <Route
        path="all-posts"
        element={
          <AuthLayout authentication={true}>
            <AllPosts />
          </AuthLayout>
        }
      />

      <Route
        path="add-posts"
        element={
          <AuthLayout authentication={true}>
            <AddPost />
          </AuthLayout>
        }
      />

      <Route
        path="update/:id"
        element={
          <AuthLayout authentication={true}>
            <EditPosts />
          </AuthLayout>
        }
      />
    </Route>
  )
);

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);
