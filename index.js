const express=require("express")
// const sgMail=require("@sendgrid/mail")
const app=express()
const DB=require("./database").connectDB
const authRoutes=require("./routes/authRoutes")
const userRouter=require("./routes/userRouter")
const productRouter=require("./routes/productsRoutes")
const sgMail=require("@sendgrid/mail")

const { response } = require("express")
var Sib = require('sib-api-v3-sdk');

// const jwt=require("jsonwebtoken")
DB()
app.use(express.json())
require("dotenv").config()
app.use("",authRoutes)
app.use("",userRouter)
app.use("",productRouter)

app.listen(process.env.Port,()=>{
    console.log("listening on port 3000")
})

// sgMail.setApiKey(process.env.SENDGRID_API_KEY)

// const sendMail=async(msg)=>{
//     try{
// await sgMail.send(msg);
// console.log("sent!")
//     }
//     catch(error){
//         console.error(error)
//         if(error.response){
//             console.error(error.response.body)
//         }

//     }
// }

// sendMail({
//     to:"sams.abdallah123@gmail.com",
//     from:"monamakki57@gmail.com",
//     subject:"Node js says hello",
//     text:"finally it worked"
// })
// sgMail.setApiKey(process.env.API_KEY)

// const message={
//     to:'monamakki57@gmail.com',
//     from:'saa081@student.bau.edu.lb',
//     subject:'Hello from sendgrid',
//     text:'Hello agin from sendgrid', 
//     html:'<h1>Hello from sendgrid people</h1>'
// }

// sgMail.send(message).then((response)=>console.log(response))
// .catch((err)=>console.log(err.message))


// var api_key = '1f39f91a80e3a2b7e211517c48d8c3a7-7764770b-8543c6aa';
// var domain = 'sandbox34bb206ed65d41469fcc54608194ba3f.mailgun.org';
// var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});
 
// var data = {
//   from: 'Sam <saa081@student.bau.edu.lb>',
//   to: 'saa081@student.bau.edu.lb',
//   subject: 'Hello',
//   text: 'Testing some Mailgun awesomeness!'
// };
 
// mailgun.messages().send(data, function (error, body) {
//     if (error){
//         console.log(error)
//     }
//   console.log(body);
// });


//send in blue starts *******


// const client=Sib.ApiClient.instance

// const apiKey=client.authentications['api-key']
// apiKey.apiKey='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'

// const tranEmailApi= new Sib.TransactionalEmailsApi

// const sender={ 
//     email:'saa081@student.bau.edu.lb'
// }

// const receivers=[
//     {
//         email:'saa081@student.bau.edu.lb'
//     }
// ]

// tranEmailApi.sendTransacEmail({
//     sender,
//     to:receivers,
//     subject:"send in blue trial",
//     textContent:"send in blue email works!"
// }).then(console.log).catch(console.log)


///send in blue finishes



// nodemailer.createTransport({
//     service: 'SendGrid',
//     auth: {
//       user: process.env.SENDGRID_USERNAME,
//       pass: process.env.SENDGRID_PASSWORD
//     }
//   });