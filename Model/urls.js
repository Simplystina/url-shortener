const mongoose = require("mongoose")

const Schema = mongoose.Schema
const ObjectId = Schema.ObjectId

const Urls = new mongoose.Schema({

    id: ObjectId,
    userId : {type:String, required: true, unique: true},
    shortenurl: {type: String, required:true, unique: true},
    originalurl:{type: String, required:true}
  },
  {
    timestamps: true, toJSON: {virtuals: true}
}
)


const UrlsModel = mongoose.model('urls', Urls)

module.exports = UrlsModel