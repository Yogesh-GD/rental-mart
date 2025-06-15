import { Router } from "express";
import { getVehicleDetails, getVehicles } from "../controllers/vehicle.controller.js";
import { addFeedback } from "../controllers/feedback.controller.js";
import { getLocatins } from "../controllers/location.controller.js";

const router = Router()


router.route("/get/vehicles").get(getVehicles)
router.route("/get/vehicle/details/:id").get(getVehicleDetails)

router.route("/add/feedback").post(addFeedback)


router.route("/get/locations").get(getLocatins)

export default router