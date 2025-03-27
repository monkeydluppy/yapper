import { useEffect, useState } from "react"
import useShowToast from "./useShowToast.js"
import { useParams } from "react-router-dom";

const useGetUserProfile = () => {
    const customToast = useShowToast();
    const [user, setUser] = useState("")
    const { username } = useParams()
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const getUserProfileData = async () => {
            console.log("running user")
            try {
                setLoading(true)


                const res = await fetch(`${import.meta.env.VITE_BASE_URI}/users/profile/${username}`, {
                    method: "get",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    // credentials: "include"
                })

                const data = await res.json()

                if (data.error) {
                    customToast("Error", data.error, "error")
                    return;
                }

                setUser(data)
            } catch (error) {
                customToast("Error", error.message, "error")
            } finally {
                setLoading(false)

            }
        }
        getUserProfileData();
    }, [username, customToast])

    return { loading, user }

}

export default useGetUserProfile;