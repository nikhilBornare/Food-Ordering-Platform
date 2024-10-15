import jwt from "jsonwebtoken";

export const isAuthenticated = async (req, res, next) => {
    try {
        const accessToken = req.cookies.accessToken;
        if (!accessToken) {
            return res.status(401).json({ message: "User not authenticated" });
        }
        const decoded = jwt.verify(accessToken, process.env.TOKEN_SECRET);
        if (!decoded) {
            return res.status(401).json({ message: "Access Token Expired" });
        }
        req.userId = decoded.userId;
        next();
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
        
    }
 }