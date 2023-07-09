const UserModel = require("../Model/user")

exports.getUser = async(req,res)=>{
  
 try {
   const userId = req.user.userid; 
     const user = await UserModel.findById(userId )

      userData = user.toObject();
        delete userData.password;
       
     return res.status(200).json({success:true, message:"Successfully retrived all links", data: userData});
       
 } catch (error) {
   console.log(error)
   res.status(500).json({success:false, error: 'An error occurred while retrieving user details.' });
 }

}