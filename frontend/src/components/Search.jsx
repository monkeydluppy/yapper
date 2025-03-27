import {
    border,
    Box,
    Button,
    Flex,
    FormControl,
    FormLabel,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Spinner,
    Text,
    Textarea,
    useColorModeValue,
    useDisclosure,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { CiSearch } from "react-icons/ci";
import useShowToast from "../../hooks/useShowToast";
import SearchedUser from "./SearchedUser";

const Search = () => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [searchedQuerry, setSearchedQuerry] = useState("");

    const [searchResult, setSearchResult] = useState([]);

    const [searching, setSearching] = useState(false);

    const customToast = useShowToast();

    const handleSearch = async (event) => {
        event.preventDefault();
        const value = event.target.value;
        setSearchedQuerry(() => value);
        if (value.length < 3) {
            return;
        }
        try {
            setSearching(true);
            const res = await fetch(`${import.meta.env.VITE_BASE_URI}/users/search/${searchedQuerry}`, {
                method: "get",
                headers: {
                    "content-Type": "application/json",
                },
                credentials: "include",
            });

            const data = await res.json();
            if (data.error) {
                console.log(data.error);
                return;
            }
            setSearchResult(() => data);
            console.log(data);
        } catch (error) {
            customToast("Error", error.message, "error");
        } finally {
            setSearching(false);
        }
    };

    return (
        <div>
            <CiSearch cursor={"pointer"} size={24} onClick={onOpen} />
            <Modal
                isOpen={isOpen}
                size={"xl"}
                onClose={() => {
                    setSearchedQuerry("");
                    return onClose();
                }}
            >
                <ModalOverlay />
                <ModalContent my={24} bg={"transparent"} boxShadow={"none"} mx={2}>
                    <ModalBody p={0}>
                        <FormControl>
                            <Flex
                                bg={useColorModeValue("rgba(229, 231, 235, 0.6)", "rgba(34, 34, 34, 0.6)")}
                                border={"1px solid"}
                                borderColor={"gray.light"}
                                gap={3}
                                alignItems={"center"}
                                py={1}
                                px={4}
                                rounded={8}
                            >
                                <FormLabel m={0}>
                                    <CiSearch cursor={"pointer"} size={24} />
                                </FormLabel>
                                <Input
                                    placeholder="Search for yapper..."
                                    onChange={handleSearch}
                                    value={searchedQuerry}
                                    flex={2}
                                    border={"none"}
                                    _focus={{
                                        border: "none",
                                        boxShadow: "none",
                                    }}
                                ></Input>
                            </Flex>
                        </FormControl>
                    </ModalBody>

                    {searchedQuerry.length > 2 && (
                        <ModalFooter
                            p={0}
                            mt={6}
                            rounded={6}
                            maxH={"350px"}
                            overflowX={"hidden"}
                            overflowY={"auto"}
                            justifyContent={"center"}
                            alignItems={"center"}
                            bg={useColorModeValue("rgba(229, 231, 235, 0.6)", "rgba(34, 34, 34, 0.6)")}
                            minH={"75px"}
                            onClick={() => {
                                setSearchedQuerry("");
                                onClose();
                            }}
                        >
                            <Flex flexDirection={"column"} width={"100%"}>
                                {searching ? (
                                    <Box py={0} display={"flex"} justifyContent={"center"} alignItems={"center"}>
                                        <Spinner width={39} height={39}></Spinner>
                                    </Box>
                                ) : searchResult.length > 0 ? (
                                    searchResult.map((user, index) => {
                                        return (
                                            <SearchedUser
                                                user={user}
                                                index={index}
                                                lastUser={searchResult.length - 1}
                                            ></SearchedUser>
                                        );
                                    })
                                ) : (
                                    <Text textAlign={"center"}>No user</Text>
                                )}
                            </Flex>
                        </ModalFooter>
                    )}
                </ModalContent>
            </Modal>
        </div>
    );
};

export default Search;
