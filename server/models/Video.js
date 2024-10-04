const mongoose = require('mongoose');

const { Schema } = mongoose;

const videoSchema = new Schema({
  uploadDate: {
    type: Date,
    default: Date.now
  },
  path: {
    type: String,
    required: true,
    unique: false
  }
});

const Video = mongoose.model('Video', videoSchema);

module.exports = Video;