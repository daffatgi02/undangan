/**
 * App Setup Layer
 * Mengonfigurasi Express, Middleware, dan Routing Utama
 */
const express = require('express');
const path = require('path');
const guestRoutes = require('./domain/guest/guest.routes');
const GuestRepository = require('./domain/guest/guest.repository'); // needed for view pages fallback validations

const app = express();

// ── Middleware ─────────────────────────────────────────────
app.use(express.json());
// Serve the root directory for assets, css, js
app.use(express.static(path.join(__dirname, '..'))); 

// ── API Routes ─────────────────────────────────────────────
app.use('/api', guestRoutes);

// ── View Routes ────────────────────────────────────────────

// /admin — serve refactored admin entry point
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/admin/index.html'));
});

// /inv/:slug — serve the invitation page
app.get('/inv/:slug', (req, res) => {
    // Validate that the slug exists before serving the page HTML
    const guests = GuestRepository.getAll();
    const guest = guests.find(g => g.slug === req.params.slug);
    
    if (!guest) {
        return res.status(404).send(`
            <!DOCTYPE html><html lang="id"><head>
            <meta charset="UTF-8"><title>Undangan Tidak Ditemukan</title>
            <style>body{font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;background:#062b20;color:#e8d5a3;text-align:center;}</style>
            </head><body>
            <div><h2>🌙 Link undangan tidak valid</h2><p>Silakan hubungi panitia untuk mendapatkan link yang benar.</p></div>
            </body></html>
        `);
    }
    // Serve the original root index.html
    res.sendFile(path.join(__dirname, '../index.html'));
});

// GET / — redirect to admin
app.get('/', (req, res) => {
    res.redirect('/admin');
});

module.exports = app;
