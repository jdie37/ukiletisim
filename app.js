/* =======================================================
   UK İLETİŞİM — app.js
   
   HOW YOUR DATA WORKS:
   ─────────────────────────────────────────────────────────
   Right now the website uses the SAMPLE DATA below.
   
   To manage data with Google Sheets:
   1. Open Google Sheets with your existing Google account
   2. Create a sheet with columns:
      id | name | career | bio | keyfact | image_url
   3. Go to File → Share → Publish to web
      → Choose "Comma-separated values (.csv)"
      → Click Publish → Copy the URL
   4. Paste the URL below in GOOGLE_SHEETS_CSV_URL
   5. Change USE_GOOGLE_SHEETS to true
   
   To add/edit a talent:
   - Just edit the Google Sheet (like Excel) — the website
     automatically updates within a few minutes.
   
   For photos:
   - Upload actor photos to https://imgbb.com (free)
   - Copy the "Direct link" and paste it in the image_url column
   ======================================================= */

/* ── CONFIG ── */
const USE_GOOGLE_SHEETS = false; // Change to true after setting up Google Sheets
const GOOGLE_SHEETS_CSV_URL = ""; // Paste your published CSV URL here

/* ── SAMPLE DATA ──
   Replace this with real data, or connect Google Sheets above.
   Each talent needs: id, name, career, bio, keyfact, image_url
   Leave bio/keyfact empty ("") if you don't have info yet.
*/
const SAMPLE_TALENTS = [
  {
    id: "pers-001",
    name: "Faruk Aran",
    career: "Actor",
    bio: "A commanding presence on screen and stage, Faruk Aran brings depth and authenticity to every role he takes on. Known for his versatility and range across drama and action genres.",
    keyfact: "Starred in over 20 major theatrical productions and several acclaimed television series.",
    image_url: ""
  },
  {
    id: "pers-002",
    name: "Beyemre",
    career: "Actor & Model",
    bio: "With a natural charisma that translates effortlessly across all mediums, Beyemre has carved out a unique space in Turkish entertainment through powerful storytelling.",
    keyfact: "Featured in international fashion campaigns while maintaining an active acting career.",
    image_url: ""
  },
  {
    id: "pers-003",
    name: "Gokhan Alkan",
    career: "Actor",
    bio: "Gokhan Alkan is celebrated for his brooding on-screen presence and emotionally resonant performances. His work spans film, television, and theatre.",
    keyfact: "Won the prestigious Best Actor award at the Antalya Golden Orange Film Festival.",
    image_url: ""
  },
  {
    id: "pers-004",
    name: "Leya Kirsan",
    career: "Actress & Poet",
    bio: "A multi-faceted artist, Leya Kirsan blends her passion for literature and performing arts to create unforgettable characters that linger long after the curtain falls.",
    keyfact: "Collaborated with renowned poets to create a spoken word project that toured 8 cities.",
    image_url: ""
  },
  {
    id: "pers-005",
    name: "Keles Ugurcan",
    career: "Actor & Painter",
    bio: "Dynamic artist with a flair for painting and social justice activism. Keles brings an activist's eye and painter's sensitivity to each of his performances.",
    keyfact: "Created a viral public art installation seen by over 500,000 people.",
    image_url: ""
  },
  {
    id: "pers-006",
    name: "Orkun Sevinc",
    career: "Actor & Adventurer",
    bio: "Known for pushing boundaries both in his roles and in life, Orkun Sevinc is as comfortable on a film set as he is on a mountain summit.",
    keyfact: "Climbed Mount Elbrus while simultaneously preparing for a lead role in a major production.",
    image_url: ""
  },
  {
    id: "pers-007",
    name: "Hannah Lee",
    career: "Actress & Scientist",
    bio: "Genius scientist and empathetic actress — Hannah defies categorization. Her performances bring an intellectual rigor and emotional intelligence rarely seen on screen.",
    keyfact: "Developed an AI-powered script analysis tool now used by major production houses.",
    image_url: ""
  },
  {
    id: "pers-008",
    name: "Ivan Sanchez",
    career: "Actor & Entrepreneur",
    bio: "High-energy entrepreneur and charismatic actor, Ivan Sanchez brings boundless energy to every project, both on screen and in the boardroom.",
    keyfact: "Started three successful tech startups while maintaining a full acting career.",
    image_url: ""
  }
];

/* =======================================================
   ── CORE FUNCTIONS ──
   You don't need to edit anything below this line.
   ======================================================= */

/* Generate initials avatar color based on name */
function getAvatarColor(name) {
  const colors = [
    ['#1a2540', '#0d1a3a'],
    ['#1a1040', '#0d0a2a'],
    ['#0d2540', '#061a30'],
    ['#251a10', '#1a0f06'],
    ['#102540', '#061830'],
    ['#1a1025', '#0f0a1a'],
    ['#251025', '#1a0819'],
    ['#102520', '#061a14'],
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + hash * 31;
  return colors[Math.abs(hash) % colors.length];
}

/* Get initials from a name */
function getInitials(name) {
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

/* Build the image HTML — real photo or styled initials fallback */
function buildImageHTML(talent, classes) {
  if (talent.image_url && talent.image_url.trim() !== '') {
    return `<img
      class="${classes}"
      src="${escapeHTML(talent.image_url)}"
      alt="${escapeHTML(talent.name)}"
      loading="lazy"
      onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
    />
    <div class="${classes.replace('card-image','card-image-fallback').replace('detail-photo','detail-photo-fallback')}"
      style="display:none; background: linear-gradient(135deg, ${getAvatarColor(talent.name)[0]}, ${getAvatarColor(talent.name)[1]});"
    >${getInitials(talent.name)}</div>`;
  }
  const [c1, c2] = getAvatarColor(talent.name);
  const isFallbackClass = classes.includes('card-image') ? 'card-image-fallback' : 'detail-photo-fallback';
  return `<div class="${isFallbackClass}" style="background: linear-gradient(135deg, ${c1}, ${c2});">${getInitials(talent.name)}</div>`;
}

/* Sanitize text to prevent XSS */
function escapeHTML(str) {
  const d = document.createElement('div');
  d.appendChild(document.createTextNode(str || ''));
  return d.innerHTML;
}

/* ── RENDER CARDS (index page) ── */
function renderCards(talents) {
  const grid = document.getElementById('talentsGrid');
  const countEl = document.getElementById('talentCount');
  if (!grid) return;

  if (talents.length === 0) {
    grid.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🎭</div>
        <p class="empty-text">No talents found</p>
        <p class="empty-sub">Try a different search term</p>
      </div>`;
    if (countEl) countEl.textContent = '';
    return;
  }

  if (countEl) countEl.textContent = `${talents.length} talent${talents.length !== 1 ? 's' : ''}`;

  grid.innerHTML = talents.map((t, i) => `
    <a
      class="card"
      href="actor.html?id=${encodeURIComponent(t.id)}"
      role="listitem"
      aria-label="View profile of ${escapeHTML(t.name)}"
      style="animation-delay: ${Math.min(i * 0.05 + 0.05, 0.45)}s"
    >
      ${buildImageHTML(t, 'card-image')}
      <div class="card-overlay"></div>
      <div class="card-info">
        <p class="card-name">${escapeHTML(t.name)}</p>
        <p class="card-career">${escapeHTML(t.career || '')}</p>
      </div>
      <div class="card-arrow">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="9 18 15 12 9 6"/>
        </svg>
      </div>
    </a>
  `).join('');
}

/* ── SEARCH FILTER ── */
function initSearch(allTalents) {
  const input = document.getElementById('searchInput');
  if (!input) return;

  input.addEventListener('input', () => {
    const query = input.value.trim().toLowerCase();
    if (!query) {
      renderCards(allTalents);
      return;
    }
    const filtered = allTalents.filter(t =>
      t.name.toLowerCase().includes(query) ||
      (t.career || '').toLowerCase().includes(query)
    );
    renderCards(filtered);
  });
}

/* ── RENDER DETAIL PAGE ── */
function renderDetail(talent) {
  // Update page title
  document.title = `${talent.name} — UK İletişim`;

  // Hero section
  const hero = document.getElementById('detailHero');
  if (hero) {
    hero.innerHTML = `
      <div class="detail-photo-wrapper">
        ${buildImageHTML(talent, 'detail-photo')}
      </div>
      <h1 class="detail-name">${escapeHTML(talent.name)}</h1>
      ${talent.career ? `<span class="detail-career">${escapeHTML(talent.career)}</span>` : ''}
    `;
  }

  // Content section
  const content = document.getElementById('detailContent');
  if (content) {
    let html = '<div class="detail-divider"></div>';

    // Bio
    if (talent.bio && talent.bio.trim()) {
      html += `
        <div class="detail-section">
          <p class="detail-section-title">About</p>
          <p class="detail-bio">${escapeHTML(talent.bio)}</p>
        </div>
      `;
    }

    // Key Fact
    if (talent.keyfact && talent.keyfact.trim()) {
      html += `
        <div class="detail-section">
          <p class="detail-section-title">Key Fact</p>
          <div class="keyfact-card">
            <div class="keyfact-row">
              <span class="keyfact-label">Interesting Fact</span>
              <span class="keyfact-value">${escapeHTML(talent.keyfact)}</span>
            </div>
          </div>
        </div>
      `;
    }

    // If nothing filled in yet
    if (!talent.bio && !talent.keyfact) {
      html += `<p class="no-content">Profile details coming soon.</p>`;
    }

    content.innerHTML = html;
  }
}

/* ── DETAIL PAGE: NOT FOUND ── */
function renderNotFound() {
  const hero = document.getElementById('detailHero');
  if (hero) {
    hero.innerHTML = `
      <div style="text-align:center; padding: 60px 20px;">
        <p style="font-size:64px; margin-bottom:16px;">🎭</p>
        <h1 class="detail-name">Talent Not Found</h1>
        <p style="color: var(--text-secondary); margin-top: 12px;">This profile doesn't exist.</p>
        <a href="index.html" class="back-btn" style="margin-top: 24px; display: inline-flex;">← Back to all talents</a>
      </div>`;
  }
}

/* ── PARSE CSV (for Google Sheets) ── */
function parseCSV(text) {
  const lines = text.trim().split('\n');
  if (lines.length < 2) return [];
  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
  return lines.slice(1).map(line => {
    const values = [];
    let cur = '', inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') { inQuotes = !inQuotes; continue; }
      if (ch === ',' && !inQuotes) { values.push(cur.trim()); cur = ''; continue; }
      cur += ch;
    }
    values.push(cur.trim());
    const obj = {};
    headers.forEach((h, i) => obj[h] = values[i] || '');
    return obj;
  }).filter(t => t.id && t.name); // Skip empty rows
}

/* ── LOAD TALENTS ── */
async function loadTalents() {
  if (USE_GOOGLE_SHEETS && GOOGLE_SHEETS_CSV_URL) {
    try {
      const resp = await fetch(GOOGLE_SHEETS_CSV_URL);
      const text = await resp.text();
      return parseCSV(text);
    } catch (e) {
      console.warn('Could not load Google Sheets data. Using sample data.', e);
      return SAMPLE_TALENTS;
    }
  }
  return SAMPLE_TALENTS;
}

/* ── MAIN ENTRY POINT ── */
async function init() {
  const talents = await loadTalents();

  // INDEX PAGE
  if (document.getElementById('talentsGrid')) {
    renderCards(talents);
    initSearch(talents);
  }

  // DETAIL PAGE
  if (document.getElementById('detailHero')) {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    const talent = talents.find(t => t.id === id);
    if (talent) {
      renderDetail(talent);
    } else {
      renderNotFound();
    }
  }
}

/* Start */
document.addEventListener('DOMContentLoaded', init);
