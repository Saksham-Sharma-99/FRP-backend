const express = require("express");
const bodyParser = require('body-parser')
const cors = require('cors');
const DataHandler = require('./database/dataHandler.js')
const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({
  extended: true
}));



app.get('/',(req,res)=>{
  console.log(req.query)
  res.send("Hello")
})

app.get('/projects',(req,res)=>{
  console.log(req)
  res.send("Projects")
})

app.get('/userDetails',(req,res)=>{
  DataHandler.demoUser(req.query.userId,(user)=>{
    console.log(req.url,'asked for user',req.query.userId)
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
