/**
 * Guest Controller
 * Menangani HTTP logic untuk entitas Guest
 */
const crypto = require('crypto');
const GuestRepository = require('./guest.repository');
const ResponseUtil = require('../../core/response.util');

function generateSlug() {
    return crypto.randomBytes(4).toString('hex');
}

const GuestController = {
    // GET /api/guests
    getAllGuests(req, res) {
        const guests = GuestRepository.getAll();
        return res.json(guests); // Tetap kembalikan array telanjang (backward compatibility dengan frontend public dan legacy admin)
    },

    // GET /api/guest/:slug
    getGuestBySlug(req, res) {
        const guests = GuestRepository.getAll();
        const guest = guests.find(g => g.slug === req.params.slug);
        
        if (!guest) {
            return res.status(404).json({ error: 'Tamu tidak ditemukan' });
        }
        
        // Return public info (name & requires_gift)
        return res.json({ 
            name: guest.name,
            requires_gift: guest.requires_gift !== false // Default true jika undefined (tamu lama)
        });
    },

    // POST /api/guests
    createGuest(req, res) {
        const { name, requires_gift } = req.body;
        
        if (!name || typeof name !== 'string' || !name.trim()) {
            return res.status(400).json({ error: 'Nama tidak boleh kosong' });
        }

        const guests = GuestRepository.getAll();
        
        let slug;
        // Pastikan slug unik
        do { 
            slug = generateSlug(); 
        } while (guests.find(g => g.slug === slug));

        // Format data tamu baru
        const newGuest = {
            id: Date.now(),
            slug,
            name: name.trim(),
            requires_gift: requires_gift === undefined ? true : Boolean(requires_gift), // Default true jika tidak dikirim
            createdAt: new Date().toISOString()
        };

        guests.push(newGuest);
        
        try {
            GuestRepository.saveAll(guests);
            return res.status(201).json(newGuest);
        } catch (error) {
            return ResponseUtil.error(res, 'Gagal menyimpan data tamu', 500);
        }
    },

    // PUT /api/guests/:slug
    updateGuest(req, res) {
        const { name, requires_gift } = req.body;
        const targetSlug = req.params.slug;

        if (!name || typeof name !== 'string' || !name.trim()) {
            return res.status(400).json({ error: 'Nama tidak boleh kosong' });
        }

        const guests = GuestRepository.getAll();
        const guestIndex = guests.findIndex(g => g.slug === targetSlug);

        if (guestIndex === -1) {
            return res.status(404).json({ error: 'Tamu tidak ditemukan' });
        }

        // Update properties
        guests[guestIndex].name = name.trim();
        guests[guestIndex].requires_gift = requires_gift === undefined ? true : Boolean(requires_gift);

        try {
            GuestRepository.saveAll(guests);
            return res.json(guests[guestIndex]);
        } catch (error) {
            return ResponseUtil.error(res, 'Gagal memperbarui data tamu', 500);
        }
    },

    // DELETE /api/guests/:slug
    deleteGuest(req, res) {
        let guests = GuestRepository.getAll();
        const initialCount = guests.length;
        
        guests = guests.filter(g => g.slug !== req.params.slug);
        
        if (guests.length === initialCount) {
             return res.status(404).json({ error: 'Tamu tidak ditemukan' });
        }
        
        try {
            GuestRepository.saveAll(guests);
            return res.json({ success: true });
        } catch (error) {
             return ResponseUtil.error(res, 'Gagal menghapus data tamu', 500);
        }
    }
};

module.exports = GuestController;
