import {
    Flex,
    Box,
    FormControl,
    FormLabel,
    Input,
    InputGroup,
    HStack,
    InputRightElement,
    Stack,
    Button,
    Heading,
    Text,
    useColorModeValue,
    Link,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";

import { useSetRecoilState } from "recoil";
import { authScreenAtom } from "../atoms/authAtom";
import userAtom from "../atoms/userAtom";
import useShowToast from "../../hooks/useShowToast";

const SignupCard = () => {
    const [showPassword, setShowPassword] = useState(false);
    const setAuthScreenAtomValue = useSetRecoilState(authScreenAtom);
    const setUserAtomValue = useSetRecoilState(userAtom);
    const [loading, setLoading] = useState(false);
    const [signUpData, setSignUpData] = useState({
        name: "",
        username: "",
        email: "",
        password: "",
    });

    const customToast = useShowToast();

    const handleSignUp = async () => {
        if (loading) {
            return;
        }
        try {
            setLoading(true);
            const res = await fetch(`${import.meta.env.VITE_BASE_URI}/users/signup`, {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                },

                credentials: "include",
                body: JSON.stringify(signUpData),
            });

            const data = await res.json();

            if (data.error) {
                customToast("Error", data.error, "error");
                return;
            }

            if (data.message) {
                customToast("Success", data.message, "success");
            }

            localStorage.setItem("user-threads", JSON.stringify(data));
            setUserAtomValue(data);
        } catch (error) {
            customToast("Error", error.message, "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Flex align={"center"} justify={"center"}>
            <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
                <Stack align={"center"}>
                    <Heading fontSize={"4xl"} textAlign={"center"}>
                        Sign up
                    </Heading>
                </Stack>
                <Box rounded={"lg"} bg={useColorModeValue("white", "gray.dark")} boxShadow={"lg"} p={8}>
                    <Stack spacing={4}>
                        <HStack>
                            <Box>
                                <FormControl isRequired>
                                    <FormLabel>Full Name</FormLabel>
                                    <Input
                                        type="text"
                                        value={signUpData.name}
                                        onChange={(e) =>
                                            setSignUpData((prev) => {
                                                return {
                                                    ...prev,
                                                    name: e.target.value,
                                                };
                                            })
                                        }
                                    />
                                </FormControl>
                            </Box>
                            <Box>
                                <FormControl isRequired>
                                    <FormLabel>Username</FormLabel>
                                    <Input
                                        type="text"
                                        value={signUpData.username}
                                        onChange={(e) =>
                                            setSignUpData((prev) => {
                                                return {
                                                    ...prev,
                                                    username: e.target.value,
                                                };
                                            })
                                        }
                                    />
                                </FormControl>
                            </Box>
                        </HStack>
                        <FormControl isRequired>
                            <FormLabel>Email address</FormLabel>
                            <Input
                                type="email"
                                value={signUpData.email}
                                onChange={(e) =>
                                    setSignUpData((prev) => {
                                        return {
                                            ...prev,
                                            email: e.target.value,
                                        };
                                    })
                                }
                            />
                        </FormControl>
                        <FormControl isRequired>
                            <FormLabel>Password</FormLabel>
                            <InputGroup>
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    value={signUpData.password}
                                    onChange={(e) =>
                                        setSignUpData((prev) => {
                                            return {
                                                ...prev,
                                                password: e.target.value,
                                            };
                                        })
                                    }
                                />
                                <InputRightElement h={"full"}>
                                    <Button variant={"ghost"} onClick={() => setShowPassword((showPassword) => !showPassword)}>
                                        {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                                    </Button>
                                </InputRightElement>
                            </InputGroup>
                        </FormControl>
                        <Stack spacing={10} pt={2}>
                            <Button
                                loadingText="Signing Up..."
                                size="lg"
                                bg={useColorModeValue("gray.600", "gray.700")}
                                color={"white"}
                                _hover={{
                                    bg: useColorModeValue("gray.700", "gray.800"),
                                }}
                                onClick={handleSignUp}
                                isLoading={loading}
                            >
                                Sign up
                            </Button>
                        </Stack>
                        <Stack pt={6}>
                            <Text align={"center"}>
                                Already a user?{" "}
                                <Link
                                    color={"blue.400"}
                                    onClick={() => {
                                        setAuthScreenAtomValue("login");
                                    }}
                                >
                                    Login
                                </Link>
                            </Text>
                        </Stack>
                    </Stack>
                </Box>
            </Stack>
        </Flex>
    );
};

export default SignupCard;
