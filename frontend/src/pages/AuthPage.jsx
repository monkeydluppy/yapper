import React from "react";
import SignupCard from "../components/SignupCard";
import LoginCard from "../components/LoginCard";
import { useRecoilState, useRecoilValue } from "recoil";
import { authScreenAtom } from "../atoms/authAtom";

const AuthPage = () => {
    const authScreenAtomValue = useRecoilValue(authScreenAtom);

    return <>{authScreenAtomValue === "login" ? <LoginCard /> : <SignupCard></SignupCard>}</>;
};

export default AuthPage;
