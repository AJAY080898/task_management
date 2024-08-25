const bcrypt = require("bcrypt");
const UserModel = require("./model");
const { getAccesstoken } = require("../Authentications/service");

const createNewUser = async (req) => {
    try {
        const { name, email, password } = req.body

        const emailExist = await UserModel.findOne({ email: email }).lean();
        if (emailExist) throw new Error("Email Already Exists");

        const salt = await bcrypt.genSalt(10);

        const hashedPassword = await bcrypt.hash(password, salt);

        const newData = {
            name,
            email,
            password: hashedPassword
        }

        const User = new UserModel(newData)

        const savedData = await User.save();

        const { accessToken, refreshToken } = await getAccesstoken(savedData);

        return { message: "User created sucessfully", data: { accessToken, refreshToken } }
    } catch (error) {
        throw (error);
    }

}

const getUserProfileByUserId = async (req) => {
    try {
        const { userId } = req.params;

        const user = await UserModel.findOne({ _id: userId }).select("name role email").lean();

        if (!user) throw new Error("User not Exit");

        return { message: "success", data: user }
    } catch (error) {
        throw (error);
    }

}

const updateUserRole = async (req) => {
    try {
        const { userId } = req.params;

        const { role } = req.body;

        const user = await UserModel.findOneAndUpdate({ _id: userId }, { role }, { new: true }).select("name role email").lean();

        if (!user) throw new Error("User not Exit");

        return { message: "success", data: user }
    } catch (error) {
        throw (error);
    }

}

const getUserListForAdmin = async (req) => {
    try {
        const { id } = req.user;

        const users = await UserModel.find({ _id: { $ne: id } }).select("name role email").lean();

        return { message: "Success", data: users }
    } catch (error) {
        throw (error);
    }

}

module.exports = {
    createNewUser,
    getUserListForAdmin,
    getUserProfileByUserId,
    updateUserRole
}