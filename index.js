const bcrypt = require('bcrypt');
const express = require('express');
const path = require('path');
const mongoose = require('mongoose')

const socketIo = require('socket.io');
const fs = require('fs');


const User = require('./models/user')
const app = express();
const server = require('http').createServer(app);
const io = socketIo(server);
const session = require('express-session');

app.set('view engine', 'ejs');
app.set('views' , 'views')
app.use(express.static(path.join(__dirname , 'public')));
app.use(express.urlencoded({extended : true})); 
app.use(session({secret: 'itisasectretyadodo'}))

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });

    socket.on('image', (dataURL) => {
        // Save the image to a file (optional)
        // const imageBuffer = Buffer.from(dataURL, 'base64');
        // const imagePath = path.join(__dirname, 'public', `image_${Date.now()}.png`);
        // fs.writeFileSync(imagePath, imageBuffer, 'base64');

        // Broadcast the image data to all connected clients
        // console.log(dataURL)
        socket.broadcast.emit('image', dataURL);
    });
});



mongoose.connect('mongodb://localhost:27017/crypto' , {
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});


app.get('/' , (req,res) => {
    if (req.session.user_id){
        res.render('cwebrtc')
    }
    else {
    res.render("login") }
})

app.post('/logout' , (req,res) => {
    req.session.user_id = null;
    res.redirect('/')
})

const saltRounds = 12;
app.post('/register' , async (req,res) => {
    const {password , username} = req.body;
    const hash = await bcrypt.hash(password , saltRounds) ;
    const user = new User({
        username,
        password : hash
    })
    await user.save();
    req.session.user_id = user._id;
    res.redirect('/')
})

app.get('/register' , (req,res) => {
    res.render('cregister')
})

app.post('/login' , async (req,res) => {
    console.log("hello world")
    const {username , password} = req.body;
    const user = await User.find({username : username});
    const validpassword = await bcrypt.compare(password , user[0].password);

    if(validpassword){
        req.session.user_id = user[0]._id;
        res.redirect('/')
    }
    else{
        res.render('cregister')
    }
})

server.listen(3000, () => {
    console.log('Serving on port 3000')
})