const User = require("./userModel")
const { createToken } = require("../service/tokenService");
const bcrypt = require("bcrypt");

const addUser = async (req, res) => {
    const { username, password } = req.body;
    let user = new User({ username, password });
    try {
        // const salt = await bcrypt.genSalt(10)
        // const hashedPassword = await bcrypt.hash(password, salt)
        // user.password = hashedPassword;

        user = await user.save();
        const token = await createToken(user);
        return res.status(201).json({ ...user, token })
    } catch (error) {
        return res.status(500).json({ msg: error.message });
    }
}

const getUsers = async (req, res) => {
    const users = await User.find({})
    return res.status(200).json(users)
}

const getUser = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findById(id);
        return res.status(200).json(user)
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }

}

const updateUser = async (req, res) => {
    const { username, password } = req.body;
    const { id } = req.params;

    try {
        const user = await User.findByIdAndUpdate(id, { username, password });
        return res.status(200).json({ message: 'updated successfully' });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findById(id);
        await user.delete();
        return res.status(200).json({ msessage: 'user deleted successfully' })
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

const login = async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username })
    // const isValid = await bcrypt.compare(password, user.password)
    // if (!isValid) {
    //     return res.status(400).json({ message: "bad credentials" })
    // }
    if (user.password !== password) {
        return res.status(400).json({ message: "invalid credentials" })
    }
    const token = await createToken(user);
    delete user.password;
    return res.status(200).json({ ...user, token })

}


module.exports = {
    getUsers,
    addUser,
    updateUser,
    getUser,
    deleteUser,
    login
}

