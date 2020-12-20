const https = require('https')
const lodash = require('lodash')
const demoProfiles = require(__dirname+'/demoData/profiles')
const projects = require(__dirname+'/demoData/projects')
const request = require('request');
const fs = require('fs');
const { add } = require('lodash');

function demoUser(token,refresh_token,callback){
  const User = demoProfiles.profiles.filter((user)=>user.personalData.userId == 2)
  const options = {
    url: 'https://internet.channeli.in/open_auth/get_user_data/',
    headers:{
      'Authorization' : `Bearer ${token}`
    }};

request.get(options, (err, resp, body) => {
    if (err) {
        return console.log("error",err);
    }
    console.log(`Status: ${resp.statusCode}`);
    console.log(`Bearer ${token}`)

    const data = [User]

    addUser(body,refresh_token)
    let rawData = fs.readFileSync(__dirname+'/data/users/users.json')
    let users = JSON.parse(rawData)
    data.push(users.users.filter((user)=>user.userId==JSON.parse(body).userId)[0])
    
    callback(data)
});
}
function demoProjects(callback){
  let rawData = fs.readFileSync(__dirname+'/demoData/projects.json')
  let projects = JSON.parse(rawData)
  callback(projects.projects)
}




function addUser(body,refresh_token){
  let rawData = fs.readFileSync(__dirname+'/data/users/users.json')
  let users = JSON.parse(rawData)
  let userExists = (users.users.filter((user)=>user.userId==JSON.parse(body).userId).length == 1)

  if(userExists){
    console.log("user already exists")
    console.log(users.users.filter((user)=>user.userId==JSON.parse(body).userId)[0])
  }else{
    console.log("user added")

    var newUser = JSON.parse(body)
    newUser.applications = {applied:[],bookmarked:[]}
    newUser.results = []
    newUser.token = refresh_token
    // console.log(newUser)
    users.users.push(newUser)
    console.log(users.users)
    fs.writeFileSync(__dirname+'/data/users/users.json',JSON.stringify(users))
  }
}
function checkUser(refresh_token,state,callback){
  let rawData = fs.readFileSync(__dirname+'/data/users/users.json')
  let users = JSON.parse(rawData)

  if (users.users.filter((user)=>user.token == refresh_token).length == 0){
    callback({status:"no user exists"})
  }
  else{
    var redirect_uri = (state == "http://localhost:3000/") ? "https://frp-backend.herokuapp.com/" : "http://ec2-13-235-76-138.ap-south-1.compute.amazonaws.com/api/"

    const options = {
      url: 'https://internet.channeli.in/open_auth/refresh_token/',
      headers:{
        'content-type': 'application/x-www-form-urlencoded',
        'cache-control': "no-cache",
      },
      body: `grant_type=authorization_code&client_secret=KiSTNolWFrQEehYloliUyLRdauKG2XczUL0ST4HapeZXA68XnaOMZ7nWLg6SAwtbJxG7UWlnXdyVO9Do0rcaqFKFxT86ZVmJ5jDRtstmi5Wzidrlk9fh5oZa6CyGegUm&client_id=KhvKozOsGjVXmRNZcvL8SB8S9XxZ7PKJOfazP9sI&redirect_uri=${redirect_uri}&code=${refresh_token}`
    };

    request.post(options, (err, resp, body) => {
        if (err) {
            return console.log("error",err);
        }
        console.log(`Status: ${resp.statusCode}`);
        console.log("body",JSON.parse(body));
        // console.log('origin',req)
        callback({status:"user exists"})
    });
  }
  
}





function bookmark(userId , postId , callback){
  console.log("user :",userId , "asked to bookmark post",postId)
  let rawUserData = fs.readFileSync(__dirname+'/data/users/users.json')
  let users = JSON.parse(rawUserData)
  let rawPostData = fs.readFileSync(__dirname+"/demoData/projects.json")
  let projects = JSON.parse(rawPostData)

  if(!users.users.filter((user)=>user.userId == userId)[0].applications.bookmarked.includes(postId)){
    users.users.map((user)=>{
      if(user.userId == userId){
        user.applications.bookmarked.push(postId)
      }})
    fs.writeFileSync(__dirname+'/data/users/users.json',JSON.stringify(users))
    projects.projects.map((project)=>{
      if(project.postId == postId){
        project.bookmarked.push(userId)
      }})
    fs.writeFileSync(__dirname+'/demoData/projects.json',JSON.stringify(projects))
    callback({user:users.users.filter((user)=>user.userId == userId)[0],projects:projects})
  }
  else{
    callback({status:"already bookmarked"})
  }
}
function removeBookmark(userId , postId , callback){
  let rawUserData = fs.readFileSync(__dirname+'/data/users/users.json')
  let users = JSON.parse(rawUserData)
  let rawPostData = fs.readFileSync(__dirname+"/demoData/projects.json")
  let projects = JSON.parse(rawPostData)

  if(users.users.filter((user)=>user.userId == userId)[0].applications.bookmarked.includes(postId)){
    let newArray = users.users.filter((user)=>user.userId == userId)[0].applications.bookmarked.filter((id)=>id!=postId)
    users.users.map((user)=>{
      if(user.userId == userId){
        user.applications.bookmarked = newArray
      }})
    fs.writeFileSync(__dirname+'/data/users/users.json',JSON.stringify(users))
    newArray = projects.projects.filter((project)=>project.postId == postId)[0].bookmarked.filter((id)=>id!=userId)
    projects.projects.map((project)=>{
      if(project.postId == postId){
        project.bookmarked = newArray
      }})
    fs.writeFileSync(__dirname+'/demoData/projects.json',JSON.stringify(projects))
    callback({user:users.users.filter((user)=>user.userId == userId)[0],projects:projects})
  }
  else{
    callback({status:"not bookmarked"})
  }
}

function applyPost(userId,postId,name,callback,type="Semester Exchange"){
  console.log("user :",userId , "asked to apply post",postId)
  let rawUserData = fs.readFileSync(__dirname+'/data/users/users.json')
  let users = JSON.parse(rawUserData)
  let rawPostData = fs.readFileSync(__dirname+"/demoData/projects.json")
  let projects = JSON.parse(rawPostData)
  let resultRawData = fs.readFileSync(__dirname+"/demoData/results.json")
  let results = JSON.parse(resultRawData)
  let today = new Date().toLocaleDateString()

  if(!users.users.filter((user)=>user.userId == userId)[0].applications.applied.includes(postId)){
    users.users.map((user)=>{
      if(user.userId == userId){
        user.applications.applied.push(postId)
        if (results.results.filter((result)=>result.postId == postId).length==0){
          results.results.push({
            type:type,
            college:name,
            postId:postId,
            numOfApp : [userId] 
          })
        }
        else{
          results.results.filter((result)=>result.postId == postId)[0].numOfApp.push(userId)
        }
        fs.writeFileSync(__dirname+"/demoData/results.json",JSON.stringify(results))
        user.results.push({
          createdAt:today,
          status:'applied',
          type:type,
          college:name,
          postId:postId,
          numOfApp : results.results.filter((result)=>result.postId == postId)[0].numOfApp
        })
      }})
    results.results.filter((result)=>result.postId == postId)[0].numOfApp.map((userId)=>{
      users.users.map((user)=>{
        if(userId == (user.userId)){
          user.results.filter((result)=>result.postId == postId)[0].numOfApp=results.results.filter((result)=>result.postId == postId)[0].numOfApp
        }
      })
    })
    fs.writeFileSync(__dirname+'/data/users/users.json',JSON.stringify(users))
    projects.projects.map((project)=>{
      if(project.postId == postId){
        project.applicants.push(userId)
      }})
    fs.writeFileSync(__dirname+'/demoData/projects.json',JSON.stringify(projects))
    callback({user:users.users.filter((user)=>user.userId == userId)[0],projects:projects})
  }
  else{
    callback({user:users.users.filter((user)=>user.userId == userId)[0],projects:projects})
  }
  
}


module.exports = {
  demoUser : demoUser,
  demoProjects : demoProjects,
  bookmark : bookmark,
  removeBookmark : removeBookmark,
  applyPost : applyPost,
  checkUser : checkUser
}
