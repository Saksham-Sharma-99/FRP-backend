const express = require("express");
const bodyParser = require('body-parser')
const cors = require('cors');
const DataHandler = require(__dirname+'/database/dataHandler.js')
const axios = require('axios')
const request = require('request');
const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({
  extended: true
}));



app.get('/',(req,res)=>{
  console.log(req.query.code)
 //  var params = new URLSearchParams();
 //  params.append('client_id', "KhvKozOsGjVXmRNZcvL8SB8S9XxZ7PKJOfazP9sI");
 //  params.append('client_secret', "KiSTNolWFrQEehYloliUyLRdauKG2XczUL0ST4HapeZXA68XnaOMZ7nWLg6SAwtbJxG7UWlnXdyVO9Do0rcaqFKFxT86ZVmJ5jDRtstmi5Wzidrlk9fh5oZa6CyGegUm");
 //  params.append('grant_type',"authorization_code")
 //  params.append('redirect_uri',"https://foreignresearchportal.herokuapp.com/#/")
 //  params.append('code',req.query.code)
 //  console.log(params)
 //  axios.post("https://internet.channeli.in/open_auth/token/", params
 //    // params :{
 //   //  client_id:"KhvKozOsGjVXmRNZcvL8SB8S9XxZ7PKJOfazP9sI",
 //   // client_secret:"KiSTNolWFrQEehYloliUyLRdauKG2XczUL0ST4HapeZXA68XnaOMZ7nWLg6SAwtbJxG7UWlnXdyVO9Do0rcaqFKFxT86ZVmJ5jDRtstmi5Wzidrlk9fh5oZa6CyGegUm",
 //   // grant_type:"authorization_code",
 //   // redirect_uri:"https://foreignresearchportal.herokuapp.com",
 //   // code:req.query.code
 // // }
 //  ).then((res) => {
 //    console.log(`statusCode: ${res.statusCode}`)
 //    console.log(res.data)
 //  }).catch((error) => {
 //    console.error(error)
 //  })

//-----------------------------------------------
  const options = {
    url: 'https://internet.channeli.in/open_auth/token/',
    headers:{
      'content-type': 'application/x-www-form-urlencoded',
      'cache-control': "no-cache",
    },
    body: `grant_type=authorization_code&client_secret=KiSTNolWFrQEehYloliUyLRdauKG2XczUL0ST4HapeZXA68XnaOMZ7nWLg6SAwtbJxG7UWlnXdyVO9Do0rcaqFKFxT86ZVmJ5jDRtstmi5Wzidrlk9fh5oZa6CyGegUm&client_id=KhvKozOsGjVXmRNZcvL8SB8S9XxZ7PKJOfazP9sI&redirect_uri=https://frp-backend.herokuapp.com/&code=${req.query.code}`
};

request.post(options, (err, res, body) => {
    if (err) {
        return console.log("error",err);
    }
    console.log(`Status: ${res.statusCode}`);
    console.log("body",body);
    res.redirect("https://foreignresearchportal.herokuapp.com/#/?token="+body.access_token)
});

res.send("Redirecting . hold on for a second")

// payload = "grant_type=authorization_code&client_secret=KiSTNolWFrQEehYloliUyLRdauKG2XczUL0ST4HapeZXA68XnaOMZ7nWLg6SAwtbJxG7UWlnXdyVO9Do0rcaqFKFxT86ZVmJ5jDRtstmi5Wzidrlk9fh5oZa6CyGegUm&client_id=KhvKozOsGjVXmRNZcvL8SB8S9XxZ7PKJOfazP9sI&redirect_uri=https://foreignresearchportal.herokuapp.com/#/&code="+req.query.code
//    headers = {
//        'content-type': "application/x-www-form-urlencoded",
//        'cache-control': "no-cache",
//    }
//
//    response = request("POST", "https://internet.channeli.in/open_auth/token/", data=payload, headers=headers)
//    console.log(response)
//    console.log(response.statusCode)
//    console.log(response.body)

//-----------------------------------------------

})

app.get('/projects',(req,res)=>{
  DataHandler.demoProjects((projects)=>{
    console.log(req.headers.origin,'asked for projects')
    res.send(projects)
  })
})

app.get('/userDetails',(req,res)=>{
  DataHandler.demoUser(req.query.userId,(user)=>{
    console.log(req.headers.origin,'asked for user',req.query.userId)
    res.send(user)
  })

})

app.get('/results',(req,res)=>{
  console.log(req)
  res.send("Results")
})



const port = process.env.PORT || 5000
app.listen(port,()=>{
    console.log('server started successfully on port:',port)
})
