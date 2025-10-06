const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MarketplaceItemSchema = new Schema({
  itemName: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: String, required: true },
  mediaUrls: { // Renamed from imageUrl for clarity
    type: [String], // This defines an array of strings
  },
  seller: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('MarketplaceItem', MarketplaceItemSchema);