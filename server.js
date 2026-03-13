/**
 * server.js — Undangan Halal Bihalal PT WIG
 * Entry Point (Refactored)
 */
const app = require('./src/app');
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`\n✅  Server berjalan di http://localhost:${PORT}`);
    console.log(`📋  Admin panel: http://localhost:${PORT}/admin`);
    console.log(`📨  Contoh undangan: http://localhost:${PORT}/inv/<slug>\n`);
});
