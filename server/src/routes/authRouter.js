import { Router } from "express";
import { adminLogin, logoutAdmin, refreshAdminAccessToken } from "../controllers/admin.controller.js";
import { loginUser, logoutUser, refreshUserAccessToken, registerUser } from "../controllers/user.controller.js";



const router  = Router()

//admin
router.route("/admin/login").post(adminLogin)
router.route("/admin/logout").delete(logoutAdmin)
router.route("/refresh/admin/token").post(refreshAdminAccessToken)

//user
router.route("/user/register").post(registerUser)
router.route("/user/login").post(loginUser)
router.route("/user/logout").delete(logoutUser)
router.route("/refresh/user/token").post(refreshUserAccessToken)


export default router