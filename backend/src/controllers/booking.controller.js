import booking from "../models/booking.model.js"
import { asyncHandler } from "../utils/asyncHandler.js"


const booked =  asyncHandler (async (req,res) => {

    customerid = req.user?.id
    const {serviceid,issueDetails,predicted} = req.body
})