// ============ NAV SCROLL STATE ============
const header = document.getElementById('header');
window.addEventListener('scroll', ()=>{ header.classList.toggle('scrolled', window.scrollY > 20); });

// ============ MOBILE NAV TOGGLE ============
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
navToggle.addEventListener('click', ()=>{
  const open = navLinks.style.display === 'flex';
  navLinks.style.display = open ? 'none' : 'flex';
  navLinks.style.cssText += open ? '' : 'position:absolute;top:100%;left:0;right:0;flex-direction:column;background:#0d0f12;padding:20px 32px;border-bottom:1px solid #26292f;gap:18px;';
});
navLinks.querySelectorAll('a').forEach(a=>{
  a.addEventListener('click', ()=>{
    if(window.innerWidth <= 680){ navLinks.style.display = 'none'; }
  });
});

// ============ SCROLL REVEAL ============
const revealEls = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
},{threshold:.15});
revealEls.forEach(el=>io.observe(el));

// ============ HERO SCAN-LINE REVEAL ============
const stage = document.getElementById('carStage');
const scanLine = document.getElementById('scanLine');
const scanLabel = document.getElementById('scanLabel');
const hudScan = document.getElementById('hudScan');
const carPhotoLayer = document.getElementById('carPhotoLayer');
function updateScan(pct){
  scanLine.style.left = pct + '%';
  scanLabel.style.left = pct + '%';
  hudScan.textContent = Math.round(pct) + '%';
  carPhotoLayer.style.clipPath = `inset(0 0 0 ${pct}%)`;
}
function handleHeroScroll(){
  const rect = stage.getBoundingClientRect();
  const vh = window.innerHeight;
  let progress = 1 - (rect.top / vh);
  progress = Math.max(0, Math.min(1, progress));
  updateScan(20 + progress*60);
}
window.addEventListener('scroll', handleHeroScroll);
handleHeroScroll();

// ============ PORTFOLIO DATA (real project photography) ============
const projects = [
  {name:'Vapid Dominator — Livrée Carbon', type:'Retexture 3D', tags:['retexture','fivem'], img:'#', desc:'Retexture complète de carrosserie avec finition carbone mate et reflets calibrés.'},
  {name:'Bravado Buffalo — Sans Badge', type:'Débadge', tags:['debadge','fivem'], img:'p2-grille.jpg', desc:'Suppression totale des logos constructeur et lissage des zones concernées.'},
  {name:'Ocelot Jugular — Livrée Client', type:'Customisation', tags:['custom','fivem'], img:'p3-side.jpg', desc:'Livrée sur mesure aux couleurs d’une organisation RP, du concept à l’intégration.'},
  {name:'Pfister Comet — Rebadge', type:'Débadge', tags:['debadge','custom'], img:'p4-wheel.jpg', desc:'Remplacement des badges d’origine par un emblème personnalisé du client.'},
  {name:'Karin Sultan RS — Track Pack', type:'Retexture 3D', tags:['retexture'], img:'p5-headlight.jpg', desc:'Textures haute définition pour finition compétition, matériaux différenciés.'},
  {name:'Annis Elegy — Projet Sur Mesure', type:'Projet sur mesure', tags:['custom','retexture'], img:'p6-rear.jpg', desc:'Refonte visuelle complète selon un cahier des charges spécifique du client.'},

];

const grid = document.getElementById('portfolioGrid');
projects.forEach((p)=>{
  const card = document.createElement('div');
  card.className = 'p-card';
  card.dataset.tags = p.tags.join(',');
  card.innerHTML = `
    <div class="p-visual">
      <div class="p-tag">${p.tags[0]}</div>
      <img src="${p.img}" alt="${p.name} — ${p.type}" loading="lazy">
      <div class="mesh-overlay"></div>
    </div>
    <div class="p-body">
      <h3>${p.name}</h3>
      <div class="p-type">${p.type}</div>
      <p>${p.desc}</p>
      <a href="https://discord.gg/GHFwrrVECv" target="_blank" rel="noopener" class="p-link">Voir le projet <span class="arrow">→</span></a>
    </div>`;
  grid.appendChild(card);
});

// ============ PORTFOLIO FILTERS ============
const filterBtns = document.querySelectorAll('.filter-btn');
filterBtns.forEach(btn=>{
  btn.addEventListener('click', ()=>{
    filterBtns.forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    const f = btn.dataset.filter;
    document.querySelectorAll('.p-card').forEach(card=>{
      const match = f==='tous' || card.dataset.tags.split(',').includes(f);
      card.classList.toggle('hidden', !match);
    });
  });
});

// ============ BEFORE / AFTER SLIDER ============
const compareWrap = document.getElementById('compareWrap');
const compareAfter = compareWrap.querySelector('.compare-after');
const compareHandle = document.getElementById('compareHandle');
const compareRange = document.getElementById('compareRange');
function setCompare(val){
  compareAfter.style.clipPath = `inset(0 0 0 ${val}%)`;
  compareHandle.style.left = val + '%';
}
compareRange.addEventListener('input', e=> setCompare(e.target.value));
setCompare(50);

// ============ CONTACT FORM → DISCORD WEBHOOK ============
const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1538249886678519908/vijgnhOVBd4QjnHBa2ZtHMhWcBFhScsKtcfJjHOeqaFUjtkaHelQBkzo7lclwDGcy3J_';

const form = document.getElementById('contactForm');
const note = document.getElementById('formNote');
const errorNote = document.getElementById('formError');
const submitBtn = form.querySelector('.submit-btn');
const submitLabel = submitBtn.querySelector('.btn-label');

form.addEventListener('submit', async (e)=>{
  e.preventDefault();
  note.classList.remove('show');
  errorNote.classList.remove('show');

  const name = document.getElementById('fname').value.trim();
  const email = document.getElementById('femail').value.trim();
  const type = document.getElementById('ftype').value;
  const desc = document.getElementById('fdesc').value.trim();
  const budget = document.getElementById('fbudget').value.trim() || 'Non précisé';

  submitBtn.disabled = true;
  submitLabel.textContent = 'Envoi en cours…';

  const payload = {
    embeds: [{
      title: 'Nouvelle demande — Site APEX RENDER',
      color: 6002415, // accent blue
      fields: [
        { name: 'Nom / pseudo', value: name || 'Non renseigné', inline: true },
        { name: 'E-mail', value: email || 'Non renseigné', inline: true },
        { name: 'Type de prestation', value: type, inline: true },
        { name: 'Budget indicatif', value: budget, inline: true },
        { name: 'Description du projet', value: desc || 'Non renseignée' }
      ],
      timestamp: new Date().toISOString()
    }]
  };

  try{
    const res = await fetch(DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if(!res.ok) throw new Error('Webhook error ' + res.status);

    note.classList.add('show');
    submitLabel.textContent = 'Demande envoyée';
    form.reset();
  }catch(err){
    console.error('Discord webhook error:', err);
    errorNote.classList.add('show');
    submitBtn.disabled = false;
    submitLabel.textContent = 'Envoyer ma demande';
  }
});
