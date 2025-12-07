const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Trek = require('../models/Trek');

router.get('/', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;
    const treks = await Trek.find({}).skip(skip).limit(limit);
    const total = await Trek.countDocuments();
    res.json({ treks, total, page, limit });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

router.post('/', auth, async (req, res) => {
  const { name, location, difficulty, price, images } = req.body;
  try {
    const trek = new Trek({ user: req.user.id, name, location, difficulty, price, images });
    await trek.save();
    res.json(trek);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

router.put('/:id', auth, async (req, res) => {
  const { name, location, difficulty, price, images } = req.body;
  try {
    let trek = await Trek.findById(req.params.id);
    if (!trek) return res.status(404).json({ msg: 'Trek not found' });
    if (trek.user.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });
    trek = await Trek.findByIdAndUpdate(req.params.id, { $set: { name, location, difficulty, price, images } }, { new: true });
    res.json(trek);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const trek = await Trek.findById(req.params.id);
    if (!trek) return res.status(404).json({ msg: 'Trek not found' });
    if (trek.user.toString() !== req.user.id) return res.status(401).json({ msg: 'Not authorized' });
    await Trek.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Trek removed' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

router.get('/:id', auth, async (req, res) => {
  try {
    const trek = await Trek.findById(req.params.id);
    if (!trek) return res.status(404).json({ msg: 'Trek not found' });
    res.json(trek);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;