const AuthenticationModel = require("../Authentications/model");
const CONFIG = require("../Configurations/config");
const jwt = require("jsonwebtoken");

const authorizeRoute = async (req, res, next) => {
    try {
        let token = req.headers['authorization'];

        if (token) {
            token = token.split(" ")[1];
            if (!token) throw(new Error("Acess Denied"));

            const tokenPayload = jwt.verify(token, CONFIG.secretkey);

            const validToken = await AuthenticationModel.findOne({ userId: tokenPayload.id, tokenId: tokenPayload.tokenId, type: "access-token" }).lean();

            if (!validToken) throw(new Error("Acess Denied"));

            if (validToken.token !== token) throw(new Error("Acess Denied"));

            req.user = tokenPayload;

            next();
        } else throw(new Error("Acess Denied"));
        }
         catch (error) {
            next(error)
        }
    };

    const isAdminUser = (req, res, next) => {
        if (req.user.role !== "ADMIN") throw new Error("Only Admin can access");
        next();
    }

    module.exports = {
        authorizeRoute,
        isAdminUser
    }