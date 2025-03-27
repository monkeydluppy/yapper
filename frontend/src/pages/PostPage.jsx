import { Avatar, Box, Button, Divider, Flex, Image, Spinner, Text, useColorModeValue } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import Actions from "../components/Actions";
import Comment from "../components/Comment";
import useGetUserProfile from "../../hooks/useGetUserProfile";
import { useNavigate, useParams } from "react-router-dom";
import useShowToast from "../../hooks/useShowToast";
import { DeleteIcon } from "@chakra-ui/icons";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { formatDistanceToNow } from "date-fns";
import allPostAtom from "../atoms/allPostAtom";

const PostPage = () => {
    const loggedInUser = useRecoilValue(userAtom);
    const [allPostAtomValue, setAllPostAtomValue] = useRecoilState(allPostAtom);

    const { user, loading } = useGetUserProfile();

    const [gettingPost, setGettingPost] = useState(true);

    const customToast = useShowToast();

    const { postId, username } = useParams();

    const navigate = useNavigate();

    const handleDeletePost = async (event) => {
        try {
            event.preventDefault();
            if (!window.confirm("Are you sure you want to delete this yapp?")) {
                return;
            }
            const res = await fetch(`${import.meta.env.VITE_BASE_URI}/posts/delete/${postId}`, {
                method: "delete",
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

            setAllPostAtomValue((prev) => {
                return prev.filter((eachPost) => eachPost._id !== postId);
            });

            customToast("Success", data.message, "success");
        } catch (error) {
            customToast("Error", error.message, "error");
        } finally {
        }
    };

    useEffect(() => {
        console.log("running pos");

        const getPost = async () => {
            try {
                if (!user) {
                    return;
                }

                const res = await fetch(`${import.meta.env.VITE_BASE_URI}/posts/${postId}`);

                const data = await res.json();

                if (data.error) {
                    return customToast("Error", data.error, "error");
                }

                setAllPostAtomValue(() => [data]);
            } catch (error) {
                customToast("Error", error.message, "error");
            } finally {
                setGettingPost(() => false);
            }
        };
        getPost();
    }, [user, customToast]);

    if (loading || gettingPost || allPostAtomValue.length > 1) {
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
    if (!loading && !gettingPost && allPostAtomValue.length < 1) {
        return (
            <Box display={"flex"} justifyContent={"center"} alignItems={"center"}>
                <Text>No post found</Text>
            </Box>
        );
    }

    const thisPost = allPostAtomValue[0];

    return (
        <>
            <Flex>
                <Flex w={"full"} alignItems={"center"} gap={3} cursor={"pointer"} onClick={() => navigate(`/${user.username}`)}>
                    <Avatar
                        src={user.profilePic ? user.profilePic : "https://bit.ly/broken-link"}
                        size={"md"}
                        name={user.name}
                    ></Avatar>
                    <Flex>
                        <Text>{user.username}</Text>
                        <Image src="/verified.png" w={4} h={4} ml={4}></Image>
                    </Flex>
                </Flex>
                <Flex gap={4} alignItems={"center"}>
                    <Text fontSize={"small"} color={"gray.light"} style={{ textWrap: "nowrap" }}>
                        {formatDistanceToNow(new Date(thisPost?.createdAt))} ago
                    </Text>
                    {loggedInUser?._id === thisPost?.postedBy && <DeleteIcon size={16} onClick={handleDeletePost}></DeleteIcon>}
                </Flex>
            </Flex>
            <Text my={3}>{thisPost?.text}</Text>
            {thisPost?.img && (
                <Box borderRadius={6} overflow={"hidden"} border={"1px solid"} borderColor={"gray.light"}>
                    <Image src={thisPost?.img} w={"full"} />
                </Box>
            )}

            <Flex gap={3} my={3}>
                <Actions post={thisPost}></Actions>
            </Flex>

            <Divider my={4}></Divider>
            <Flex justifyContent={"space-between"}>
                <Flex gap={2} alignItems={"center"}>
                    <Text fontSize={"2xl"}>👋</Text>
                    <Text color={"gray.light"}>Get the app to like, reply and post</Text>
                </Flex>
                <Button>Get</Button>
            </Flex>
            <Divider my={4}></Divider>

            {thisPost?.replies.map((reply, index) => {
                return (
                    <Comment
                        key={`${index}${thisPost?._id}`}
                        reply={reply}
                        lastReply={index === thisPost?.replies.length - 1}
                    ></Comment>
                );
            })}
        </>
    );
};

export default PostPage;
