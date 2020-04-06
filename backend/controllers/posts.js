const Post = require('../models/post');

exports.createPost = (req, res, next) =>{
  const url = req.protocol + "://" + req.get("host");
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + "/images/" + req.file.filename,
    creator: req.userData.userId
  });
  post.save().then(createdPost =>{
    res.status(201).json({
      message:'Post Added Successfully',
      post:{
        ...createdPost,
        id: createdPost._id
      }
  });
  }).catch(error =>{
    res.status(500).json({
      message: 'Creating Post Failed!'
    });
  });
  };

  exports.getPosts = (req, res, next) =>{
    const pagesize = +req.query.pagesize;
    const currentPage = +req.query.page;
    const postQuery = Post.find();
    let fetchedPost;
    if(currentPage && pagesize){
      postQuery.skip(pagesize *(currentPage - 1)).limit(pagesize);
    }
    postQuery.then(documents =>{
     fetchedPost = documents;
     return Post.countDocuments();
    }).then(count =>{
      res.status(200).json({
        message: "Post Fetched Successfully",
        posts: fetchedPost,
        maxPosts: count
    });
  }).catch(error =>{
    res.status(500).json({
      message: 'Fetching of Posts Failed'
    });
  });
};
exports.getpost = (req, res, next) =>{
  Post.findById(req.params.id).then(post =>{
    if(post){
      res.status(200).json(post);
    }else{
      res.status(404).json({message: 'Post is not found!'});
      }
  }).catch(error =>{
    res.status(500).json({
      message: 'Fetching of Post Failed!'
    });
});
};

exports.updatePost = (req, res, next) =>{
  let imagePath = req.body.imagePath;
  if(req.file){
    const url = req.protocol + "://" + req.get("host");
    imagePath = url + "/images/" + req.file.filename
  }
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath,
    creator: req.userData.userId
  });
Post.updateOne({_id: req.params.id, creator: req.userData.userId}, post).then((result) =>{
if(result.n > 0){
  res.status(200).json({message: "Successfully Updated post"});
}
// else if(result.n > 0 && result.nModified === 0){
//   res.status(200).json({message: "No Changes to Update"});
//}
else{
  res.status(401).json({message: "Not Authorized"});
}
}).catch(error =>{
  res.status(500).json({
    message: 'Updating Failed!'
  });
});
};

exports.deletePost =(req, res, next) =>{
  Post.deleteOne({_id: req.params.id, creator: req.userData.userId}).then(result=>{
    if(result.n > 0){
      res.status(200).json({message: "Deleted post"});
    }else{
      res.status(401).json({message: "Not Authorized"});
    }
  }).catch(error =>{
    res.status(500).json({
      message: 'Creating Post Failed!'
    });
  });
};
