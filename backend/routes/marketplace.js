const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const MarketplaceItem = require('../models/MarketplaceItem');

// GET all items (Public)
router.get('/', async (req, res) => {
  try {
    const items = await MarketplaceItem.find()
      // Update this line to include more fields
      .populate('seller', ['name', 'blockNo', 'email', 'phone'])
      .sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// POST a new item (Private)
router.post('/', auth, async (req, res) => {
  try {
    const newItem = new MarketplaceItem({
      ...req.body,
      seller: req.user.id,
    });
    const item = await newItem.save();
    const populatedItem = await item.populate('seller', ['name']);
    res.status(201).json(populatedItem);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// DELETE an item (Private)
router.delete('/:id', auth, async (req, res) => {
    try {
        const item = await MarketplaceItem.findById(req.params.id);
        if (!item) return res.status(404).json({ msg: 'Item not found' });
        if (item.seller.toString() !== req.user.id) return res.status(401).json({ msg: 'User not authorized' });
        
        await item.deleteOne();
        res.json({ msg: 'Item removed' });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// PATCH an item (Private)
router.patch('/:id', auth, async (req, res) => {
    try {
        let item = await MarketplaceItem.findById(req.params.id);
        if (!item) return res.status(404).json({ msg: 'Item not found' });
        if (item.seller.toString() !== req.user.id) return res.status(401).json({ msg: 'User not authorized' });

        item = await MarketplaceItem.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
        const populatedItem = await item.populate('seller', ['name']);
        res.json(populatedItem);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});


module.exports = router;