import { Router } from "express";
import { adminLogin, changeAdminPassword, getAdminDashboardData } from "../controllers/admin.controller.js"
import { addVehicle, deleteVehicleById, getVehicleDetails, getVehicles, handleFeatureVehicleById, updateVehicle } from "../controllers/vehicle.controller.js"
import { adminAuthMiddleware } from "../middlewares/AdminAuth.middleware.js";
import { addUser, deleteUserPermanently, deleteUserProfileById, getUserProfileById, getUsers, softDeleteUser, updateUserProfileById } from "../controllers/user.controller.js";
import { cancelBooking, getBookingDetails, getBookings, updateBooking, updateBookingStatus } from "../controllers/booking.controller.js";
import { deleteReviewById, getReviews } from "../controllers/review.controller.js";
import { getNotifications, sendNotification } from "../controllers/notification.controller.js";
import { getWishlists } from "../controllers/wishlist.controller.js";
import { multerErrorHandler, upload } from "../middlewares/multer.middleware.js";
import { deleteFeedback, getFeedback } from "../controllers/feedback.controller.js";
import { addLocation, deleteLocationById } from "../controllers/location.controller.js";


const router  = Router()

router.route("/dashboard").get(adminAuthMiddleware,getAdminDashboardData)

router.route("/change/password").put(adminAuthMiddleware,changeAdminPassword)

router.route("/get/users").get(adminAuthMiddleware,getUsers)
router.route("/get/user/profile/:id").get(adminAuthMiddleware,getUserProfileById)
router.route("/add/user").post(adminAuthMiddleware,upload.single("profilePicture"),multerErrorHandler,addUser)
router.route('/update/user/profile/:id').put(adminAuthMiddleware,upload.single("profilePicture"),multerErrorHandler,updateUserProfileById)
router.route('/delete/user/temp/:id').delete(adminAuthMiddleware,softDeleteUser)
router.route('/delete/user/:id').delete(adminAuthMiddleware,deleteUserPermanently)


router.route("/get/vehicles").get(adminAuthMiddleware,getVehicles)
router.route("/get/vehicle/details/:id").get(adminAuthMiddleware,getVehicleDetails)
router.route("/add/vehicle").post(adminAuthMiddleware,upload.array("images", 5),multerErrorHandler,addVehicle)
router.route("/update/vehicle/:id").put(adminAuthMiddleware,upload.array("images", 5),updateVehicle)
router.route("/delete/vehicle/:id").delete(adminAuthMiddleware,deleteVehicleById)
router.route("/feature/vehicle/:id").put(adminAuthMiddleware,handleFeatureVehicleById)

router.route("/get/bookings").get(adminAuthMiddleware,getBookings)
router.route("/get/booking/details/:id").get(adminAuthMiddleware,getBookingDetails)
router.route("/update/booking/:id").put(adminAuthMiddleware,updateBooking)
router.route("/update/booking/:id/status").put(adminAuthMiddleware,updateBookingStatus)
router.route("/bookings/:id/cancel").put(adminAuthMiddleware,cancelBooking)

router.route("/send/all/notification").post(adminAuthMiddleware,sendNotification)
router.route("/send/user/notification/:id").post(adminAuthMiddleware,sendNotification)


router.route("/get/reviews").get(adminAuthMiddleware,getReviews)
router.route("/delete/review/:id").delete(adminAuthMiddleware,deleteReviewById)


router.route("/get/feedbacks").get(adminAuthMiddleware,getFeedback)
router.route("/delete/feedback/:id").delete(adminAuthMiddleware,deleteFeedback)


router.route("/add/location").post(adminAuthMiddleware,addLocation)
router.route("/delete/location/:id").delete(adminAuthMiddleware,deleteLocationById)


router.route("/login").post(adminLogin)



router.route("/vehicles").get(getVehicles)

export default router
