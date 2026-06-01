const mongoose = require('mongoose');

/**
 * Counter — used to generate sequential membership IDs like AAFWS-2026-0001
 * One document per year: { year: 2026, seq: 5 } means next ID is AAFWS-2026-0006
 */
const counterSchema = new mongoose.Schema({
  year:  { type: Number, required: true, unique: true },
  seq:   { type: Number, default: 0 }
});

module.exports = mongoose.model('Counter', counterSchema);
