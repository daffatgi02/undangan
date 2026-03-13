/**
 * Guest Routes
 */
const express = require('express');
const GuestController = require('./guest.controller');

const router = express.Router();

router.get('/guests', GuestController.getAllGuests);
router.get('/guest/:slug', GuestController.getGuestBySlug);
router.post('/guests', GuestController.createGuest);
router.put('/guests/:slug', GuestController.updateGuest); // NEW
router.delete('/guests/:slug', GuestController.deleteGuest);

module.exports = router;
