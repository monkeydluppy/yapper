import express from "express";

import { loginUser, logoutUser, signupUser, followUnfollowUser, updateUserProfile, getUserProfile, getSuggestedUsers, getSearchedUser } from "../controllers/user.controller.js";
import protectedRoute from "../middleware/protectedRoute.middleware.js";




const userRouter = express.Router();

// user signup route
userRouter.post("/signup", signupUser)



// user login route

userRouter.post("/login", loginUser)

// aba logout ko route pani banam
userRouter.post("/logout", logoutUser)


userRouter.post("/follow/:id", protectedRoute, followUnfollowUser)




userRouter.put("/update/:id", protectedRoute, updateUserProfile)



userRouter.get("/suggestedUsers", protectedRoute, getSuggestedUsers)


userRouter.get("/profile/:usernameOrId", getUserProfile)

userRouter.get("/search/:searchedQuerry", protectedRoute, getSearchedUser)



export default userRouter;