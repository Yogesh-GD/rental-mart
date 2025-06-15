import { useState } from "react";
import { Outlet, Link, useNavigate } from "react-router";
import { useScroll, useMotionValueEvent } from "framer-motion";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaHome, FaUser, FaCar, FaClipboardList, FaHeart, FaBell,
  FaComments, FaLock, FaBars, FaTimes, FaChevronDown, FaPlusCircle, FaEdit, FaTrash
} from "react-icons/fa";
import { FaBellConcierge } from "react-icons/fa6";
import { BiSend } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { adminLogout } from "../../slices/Auth/authSlice";

const AdminRoot = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="w-full h-screen flex flex-col bg-black text-white">
      <Topbar setSidebarOpen={setSidebarOpen} />
      <div className="flex flex-grow overflow-hidden pt-16">
        <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 overflow-y-auto p-3 sm:p-6">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminRoot;

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
        className="bg-black border-r border-[#2e2e2e] h-full hidden md:flex flex-col transition-all duration-300 p-4 overflow-y-scroll"
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
            className="fixed top-0 left-0 h-full w-full bg-gray-900 p-6 shadow-lg z-50 overflow-y-scroll md:hidden"
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
dispatch(adminLogout())
navigate("/")

}

if(status === "adminloggedOut"){
  window.location.reload()
}
  
  return (
    <nav className="flex flex-col space-y-4">
      <NavItem to="/admin/" icon={<FaHome />} label="Dashboard" />
      
      <DropdownMenu label="User Management" icon={<FaUser />}>
        <NavItem to="/admin/users/add" label="Add User" icon={<FaPlusCircle />} />
        <NavItem to="/admin/users/manage" label="Manage Users" icon={<FaEdit />} />
      </DropdownMenu>

      <DropdownMenu label="Vehicle Management" icon={<FaCar />}>
        <NavItem to="/admin/vehicles/add" label="Add Vehicle" icon={<FaPlusCircle />} />
        <NavItem to="/admin/vehicles/manage" label="Manage Vehicles" icon={<FaEdit />} />
      </DropdownMenu>

      <DropdownMenu label="Booking Management" icon={<FaClipboardList />}>
        <NavItem to="/admin/bookings/manage" label="Manage Bookings" icon={<FaEdit />} />
      </DropdownMenu>

      <NavItem to="/admin/notification/send" icon={<BiSend />} label="Send Notification" />
      <NavItem to={"/admin/add-location"} label={"Add Location"} />
      <DropdownMenu label="Feedback & Reviews" icon={<FaComments />}>
        <NavItem to="/admin/reviews/manage" label="Manage Reviews" />
        <NavItem to="/admin/feedback" label="Customer Feedback" />
      </DropdownMenu>

      <DropdownMenu label="Admin " icon={<FaLock />}>
        <NavItem to="/admin/change-password" label="Change password" />
      </DropdownMenu>

      <button type="button" onClick={handleLogOut}  className="flex cursor-pointer items-center space-x-4 text-red-500 hover:text-red-400">
      Log Out
    </button>
    </nav>
  );
};

const NavItem = ({ to, icon, label }) => (
  <Link to={to} className="flex items-center space-x-4 p-3 rounded-md hover:bg-gray-700 transition">
    {icon}
    <span>{label}</span>
  </Link>
);

const DropdownMenu = ({ label, icon, children }) => {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        className="flex items-center justify-between w-full text-left p-3 rounded-md hover:bg-gray-700 transition"
        onClick={() => setOpen(!open)}
      >
        <span className="flex items-center space-x-4">
          {icon}
          <span>{label}</span>
        </span>
        <FaChevronDown className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="ml-6 mt-2 space-y-2"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
