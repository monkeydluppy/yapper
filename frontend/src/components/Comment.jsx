import { Avatar, Divider, Flex, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import Actions from "./Actions";
import { useNavigate } from "react-router-dom";

const Comment = ({ reply, lastReply }) => {
    const navigate = useNavigate();
    return (
        <>
            <Flex gap={4} py={2} my={4} w={"full"} onClick={() => navigate(`/${reply.username}`)} cursor={"pointer"}>
                <Avatar
                    name={reply.username}
                    src={reply.userProfilePic ? reply.userProfilePic : "https://bit.ly/broken-link"}
                    size={"sm"}
                ></Avatar>
                <Flex gap={1} w={"full"} flexDirection={"column"}>
                    <Flex w={"full"} justifyContent={"space-between"} alignItems={"center"}>
                        <Text fontSize={"sm"} fontWeight={700}>
                            {reply.username}
                        </Text>
                        {/* <Flex gap={2} alignItems={"center"}>
                            <Text fontSize={"sm"} color={"gray.light"}>
                                {createdAt}
                            </Text>
                            <BsThreeDots></BsThreeDots>
                        </Flex> */}
                    </Flex>
                    <Text>{reply.text}</Text>
                </Flex>
            </Flex>
            {!lastReply ? <Divider my={4}></Divider> : null}
        </>
    );
};

export default Comment;
