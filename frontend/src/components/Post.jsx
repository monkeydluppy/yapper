import { Avatar } from "@chakra-ui/avatar";
import { Image } from "@chakra-ui/image";
import { Box, Flex, Text } from "@chakra-ui/layout";
import { Link, useNavigate } from "react-router-dom";
import Actions from "./Actions";
import { useEffect, useState } from "react";
import useShowToast from "../../hooks/useShowToast";
import { DeleteIcon } from "@chakra-ui/icons";

import { formatDistanceToNow } from "date-fns";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import allPostAtom from "../atoms/allPostAtom";
import { Spinner, useColorModeValue } from "@chakra-ui/react";

const Post = ({ post, index }) => {
    const userIdOfPostCreator = post.postedBy;

    const loggedInUser = useRecoilValue(userAtom);

    const [user, setUser] = useState(null);

    const [loading, setLoading] = useState(true);

    const setAllPostAtomValue = useSetRecoilState(allPostAtom);

    const customToast = useShowToast();

    const navigate = useNavigate();

    useEffect(() => {
        const getUserProfile = async () => {
            try {
                setLoading(true);
                const res = await fetch(`${import.meta.env.VITE_BASE_URI}/users/profile/${userIdOfPostCreator}`);
                const data = await res.json();
                if (data.error) {
                    customToast("Error", data.error, "error");
                    return;
                }

                setUser(() => data);
                console.log(`mapping ${index}`);
            } catch (error) {
                setUser(() => null);
                customToast("Error", error.message, "error");
            } finally {
                setLoading(false);
            }
        };
        getUserProfile();
    }, [userIdOfPostCreator, customToast]);

    const handleDeletePost = async (event) => {
        try {
            event.preventDefault();
            if (!window.confirm("Are you sure you want to delete this yapp?")) {
                return;
            }
            const res = await fetch(`${import.meta.env.VITE_BASE_URI}/posts/delete/${post._id}`, {
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
                return prev.filter((eachPost) => eachPost._id !== post._id);
            });

            customToast("Success", data.message, "success");
        } catch (error) {
            customToast("Error", error.message, "error");
        } finally {
        }
    };

    if (loading) {
        return (
            <Box
                mt={10}
                mb={20}
                bg={useColorModeValue("#ffffff", "#101010")}
                display={"flex"}
                justifyContent={"center"}
                alignItems={"center"}
            >
                <Spinner width={39} height={39}></Spinner>
            </Box>
        );
    }

    return (
        <Link to={`/${user?.username}/post/${post._id}`}>
            <Flex gap={3} mb={4} py={5}>
                <Flex flexDirection={"column"} alignItems={"center"}>
                    <Avatar
                        size="md"
                        name={user?.username}
                        src={user.profilePic}
                        onClick={(event) => {
                            event.preventDefault();
                            navigate(`/${user.username}`);
                        }}
                    />
                    <Box w="1px" h={"full"} bg="gray.light" my={2}></Box>
                    <Box position={"relative"} w={"full"}>
                        {post.replies.length === 0 && <Text textAlign={"center"}>🐼</Text>}
                        {post.replies[0] && (
                            <Avatar
                                size="xs"
                                name={post.replies[0].username}
                                src={
                                    post.replies[0].userProfilePic ? post.replies[0].userProfilePic : "https://bit.ly/broken-link"
                                }
                                position={"absolute"}
                                top={"-10px"}
                                left="12px"
                                padding={"2px"}
                            />
                        )}
                        {post.replies[1] && (
                            <Avatar
                                size="xs"
                                name={post.replies[1].username}
                                src={
                                    post.replies[1].userProfilePic ? post.replies[1].userProfilePic : "https://bit.ly/broken-link"
                                }
                                position={"absolute"}
                                top={"5px"}
                                right="-15px"
                                padding={"2px"}
                            />
                        )}
                        {post.replies[2] && (
                            <Avatar
                                size="xs"
                                name={post.replies[2].username}
                                src={
                                    post.replies[2].userProfilePic ? post.replies[2].userProfilePic : "https://bit.ly/broken-link"
                                }
                                position={"absolute"}
                                top={"5px"}
                                left="-15px"
                                padding={"2px"}
                            />
                        )}
                    </Box>
                </Flex>
                <Flex flex={1} flexDirection={"column"} gap={2}>
                    <Flex justifyContent={"space-between"} w={"full"}>
                        <Flex w={"full"} alignItems={"center"}>
                            <Text
                                fontSize={"sm"}
                                fontWeight={"bold"}
                                onClick={(event) => {
                                    event.preventDefault();
                                    navigate(`/${user.username}`);
                                }}
                            >
                                {user?.username}
                            </Text>
                            <Image src="/verified.png" w={4} h={4} ml={1} />
                        </Flex>
                        <Flex gap={4} alignItems={"center"}>
                            <Text fontSize={"small"} color={"gray.light"} style={{ textWrap: "nowrap" }}>
                                {formatDistanceToNow(new Date(post.createdAt))} ago
                            </Text>
                            {loggedInUser?._id === post.postedBy && (
                                <DeleteIcon size={16} onClick={handleDeletePost}></DeleteIcon>
                            )}
                        </Flex>
                    </Flex>

                    <Text fontSize={"sm"}>{post.text}</Text>
                    {post.img && (
                        <Box borderRadius={6} overflow={"hidden"} border={"1px solid"} borderColor={"gray.light"}>
                            <Image src={post.img} w={"full"} />
                        </Box>
                    )}

                    <Flex gap={3} my={1}>
                        <Actions post={post} />
                    </Flex>
                </Flex>
            </Flex>
        </Link>
    );
};

export default Post;
