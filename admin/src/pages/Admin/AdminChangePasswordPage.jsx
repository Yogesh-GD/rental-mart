import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { UpdatePassword } from '../../slices/Admin/AdminSlice';

const AdminChangePasswordPage = () => {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const dispatch = useDispatch();

    const { status, formError } = useSelector((state) => state.admin);

    const onSubmit = (e) => {
        e.preventDefault();
        const data = { currentPassword, newPassword };
        dispatch(UpdatePassword(data))
    };



    return (
        <div className=" flex items-center justify-center  text-white ">
            <div className=" bg-[#212121] p-6 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold text-center mb-4">Change Password</h2>
                <form onSubmit={onSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="currentPassword" className="block text-sm text-gray-300 mb-1">Current Password</label>
                        <input 
                            type="password"
                            name="currentPassword"
                            id="currentPassword"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="w-full bg-[#212121] p-2 rounded mt-1 ring ring-[#4e4e4e]"                        />
                    </div>

                    <div>
                        <label htmlFor="newPassword" className="block text-sm text-gray-300 mb-1">New Password</label>
                        <input 
                            type="password"
                            name="newPassword"
                            id="newPassword"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full bg-[#212121] p-2 rounded mt-1 ring ring-[#4e4e4e]"                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={status === "submitting"}
                        className={`w-full p-2 rounded text-white font-semibold transition ${
                            status === "submitting" ? "bg-gray-600 cursor-not-allowed" : "bg-violet-600 hover:bg-violet-700"
                        }`}
                    >
                        {status === "submitting" ? "Updating..." : status === "succeed" ? "Updated" : "Update"}
                    </button>

                    {formError && <p className="text-sm text-red-400 text-center mt-2">{formError.message}</p>}
                </form>
            </div>
        </div>
    );
};

export default AdminChangePasswordPage;
