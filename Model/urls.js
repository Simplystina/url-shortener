const mongoose = require("mongoose")

const Schema = mongoose.Schema
const ObjectId = Schema.ObjectId

const Urls = new mongoose.Schema(
  {

    id: ObjectId,
    userId : {type:String, required: true},
    shortenurl: {type: String, required:true, unique: true},
    shortId: {type: String, required:true, unique: true},
    originalurl:{type: String, required:true},
    qrcode: {type: String},
    clickCount: {type: Number},
    customizedurl:{type:String}
  },
  {
    timestamps: true, toJSON: {virtuals: true}
}
)


const UrlsModel = mongoose.model('urls', Urls)

module.exports = UrlsModel