const UrlsModel = require("../Model/urls")
const validator = require('validator');


exports.shorten = async(req,res)=>{
    try {
        // Dynamically import the nanoid library
         const { customAlphabet } = await import('nanoid');
        const {url} = req.body.url

        // Validate the original URL
        if (!validator.isURL(url)) {
            res.status(400).json({message:'Invalid URL', status: true});
           return;
        }

        const cleanedUrl = url.replace(/[^\w\s]/gi, "");

        // Generate a NanoID
        const nanoid = customAlphabet(cleanedUrl, 10)
        const shortid = nanoid() 

        console.log(shortid, originalurl,req.user.userid)

        const data = {
            shortenurl : shortid,
            originalurl: url,
            userId:req.user.userid
        }

        const urlData = await UserModel.create(data)

        console.log(urlData)
       
    } catch (error) {
        console.log(error,"error")
        
    }
}