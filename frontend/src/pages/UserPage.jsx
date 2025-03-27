import React, { useCallback, useEffect, useState } from "react";
import UserHeader from "../components/UserHeader";
import UserPost from "../components/UserPost";
import { useParams } from "react-router-dom";
import useShowToast from "../../hooks/useShowToast";
import { Box, Flex, Spinner, Text, useColorModeValue } from "@chakra-ui/react";
import Post from "../components/Post";
import useGetUserProfile from "../../hooks/useGetUserProfile";
import { useRecoilState, useRecoilValue } from "recoil";
import allPostAtom from "../atoms/allPostAtom";

const UserPage = () => {
    const { user, loading } = useGetUserProfile();

    const { username } = useParams();

    const [loadingPost, setLoadingPost] = useState(true);

    const customToast = useShowToast();

    const [postOrder, setPostOrder] = useState("accending");

    const [allPostAtomValue, setAllPostAtomValue] = useRecoilState(allPostAtom);

    const getUserPost = useCallback(async () => {
        try {
            setLoadingPost(true);
            const res = await fetch(`${import.meta.env.VITE_BASE_URI}/posts/user/${username}`, {
                method: "get",
                headers: {
                    "Content-Type": "applicaton/json",
                },
            });
            const data = await res.json();
            if (data.error) {
                customToast("Error", data.error, "error");
                return;
            }
            setAllPostAtomValue(() => data);
        } catch (error) {
            customToast("Error", error.message, "error");
        } finally {
            setLoadingPost(false);
        }
    }, [username, customToast]);

    useEffect(() => {
        getUserPost();
    }, [getUserPost]);

    if (loading) {
        return (
            <Box
                w={"100vw"}
                height={"100vh"}
                bg={useColorModeValue("#ffffff", "#101010")}
                pos={"fixed"}
                top={0}
                left={0}
                display={"flex"}
                justifyContent={"center"}
                alignItems={"center"}
            >
                <Spinner width={69} height={69}></Spinner>
            </Box>
        );
    }

    if (!user && !loading) {
        return (
            <Flex minHeight={`calc(100vh - 200px)`} justifyContent={"center"} alignItems={"center"}>
                <Text fontSize={24} textAlign={"center"} color={"gray.light"}>
                    There is no yapper with this username...
                </Text>
            </Flex>
        );
    }

    return (
        <div>
            <UserHeader user={user} postOrder={postOrder} setPostOrder={setPostOrder}></UserHeader>

            {loadingPost && (
                <Box
                    mt={4}
                    bg={useColorModeValue("#ffffff", "#101010")}
                    display={"flex"}
                    justifyContent={"center"}
                    alignItems={"center"}
                >
                    <Spinner width={39} height={39}></Spinner>
                </Box>
            )}

            {allPostAtomValue.length === 0 ? (
                <Text textAlign={"center"} mt={5} color={"gray.light"} opacity={0.5}>
                    This yapper has has no yapping
                </Text>
            ) : postOrder === "accending" ? (
                allPostAtomValue.map((post, index) => {
                    return <Post key={`${post._id}`} post={post}></Post>;
                })
            ) : (
                allPostAtomValue
                    .slice()
                    .reverse()
                    .map((post, index) => {
                        return <Post key={`${post._id}`} post={post}></Post>;
                    })
            )}
        </div>
    );
};

export default UserPage;
