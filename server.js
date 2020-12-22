const express = require("express");
const bodyParser = require('body-parser')
const cors = require('cors');
const DataHandler = require(__dirname+'/database/dataHandler.js')
const request = require('request');
const Constant = require(__dirname+"/Constants.js")
const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
const Constants = Constant.Constants


app.get(Constants.Routes.default,(req,res)=>{
  console.log(req.query.code)

  var redirect_uri = (req.query.state == "http://localhost:3000/") ? "https://frp-backend.herokuapp.com/" : "http://ec2-13-235-76-138.ap-south-1.compute.amazonaws.com/api/"

  const options = {
    url: 'https://internet.channeli.in/open_auth/token/',
    headers:{
      'content-type': 'application/x-www-form-urlencoded',
      'cache-control': "no-cache",
    },
    body: `grant_type=authorization_code&client_secret=${Constants.SECRET}&client_id=${Constants.CLIENT_ID}&redirect_uri=${redirect_uri}&code=${req.query.code}`
};
request.post(options, (err, resp, body) => {
    if (err) {
        return console.log("error",err);
    }
    console.log(`Status: ${resp.statusCode}`);
    console.log("body",JSON.parse(body));
    // console.log('origin',req)
    res.redirect(`${req.query.state}?token=${JSON.parse(body).access_token}&refresh_token=${JSON.parse(body).refresh_token}`)
});
})

app.get(Constants.Routes.projects,(req,res)=>{
  DataHandler.demoProjects((projects)=>{
    console.log(req.headers.origin,'asked for projects')
    res.send(projects)
  })
})

app.get(Constants.Routes.userDetails,(req,res)=>{
  console.log(req.headers.origin,'asked for user',req.query.token)
  DataHandler.demoUser(req.query.token,req.query.refresh_token,(user)=>{
    res.send(user)
  })

})

app.get(Constants.Routes.results,(req,res)=>{
  console.log(req)
  res.send("Results")
})

app.get(Constants.Routes.checkUser,(req,res)=>{
  console.log("checking user with token",req.query.token)
  DataHandler.checkUser(req.query.token,req.query.state,(data)=>{
    if (data.status == "exists"){
      res.send({data:data.user,projects:data.project,token:data.refresh_token})
    }
    else{
      res.send("doesnt exist")
    }
  })
})








app.post(Constants.Routes.bookmark,(req,res)=>{
  DataHandler.bookmark(parseInt(req.query.userId),parseInt(req.query.postId),(status)=>{
    res.send(status)
  })
})

app.post(Constants.Routes.removeBookmark,(req,res)=>{
  console.log("user :",req.query.userId , "asked to remove bookmark post",req.query.postId)
  DataHandler.removeBookmark(parseInt(req.query.userId),parseInt(req.query.postId),((status)=>{
    res.send(status)
  }))
})

app.post(Constants.Routes.apply,(req,res)=>{
  DataHandler.applyPost(parseInt(req.query.userId),parseInt(req.query.postId),req.query.name,((status)=>{
    res.send(status)
  }))
})







const port = process.env.PORT || 5000
app.listen(port,()=>{
    console.log('server started successfully on port:',port)
})
