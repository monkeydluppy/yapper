import mongoose from "mongoose";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import { v2 as cloudinary } from 'cloudinary';



const getPost = async (req, res) => {
    try {

        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(404).json({ error: `The yapp doesnt exist` })
        }

        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ error: `The yapp doesnt exist` })
        }
        res.status(200).json(post)
        console.log(post)
    } catch (error) {
        res.status(500).json({ error: `There was some error ${error.message}` })
        console.log("Error in getPost : ", error.message)
    }

}



const createPost = async (req, res) => {
    try {

        const { postedBy, text } = req.body;

        let { img } = req.body

        if (!postedBy || !text) {
            console.log("reached if check")
            return res.status(400).json({ error: "Enter something, you cannot post an empty yapp" })
        }



        const user = await User.findById(postedBy);


        if (!user) {
            return res.status(404).json({ error: "Yapper not found" })
        }

        if (user._id.toString() !== req.user._id.toString()) {
            return res.status(401).json({ error: "You cannot create yapp in someone elses account bruh. Asli ID se aa bhai" })
        }

        const maxLength = 500;
        if (text.length > maxLength) {
            return res.status(400).json({ error: `Text must be less than ${maxLength}, no need to yapp this much` })
        }


        if (img) {

            const uploadedResponse = await cloudinary.uploader.upload(img)

            img = uploadedResponse.secure_url

        }




        const newPost = new Post({ postedBy: postedBy, text: text, img: img })

        await newPost.save()


        const newPostObject = newPost.toObject();

        newPostObject.message = "Yapp created successfully";

        res.status(201).json(newPostObject)
        console.log("post created", newPostObject)
    }
    catch (error) {
        res.status(500).json({ error: `There was some error ${error.message}` })
        console.log("Error in createPost : ", error.message)
    }

}


const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(400).json({ error: `Yapp not found` })
        }


        if (post.postedBy.toString() !== req.user._id.toString()) {
            return res.status(400).json({ error: `You cannot delete yapp of other users` })
        }


        if (post.img) {
            const postImgId = post.img.split("/").pop().split(".")[0]
            const uploadedResponse = await cloudinary.uploader.destroy(postImgId)
        }




        const deletedPost = await Post.findByIdAndDelete(req.params.id)
        res.status(200).json({ message: `Yapp deleted succesfull`, deletedPost })
        console.log(`Post deleted succesfull`)

    } catch (error) {
        res.status(500).json({ error: `There was some error ${error.message}` })
        console.log("Error in deletePost : ", error.message)
    }

}



const likeUnlikePost = async (req, res) => {
    try {

        const postId = req.params.id;
        const userId = req.user._id;

        const post = await Post.findById(postId);

        if (!post) return res.status(404).json({ error: "Yapp not found" })



        if (post.likes.includes(userId)) {
            await Post.updateOne({ _id: postId }, { $pull: { likes: userId } })

            // post.likes.pull.(userId)
            // await post.save();
            res.status(200).json({ message: "Yapp unliked successfully" })
            console.log("unliked")
        }
        else {
            // await Post.updateOne({ _id: postId }, { $push: { likes: userId } })



            post.likes.push(userId)
            await post.save();

            res.status(200).json({ message: "Yapp liked successfully" })
            console.log("liked")
        }


    } catch (error) {
        res.status(500).json({ error: `There was some error ${error.message}` })
        console.log("Error in likeUnlikePost : ", error.message)
    }
}



const replyToPost = async (req, res) => {
    try {

        const { text } = req.body;
        const postId = req.params.id;
        const userId = req.user._id;
        const userProfilePic = req.user.profilePic
        const username = req.user.username


        if (!text) return res.status(400).json({ error: "Text field is required" })


        const post = await Post.findById(postId)

        if (!post) return res.status(404).json({ error: "Yapp not found." })



        const reply = {
            userId: userId,
            text: text,
            userProfilePic: userProfilePic,
            username: username,
            _id: postId,
        }

        post.replies.push(reply)
        await post.save()

        res.status(201).json({ message: "Reply added successfully", post: post, reply: reply })
        console.log("Reply added successfully")


    }
    catch (error) {
        res.status(500).json({ error: `There was some error ${error.message}` })
        console.log("Error in replyToPost : ", error.message)
    }
}



const getFeedPosts = async (req, res) => {

    try {
        const userId = req.user._id;
        const user = await User.findById(userId)


        if (!user) {
            return res.status(200).json({ error: "Yapper not found" })
        }


        const following = [...user.following, user._id];

        const feedPosts = await Post.find({ postedBy: { $in: following } }).sort({ createdAt: -1 })


        res.status(200).json({ message: "All feed yapps fetched successfully", feedPosts: feedPosts })
        console.log("All feed post fetched successfully")

    }
    catch (error) {
        res.status(500).json({ error: `There was some errorss ${error.message}` })
        console.log("Error in getFeedPosts : ", error.message)
    }
}



const getUserPost = async (req, res) => {
    try {

        const username = req.params.username;

        const user = await User.findOne({ username: username })

        if (!user) {
            return res.status(400).json({ error: "No such yapper found" })
        }

        const userId = user._id
        const posts = await Post.find({ postedBy: userId }).sort({ createdAt: -1 })


        res.status(200).json(posts)

    } catch (error) {
        res.status(500).json({ error: `There was some error in getUserPost ${error.message}` })
    }


}

export { createPost, deletePost, getPost, likeUnlikePost, replyToPost, getFeedPosts, getUserPost }