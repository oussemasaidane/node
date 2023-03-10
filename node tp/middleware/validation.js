const { object, string, number } = require('yup');

let userSchema = object({
    username: string('username must be a string').required('username is required'),
    password: number('password must be a number').required('password is requierd')
});

const userValidaiton = async (req, res, next) => {
    try {
        await userSchema.validate(req.body)
        next();
    } catch (error) {
        return res.status(400).json(error.message)
    }

}


module.exports = {
    userValidaiton
}