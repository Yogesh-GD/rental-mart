import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { adminLogin } from "../../slices/Auth/authSlice";


const AdminLoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setError] = useState("");
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { status,error } = useSelector((state) => state.auth)

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    const data = { email, password }
    dispatch(adminLogin(data))

  };
  if(status === "succeed") {
  setTimeout(() => {
    navigate("/admin/")
  }, 1000);  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#00ffff] via-white/30 to-[#8bb2ff]">
      <div className="max-w-lg w-full bg-white rounded-xl shadow-2xl p-8 relative">
        <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 w-20 h-20 bg-gradient-to-r from-[#00ffff]  to-[#8bb2ff] rounded-full shadow-lg flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="white"
            className="w-10 h-10"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25V9m-3 0h12m-12 0v9.75A2.25 2.25 0 007.5 21h9a2.25 2.25 0 002.25-2.25V9m-12 0h12"
            />
          </svg>
        </div>

        <h2 className="text-3xl font-extrabold text-gray-800 text-center mt-10">Welcome Back</h2>
        <p className="text-gray-500 text-center mt-2">Sign in to manage the admin panel</p>

        {err && <p className="mt-4 text-red-500 text-center">{err}</p>}

        <form onSubmit={handleLogin} className="mt-8 space-y-6">
          <div className=" relative">

            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="peer w-full mt-2 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00ffff]"

            />
            <label htmlFor="email" className={` transition-all duration-200 absolute left-3 text-gray-700 font-medium  peer-focus:-top-5 peer-focus:text-sm peer-focus:text-[#00ffff] ${email.length > 0 ? '-top-5' : 'top-6'} `}>
              Email Address
            </label>
          </div>

          <div className=" relative">

            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="peer w-full mt-2 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00ffff]"
            />
            <label htmlFor="password" className={` transition-all duration-200 absolute left-3 text-gray-700 font-medium  peer-focus:-top-5 peer-focus:text-sm peer-focus:text-[#00ffff] ${password.length > 0 ? '-top-5' : 'top-6'} `}>
              Password
            </label>
          </div>
          {error && <p className="mt-4 text-red-500 text-center">{error.message}</p>}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-[#00ffff]  to-[#8bb2ff] text-white py-3 rounded-lg font-bold text-lg shadow-lg hover:opacity-90 transition duration-300"
          >
            Login
          </button>
        </form>

        <p className="text-center mt-6 text-gray-500">
          Forgot your password?{' '}
          <a href="/reset" className="text-pink-500 hover:underline">
            Reset it here
          </a>
        </p>
      </div>
    </div>
  );
};

export default AdminLoginPage;