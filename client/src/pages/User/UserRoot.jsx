import { useState } from "react";
import { Outlet, Link, useNavigate } from "react-router";
import { useScroll, useMotionValueEvent } from "framer-motion";
import { motion, AnimatePresence } from "framer-motion";
import { FaHome, FaBars, FaTimes } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { userLogout } from "../../slices/Auth/authSlice";
import { FaUser, FaCar, FaBell, FaHeart, FaKey, FaIdCard, FaComment, FaSignOutAlt } from "react-icons/fa";

const UserRoot = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="w-full h-screen flex flex-col bg-black text-white">
      <Topbar setSidebarOpen={setSidebarOpen} />
      <div className="flex flex-grow overflow-hidden pt-16">
        <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 overflow-y-auto p-6">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserRoot;

const Topbar = ({ setSidebarOpen }) => {
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => {
    setIsScrolled(y > 50);
  });

  return (
    <nav
      className={`w-full shadow-[#ffffff0d] shadow-xl px-6 py-4 z-50 transition-all duration-300 bg-black text-white fixed top-0 left-0 ${
        isScrolled ? "shadow-md" : ""
      }`}
    >
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          Car <span className="text-red-400">Hub</span>
        </h1>

        <button type="button" className="md:hidden text-2xl cursor-pointer" onClick={() => setSidebarOpen(true)}>
          <FaBars />
        </button>
      </div>
    </nav>
  );
};

const Sidebar = ({ isOpen, setIsOpen }) => {
  return (
    <>
      <motion.div
        animate={{ width: "16rem" }}
        className="bg-black border-r  border-[#2e2e2e] h-full hidden md:flex flex-col transition-all duration-300 p-4"
      >
        <SidebarContent />
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.3 }}
            className="fixed top-0 left-0 h-full w-full bg-gray-900 p-6 shadow-lg z-50 md:hidden"
          >
            <button onClick={() => setIsOpen(false)} className="mb-6 text-white flex items-center">
              <FaTimes size={24} />
            </button>
            <SidebarContent />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const SidebarContent = () => { 
  const navigate = useNavigate()
    const {status} = useSelector((state) => state.auth)
  
  const dispatch = useDispatch();
const handleLogOut = () => {
  dispatch(userLogout())
  navigate("/")

}

if(status === "userLoggedOut"){
  window.location.reload()
}
  
  return(
  

 
<nav className="flex flex-col space-y-6">
  <Link to="/user/profile" className="flex items-center space-x-4 hover:text-blue-400">
    <FaUser size={20} />
    <span>Profile</span>
  </Link>

  <Link to="bookings" className="flex items-center space-x-4 hover:text-blue-400">
    <FaCar size={20} />
    <span>Bookings</span>
  </Link>

  <Link to="/user/notifications" className="flex items-center space-x-4 hover:text-blue-400">
    <FaBell size={20} />
    <span>Notifications</span>
  </Link>

  <Link to="/user/wishlists" className="flex items-center space-x-4 hover:text-blue-400">
    <FaHeart size={20} />
    <span>Wishlists</span>
  </Link>

  <Link to="/user/change-password" className="flex items-center space-x-4 hover:text-blue-400">
    <FaKey size={20} />
    <span>Change Password</span>
  </Link>

  <Link to="/user/add-or-update-driving-info" className="flex items-center space-x-4 hover:text-blue-400">
    <FaIdCard size={20} />
    <span>Update License</span>
  </Link>

  <Link to="/user/add-driving-info" className="flex items-center space-x-4 hover:text-blue-400">
    <FaIdCard size={20} />
    <span>Add License</span>
  </Link>

  <Link to="/user/add-feedback" className="flex items-center space-x-4 hover:text-blue-400">
    <FaComment size={20} />
    <span>Add Feedback</span>
  </Link>

  <button 
    type="button" 
    onClick={handleLogOut} 
    className="flex cursor-pointer items-center space-x-4 text-red-500 hover:text-red-400"
  >
    <FaSignOutAlt size={20} />
    <span>Log Out</span>
  </button>
</nav>
);}
