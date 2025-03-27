import React from "react";
import useShowToast from "../../hooks/useShowToast";
import userAtom from "../atoms/userAtom";
import { useSetRecoilState } from "recoil";
import { FiLogOut } from "react-icons/fi";

import { Button, Flex, Text } from "@chakra-ui/react";
import { authScreenAtom } from "../atoms/authAtom";
import { useNavigate } from "react-router-dom";

const LogoutButton = () => {
    const customToast = useShowToast();
    const setUserAtomValue = useSetRecoilState(userAtom);
    const setAuthScreenAtomValue = useSetRecoilState(authScreenAtom);
    const navigation = useNavigate();
    const handleLogout = async () => {
        try {
            console.log("trying");
            const res = await fetch(`${import.meta.env.VITE_BASE_URI}/users/logout`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            });
            const data = await res.json();

            if (data.error) {
                customToast("Error", data.error, "error");
                return;
            }
            if (data.message) {
                customToast("Success", data.message, "success");
            }

            setAuthScreenAtomValue("login");

            localStorage.removeItem("user-threads");
            setUserAtomValue(null);
            navigation("/auth");
        } catch (error) {
            customToast("Error", error.message, "error");
        }
    };
    return <FiLogOut cursor={"pointer"} onClick={handleLogout} size={20} />;
};

export default LogoutButton;
