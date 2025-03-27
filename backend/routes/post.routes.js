import express from "express"
import { createPost, deletePost, getFeedPosts, getPost, likeUnlikePost, replyToPost, getUserPost } from "../controllers/post.conteroller.js";
import protectedRoute from "../middleware/protectedRoute.middleware.js";

const postRoute = express.Router();


postRoute.get("/feed", protectedRoute, getFeedPosts)

postRoute.get("/user/:username", getUserPost)


postRoute.get("/:id", getPost)

postRoute.post("/create", protectedRoute, createPost)

postRoute.post("/like/:id", protectedRoute, likeUnlikePost)


postRoute.delete("/delete/:id", protectedRoute, deletePost)


postRoute.post("/reply/:id", protectedRoute, replyToPost)





export default postRoute;