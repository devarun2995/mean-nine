const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const postsRouter = require('./routes/posts');
const userRouter = require('./routes/user');
const mongoose = require('mongoose');
const app = express();
mongoose.connect('mongodb+srv://arun_user:'+ process.env.MONGO_ATLAS_PW +'@cluster0-9pukn.mongodb.net/angular-node?retryWrites=true&w=majority')
.then(() => {
  console.log('Connection Successful');
}).catch(() =>{
  console.log('Connection Failure');
});
app.use("/images", express.static(path.join("backend/images")));
app.use(bodyParser.json());
app.use((req, res, next) =>{
  res.setHeader("Access-Control-Allow-Origin","*");
  res.setHeader("Access-Control-Allow-Headers","Origin, X-Requested-Width, Content-Type, Accept, Authorization");
  res.setHeader("Access-Control-Allow-Methods","GET, POST, PATCH, PUT, DELETE, OPTIONS");
  next();
});

app.use("/api/posts",postsRouter);
app.use("/api/user",userRouter);
module.exports = app;
