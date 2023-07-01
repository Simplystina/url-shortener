const UrlsModel = require("../Model/urls")
const validator = require('validator');
const QRCode = require('qrcode-generator');

const baseUrl = 'https://urlshortner-3u0i.onrender.com'
exports.shorten = async(req,res)=>{
    try {
        // Dynamically import the nanoid library
         const { customAlphabet } = await import('nanoid');
        const {url} = req.body
        // Validate the original URL
        if (!validator.isURL(url)) {
            res.status(400).json({success: false, message:'Invalid URL'});
           return;
        }

        const cleanedUrl = url.replace(/[^\w\s]/gi, "");

        // Generate a NanoID
        const nanoid = customAlphabet(cleanedUrl, 5)
        const shortid = nanoid() 

      
         const shortenedurl = `${baseUrl}/${shortid}`
        const data = {
            shortenurl : shortenedurl,
            originalurl: url,
            userId:req.user.userid,
            shortId : shortid,
            clickCount: 0
        }

        const urlData = await UrlsModel.create(data)

        console.log(urlData)
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

    console.log(req.params)
    try {
        
        const  url  = req.params.shortId
        console.log(url, "urlllllllllllllllll")

        const data = await UrlsModel.findOne({shortId: url})

        console.log(data,"dataaaaaaaaaaaaa")
        if(!data){
           return res.status(404).json({success: false, message:"The url link generated is broken"})
        }
        const originalUrl = data.originalurl
        console.log(originalUrl, data)
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

// Function to generate QR code using the qrcode-generator library
function generateQRCode(url) {
    const qr = QRCode(0, 'M');
    qr.addData(url);
    qr.make();
    return qr.createDataURL();
  }

exports.generateqrcode = async(req,res)=>{
    try {
        const shortId = req.params.shortId;

        const  url  = req.params.shortId
        console.log(url, "urlllllllllllllllll", req.ip,"rep.ip")

        const data = await UrlsModel.findOne({shortId: url})

        console.log(data,"dataaaaaaaaaaaaa")
        if(!data){
           return res.status(404).json({success: false, message:"The url link generated is broken"})
        
        }
        const originalUrl = data.originalurl
        // Generate the QR code image using the original URL
         const qrCodeDataURL = await generateQRCode(originalUrl)
         res.type('png');
         console.log(qrCodeDataURL,"code")
         res.status(201).json({success:true, message:"QR Code successfully generateQRCode, data:qrCodeDataURL"})
         console.log(originalUrl, data, shortId)

    } catch (error) {
        console.log(error,"error")
    }
}


// Backend route
exports.getLinkHistory = async(req,res)=>{
    try {
       
        const userId = req.user.userid; // Assuming you have implemented user authentication and can access the user's ID from the request
          
        // Query the database to find the user's link history
        const linkHistory = await UrlsModel.find({ userId }).sort({ createdAt: -1 });
    
        res.json({success:true, message:"Successfully retrived all links", data: linkHistory});
          
          
    } catch (error) {
        console.error('Error retrieving link history:', error);
        res.status(500).json({success:false, error: 'An error occurred while retrieving link history.' });
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
  
  
  
  
