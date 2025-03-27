import { Link as ReactRouterLink } from "react-router-dom";
import { Button, Flex, Link as ChakraLink, Text, Spinner, Box, useColorModeValue } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import useShowToast from "../../hooks/useShowToast";
import Post from "../components/Post";
import allPostAtom from "../atoms/allPostAtom";
import SuggestedUsers from "../components/SuggestedUsers";

const HomePage = () => {
    const loggedInUser = useRecoilValue(userAtom);

    const [loading, setLoading] = useState(true);

    const [allPostAtomValue, setAllPostAtomValue] = useRecoilState(allPostAtom);

    const customToast = useShowToast();

    useEffect(() => {
        const getFeedPost = async () => {
            try {
                setLoading(true);
                const res = await fetch(`${import.meta.env.VITE_BASE_URI}/posts/feed`, {
                    credentials: "include",
                });
                const data = await res.json();

                if (data.error) {
                    customToast("Error", data.error, "error");
                    return;
                }

                console.log(data);

                setAllPostAtomValue(() => {
                    return data.feedPosts;
                });
            } catch (error) {
                customToast("Error", error.message, "error");
            } finally {
                setLoading(false);
            }
        };
        getFeedPost();
    }, [customToast]);

    console.log(allPostAtomValue);

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

    return (
        <Flex
            gap="10"
            flexDirection={{
                base: "column",
                md: "row",
            }}
        >
            <Box flex={70}>
                {allPostAtomValue.length === 0 && (
                    <>
                        <Text textAlign={"center"} mb={7} color={"gray.light"} opacity={0.7}>
                            Cannot get feed as you follow no one and dont have any post. Post whats happening in the world or
                            follow others to see they are thinking...
                        </Text>
                    </>
                )}
                {allPostAtomValue.length > 0 &&
                    allPostAtomValue.map((post, index) => {
                        return <Post key={index} post={post} index={index}></Post>;
                    })}
            </Box>
            <Box flex={30}>
                <SuggestedUsers></SuggestedUsers>
            </Box>
        </Flex>
    );
};

export default HomePage;
