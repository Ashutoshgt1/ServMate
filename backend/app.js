import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
const app = express()

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))

app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieParser())


//routes
import customerRoutes from "./src/routes/customer.route.js";
import serviceRoutes from "./src/routes/service.route.js"
import providerRoutes from "./src/routes/provider.route.js"

app.use("/api/customers", customerRoutes);
app.use('/api/service',serviceRoutes)
app.use('/api/provider',providerRoutes)


export { app }