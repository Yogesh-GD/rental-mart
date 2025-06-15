import { useScroll, useMotionValueEvent } from "framer-motion";
import { motion, AnimatePresence } from "framer-motion";
import React, { useState } from "react";
import { FaBars } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { NavLink, useNavigate } from "react-router";
import Cookies from "js-cookie";
import { FaUser } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { userLogout } from "../slices/Auth/authSlice";

const Navbar = () => {
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpened, setOpened] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const isUserAuthenticated = Cookies.get("isUserAuthenticated") === "true";

  useMotionValueEvent(scrollY, "change", (y) => {
    setIsScrolled(y > 50);
  });

  return (
    <nav
      className={`w-full px-6 py-4 z-50 transition-all duration-300 ${
        isScrolled ? "fixed bg-white shadow-md text-black" : "relative bg-[#00000037] sm:absolute sm:text-white"
      } top-0 left-0`}
    >
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          Rental <span className="text-red-400">Mart</span>
        </h1>

        <div className="inline-block sm:hidden">
          {isUserAuthenticated ? (
            <LoggedUserTool isScrolled={isScrolled} />
          ) : (
     
            <NavLink
              to="/auth/user/login"
              className={({ isActive }) => (isActive ? " sm:text-red-500" : "hover:text-red-400")}
            >
              Login
            </NavLink>
          
          )}
        </div>

        <button
          type="button"
          className="sm:hidden text-2xl cursor-pointer text-black"
          onClick={() => setOpened(!isOpened)}
        >
          {isOpened ? <IoClose /> : <FaBars />}
        </button>

        <ul className="hidden sm:flex space-x-6">
          {["Home", "About", "Services", "Pricing", "Blog", "Contact"].map((item, index) => (
            <li key={index}>
              <NavLink
                to={`/${item==="Home" ? "" : item.toLowerCase()}`}
                className={({ isActive }) => (isActive ? "text-red-500" : "hover:text-red-400")}
              >
                {item}
              </NavLink>
            </li>
          ))}

          <li
            className="relative"
            onMouseEnter={() => setDropdownOpen(true)}
            onMouseLeave={() => setDropdownOpen(false)}
          >
            <NavLink
              to="/vehicles"
              className={({ isActive }) => (isActive ? "text-red-500" : "hover:text-red-400")}
            >
              Vehicles
            </NavLink>
            <AnimatePresence>
              {dropdownOpen && (
                <motion.ul
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute left-0 mt-2 bg-white shadow-lg w-40 text-black"
                >
                  {["Cars", "Bikes", "Luxury Cars"].map((type) => (
                    <li key={type} className="hover:bg-gray-100 p-2">
                      <NavLink
                        to={`/vehicles/${type.toLowerCase().replace(" ", "-")}`}
                        className={({ isActive }) => (isActive ? "text-red-500  p-2 rounded" : "")}
                      >
                        {type}
                      </NavLink>
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </li>

    
        </ul>

        <div className="hidden sm:inline-block">
          {isUserAuthenticated ? <LoggedUserTool isScrolled={isScrolled} /> :  
              <NavLink
                to="/auth/user/login"
                className={({ isActive }) => (isActive ? "text-red-500" : "hover:text-red-400")}
              >
                Login
              </NavLink>
            }
        </div>
      </div>

      <AnimatePresence>
        {isOpened && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="sm:hidden bg-white shadow-lg absolute top-full left-0 w-full overflow-hidden"
          >
            <ul className="flex flex-col text-center text-black">
              {["Home", "About", "Services", "Pricing", "Blog", "Contact"].map((item, index) => (
                <motion.li key={index}>
                  <NavLink
                to={`/${item==="Home" ? "" : item.toLowerCase()}`}
                className={({ isActive }) => `block py-3 ${isActive ? "text-red-500" : ""}`}
                    onClick={() => setOpened(false)}
                  >
                    {item}
                  </NavLink>
                </motion.li>
              ))}

              <li>
                <button className="block w-full py-3 hover:bg-gray-200" onClick={() => setDropdownOpen(!dropdownOpen)}>
                  Vehicles
                </button>
                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.ul className="bg-gray-100 text-black">
                      {["Cars", "Bikes", "Luxury Cars"].map((type) => (
                        <li key={type} className="p-2">
                          <NavLink to={`/vehicles/${type.toLowerCase().replace(" ", "-")}`}  onClick={() => setOpened(false)} className="hover:text-red-500">
                            {type}
                          </NavLink>
                        </li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;


const LoggedUserTool = ({ isScrolled }) => {
  const [toggle, setToggle] = useState(false);
  const {status} = useSelector((state) => state.auth)
  const navigate = useNavigate()
  const dispatch = useDispatch();
const handleLogOut = () => {
  dispatch(userLogout())
  navigate("/")

}

if(status === "userLoggedOut"){
  window.location.reload()
}
  return (
    <div
      onMouseEnter={() => setToggle(true)}
      onMouseLeave={() => setToggle(false)}
      className="relative"
    >
      <button
        className={`grid place-items-center rounded-full border-2 p-2 transition-all duration-300 ${
          isScrolled ? "border-black text-black bg-white hover:bg-gray-200" : "border-black text-black bg-white hover:bg-gray-300"
        }`}
        onClick={() => setToggle(!toggle)}
      >
        <FaUser />
      </button>

      <AnimatePresence>
        {toggle && (
          <motion.ul
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full right-0 mt-2 shadow-lg w-44 rounded-lg border bg-white text-black"
          >
            {[
              { name: "Profile", path: "/user/profile" },
              { name: "Bookings", path: "/user/bookings" },
              { name: "Notifications", path: "/user/notifications" },
              { name: "Wishlists", path: "/user/wishlists" },
              { name: "Change Password", path: "/user/change-password" },
            ].map((item) => (
              <li key={item.name} className="hover:bg-gray-100">
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `block w-full px-4 py-2 transition-all ${
                      isActive ? "bg-red-500 text-white rounded" : ""
                    }`
                  }
                >
                  {item.name}
                </NavLink>
              </li>
            ))}

            <li>
              <button
                className="block w-full px-4 py-2 text-left hover:bg-red-500 hover:text-white rounded-b-lg"
                onClick={handleLogOut}
              >
                Log out
              </button>
            </li>
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
};

