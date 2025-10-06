const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Event = require('../models/Event');

// GET all events (Public)
router.get('/', async (req, res) => {
  try {
    const events = await Event.find().populate('postedBy', ['name']).sort({ eventDate: 1 });
    res.json(events);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// POST a new event (Private)
router.post('/', auth, async (req, res) => {
  try {
    const newEvent = new Event({
      ...req.body,
      postedBy: req.user.id,
    });
    const event = await newEvent.save();
    const populatedEvent = await event.populate('postedBy', ['name']);
    res.status(201).json(populatedEvent);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// DELETE an event (Private)
router.delete('/:id', auth, async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ msg: 'Event not found' });
        if (event.postedBy.toString() !== req.user.id) return res.status(401).json({ msg: 'User not authorized' });
        
        await event.deleteOne();
        res.json({ msg: 'Event removed' });
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// PATCH an event (Private)
router.patch('/:id', auth, async (req, res) => {
    try {
        let event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ msg: 'Event not found' });
        if (event.postedBy.toString() !== req.user.id) return res.status(401).json({ msg: 'User not authorized' });

        event = await Event.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
        const populatedEvent = await event.populate('postedBy', ['name']);
        res.json(populatedEvent);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;