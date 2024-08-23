const bcrypt = require("bcrypt");
const UserModel = require("./model");

const createNewUser = async (req) => {
    try {
        const { name, email, role, password } = req.body

        const emailExist = await UserModel.findOne({ email: email })
        if (emailExist) throw new Error("Email Already Exit");

        const salt = await bcrypt.genSalt(10);

        const hashedPassword = await bcrypt.hash(password, salt);

        const newData = {
            name,
            email,
            role,
            password: hashedPassword
        }

        const User = new UserModel(newData)

        await User.save();

        return { message: "User created sucessfully" }
    } catch (error) {
        throw (error);
    }

}


module.exports = {
    createNewUser
}