/**
 * Admin Logic API Module
 */

const BASE_URL = window.location.origin;  // e.g. https://wig.perusahaan.com

// ── Fetch & Render Guests ────────────────────────────────
async function loadGuests() {
    try {
        const res = await fetch('/api/guests');
        if (!res.ok) throw new Error('Network response was not ok');
        const guests = await res.json();
        renderGuests(guests);
    } catch (err) {
        showToast('❌ Gagal memuat data tamu');
        document.getElementById('guestList').innerHTML = '<div class="loading">Gagal memuat data.</div>';
    }
}

function renderGuests(guests) {
    const container = document.getElementById('guestList');
    const countEl = document.getElementById('guestCount');
    
    countEl.textContent = `${guests.length} tamu`;
    
    if (guests.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="icon">📋</div>
                <p>Belum ada undangan dibuat.<br>Tambahkan nama tamu di atas.</p>
            </div>`;
        return;
    }

    // Sort newest first
    const sorted = [...guests].sort((a, b) => b.id - a.id);
    
    container.innerHTML = sorted.map(guest => {
        const invLink = `${BASE_URL}/inv/${guest.slug}`;
        const initial = guest.name.trim()[0].toUpperCase();
        
        // Handling properti requires_gift (default true jika legacy data)
        const requiresGift = guest.requires_gift !== false;
        
        const giftBadge = requiresGift 
            ? `<span class="badge-gift yes" title="Tamu diharapkan membawa kado">🎁 Wajib Kado</span>`
            : `<span class="badge-gift no" title="Tamu tidak perlu membawa kado">Tdk Wajib Kado</span>`;

        return `
            <div class="guest-item" id="item-${guest.slug}">
                <div class="guest-avatar">${initial}</div>
                <div class="guest-info">
                    <div class="guest-name">
                        ${escHtml(guest.name)}
                        ${giftBadge}
                    </div>
                    <div class="guest-link">${invLink}</div>
                </div>
                <div class="guest-actions">
                    <button class="btn-copy-link" id="copy-${guest.slug}" onclick="copyLink('${invLink}', '${guest.slug}')">
                        Salin Link
                    </button>
                    <button class="btn-edit" onclick="openEditModal('${guest.slug}', '${escHtml(guest.name)}', ${requiresGift})">
                        Edit
                    </button>
                    <button class="btn-delete" onclick="deleteGuest('${guest.slug}', '${escHtml(guest.name)}')">
                        Hapus
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// ── Add Guest ────────────────────────────────────────────
async function addGuest() {
    const input = document.getElementById('guestNameInput');
    const giftCheckbox = document.getElementById('requiresGiftCheckbox');
    const btn = document.getElementById('btnAdd');
    
    const name = input.value.trim();
    const requires_gift = giftCheckbox.checked;
    
    if (!name) {
        showToast('⚠️ Nama tidak boleh kosong');
        input.focus();
        return;
    }

    btn.disabled = true;
    btn.textContent = 'Membuat...';

    try {
        const res = await fetch('/api/guests', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, requires_gift })
        });

        if (!res.ok) {
            const err = await res.json();
            showToast('❌ ' + (err.error || err.message || 'Kesalahan Server'));
            return;
        }

        const guest = await res.json();
        
        // Reset form
        input.value = '';
        giftCheckbox.checked = true; // reset ke default aktif
        
        await loadGuests();
        
        // Auto-copy the new link
        const invLink = `${BASE_URL}/inv/${guest.slug}`;
        copyLink(invLink, guest.slug);
        showToast(`✅ Undangan untuk "${guest.name}" dibuat! Link disalin.`);
    } catch (err) {
        showToast('❌ Gagal membuat undangan. Coba lagi.');
    } finally {
        btn.disabled = false;
        btn.textContent = '+ Buat Link';
    }
}

// ── Delete Guest ─────────────────────────────────────────
async function deleteGuest(slug, name) {
    if (!confirm(`Hapus undangan untuk "${name}"?`)) return;
    
    try {
        const res = await fetch(`/api/guests/${slug}`, { method: 'DELETE' });
        if (!res.ok) throw new Error();
        
        // Animate removal
        const item = document.getElementById(`item-${slug}`);
        if (item) {
            item.style.transition = 'opacity 0.2s, transform 0.2s';
            item.style.opacity = '0';
            item.style.transform = 'translateX(20px)';
            setTimeout(() => loadGuests(), 220);
        }
        showToast(`🗑️ Undangan "${name}" dihapus`);
    } catch {
        showToast('❌ Gagal menghapus. Coba lagi.');
    }
}

// ── Copy Link ────────────────────────────────────────────
async function copyLink(link, slug) {
    try {
        await navigator.clipboard.writeText(link);
    } catch {
        // Fallback
        const ta = document.createElement('textarea');
        ta.value = link;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        ta.remove();
    }
    
    const btn = document.getElementById(`copy-${slug}`);
    if (btn) {
        const originalText = btn.textContent;
        btn.textContent = '✓ Tersalin!';
        btn.classList.add('copied');
        setTimeout(() => {
            btn.textContent = originalText;
            btn.classList.remove('copied');
        }, 2500);
    }
}

// ── Edit Guest ───────────────────────────────────────────
function openEditModal(slug, name, requiresGift) {
    document.getElementById('editGuestSlug').value = slug;
    
    // Decode HTML entities that were encoded in UI
    const txtArea = document.createElement('textarea');
    txtArea.innerHTML = name;
    document.getElementById('editGuestName').value = txtArea.value;
    
    document.getElementById('editGuestGift').checked = requiresGift;
    
    document.getElementById('editModalOverlay').classList.add('show');
    document.getElementById('editGuestName').focus();
}

function closeEditModal() {
    document.getElementById('editModalOverlay').classList.remove('show');
}

async function saveEditedGuest() {
    const slug = document.getElementById('editGuestSlug').value;
    const nameInput = document.getElementById('editGuestName');
    const giftCheckbox = document.getElementById('editGuestGift');
    const btnSave = document.getElementById('btnSaveEdit');
    
    const newName = nameInput.value.trim();
    const newRequiresGift = giftCheckbox.checked;

    if (!newName) {
        showToast('⚠️ Nama tamu tidak boleh kosong');
        nameInput.focus();
        return;
    }

    btnSave.disabled = true;
    btnSave.textContent = 'Menyimpan...';

    try {
        const res = await fetch(`/api/guests/${slug}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: newName, requires_gift: newRequiresGift })
        });

        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error || 'Server error');
        }

        closeEditModal();
        showToast('✅ Data tamu berhasil diperbarui');
        await loadGuests();
        
    } catch (error) {
        showToast(`❌ Gagal memperbarui: ${error.message}`);
    } finally {
        btnSave.disabled = false;
        btnSave.textContent = 'Simpan Perubahan';
    }
}

// ── Toast ─────────────────────────────────────────────────
function showToast(msg) {
    const toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3500);
}

// ── Utilities ─────────────────────────────────────────────
function escHtml(str) {
    return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

// ── Init ──────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    loadGuests();

    // Enter key to submit
    document.getElementById('guestNameInput').addEventListener('keypress', e => {
        if (e.key === 'Enter') addGuest();
    });
});
