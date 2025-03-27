import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    Button,
    useColorModeValue,
    FormControl,
    Textarea,
    Text,
    Box,
    Flex,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import useShowToast from "../../hooks/useShowToast";
import { atom, useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import allPostAtom from "../atoms/allPostAtom";

const Actions = ({ post }) => {
    const user = useRecoilValue(userAtom);

    const [liked, setLiked] = useState(post.likes.includes(user?._id));

    const [allPostAtomValue, setAllPostAtomValue] = useRecoilState(allPostAtom);

    useEffect(() => {
        if (allPostAtomValue.length < 1) {
            setAllPostAtomValue([post]);
        }
    });

    const [isPosting, setIsPosting] = useState(false);

    const [isLiking, setIsLiking] = useState(false);

    const customToast = useShowToast();

    const [commentText, setCommentText] = useState("");

    const handleCommentTextChange = (event) => {
        const inputText = event.target.value;
        setCommentText(() => inputText);
    };

    const { isOpen, onOpen, onClose } = useDisclosure();

    const handleAddComment = async () => {
        try {
            if (isPosting) {
                return;
            }
            setIsPosting(true);
            const res = await fetch(`${import.meta.env.VITE_BASE_URI}/posts/reply/${post._id}`, {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ text: commentText }),
            });
            const data = await res.json();
            if (data.error) {
                customToast("Error", data.error, "error");
                return;
            }

            const newPostArray = allPostAtomValue.map((atomPost) => {
                if (atomPost._id === post._id) {
                    return { ...atomPost, replies: [data.reply, ...atomPost.replies] };
                }
                return atomPost;
            });

            setAllPostAtomValue((prev) => newPostArray);

            setCommentText(() => "");
            onClose();
            customToast("Success", data.message, "success");
        } catch (error) {
            customToast("Error", error.message, "error");
        } finally {
            setIsPosting(false);
        }
    };

    const handleLikeAndUnlike = async () => {
        try {
            if (!user) {
                customToast("Error", "You are not logged in. Please login to like or unlike posts.", "error");
                return;
            }

            setIsLiking(true);
            if (isLiking) {
                return;
            }

            const res = await fetch(`${import.meta.env.VITE_BASE_URI}/posts/like/${post._id}`, {
                method: "post",
                headers: {
                    "Content-Type": "json/application",
                },
                credentials: "include",
            });
            const data = await res.json();

            if (data.error) {
                customToast("Error", data.error, "error");
                return;
            }

            if (liked) {
                const newLikedArray = post.likes.filter((element) => {
                    return element !== user?._id;
                });

                const newPostArray = allPostAtomValue.map((atomPost) => {
                    if (atomPost._id === post._id) {
                        return { ...atomPost, likes: newLikedArray };
                    }
                    return atomPost;
                });

                setAllPostAtomValue(() => newPostArray);
            } else {
                const newLikedArray = [...post.likes, user._id];
                const newPostArray = allPostAtomValue.map((atomPost) => {
                    if (atomPost._id === post._id) {
                        return { ...atomPost, likes: newLikedArray };
                    }
                    return atomPost;
                });

                setAllPostAtomValue(() => newPostArray);
            }

            setLiked(!liked);
        } catch (error) {
            customToast("Error", error.message, "error");
        } finally {
            setIsLiking(false);
        }
    };

    return (
        <Flex flexDirection="column">
            <Flex gap={3} my={2} onClick={(e) => e.preventDefault()}>
                <svg
                    aria-label="Like"
                    color={liked ? "rgb(237, 73, 86)" : ""}
                    fill={liked ? "rgb(237, 73, 86)" : "transparent"}
                    height="19"
                    role="img"
                    cursor={"pointer"}
                    viewBox="0 0 24 22"
                    width="20"
                    onClick={handleLikeAndUnlike}
                >
                    <title>Like</title>
                    <path
                        d="M1 7.66c0 4.575 3.899 9.086 9.987 12.934.338.203.74.406 1.013.406.283 0 .686-.203 1.013-.406C19.1 16.746 23 12.234 23 7.66 23 3.736 20.245 1 16.672 1 14.603 1 12.98 1.94 12 3.352 11.042 1.952 9.408 1 7.328 1 3.766 1 1 3.736 1 7.66Z"
                        stroke="currentColor"
                        strokeWidth="2"
                    ></path>
                </svg>

                <svg
                    aria-label="Comment"
                    color=""
                    fill=""
                    height="20"
                    role="img"
                    viewBox="0 0 24 24"
                    width="20"
                    cursor={"pointer"}
                    onClick={onOpen}
                >
                    <title>Comment</title>
                    <path
                        d="M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z"
                        fill="none"
                        stroke="currentColor"
                        strokeLinejoin="round"
                        strokeWidth="2"
                    ></path>
                </svg>

                <RepostComponent></RepostComponent>
                <ShareComponent></ShareComponent>
            </Flex>
            <Flex gap={2} alignItems={"center"}>
                <Text color={"gray.light"} fontSize="sm">
                    {post.likes.length} likes
                </Text>

                <Box w={0.5} h={0.5} borderRadius={"full"} bg={"gray.light"}></Box>
                <Text color={"gray.light"} fontSize="sm">
                    {post.replies.length} replies
                </Text>
            </Flex>
            <Modal
                closeOnOverlayClick={false}
                isOpen={isOpen}
                onClose={() => {
                    setCommentText("");
                    return onClose();
                }}
                isCentered
            >
                <ModalOverlay />
                <ModalContent bg={useColorModeValue("gray.200", "gray.dark")} m={2}>
                    <ModalHeader>Add a comment</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <FormControl>
                            <Textarea
                                placeholder="Your commnet to the yapp goes here..."
                                onChange={handleCommentTextChange}
                                value={commentText}
                            ></Textarea>
                            <Text fontSize="xs" fontWeight="bold" textAlign="right" color={"gray.light"} m={"1"}>
                                500
                            </Text>
                        </FormControl>
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={handleAddComment} isLoading={isPosting}>
                            Comment
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Flex>
    );
};

export default Actions;

const RepostComponent = () => {
    return (
        <svg aria-label="Repost" color="currentColor" fill="currentColor" height="20" role="img" viewBox="0 0 24 24" width="20">
            <title>Repost</title>
            <path
                fill=""
                d="M19.998 9.497a1 1 0 0 0-1 1v4.228a3.274 3.274 0 0 1-3.27 3.27h-5.313l1.791-1.787a1 1 0 0 0-1.412-1.416L7.29 18.287a1.004 1.004 0 0 0-.294.707v.001c0 .023.012.042.013.065a.923.923 0 0 0 .281.643l3.502 3.504a1 1 0 0 0 1.414-1.414l-1.797-1.798h5.318a5.276 5.276 0 0 0 5.27-5.27v-4.228a1 1 0 0 0-1-1Zm-6.41-3.496-1.795 1.795a1 1 0 1 0 1.414 1.414l3.5-3.5a1.003 1.003 0 0 0 0-1.417l-3.5-3.5a1 1 0 0 0-1.414 1.414l1.794 1.794H8.27A5.277 5.277 0 0 0 3 9.271V13.5a1 1 0 0 0 2 0V9.271a3.275 3.275 0 0 1 3.271-3.27Z"
            ></path>
        </svg>
    );
};

// share svg component
const ShareComponent = () => {
    return (
        <svg aria-label="Share" color="" fill="rgb(243, 245, 247)" height="20" role="img" viewBox="0 0 24 24" width="20">
            <title>Share</title>
            <line
                fill="none"
                stroke="currentColor"
                strokeLinejoin="round"
                strokeWidth="2"
                x1="22"
                x2="9.218"
                y1="3"
                y2="10.083"
            ></line>
            <polygon
                fill="none"
                points="11.698 20.334 22 3.001 2 3.001 9.218 10.084 11.698 20.334"
                stroke="currentColor"
                strokeLinejoin="round"
                strokeWidth="2"
            ></polygon>
        </svg>
    );
};
