const express = require("express")
const router = express.Router()
const { addUser, getUsers, updateUser, getUser, deleteUser, login } = require("./userService")
const { userValidaiton } = require('../middleware/validation')
const { authenticated } = require("../middleware/authentication")


router.post('/', userValidaiton, addUser)
router.get('/', getUsers)
router.get('/:id', authenticated, getUser)
router.put('/:id', authenticated, userValidaiton, updateUser)
router.delete('/:id', authenticated, deleteUser)
router.post('/login', userValidaiton, login)

module.exports = router