const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EventSchema = new Schema({
  eventName: { type: String, required: true },
  eventDate: { type: String, required: true },
  eventTime: { type: String, required: true },
  description: { type: String, required: true },
  postedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Event', EventSchema);