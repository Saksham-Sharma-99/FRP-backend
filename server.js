const express = require("express");
const bodyParser = require('body-parser')
const cors = require('cors');
const DataHandler = require(__dirname+'/database/dataHandler.js')
const request = require('request');
const { query } = require("express");
const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({
  extended: true
}));



app.get('/',(req,res)=>{
  console.log(req.query.code)

  var redirect_uri = (req.query.state == "http://localhost:3000/") ? "https://frp-backend.herokuapp.com/" : "http://ec2-13-235-76-138.ap-south-1.compute.amazonaws.com/api/"

  const options = {
    url: 'https://internet.channeli.in/open_auth/token/',
    headers:{
      'content-type': 'application/x-www-form-urlencoded',
      'cache-control': "no-cache",
    },
    body: `grant_type=authorization_code&client_secret=KiSTNolWFrQEehYloliUyLRdauKG2XczUL0ST4HapeZXA68XnaOMZ7nWLg6SAwtbJxG7UWlnXdyVO9Do0rcaqFKFxT86ZVmJ5jDRtstmi5Wzidrlk9fh5oZa6CyGegUm&client_id=KhvKozOsGjVXmRNZcvL8SB8S9XxZ7PKJOfazP9sI&redirect_uri=${redirect_uri}&code=${req.query.code}`
};


request.post(options, (err, resp, body) => {
    if (err) {
        return console.log("error",err);
    }
    console.log(`Status: ${resp.statusCode}`);
    console.log("body",JSON.parse(body));
    // console.log('origin',req)
    res.redirect(`${req.query.state}?token=${JSON.parse(body).access_token}`)
});

})

app.get('/projects',(req,res)=>{
  DataHandler.demoProjects((projects)=>{
    console.log(req.headers.origin,'asked for projects')
    res.send(projects)
  })
})

app.get('/userDetails',(req,res)=>{
  console.log(req.headers.origin,'asked for user',req.query.token)
  DataHandler.demoUser(req.query.token,(user)=>{
    res.send(user)
  })

})

app.get('/results',(req,res)=>{
  console.log(req)
  res.send("Results")
})



app.post("/bookmark",(req,res)=>{
  if (!req.body) return res.sendStatus(400);
  console.log(req.body, "body");
  console.log("user :",req.query.userId , "asked to bookmark post",req.query.postId)
  DataHandler.bookmark(req.query.userId,req.query.postId,(status)=>{
    res.send(status)
  })
})

app.post("/removeBookmark",(req,res)=>{
  console.log("user :",req.query.userId , "asked to bookmark post",req.query.postId)
  DataHandler.removeBookmark(req.query.userId,req.query.postId,(status)=>{
    res.send(status)
  })
})


const port = process.env.PORT || 5000
app.listen(port,()=>{
    console.log('server started successfully on port:',port)
})
