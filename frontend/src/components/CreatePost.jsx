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
    Input,
    Flex,
    Image,
    CloseButton,
    Img,
    Box,
    Spinner,
} from "@chakra-ui/react";

import React, { useRef, useState } from "react";
import { BsFillImageFill } from "react-icons/bs";
import usePreviewImage from "../../hooks/usePreviewImage";
import useShowToast from "../../hooks/useShowToast";
import { useRecoilValue, useSetRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import allPostAtom from "../atoms/allPostAtom";
import { useLocation } from "react-router-dom";
import { FaPlus } from "react-icons/fa";

const MAX_CHAR = 500;

const CreatePost = ({ text }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    const [remainingLetters, setRemainingLetters] = useState(MAX_CHAR);

    const { handleImageChange, imageUrl, setImageUrl } = usePreviewImage("");

    const [posting, setPosting] = useState(false);

    const currentLoggedInUser = useRecoilValue(userAtom);

    const imageRef = useRef(null);

    const [postText, setPostText] = useState("");

    const setAllPostAtomValue = useSetRecoilState(allPostAtom);

    const pathLocation = useLocation();
    const username = pathLocation.pathname.split("/")[1];

    const customToast = useShowToast();

    function handlePostTextChange(event) {
        const inputText = event.target.value;
        if (inputText.length > MAX_CHAR) {
            const restrictText = inputText.slice(0, MAX_CHAR);
            setPostText(() => {
                return restrictText;
            });
            setRemainingLetters(0);
        } else {
            setPostText(() => {
                return inputText;
            });
            setRemainingLetters(() => MAX_CHAR - inputText.length);
        }
    }

    const handleCreatePost = async () => {
        if (posting) {
            return;
        }
        try {
            setPosting(true);
            const res = await fetch(`${import.meta.env.VITE_BASE_URI}/posts/create`, {
                method: "post",
                headers: {
                    "Content-type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ postedBy: currentLoggedInUser._id, text: postText, img: imageUrl }),
            });

            const data = await res.json();

            if (data.error) {
                customToast("Error", data.error, "error");
                return;
            }

            setPostText(() => "");
            setImageUrl(() => "");

            onClose();
            if (username === currentLoggedInUser.username || pathLocation.pathname === "/") {
                setAllPostAtomValue((prev) => {
                    return [data, ...prev];
                });
            }
            customToast("Success", data.message, "success");
        } catch (error) {
            customToast("Error", error.message, "error");
        } finally {
            setPosting(false);
        }
    };

    if (posting) {
        return (
            <Box
                w={"100vw"}
                height={"100vh"}
                bg={useColorModeValue("#ffffff", "#101010")}
                pos={"fixed"}
                top={0}
                left={0}
                zIndex={"1111"}
                display={"flex"}
                justifyContent={"center"}
                alignItems={"center"}
            >
                <Spinner width={69} height={69}></Spinner>
            </Box>
        );
    }

    return (
        <>
            {text ? (
                <Button
                    position={"fixed"}
                    bottom={10}
                    right={10}
                    onClick={onOpen}
                    display={{
                        base: "none",
                        lg: "flex",
                    }}
                >
                    <Text mr={2}>Post</Text>
                    <FaPlus size={18} />
                </Button>
            ) : (
                <Button
                    onClick={onOpen}
                    bg={"transparent"}
                    p={0}
                    minW={"fit-content"}
                    _focus={{ bg: "transparent" }}
                    _hover={{ bg: "transparent" }}
                    _active={{ bg: "transparent" }}
                    display={{
                        base: "flex",
                        lg: "none",
                    }}
                >
                    <FaPlus size={18} />
                </Button>
            )}

            <Modal
                closeOnOverlayClick={false}
                isOpen={isOpen}
                onClose={() => {
                    setImageUrl("");
                    setPostText("");
                    return onClose();
                }}
                isCentered
            >
                <ModalOverlay />
                <ModalContent bg={useColorModeValue("gray.200", "gray.dark")} m={2}>
                    <ModalHeader>Create Post</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody pb={6}>
                        <FormControl>
                            {imageUrl && (
                                <Flex mb={5} w={"full"} position={"relative"}>
                                    <Image src={imageUrl}></Image>
                                    <CloseButton
                                        onClick={() => setImageUrl("")}
                                        position={"absolute"}
                                        right={2}
                                        top={2}
                                        bg={useColorModeValue("gray.light", "gray.dark")}
                                    ></CloseButton>
                                </Flex>
                            )}
                            <Textarea
                                placeholder="Your yapping goes here..."
                                onChange={handlePostTextChange}
                                value={postText}
                            ></Textarea>
                            <Text fontSize="xs" fontWeight="bold" textAlign="right" color={"gray.light"} m={"1"}>
                                {remainingLetters}/500
                            </Text>
                            <Input type="file" hidden ref={imageRef} onChange={handleImageChange} accept="image/*"></Input>
                            <Flex
                                alignItems={"center"}
                                gap={2}
                                onClick={() => imageRef.current.click()}
                                w={"fit-content"}
                                ml={"5px"}
                                cursor={"pointer"}
                            >
                                <BsFillImageFill size={16}></BsFillImageFill> <Text fontSize="xs">Add Image</Text>
                            </Flex>
                        </FormControl>
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={handleCreatePost} isLoading={posting}>
                            Post
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
};

export default CreatePost;
