const nodemailer = require("nodemailer")
const fs = require("fs")
const Constant = require("../Constants")
const Constants = Constant.Constants
const transporter = nodemailer.createTransport(
    {
        service : Constants.SERVICE,
        auth :{
            user:Constants.EMAIL,
            pass: Constants.PASS
        }
    }
)

function sendMail(userId,postId,sop){
    let rawUserData = fs.readFileSync(__dirname+'/../database/data/users/users.json')
    let users = JSON.parse(rawUserData)
    let rawPostData = fs.readFileSync(__dirname+'/../database/demoData/projects.json')
    let projects = JSON.parse(rawPostData)
    var mailOptions = {
        from: Constants.EMAIL,
        to: users.users.filter((user)=>user.userId == userId)[0].contactInformation.instituteWebmailAddress,
        subject: 'Updates on your application',
        text: `Your Application for semester exchange with ${projects.projects.filter((project)=>project.postId == postId)[0].data.name} was successful \n${sop}`
      };

      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
          console.log("message sent successfully to",users.users.filter((user)=>user.userId == userId)[0].contactInformation.instituteWebmailAddress)
        }
      });
}

module.exports = {
    sendMail : sendMail
}