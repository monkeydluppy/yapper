import { Avatar, Box, Flex, Text } from "@chakra-ui/react";
import React from "react";
import { Link } from "react-router-dom";

const SearchedUser = ({ user, index, lastUser }) => {
    console.log(index, lastUser);
    return (
        <Flex
            gap={2}
            justifyContent={"space-between"}
            alignItems={"center"}
            p={"16px"}
            borderBottom={!(index === lastUser) ? "1px solid" : "none"}
            borderColor={!(index === lastUser) ? "gray.light" : "none"}
            w={"full"}
            backdropFilter={"blur(25px)"}
        >
            <Flex gap={2} as={Link} to={`${user?.username}`} w={"100%"} alignItems={"center"}>
                <Avatar name={user.name} src={user?.profilePic} />
                <Box flex={"2"}>
                    <Text fontSize={"sm"} fontWeight={"bold"}>
                        {user?.username}
                    </Text>
                    <Text color={"gray.light"} fontSize={"sm"}>
                        {user?.name}
                    </Text>
                </Box>
            </Flex>
        </Flex>
    );
};

export default SearchedUser;
