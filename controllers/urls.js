const UrlsModel = require("../Model/urls")
const validator = require('validator');
const QRCode = require('qrcode-generator');


const baseUrl = 'https://urlshortner-3u0i.onrender.com'

// Function to generate QR code using the qrcode-generator library
function generateQRCode(url) {
    const qr = QRCode(0, 'M');
    qr.addData(url);
    qr.make();
    return qr.createDataURL();
  }

exports.shorten = async(req,res)=>{
    try {
        const {customizedurl, url} = req.body
        // Dynamically import the nanoid library
        const { customAlphabet } = await import('nanoid');
        

        // Validate the original URL
        if (!validator.isURL(url)) {
            res.status(400).json({success: false, message:'Invalid URL'});
           return;
        }
        const cleanedUrl = url.replace(/[^\w\s]/gi, "");

        // check if the customizedurl is more than 6 letters
        if(customizedurl?.trim().length > 6){
             return res.status(404).json({
              success: false,
              message: "Alias should be less or equal to 6 letters. Try new one?",
            
            });    
        }
        // Generate a NanoID
        const nanoid = customAlphabet(cleanedUrl, 5)
        const shortid = nanoid() 
           
        //generate qr code
        const qrCodeDataURL = await generateQRCode(url)
         const shortenedurl = `${baseUrl}/${shortid}`


         const checkShortID = await UrlsModel.find({
           shortId: customizedurl ? customizedurl.trim() : shortid,
         });
         if(checkShortID.length > 0){
            return res.status(404).json({
              success: false,
              message: "This alias has been used. Try new one?",
            
            });    
        }

        const data = {
            shortenurl : customizedurl? `${baseUrl}/${customizedurl.trim()}` : shortenedurl,
            originalurl: url,
            userId:req.user.userid,
            shortId : customizedurl? customizedurl.trim() : shortid,
            clickCount: 0,
            qrcode: qrCodeDataURL
        }

        const urlData = await UrlsModel.create(data)
        return res.status(201).json({
            success:true,
            message: "Shortened url created successfully.",
            data: urlData
        })    
       
    } catch (error) {
        console.log(error,"error")  
        
    }
}

exports.urlRedirect = async(req,res)=>{

    try {
        
        const  url  = req.params.shortId
        const data = await UrlsModel.findOne({shortId: url})

        if(!data){
           return res.status(404).json({success: false, message:"The url link generated is broken"})
        }
        const originalUrl = data.originalurl
     
         // Increment the click count
          data.clickCount++;

        // Save the updated URL record
        await data.save();
        res.redirect(originalUrl)

       
       // res.send("successful!")
    } catch (error) {
        console.log(error, "error")
    }
}



// Backend route
exports.getLinkHistory = async(req,res)=>{
    try {
        const userId = req.user.userid; 
        const linkHistory = await UrlsModel.find({ userId }).sort({ createdAt: -1 });
    
        res.status(200).json({success:true, message:"Successfully retrived all links", data: linkHistory});
          
          
    } catch (error) {
        console.error('Error retrieving link history:', error);
        res.status(500).json({success:false, error: 'An error occurred while retrieving link history.' });
    }
} 

exports.getLink = async(req,res)=>{
    try {
        const linkId = req.params.id
        const info = await UrlsModel.findById(linkId)

        if(!info){
           
            return res.status(404).json({ success: false, message: 'Link not found.' });
        }
       return  res.status(200).json({success:true, message:"Link fetched successfully", data: info})

       
    } catch (error) {
        console.error('Error deleting link:', error);
      return res.status(500).json({ success:false, message: 'An error occurred while getting the link.' })
    }
}
exports.deleteLink = async (req, res) => {
    try {
      const linkId = req.params.id;
  
      // Find and delete the link by ID
      const deletedLink = await UrlsModel.findByIdAndDelete(linkId);
  
      if (!deletedLink) {
        return res.status(404).json({ success: false, message: 'Link not found.' });
      }
  
      return res.json({success: true, message: 'Link deleted successfully.' });
    } catch (error) {
      console.error('Error deleting link:', error);
      return res.status(500).json({ success:false, message: 'An error occurred while deleting the link.' });
    }
  };
  
  
  
  
