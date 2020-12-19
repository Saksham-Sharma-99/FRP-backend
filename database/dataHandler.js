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
    newUser.results = []
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
  }else{
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
  }else{
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
        }else{
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
    fs.writeFileSync(__dirname+'/data/users/users.json',JSON.stringify(users))
    projects.projects.map((project)=>{
      if(project.postId == postId){
        project.applicants.push(userId)
      }})
    fs.writeFileSync(__dirname+'/demoData/projects.json',JSON.stringify(projects))
    callback({user:users.users.filter((user)=>user.userId == userId)[0],projects:projects})
  }else{
    callback({user:users.users.filter((user)=>user.userId == userId)[0],projects:projects})
  }

  results.results.filter((result)=>result.postId == postId)[0].numOfApp.map((userId)=>{
    users.users.map((user)=>{
      if(userId == (user.userId)){
        console.log(user.results.filter((result)=>result.postId == postId))
        user.results.filter((result)=>result.postId == postId)[0].numOfApp=results.results.filter((result)=>result.postId == postId)[0].numOfApp
      }
    })
  })
  
}


module.exports = {
  demoUser : demoUser,
  demoProjects : demoProjects,
  bookmark : bookmark,
  removeBookmark : removeBookmark,
  applyPost : applyPost
}
