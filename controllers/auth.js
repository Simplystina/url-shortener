const UserModel = require("../Model/user")
const jwt = require("jsonwebtoken")
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const bcrypt = require("bcryptjs")

require("dotenv").config()
// Generate a verification token
function generateVerificationToken() {
    return crypto.randomBytes(32).toString('hex');
  }


const baseUrl = 'https://urlshortner-3u0i.onrender.com'
// Send verification email
async function sendVerificationEmail(user,verificationLink) {

     const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.GMAIL_USERNAME,
      pass: process.env.GMAIL_PASSWORD
    }
     })
 
  const mailOptions = {
    to: user.email,
    subject: 'Welcome to LINKURL - Email Verification',
    html: `
      <h2 style="color:blue" >Welcome to LinkURL</h2>
      <p>Dear ${user.firstName},</p>
      <p>Thank you for registering an account with LinkURL. To verify your email address and activate your account, please click the following link:</p>
      <a href=${verificationLink}>${verificationLink}</a>
      <p>Please note that the verification link will expire after 1 hour.</p>
      <p>If you did not register for an account with LinkURL, please disregard this email.</p>
      <p>Best regards,</p>
      <p>Developed by Dinma</p>
    `
  };

  await transporter.sendMail(mailOptions);
}


exports.register = async(req,res)=>{
    try {

        //get user input
      
        const {firstName, lastName, email, password}=data = req.body
        
        if(!(firstName && lastName && email && password)){
           return res.status(400).json({success: false, message:"All input is required"})
        }
        
        //check if user already exist

        const oldUser = await UserModel.findOne({email})
        if (oldUser) {
            return res.status(409).json({ success: false, message:"User Already exist. Please Login"})
        }

        //check password length
        if(password.length < 5){
            return res.status(404).json({success:false, message:"Password must be greater than length 4"})
        }
        const verificationToken = generateVerificationToken();
        //create user in our database
       
        
        const userData = {
          ...data,
         verificationToken : verificationToken,
         verificationTokenExpiresAt : Date.now() + 60 * 60 * 1000
        }
        
        const user = await UserModel.create(userData)

  
       
         const verificationLink = `https://linkurl.netlify.app/verify-mail?token=${verificationToken}&email=${email}`
        // Send verification email to the user
        await sendVerificationEmail(user,verificationLink);

        const userWithoutPassword = {
          ...user._doc,
          password: undefined,
       };

        return res.status(201).json({
            message: "Registration successful. Please check your email for the verification link.",
            data: userWithoutPassword,
            success:true
        })
    
    } catch (error) {
        console.log(error,"error")

        return res.status(404).send("An error has occurred")
    }
}

exports.login = async(req,res)=>{
    console.log(req.body, "reeee")
    try {
          
        //Get user input
        const {email, password}=data = req.body

        //Validate user input

        if(!(email && password)){
          return res.status(400).json({success: false, message: "All input is required"})
        }

         //Validate if user exist in our database
        const user = await UserModel.findOne({ email })
        //console.log(user,"user")
        
        if(!user){
            return res.status(404).json({success: false, message: "User doesn't exist"})
        } 
        
       
        //validate user password
        const validate = await user.isValidPassword(password)
        const isValidPassword = await bcrypt.compare(password, user?.password);
  
         console.log(validate, "validate", isValidPassword)
        if(!validate)
        return res.status(404).json({success: false, message:"Wrong password entered"})

        //create token
        const token = jwt.sign(
            { userid: user._id, email},
            process.env.JWT_TOKEN,
            {
                expiresIn: "5h"
            }
        )
        //save user token
        userData = user.toObject();
        userData.token = token 
       
        //console.log(token,"tokennnnnnnnnn", user, user.firstName)
        //Delete the password from the object so as not to display the hash to the user
        delete userData.password;
       
        return  res.status(200).json({success:true, message:"Logged in successfully", data:userData})
    } catch (error) {
        console.log(error, "error")
        return res.status(404).send("An error occurred")
    }

}

// API endpoint for verifying the user's email
exports.verify = async(req, res) => {
    const { token, email } = req.query;
         console.log(token,"tokennnnnnnnnn")                     

    try {

      // Find the user with the provided verification token
    const userToken = await UserModel.findOne({
      verificationToken: token,
      verificationTokenExpiresAt: { $gt: new Date() } // Check if token is not expired
    });
    const userEmail = await UserModel.findOne({email})//check if the mail is verified
    console.log(userToken,"email",userEmail)
    if(userEmail?.verified === true){
      return res.status(200).json({success: true, message: "User is already verified"})
    }
  
    if (userToken) {
      // Mark the user as verified
      const userUpdate = await UserModel.updateOne(
        {
          verificationToken: token,
          verificationTokenExpiresAt: { $gt: new Date() }
        },
        {
          $set: { verified: true },
          $unset: {
            verificationToken: '',
            verificationTokenExpiresAt: ''
          }
        }
      );
      return res.status(201).json({message: 'Email verification successful! Please go to login', success: true});
    }
    return res.status(400).json({ success: false, message:'Invalid verification token or token has expired.'});
    } catch (error) {
      console.log(error,"error")
      // Handle invalid or expired verification token
        return res.status(400).json({ success: false, message:'Invalid verification token or token has expired.'});
    
    }
    
} 


exports.resendVerification = async(req, res) => {
    const { email } = req.body;
  
    try {
      const user = await UserModel.findOne({ email });
  
      if (!user) {
        return res.status(404).json({success:false, message: 'User not found, please register'});
      }
  
      const verificationToken = generateVerificationToken(); 
      const verificationTokenExpiresAt = Date.now() + 3600000; 
  
      const userUpdate = await UserModel.updateOne(
        {email},
        {
          $set: { 
            verificationToken: verificationToken,
            verificationTokenExpiresAt: verificationTokenExpiresAt
          },
        
        }
      );
  
      const verificationLink = `https://linkurl.netlify.app/verify-mail?token=${verificationToken}&email=${email}`;
      await sendVerificationEmail(user, verificationLink);
  
      return res.status(201).json({success:true , message: 'Verification email resent successfully',data:verificationToken });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
  }
  

  