const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');

const AuthRouter = require('./Routes/auth-router');
const UserRouter = require('./Routes/user-router');
const PostRouter = require('./Routes/post-router');
const CommentRouter = require('./Routes/comment-router');
const CategoriesRouter = require('./Routes/categories-router');


const PORT = process.env.PORT || 3001;
const CLIENT_URL = 'http://localhost:3000';

const app = express();

app.use(express.json({extended:true}));
app.use(cookieParser());

app.use(cors({
    credentials: true,
    origin: CLIENT_URL,
    methods:["GET" , "POST" , "PATCH", "DELETE"],
    optionSuccessStatus:200
    
}));

app.use('/avatars', express.static(path.join(__dirname, 'avatars')));

app.use('/api/auth', AuthRouter);
app.use('/api/users', UserRouter);
app.use('/api/posts', PostRouter);
app.use('/api/comments', CommentRouter);
app.use('/api/categories', CategoriesRouter);


app.listen(PORT, () => {console.log(`Server start on http://localhost:${PORT}`)});
