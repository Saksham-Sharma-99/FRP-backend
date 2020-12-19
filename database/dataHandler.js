const https = require('https')
const lodash = require('lodash')
const demoProfiles = require(__dirname+'/demoData/profiles')
const projects = require(__dirname+'/demoData/projects')
const request = require('request');
const fs = require('fs');
const { add } = require('lodash');

function demoUser(token,callback){
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

    addUser(body)
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


function addUser(body){
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
    // console.log(newUser)
    users.users.push(newUser)
    console.log(users.users)
    fs.writeFileSync(__dirname+'/data/users/users.json',JSON.stringify(users))
  }
}

function bookmark(userId , postId , callback){
  console.log("user :",userId , "asked to bookmark post",postId)
  let rawUserData = fs.readFileSync(__dirname+'/data/users/users.json')
  let users = JSON.parse(rawUserData)
  let rawPostData = fs.readFileSync(__dirname+"/demoData/projects.json")
  let projects = JSON.parse(rawPostData)

  console.log(sers.users)

  if(!users.users.filter((user)=>user.userId == userId)[0].bookmarked.includes(postId)){
    users.users.filter((user)=>user.userId == userId)[0].bookmarked.push(postId)
    projects.projects.filter((project)=>project.postId == postId)[0].bookmarked.push(userId)
    callback({status:"bookmarked successfully"})
  }else{
    callback({status:"already bookmarked"})
  }
}
function removeBookmark(userId , postId , callback){
  let rawUserData = fs.readFileSync(__dirname+'/data/users/users.json')
  let users = JSON.parse(rawUserData)
  let rawPostData = fs.readFileSync(__dirname+"/demoData/projects.json")
  let projects = JSON.parse(rawPostData)

  if(users.users.filter((user)=>user.userId == userId)[0].bookmarked.includes(postId)){
    let newArray = users.users.filter((user)=>user.userId != userId)
    users.users.filter((user)=>user.userId == userId)[0].bookmarked=newArray
    newArray = projects.projects.filter((project)=>project.postId != postId)
    projects.projects.filter((project)=>project.postId == postId)[0].bookmarked=newArray
    callback({status:"removed successfully"})
  }else{
    callback({status:"not bookmarked"})
  }
}


module.exports = {
  demoUser : demoUser,
  demoProjects : demoProjects,
  bookmark : bookmark,
  removeBookmark : removeBookmark
}
