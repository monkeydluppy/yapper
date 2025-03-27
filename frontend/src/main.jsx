import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { mode } from "@chakra-ui/theme-tools";
import { ChakraProvider, ColorModeScript, extendTheme } from "@chakra-ui/react";
import { BrowserRouter } from "react-router-dom";
import { RecoilRoot } from "recoil";
import "./index.css";
import { color } from "framer-motion";

const styles = {
    global: (props) => ({
        body: {
            color: mode("grey.800", "whiteAlpha.900")(props),
            bg: mode("grey.100", "#101010")(props),
        },
    }),
};

const config = {
    initialColorMode: "dark",
    useSystemColorMode: true,
};

const colors = {
    gray: {
        light: "#a3a3a3",
        dark: "#1e1e1e",
    },
};

const theme = extendTheme({ config, styles, colors });

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <RecoilRoot>
            <BrowserRouter>
                <ChakraProvider theme={theme}>
                    <ColorModeScript initialColorMode={theme.config.initialColorMode} />
                    <App />
                </ChakraProvider>
            </BrowserRouter>
        </RecoilRoot>
    </StrictMode>
);
