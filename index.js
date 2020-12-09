const express = require("express");
const bodyParser = require('body-parser')
const cors = require('cors');
const DataHandler = require(__dirname+'/database/dataHandler.js')
const axios = require('axios')
const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({
  extended: true
}));



app.get('/',(req,res)=>{
  console.log(req.query.code)
  axios.post("https://internet.channeli.in/open_auth/token/", {
    client_id:"KhvKozOsGjVXmRNZcvL8SB8S9XxZ7PKJOfazP9sI",
   client_secret:"KiSTNolWFrQEehYloliUyLRdauKG2XczUL0ST4HapeZXA68XnaOMZ7nWLg6SAwtbJxG7UWlnXdyVO9Do0rcaqFKFxT86ZVmJ5jDRtstmi5Wzidrlk9fh5oZa6CyGegUm",
   grant_type:req.query.code,
   redirect_uri:"https://frp-backend.herokuapp.com",
   code:req.query.code
  }).then((res) => {
    console.log(`statusCode: ${res.statusCode}`)
    console.log(res.data)
  }).catch((error) => {
    console.error(error.response.data)
  })


  res.send("Redirecting . hold on for a second")
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
