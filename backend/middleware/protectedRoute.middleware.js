

import User from "../models/user.model.js";
import jwt from "jsonwebtoken";


const protectedRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwtcookie;


        if (!token) {
            return res.status(401).json({ error: "Unauthorised. Please login to do this action." })
        }



        const decodeCookie = jwt.verify(token, process.env.JWT_SECRET)


        const user = await User.findById(decodeCookie.userId).select("-password").select("-rawPassword")


        req.user = user;

        next();

    }
    catch (error) {
        res.status(500).json({ error: `There was some error ${error.message}` })
    }
}


export default protectedRoute;