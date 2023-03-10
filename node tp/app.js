const express = require("express")
const mongoose = require("mongoose")
const mongoConfig = require("./config/mongoConfig.json")
const userRoutes = require("./users/controller")
const path = require("path");
const http = require("http");
const { chatRouter } = require('./controller/chatController')
require('dotenv').config()
const Chat = require('./models/Chat')

const app = express()

app.set('view engine', 'twig')
app.set("views", path.join(__dirname, "views"))
const PORT = 3000;
app.use(express.json())
app.use("/users", userRoutes)
app.use('/testChat', chatRouter)

const server = http.createServer(app);

const io = require('socket.io')(server)


mongoose.connect(mongoConfig.uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("DB connected");
}).catch(err => {
    console.log(err);
})

io.on("connection", function async(socket) {
    socket.emit("user-joined", "a new user is connected")
    socket.on('msg', async (data) => {
        io.emit("msg", data);
        const msg = new Chat({ message: data, date: new Date() });
        await msg.save();
    })
    socket.on('disconnect', () => {
        io.emit('user disonnected', 'user has disconnected')
    })

    socket.on('user typing', (data) => {
        io.emit('userTyping', data)
    })
});

server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
})

app.get('/chat', (req, res) => {
    return res.render('chat.twig')
})

