import { useState } from "react"
import { useRecoilValue } from "recoil";
import userAtom from "../src/atoms/userAtom";
import useShowToast from "./useShowToast";

const useFollowUnfollow = (user) => {

    const loggedInUser = useRecoilValue(userAtom)



    const [following, setFollowing] = useState(user.followers.includes(loggedInUser?._id) || false);


    const [updating, setUpdating] = useState(false);

    const customToast = useShowToast()



    const handleFollowUnfollow = async () => {


        if (!loggedInUser) {
            customToast("Error", "You must be logged in to perform this action", "error");
            return;
        }



        if (updating) {
            return;
        }


        try {
            setUpdating(true);
            const res = await fetch(`${import.meta.env.VITE_BASE_URI}/users/follow/${user._id}`, {
                method: "post",
                headers: {
                    Content: "application/json",
                },
                credentials: "include",
            });
            const data = await res.json();


            if (data.error) {
                customToast("Error", data.error, "error");
                navigate("/auth");
                return;
            }


            if (following) {
                customToast("Success", `Unfollowed ${user.name}`, "success");
                user.followers.pop();
            } else {
                customToast("Success", `Followed ${user.name}`, "success");
                user.followers.push(loggedInUser._id);
            }





            setFollowing(() => !following);





        } catch (error) {
            customToast("Error", error.message, "error");
        } finally {
            setUpdating(false);
        }
    };

    return { handleFollowUnfollow, updating, following }

}

export default useFollowUnfollow