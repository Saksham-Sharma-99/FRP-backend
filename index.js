const express = require("express");
const bodyParser = require('body-parser')
const cors = require('cors');
const DataHandler = require(__dirname+'/database/dataHandler.js')
const request = require('request');
const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({
  extended: true
}));



app.get('/',(req,res)=>{
  console.log(req.query.code)

  const options = {
    url: 'https://internet.channeli.in/open_auth/token/',
    headers:{
      'content-type': 'application/x-www-form-urlencoded',
      'cache-control': "no-cache",
    },
    body: `grant_type=authorization_code&client_secret=KiSTNolWFrQEehYloliUyLRdauKG2XczUL0ST4HapeZXA68XnaOMZ7nWLg6SAwtbJxG7UWlnXdyVO9Do0rcaqFKFxT86ZVmJ5jDRtstmi5Wzidrlk9fh5oZa6CyGegUm&client_id=KhvKozOsGjVXmRNZcvL8SB8S9XxZ7PKJOfazP9sI&redirect_uri=https://frp-backend.herokuapp.com/&code=${req.query.code}`
};

request.post(options, (err, resp, body) => {
    if (err) {
        return console.log("error",err);
    }
    console.log(`Status: ${resp.statusCode}`);
    console.log("body",JSON.parse(body));
    // console.log('origin',req)
    res.redirect(`https://foreignresearchportal.herokuapp.com/?token=${JSON.parse(body).access_token}`)
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



const port = process.env.PORT || 5000
app.listen(port,()=>{
    console.log('server started successfully on port:',port)
})
