import mongoose from "mongoose";


const postSchema = mongoose.Schema({
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    text: {
        type: String,
        minLength: 1,
        maxLength: 500,
    },
    img: {
        type: String
    },

    likes: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "User",
        default: [],
    },


    replies: [
        {
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true,
            },
            text: {
                type: String,
                required: true,
            },
            userProfilePic: {
                type: String,

            },
            username: {
                type: String,
            }

        }
    ],



    // replies: {
    //     type: [
    //         {
    //             userId: {
    //                 type: mongoose.Schema.Types.ObjectId,
    //                 ref: "User",
    //                 required: true,
    //             },
    //             text: {
    //                 type: String,
    //                 required: true,
    //             },
    //             userProfilePic: {
    //                 type: String,

    //             },
    //             username: {
    //                 type: String,
    //             }
    //         }
    //     ]
    // }

}, {
    timestamps: true,
})

const Post = mongoose.model("post", postSchema)

export default Post;