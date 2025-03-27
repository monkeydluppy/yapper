import { Box, Flex, Skeleton, SkeletonCircle, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import SuggestedUser from "./SuggestedUser";
import useShowToast from "../../hooks/useShowToast";

const SuggestedUsers = () => {
    const [loading, setLoading] = useState(true);
    const [suggestedUsers, setSuggestedUsers] = useState([]);

    const customToast = useShowToast();

    useEffect(() => {
        const getSuggestedUsers = async () => {
            try {
                setLoading(true);
                const res = await fetch(`${import.meta.env.VITE_BASE_URI}/users/suggestedUsers`, {
                    method: "get",
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
                setSuggestedUsers(data);
            } catch (error) {
            } finally {
                setLoading(false);
            }
        };
        getSuggestedUsers();
    }, [customToast]);

    return (
        <>
            <Text mb={4} fontWeight={"bold"}>
                Suggested Users
            </Text>
            <Flex direction={"column"} gap={4}>
                {!loading && suggestedUsers.length < 1 ? (
                    <Text textAlign={"center"} mb={7} color={"gray.light"} opacity={0.7}>
                        No more user left to suggest. You're following every yapper...
                    </Text>
                ) : (
                    suggestedUsers.map((user, index) => {
                        return <SuggestedUser key={`${user._id}${index}`} user={user}></SuggestedUser>;
                    })
                )}
                {loading &&
                    [...Array(7)].map((_, idx) => (
                        <Flex key={idx} gap={2} alignItems={"center"} p={"1"} borderRadius={"md"}>
                            {/* avatar skeleton */}
                            <Box>
                                <SkeletonCircle size={"10"} />
                            </Box>
                            {/* username and fullname skeleton */}
                            <Flex w={"full"} flexDirection={"column"} gap={2}>
                                <Skeleton h={"8px"} w={"80px"} />
                                <Skeleton h={"8px"} w={"90px"} />
                            </Flex>
                            {/* follow button skeleton */}
                            <Flex>
                                <Skeleton h={"20px"} w={"60px"} />
                            </Flex>
                        </Flex>
                    ))}
            </Flex>
        </>
    );
};

export default SuggestedUsers;
