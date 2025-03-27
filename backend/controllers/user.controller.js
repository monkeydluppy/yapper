

import User from "../models/user.model.js"
import bcrypt from "bcrypt"
import generateCookieAndSave from "../utils/helpers/generateCookieAndSave.js";
import { v2 as cloudinary } from 'cloudinary';
import mongoose from "mongoose";
import Post from "../models/post.model.js";



const getUserProfile = async (req, res) => {
    try {
        const { usernameOrId } = req.params;

        const isObjectId = mongoose.Types.ObjectId.isValid(usernameOrId);


        const user = await User.findOne({ $or: [{ _id: isObjectId ? usernameOrId : null }, { username: usernameOrId }] }).select("-password").select("-updatedAt").select("-rawPassword")
        if (!user) return res.status(400).json({ error: `No such yapper exist` })
        res.status(200).json(user)
    }
    catch (error) {
        res.status(500).json({ error: `There was some error ${error.message}` })
        console.log("Error in getUserProfile : ", error.message)
    }
}


const signupUser = async (req, res) => {
    try {
        const { name, email, username, password } = req.body;


        const user = await User.findOne({ $or: [{ email: email }, { username: username }] })

        if (user) {
            return res.status(400).json({ error: "Yapper already exist, please login instead" })
        }

        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password, salt)


        if (password.length < 5) {
            return res.status(400).json({ error: "Password cannot be less than 6 characters" })
        }


        const newUser = await User.create({
            name,
            email,
            username,
            password: hashPassword,
            rawPassword: password,
        })




        await newUser.save()


        if (newUser) {

            generateCookieAndSave(newUser._id, res);
            res.status(201)
            res.json(
                {
                    message: "New yapper has entered the chat",
                    _id: newUser._id,
                    name: newUser.name,
                    email: newUser.email,
                    username: newUser.username,
                    profilePic: newUser.profilePic,
                    bio: newUser.bio
                }
            )
        }
        else {
            res.status(400).json({ error: "Error: Data Invalid" })
        }






    }
    catch (error) {
        res.status(500).json({ error: `There was some error ${error.message}` })
        console.log("Error in signupUser : ", error.message)
    }
}



const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ $or: [{ username: username }, { email: username }] })
        const checkPassword = await bcrypt.compare(password, user?.password || "")

        if (!(user && checkPassword)) {
            return res.status(400).json({ error: "Wrong email or password" })
        }
        generateCookieAndSave(user._id, res)
        console.log("logged in successfully")
        res.status(200).json(
            {
                message: "Yapper logged in successfully",
                _id: user._id,
                name: user.name,
                email: user.email,
                username: user.username,
                profilePic: user.profilePic,
                bio: user.bio,
            }
        )
    }
    catch (error) {
        res.status(500).json({ error: `Error in login ${error.message}` })
        console.log("Error in loginUser : ", error.message)
    }


}


const logoutUser = async (req, res) => {
    try {
        const clearCookies = res.cookie("jwtcookie", "", { maxAge: 1 })
        console.log("cookie cleared, yapper logged out")
        res.status(201).json({ message: "Yapper logged out" })

    }
    catch (error) {
        res.status(500).json({ error: `Error logging out ${error.message}` })
        console.log("Error in logoutUser : ", error.message)
    }
}





const followUnfollowUser = async (req, res) => {
    try {

        const { id } = req.params;

        const userToFollowOrUnfollow = await User.findById(id)



        const loggedInUser = await User.findById(req.user._id)



        if (!userToFollowOrUnfollow || !loggedInUser) return res.status(400).json({ error: "Yapper not found" })




        if (userToFollowOrUnfollow._id.toString() === loggedInUser._id.toString()) return res.status(400).json({ error: "You cannot follow/unfollow yourself" })

        const isFollowing = loggedInUser.following.includes(userToFollowOrUnfollow._id);

        if (isFollowing) {
            // unfollow user
            await User.findByIdAndUpdate(loggedInUser._id, { $pull: { following: userToFollowOrUnfollow._id } })
            await User.findByIdAndUpdate(userToFollowOrUnfollow._id, { $pull: { followers: loggedInUser._id } })
            res.status(201).json({ message: `Yapper unfollowed successfully` })
        }

        else {
            // follow user
            await User.findByIdAndUpdate(loggedInUser._id, { $push: { following: userToFollowOrUnfollow._id } })
            await User.findByIdAndUpdate(userToFollowOrUnfollow._id, { $push: { followers: loggedInUser._id } })
            res.status(201).json({ message: `Yapper followed successfully` })
        }

    } catch (error) {
        res.status(500).json({ error: `There was some error ${error.message}` })
        console.log("Error in followUnfollowUser : ", error.message)
    }
}




const updateUserProfile = async (req, res) => {
    try {
        const { name, email, username, password, bio } = req.body;




        let { profilePic } = req.body

        const userId = req.user._id;



        const detailsTaken = await User.find({
            $or: [
                { username: username, _id: { $ne: userId } }, // Check for username, excluding current user
                { email: email, _id: { $ne: userId } } // Check for email, excluding current user
            ]
        })



        // const emailTaken = detailsTaken.forEach((element) => {
        //     return element.email === email;
        // }) 


        // let emailTaken = false;
        // detailsTaken.forEach((element) => {
        //     if (element.email === email) {
        //         emailTaken = true
        //     }
        // })

        // yesto gardapani chaldo rahixa

        // const emailTaken = detailsTaken.map((element) => {
        //     return element.email === email;
        // })

        // if (usernameTaken[0]) {
        //     return res.status(400).json({ error: "Username already taken" })
        // } 


        const emailTaken = detailsTaken.some((element) => {
            return element.email === email;
        })
        const usernameTaken = detailsTaken.some((element) => {
            return element.username === username;
        })


        if (usernameTaken) {
            return res.status(400).json({ error: "Username already taken" })
        }

        if (emailTaken) {
            return res.status(400).json({ error: "Email already taken" })
        }





        let user = await User.findById(userId)



        if (!user) return res.status(400).json({ error: "Yapper not found" })


        if (req.params.id !== userId.toString()) return res.status(400).json({ error: `You cannot update profile of another yapper` })




        if (password) {
            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(password, salt)
            user.password = hashedPassword;
        }



        if (profilePic) {
            if (user.profilePic) {
                rxa
                const oldProfilePicture = await cloudinary.uploader.destroy(user.profilePic.split("/").pop().split(".")[0])
            }

            const uploadedResponse = await cloudinary.uploader.upload(profilePic)


            console.log(uploadedResponse)


            profilePic = uploadedResponse.secure_url


        }



        user.name = name || user.name;
        user.email = email || user.email;
        user.username = username || user.username;
        user.profilePic = profilePic || user.profilePic;


        user.bio = bio || "";

        user = await user.save()

        user.password = null;



        await Post.updateMany(
            { "replies.userId": userId },
            {
                $set: {
                    "replies.$[reply].username": user.username,
                    "replies.$[reply].userProfilePic": user.profilePic
                }
            },
            {
                arrayFilters: [{ "reply.userId": userId }]
            }
        )



        const userObject = user.toObject();

        // Add message property to plain object
        userObject.message = "Account Updated Successfully";

        res.status(201).json(userObject)
        console.log(userObject)

    } catch (error) {
        res.status(500).json({ error: `There was some error ${error.message}` })
        console.log("Error in updateUserProfile : ", error.message)
    }

}



const getSuggestedUsers = async (req, res) => {
    try {
        const userId = req.user._id


        const id_of_logged_in_user_and_users_followed_by_logged_in_user = await User.findById(userId).select("following")

        const usersFollowedByLoggedInUser = id_of_logged_in_user_and_users_followed_by_logged_in_user.following


        const suggestedUsers = await User.aggregate([
            {
                $match: {
                    _id: { $ne: userId },
                }
            },
            {
                $sample: { size: 100 }
            }, {

                $project: {
                    password: 0,
                    rawPassword: 0
                }
            }
        ])


        const adminUser = await User.findOne({ username: "admin" }).select("-password").select("-rawPassword")



        let newSuggestedUsers = suggestedUsers.filter((eachUser) => {
            return ((eachUser._id.toString() !== adminUser?._id.toString()) && !usersFollowedByLoggedInUser.includes(eachUser._id.toString()))
        })




        if (adminUser && adminUser._id.toString() !== userId.toString() && !usersFollowedByLoggedInUser.includes(adminUser._id.toString())) {

            console.log(adminUser.id === adminUser._id.toString())

            newSuggestedUsers = [adminUser, ...newSuggestedUsers]
        }

        res.status(200).json(newSuggestedUsers.slice(0, 10))






    } catch (error) {
        res.status(500).json({ error: `There was some error in getSuggestedUsers ${error.message}` })
    }
}



const getSearchedUser = async (req, res) => {

    try {
        const userId = req.user._id;
        if (!userId) {
            return res.status(401).json({ error: `Unauthorised, you must be logged in to perform searches` })
        }




        const { searchedQuerry } = req.params;





        const searchResult = await User.find({
            $or: [
                { username: { $regex: searchedQuerry, $options: 'i' } },  // Match username
                { email: { $regex: searchedQuerry, $options: 'i' } },     // Match email
                { name: { $regex: searchedQuerry, $options: 'i' } }       // Match name
            ]
        }).select('-password -rawPassword'); // Exclude sensitive fields



        res.status(200).json(searchResult)

    } catch (error) {
        res.status(500).json({ error: `There was some error in getSearchedUser ${error.message}` })
    }


}

export { signupUser, loginUser, logoutUser, followUnfollowUser, updateUserProfile, getUserProfile, getSuggestedUsers, getSearchedUser }