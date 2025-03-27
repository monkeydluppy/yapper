import { Box, Button, Container } from "@chakra-ui/react";
import { Navigate, Route, Routes, useLocation, useParams } from "react-router-dom";
import UserPage from "./pages/UserPage";
import PostPage from "./pages/PostPage";
import Header from "./components/Header";
import AuthPage from "./pages/AuthPage";
import { useRecoilValue } from "recoil";
import userAtom from "./atoms/userAtom";
import HomePage from "./pages/HomePage";
import LogoutButton from "./components/LogoutButton";
import UpdateProfilePage from "./pages/UpdateProfilePage";
import CreatePost from "./components/CreatePost";

function App() {
    const user = useRecoilValue(userAtom);

    const location = useLocation();
    const path = location.pathname;
    console.log(user);
    return (
        <Container maxW={`${path === "/" ? "992px" : "677px"}`}>
            <Header></Header>

            {user && <CreatePost text={true}></CreatePost>}

            <Routes>
                <Route path="/" element={user ? <HomePage></HomePage> : <Navigate to="/auth"></Navigate>}></Route>
                <Route path="/:username" element={<UserPage></UserPage>}></Route>

                <Route path="/:username/post/:postId" element={<PostPage></PostPage>}></Route>
                <Route path="/auth" element={user ? <Navigate to="/"></Navigate> : <AuthPage></AuthPage>}></Route>
                <Route
                    path="/profile/update"
                    element={user ? <UpdateProfilePage></UpdateProfilePage> : <Navigate to="/"></Navigate>}
                ></Route>
            </Routes>
        </Container>
    );
}

export default App;
