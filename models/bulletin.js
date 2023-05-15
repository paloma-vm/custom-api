const mongoose = require('mongoose');
const Schema = mongoose.Schema

const BulletinSchema = new Schema({
    title: { type: String, required: true },
    body: { type: String, required: true },
    postedBy : { type: Schema.Types.ObjectId, ref: "User", required: true },
})

const Bulletin = mongoose.model('Bulletin', BulletinSchema)

module.exports = Bulletin