const AuthenticationModel = require("../Authentications/model");
const CONFIG = require("../Configurations/config");
const jwt = require("jsonwebtoken");

const authorizeRoute = async (req, res, next) => {
    let token = req.headers['authorization'];

    if (token) {
        token = token.split(" ")[1];
        if (!token) return next(new Error("Acess Denied"));

        const tokenPayload = jwt.verify(token, CONFIG.secretkey);

        const validToken = await AuthenticationModel.findOne({ userId: tokenPayload.id, tokenId: tokenPayload.tokenId, type: "access-token" }).lean();

        if (!validToken ) return next(new Error("Acess Denied"));

        if (validToken.token !== token) return next(new Error("Acess Denied"));

        req.user = tokenPayload;

        next()
    } else next(new Error("Acess Denied"));
};

module.exports = {
    authorizeRoute
}