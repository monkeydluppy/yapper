import { Button, Flex, FormControl, FormLabel, Heading, Input, Stack, useColorModeValue, Avatar, Center } from "@chakra-ui/react";

import React, { useRef, useState } from "react";
import { useRecoilState } from "recoil";
import { useNavigate } from "react-router-dom";
import userAtom from "../atoms/userAtom";
import usePreviewImage from "../../hooks/usePreviewImage";
import useShowToast from "../../hooks/useShowToast";

const UpdateProfilePage = () => {
    const [userAtomValue, setUserAtomValue] = useRecoilState(userAtom);

    const [updating, setUpdating] = useState(false);

    const navigate = useNavigate();

    const [userDetails, setUserDeatails] = useState({
        name: userAtomValue.name,
        username: userAtomValue.username,
        email: userAtomValue.email,
        bio: userAtomValue.bio,
        password: "",
    });

    const selectFileRef = useRef(null);

    const { imageUrl, handleImageChange } = usePreviewImage();

    const customToast = useShowToast();

    const handleProfileUpdate = async (event) => {
        event.preventDefault();

        if (updating) {
            return;
        }

        try {
            setUpdating(true);
            const res = await fetch(`${import.meta.env.VITE_BASE_URI}/users/update/${userAtomValue._id}`, {
                method: "put",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ ...userDetails, profilePic: imageUrl }),
            });

            const data = await res.json();
            if (data.error) {
                customToast("Error", data.error, "error");
                return;
            }

            if (data.message) {
                customToast("Success", data.message, "success");
            }

            setUserAtomValue(data);
            localStorage.setItem("user-threads", JSON.stringify(data));

            navigate(`/${data.username}`);
        } catch (error) {
            customToast("Error", error.message, "error");
        } finally {
            setUpdating(false);
        }
    };

    return (
        <form onSubmit={handleProfileUpdate}>
            <Flex align={"center"} justify={"center"} my={5}>
                <Stack
                    spacing={4}
                    w={"full"}
                    maxW={"md"}
                    bg={useColorModeValue("white", "gray.dark")}
                    rounded={"xl"}
                    boxShadow={"lg"}
                    p={6}
                >
                    <Heading lineHeight={1.1} fontSize={{ base: "2xl", sm: "3xl" }}>
                        Edit Your Profile
                    </Heading>
                    <FormControl>
                        <Stack direction={["column", "row"]} spacing={6}>
                            <Center>
                                <Avatar size="xl" src={imageUrl || userAtomValue.profilePic}></Avatar>
                            </Center>
                            <Center w="full">
                                <Button w="full" onClick={(e) => selectFileRef.current.click()}>
                                    Change Avatar
                                </Button>
                                <Input
                                    ref={selectFileRef}
                                    type="file"
                                    placeholder="Choose File"
                                    accept="image/*"
                                    hidden
                                    onChange={(event) => handleImageChange(event)}
                                ></Input>
                            </Center>
                        </Stack>
                    </FormControl>
                    <FormControl isRequired>
                        <FormLabel>Full Name</FormLabel>
                        <Input
                            placeholder="Johnhoe Pandey"
                            _placeholder={{ color: "gray.500" }}
                            type="text"
                            value={userDetails.name}
                            onChange={(e) =>
                                setUserDeatails((prev) => {
                                    return {
                                        ...prev,
                                        name: e.target.value,
                                    };
                                })
                            }
                        />
                    </FormControl>
                    <FormControl isRequired>
                        <FormLabel>User name</FormLabel>
                        <Input
                            placeholder="johnhoe"
                            _placeholder={{ color: "gray.500" }}
                            type="text"
                            value={userDetails.username}
                            onChange={(e) =>
                                setUserDeatails((prev) => {
                                    return {
                                        ...prev,
                                        username: e.target.value,
                                    };
                                })
                            }
                        />
                    </FormControl>
                    <FormControl isRequired>
                        <FormLabel>Email address</FormLabel>
                        <Input
                            placeholder="johnhoe@gmail.com"
                            _placeholder={{ color: "gray.500" }}
                            type="email"
                            value={userDetails.email}
                            onChange={(e) =>
                                setUserDeatails((prev) => {
                                    return {
                                        ...prev,
                                        email: e.target.value,
                                    };
                                })
                            }
                        />
                    </FormControl>
                    <FormControl>
                        <FormLabel>Bio</FormLabel>
                        <Input
                            placeholder="Your Bio"
                            _placeholder={{ color: "gray.500" }}
                            type="text"
                            value={userDetails.bio}
                            onChange={(e) =>
                                setUserDeatails((prev) => {
                                    return {
                                        ...prev,
                                        bio: e.target.value,
                                    };
                                })
                            }
                        />
                    </FormControl>
                    <FormControl>
                        <FormLabel>Password</FormLabel>
                        <Input
                            placeholder="Password"
                            _placeholder={{ color: "gray.500" }}
                            type="password"
                            value={userDetails.password}
                            onChange={(e) =>
                                setUserDeatails((prev) => {
                                    return {
                                        ...prev,
                                        password: e.target.value,
                                    };
                                })
                            }
                        />
                    </FormControl>
                    <Stack spacing={6} direction={["column", "row"]}>
                        <Button
                            onClick={() => navigate(`/${userAtomValue.username}`)}
                            bg={"red.400"}
                            color={"white"}
                            w="full"
                            _hover={{
                                bg: "red.500",
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            bg={"blue.400"}
                            color={"white"}
                            w="full"
                            _hover={{
                                bg: "blue.500",
                            }}
                            type="submit"
                            isLoading={updating}
                        >
                            Submit
                        </Button>
                    </Stack>
                </Stack>
            </Flex>
        </form>
    );
};

export default UpdateProfilePage;
