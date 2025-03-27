import jwt from "jsonwebtoken";

const generateCookieAndSave = (userId, res) => {
    const cookie = jwt.sign({ userId: userId }, process.env.JWT_SECRET, {
        expiresIn: "15d",
    });

    res.cookie("jwtcookie", cookie, {
        httpOnly: true,
        maxAge: 15 * 24 * 60 * 60 * 1000,
        sameSite: "none",
        secure: true,

        // NOTE: MOST IMPORTANT OPTION TO RUN INVERCEL
        // sameSite: "none", 
        // secure: true,
        // THESE TWO OPTIONS SHOULD BE LIKE THIS ALWAYS ON DEPLOYMNT, SECURE TRUE IS IMPORTANT TOO

    })
    console.log("cookie created and saved")



    return cookie;
}

export default generateCookieAndSave;