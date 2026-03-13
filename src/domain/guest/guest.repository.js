/**
 * Guest Repository
 * Menangani operasi baca/tulis ke data/guests.json
 */
const fs = require('fs');
const path = require('path');

const GUESTS_FILE = path.join(__dirname, '../../../data', 'guests.json');

const GuestRepository = {
    getAll() {
        try {
            if (!fs.existsSync(GUESTS_FILE)) {
                return [];
            }
            const raw = fs.readFileSync(GUESTS_FILE, 'utf-8');
            return JSON.parse(raw);
        } catch (error) {
            console.error('Error reading guests.json:', error);
            return [];
        }
    },

    saveAll(guests) {
        try {
            // Ensure data directory exists
            const dir = path.dirname(GUESTS_FILE);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            fs.writeFileSync(GUESTS_FILE, JSON.stringify(guests, null, 2), 'utf-8');
            return true;
        } catch (error) {
            console.error('Error writing to guests.json:', error);
            throw error;
        }
    }
};

module.exports = GuestRepository;
