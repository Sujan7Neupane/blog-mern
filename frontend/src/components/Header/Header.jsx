import React from "react";
import { useSelector } from "react-redux";
import { Logo, LogoutBtn } from "../index.js";
import { useNavigate } from "react-router";
import { Link } from "react-router";

const Header = () => {
  const { status: authStatus } = useSelector((state) => state.auth);

  const navigate = useNavigate();
  const navItems = [
    {
      name: "Home",
      slug: "/",
      active: true,
    },

    {
      name: "Login",
      slug: "/login",
      active: !authStatus,
    },
    {
      name: "Register",
      slug: "/register",
      active: !authStatus,
    },
    {
      name: "All Posts",
      slug: "/all-posts",
      active: authStatus,
    },
    {
      name: "Add Posts",
      slug: "/add-posts",
      active: authStatus,
    },
  ];

  return (
    <nav className="bg-gray-900 text-white shadow-md ">
      <div className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <Link to={"/"}>
            <Logo />
          </Link>
        </div>

        {/* Nav Items */}
        <ul className=" md:flex space-x-8 text-white font-medium flex">
          {/* li items */}
          {navItems.map((item) =>
            item.active ? (
              <li key={item.name}>
                <button
                  className="text-white cursor-pointer"
                  onClick={() => navigate(item.slug)}
                >
                  {item.name}
                </button>
              </li>
            ) : null
          )}
        </ul>

        {/* Logout Button */}
        {authStatus && <LogoutBtn />}
      </div>
    </nav>
  );
};

export default Header;
