const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const UserModel = require("../Users/model");
const CONFIG = require("../Configurations/config");
const AuthenticationModel = require("./model");
const { default: mongoose } = require("mongoose");

const loginAccount = async (req) => {

	const { email, password } = req.body;

	const existUser = await UserModel.findOne({ email });

	if (!existUser) throw new Error("User not exist");

	const verifyPassword = await bcrypt.compare(password, existUser.password);

	if (!verifyPassword) throw new Error("Invalid password");

	const tokenId =new mongoose.Types.ObjectId();

	const accessToken = jwt.sign({ id: existUser._id, tokenId, type: "access-token" }, CONFIG.secretkey, { expiresIn: CONFIG.jwtExpiresForAcessToken });

	const refreshToken = jwt.sign({ id: existUser._id, tokenId, type: "refresh-token" }, CONFIG.secretkey, { expiresIn: CONFIG.jwtExpiresForRefreshToken });

	const authAcessTokenData = {
		userId: existUser._id,
		tokenId,
		token: accessToken,
		type: "access-token"
	}

	const authRefreshTokenData = {
		userId: existUser._id,
		tokenId,
		token: refreshToken,
		type: "refresh-token"
	}

	await AuthenticationModel.insertMany([authAcessTokenData, authRefreshTokenData]);

	return { message: "LOGGED IN ", accessToken, refreshToken }
}

const logoutAccount = async (req) => {

	const user = req.user;

	await AuthenticationModel.deleteMany({ tokenId: user.tokenId });

	return { message: "LOGGED OUT sucessfully " }
}

module.exports = {
	loginAccount,
	logoutAccount
}