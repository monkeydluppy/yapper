import {
    Avatar,
    Box,
    Button,
    Flex,
    Link as ChakraLink,
    Link,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Portal,
    Text,
    VStack,
    useColorModeValue,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { BsInstagram } from "react-icons/bs";
import { CgMoreO } from "react-icons/cg";
import useShowToast from "../../hooks/useShowToast";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { Link as ReactRouterLink, useNavigate } from "react-router-dom";
import useFollowUnfollow from "../../hooks/useFollowUnfollow";

const UserHeader = ({ user, postOrder, setPostOrder }) => {
    const customToast = useShowToast();

    const loggedInUser = useRecoilValue(userAtom);

    const navigate = useNavigate();

    const copyUrl = () => {
        const currentUrl = window.location.href;
        navigator.clipboard.writeText(currentUrl).then(() => {
            customToast("Success", "Profile URL copied", "success");
        });
    };

    {
    }

    const { handleFollowUnfollow, updating, following } = useFollowUnfollow(user);

    return (
        <VStack alignItems={"start"}>
            <Flex justifyContent={"space-between"} w={"full"}>
                <Box>
                    <Text fontSize={"2xl"} fontWeight={700}>
                        {user.name}
                    </Text>
                    <Flex gap={2} alignItems={"center"}>
                        <Text fontSize={"sm"}>{user.username}</Text>
                        <Text
                            fontSize={"xs"}
                            bg={useColorModeValue("gray.200", "gray.dark")}
                            color={useColorModeValue("gray.dark", "gray.200")}
                            p={1}
                            borderRadius={"full"}
                        >
                            thread.net
                        </Text>
                    </Flex>
                </Box>
                <Box>
                    <Avatar
                        name={user.name}
                        src={user.profilePic ? user.profilePic : "https://bit.ly/broken-link"}
                        size={{
                            base: "md",
                            md: "xl",
                        }}
                    ></Avatar>
                </Box>
            </Flex>
            <Text color={!user.bio && "gray.light"} opacity={!user.bio && 0.5} mb={3}>
                {user.bio ? user.bio : "Yapper has no bio yet !!"}{" "}
            </Text>

            {loggedInUser?._id === user._id ? (
                <ChakraLink as={ReactRouterLink} to="/profile/update">
                    <Button size={"sm"}>Update Profile</Button>
                </ChakraLink>
            ) : (
                <ChakraLink as={ReactRouterLink}>
                    <Button size={"sm"} onClick={handleFollowUnfollow} isLoading={updating}>
                        {following ? "Unfollow" : "Follow"}
                    </Button>
                </ChakraLink>
            )}
            <Flex w={"full"} justifyContent={"space-between"}>
                <Flex gap={2} alignItems={"center"}>
                    <Text color={"gray.light"}>{user.followers.length} followers</Text>
                    <Box w={1} h={1} bg={"gray.light"} borderRadius={"full"}></Box>
                    <Link color={"gray.light"}>instagram.com</Link>
                </Flex>
                <Flex>
                    <Box className="icon-container">
                        <BsInstagram size={24} cursor={"pointer"}></BsInstagram>
                    </Box>
                    <Box className="icon-container">
                        <Menu>
                            <MenuButton>
                                <CgMoreO size={24} cursor={"pointer"}></CgMoreO>
                            </MenuButton>
                            <Portal>
                                <MenuList bg={"gray.dark"} color={"gray.light"}>
                                    <MenuItem onClick={copyUrl}>Copy Link</MenuItem>
                                </MenuList>
                            </Portal>
                        </Menu>
                    </Box>
                </Flex>
            </Flex>
            <Flex w={"full"}>
                <Flex
                    flex={1}
                    borderBottom={postOrder === "accending" ? "1.5px solid" : "1.5px solid gray"}
                    borderColor={postOrder === "accending" ? useColorModeValue("black", "white") : "gray.light"}
                    justifyContent={"center"}
                    pb={3}
                    cursor={"pointer"}
                    color={postOrder === "accending" ? "white" : "gray.light"}
                    onClick={() => setPostOrder("accending")}
                >
                    <Text fontWeight={700}>Yapps</Text>
                </Flex>
                <Flex
                    flex={1}
                    borderBottom={postOrder === "decending" ? "1.5px solid" : "1.5px solid gray"}
                    borderColor={postOrder === "decending" ? useColorModeValue("black", "white") : "gray.light"}
                    justifyContent={"center"}
                    pb={3}
                    cursor={"pointer"}
                    color={postOrder === "decending" ? "white" : "gray.light"}
                    onClick={() => setPostOrder("decending")}
                >
                    <Text>Old Yapps</Text>
                </Flex>
            </Flex>
        </VStack>
    );
};

export default UserHeader;
