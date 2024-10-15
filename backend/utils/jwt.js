import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
dotenv.config();

export const generateTokens = (userId) => {
    const refreshToken = jwt.sign({ userId }, process.env.TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRS_IN });
    const accessToken = jwt.sign({ userId }, process.env.TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRS_IN });
    const newRefreshToken = refreshToken;
    return { refreshToken, accessToken , newRefreshToken };
}