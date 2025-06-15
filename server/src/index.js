import { app } from "./App.js";
import { createadmin } from "./controllers/admin.controller.js";
import connectDB from "./database/index.js"
import cron from "node-cron"

const port  = process.env.PORT || 5000

connectDB()


import  userRouter  from "./routes/userRoutes.js";
import adminRouter from "./routes/adminRouter.js"
import publicRouter from "./routes/publicRoutes.js"
import authRouter from "./routes/authRouter.js"
import { autoCancelingBooking } from "./controllers/booking.controller.js";

app.use("/user", userRouter)
app.use("/admin",adminRouter)
app.use("/api/v1",publicRouter)
app.use("/auth",authRouter)

cron.schedule("*/5 * * * *", autoCancelingBooking);

app.listen(port,()=>{
    console.log("server is running on port ",port)
})