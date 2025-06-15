import {  Router } from "express";
import { addUserDrivingLicenceDetails, changeUserPassword, getUserBooking, getUserProfile, updateUserDrivingLicenceDetails, updateUserProfile } from "../controllers/user.controller.js";
import { authMiddleware } from "../middlewares/Auth.middleware.js";
import { multerErrorHandler, upload } from "../middlewares/multer.middleware.js";
import { addFeedback } from "../controllers/feedback.controller.js";
import { addReview } from "../controllers/review.controller.js";
import { addToviewedNotification, getUserNotifications } from "../controllers/notification.controller.js";
import { addToWishlist, getUserWishlists, removeFromWishlist } from "../controllers/wishlist.controller.js";
import { bookVehicle, cancelBooking, createBooking } from "../controllers/booking.controller.js";
import { processPayment } from "../controllers/Payment.controller.js";

const router = Router()



router.route("/hello").get((req,res) => res.status(200).json({message:"jf"}) )

router.route("/change/password").put(authMiddleware,changeUserPassword)
router.route("/update/driving-license").put(authMiddleware,upload.single("document"),multerErrorHandler,updateUserDrivingLicenceDetails)
router.route("/add/driving-license").post(authMiddleware,upload.single("document"),multerErrorHandler,addUserDrivingLicenceDetails)
router.route("/profile").post(authMiddleware,getUserProfile)
router.route("/update/profile").put(authMiddleware,upload.single("profilePicture"),multerErrorHandler,updateUserProfile)
router.route("/delete/profile").delete()//*

router.route("/bookings").post(authMiddleware,getUserBooking)
router.route("/book/vehicle/:id").post(authMiddleware,createBooking)
router.route("/bookings/:id/cancel").put(authMiddleware,cancelBooking)

router.route("/book/vehicle/processing/payment").post(authMiddleware,processPayment)

router.route("/get/notifications").get(authMiddleware,getUserNotifications)
router.route("/update/notification/:id").put(authMiddleware,addToviewedNotification)

router.route("/add/car/:id/review").post(authMiddleware,addReview)

router.route("/add/to/wishlist/:id").put(authMiddleware,addToWishlist)
router.route("/remove/from/wishlist/:id").put(authMiddleware,removeFromWishlist)
router.route("/get/wishlist").get(authMiddleware,getUserWishlists)


router.route("/add/feedback").post(authMiddleware,addFeedback)




export default router;