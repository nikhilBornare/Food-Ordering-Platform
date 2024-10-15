
export const generateVerificationToken = (length = 6) => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let verificationToken = "";

    for (let i = 0; i < length; i++) {
        verificationToken += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return verificationToken;
}