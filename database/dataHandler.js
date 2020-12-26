const https = require('https')
const demoProfiles = require(__dirname+'/demoData/profiles')
const request = require('request');
const fs = require('fs');
const crypto = require("crypto");
const { sendMail } = require('../Moderator/EmailsManager');
const Constant = require('../Constants')
const Constants = Constant.Constants

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
      if(resp.statusCode == 200){
        console.log(`Status: ${resp.statusCode}`);
        console.log(`Bearer ${token}`)

        const data = [User]

        addUser(body,refresh_token)
        let rawData = fs.readFileSync(__dirname+'/data/users/users.json')
        let users = JSON.parse(rawData)
        data.push(users.users.filter((user)=>user.userId==JSON.parse(body).userId)[0])
        
        callback(data)
      }
      else if(resp.statusCode==401){
        console.log(`Status: ${resp.statusCode}`);
        console.log(body)
        const data = [User]
        let rawData = fs.readFileSync(__dirname+'/data/users/users.json')
        let users = JSON.parse(rawData)
        data.push(users.users.filter((user)=>user.userId==JSON.parse(body).userId)[0])
        callback(data)
      }
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
    users.users.filter((user)=>user.userId==JSON.parse(body).userId)[0].token = refresh_token
    console.log(users.users.filter((user)=>user.userId==JSON.parse(body).userId)[0])
  }
  else{
    let today = new Date().toLocaleDateString()
    console.log("user added")
    var newUser = JSON.parse(body)
    newUser.applications = {applied:[],bookmarked:[]}
    newUser.results = []
    newUser.token = refresh_token
    newUser.notifs = [ 
      {
        createdAt : today,
        action : "#",
        data :{
          title : 'New User',
          content : 'Welcome To FRP'
        },
        notifId : crypto.randomBytes(20).toString('hex'),
        read : false
      }
    ]
    newUser.documents = {
      resume : "",
      transcript : ""
    }
    newUser.passStatus = "no"
    console.log(newUser)
    users.users.push(newUser)
    console.log(users.users)
  }
  fs.writeFileSync(__dirname+'/data/users/users.json',JSON.stringify(users))
}

function checkUser(refresh_token,state,callback){
  let rawData = fs.readFileSync(__dirname+'/data/users/users.json')
  let users = JSON.parse(rawData)

  if (users.users.filter((user)=>user.token == refresh_token).length == 0){
    callback({status:"no user exists"})
    console.log("no user exists")
  }
  else{
    var redirect_uri = (state == "http://localhost:3000/") ? "https://frp-backend.herokuapp.com/" : "http://ec2-13-235-76-138.ap-south-1.compute.amazonaws.com/api/"

    const options = {
      url: 'https://internet.channeli.in/open_auth/token/',
      headers:{
        'content-type': 'application/x-www-form-urlencoded',
        'cache-control': "no-cache",
      },
      body: `grant_type=refresh_token&client_secret=${Constants.SECRET}&client_id=${Constants.CLIENT_ID}&redirect_uri=${redirect_uri}&refresh_token=${refresh_token}`
    };

    request.post(options, (err, resp, body) => {
        if (err) {
            return console.log("error",err);
        }
        if(resp.statusCode == 200){
          console.log(`Status: ${resp.statusCode}`);
          console.log("body",JSON.parse(body));
          // console.log('origin',req)
          demoUser(JSON.parse(body).access_token,JSON.parse(body).refresh_token,(data)=>{
            demoProjects((projects)=>{
              callback({status:"exists",user:data,project:projects,refresh_token:data[1].token})
            })
          })
      }
      else{
        callback({status:"no user exists"})
        console.log("no user exists")
      }
    });
  }
  
}




function createNotif(userId , title , content, action){
  let rawData = fs.readFileSync(__dirname+'/data/users/users.json')
  let users = JSON.parse(rawData)

  if(users.users.filter((user)=>user.userId == userId).length != 0){
    let today = new Date().toLocaleDateString()
    console.log("notification created successfully")
    users.users.filter((user)=>user.userId == userId)[0].notifs.push({
      createdAt : today,
      action : action,
      data :{
        title : title,
        content : content
      },
      notifId : crypto.randomBytes(20).toString('hex'),
      read : false
    })
    fs.writeFileSync(__dirname+'/data/users/users.json',JSON.stringify(users))
  }
  else{
    console.log("no such user exists , can't create notification")
  }

}
function markRead(userId,notifId){
  if(users.users.filter((user)=>user.userId == userId).length != 0){
    if(users.users.filter((user)=>user.userId == userId)[0].notifs.filter((notif)=>notif.notifId == notifId).length != 0){
      users.users.filter((user)=>user.userId == userId)[0].notifs.filter((notif)=>notif.notifId == notifId)[0].read = true
    }
    else{
      console.log("no such notif exists")
    }
  }
  else{
    console.log("no such user exists")
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

function applyPost(userId,postId,name,sop,callback,type="Semester Exchange"){
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
    var content = `applied for ${type} at ${projects.projects.filter((project)=>project.postId == postId)[0].data.name}`
    createNotif(userId,"Applied Successfully!",content,"#")
    let rawUserData = fs.readFileSync(__dirname+'/data/users/users.json')
    let Users = JSON.parse(rawUserData)
    callback({user:Users.users.filter((user)=>user.userId == userId)[0],projects:projects})
  }
  else{
    callback({user:users.users.filter((user)=>user.userId == userId)[0],projects:projects})
  }
  sendMail(userId,postId,sop)
}



function changePassStatus(userId,status,callback){
  let rawUserData = fs.readFileSync(__dirname+'/data/users/users.json')
  let users = JSON.parse(rawUserData)
  let data = [demoProfiles.profiles.filter((user)=>user.personalData.userId == 2)]
  // console.log(users.users.filter((user)=>user.userId ==userId))
  if(users.users.filter((user)=>user.userId == userId).length == 1){
    users.users.filter((user)=>user.userId == userId)[0].passStatus = status
    fs.writeFileSync(__dirname+'/data/users/users.json',JSON.stringify(users))
    data.push(users.users.filter((user)=>user.userId==userId)[0])
    console.log("status changed successfully")
    callback(data)
  }else{
    console.log("no such user exists")
    callback({status:"no such user exists"})
  }
}

function fileUpload(userId,filetype,location,callback){
  let rawUserData = fs.readFileSync(__dirname+'/data/users/users.json')
  let users = JSON.parse(rawUserData)
  let data = [demoProfiles.profiles.filter((user)=>user.personalData.userId == 2)]
  if(users.users.filter((user)=>user.userId == userId).length == 1){
    users.users.filter((user)=>user.userId == userId)[0].documents[filetype] = location
    fs.writeFileSync(__dirname+'/data/users/users.json',JSON.stringify(users))
    data.push(users.users.filter((user)=>user.userId==userId)[0])
    console.log("file uploaded successfully")
    callback(data)
  }else{
    console.log("no such user exists")
    callback({status:"no such user exists"})
  }
}


module.exports = {
  demoUser : demoUser,
  demoProjects : demoProjects,
  bookmark : bookmark,
  removeBookmark : removeBookmark,
  applyPost : applyPost,
  checkUser : checkUser,
  markRead : markRead,
  changePassStatus : changePassStatus,
  fileUpload : fileUpload
}
