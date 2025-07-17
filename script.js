let hospitalsData = {};
let allStates = [];

// Simple i18n dictionary
const translations = {
  en: {
    home: 'Home',
    contact_us: 'Contact Us',
    select_state: 'Select State:',
    medihelp: 'MediHelp!',
    top_5_hospitals: "India's Top 5 Hospitals",
    name: 'Name:',
    email: 'Email:',
    message: 'Message:',
    send: 'Send',
    search_placeholder: 'Search your state...',
    faq_heading: 'Frequently Asked Questions',
    faq_q1: 'How do I find hospitals in my state?',
    faq_a1: 'Use the search bar or dropdown to select your state.',
    faq_q2: 'How do I contact a hospital?',
    faq_a2: 'Click on a hospital card to see contact details and location.',
    faq_q3: 'How do I switch languages?',
    faq_a3: 'Use the 🌐 button in the navbar to switch between English and Hindi.',
    faq_q4: 'How do I contact MediHelp!?',
    faq_a4: 'Use the Contact Us page from the navigation bar.'
  },
  hi: {
    home: 'होम',
    contact_us: 'संपर्क करें',
    select_state: 'राज्य चुनें:',
    medihelp: 'मेडीहेल्प!',
    top_5_hospitals: 'भारत के शीर्ष 5 अस्पताल',
    name: 'नाम:',
    email: 'ईमेल:',
    message: 'संदेश:',
    send: 'भेजें',
    search_placeholder: 'अपना राज्य खोजें...',
    faq_heading: 'अक्सर पूछे जाने वाले प्रश्न',
    faq_q1: 'मैं अपने राज्य के अस्पताल कैसे ढूंढूं?',
    faq_a1: 'राज्य खोजने के लिए सर्च बार या ड्रॉपडाउन का उपयोग करें।',
    faq_q2: 'मैं किसी अस्पताल से कैसे संपर्क करूं?',
    faq_a2: 'संपर्क विवरण और स्थान देखने के लिए अस्पताल कार्ड पर क्लिक करें।',
    faq_q3: 'मैं भाषा कैसे बदलूं?',
    faq_a3: 'अंग्रेज़ी और हिंदी के बीच स्विच करने के लिए नेवबार में 🌐 बटन का उपयोग करें।',
    faq_q4: 'मैं MediHelp! से कैसे संपर्क करूं?',
    faq_a4: 'नेविगेशन बार से Contact Us पेज का उपयोग करें।'
  }
};
let currentLang = 'en';

// Load hospital data from JSON
fetch('hospitals.json')
  .then(res => res.json())
  .then(data => {
    hospitalsData = data;
    allStates = data.states || [];
    renderTopHospitals();
    populateStates();
    setupSearchBox();
    updateLangUI();
  });

// --- Dark Mode Toggle ---
const darkToggle = document.getElementById('dark-toggle');
darkToggle.onclick = function() {
  document.body.classList.toggle('dark');
  darkToggle.classList.toggle('active');
  localStorage.setItem('medihelp-dark', document.body.classList.contains('dark') ? '1' : '0');
};
// Load dark mode preference
if (localStorage.getItem('medihelp-dark') === '1') {
  document.body.classList.add('dark');
  darkToggle.classList.add('active');
}

// --- Back to Top Button ---
const backToTop = document.getElementById('back-to-top');
window.addEventListener('scroll', () => {
  if (window.scrollY > 200) {
    backToTop.style.display = 'block';
  } else {
    backToTop.style.display = 'none';
  }
});
backToTop.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });

// --- Animated Page Fade-in ---
document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('.container').classList.add('fade-in');
});

// --- Modal for Hospital Details ---
function showHospitalModal(hospital) {
  const modalOverlay = document.getElementById('modal-overlay');
  const modal = document.getElementById('modal');
  modal.innerHTML = `
    <button class="modal-close" onclick="closeModal()">&times;</button>
    <h2>${hospital.name}</h2>
    <p><b>Contact:</b> ${hospital.contact}</p>
    <p><b>Email:</b> ${hospital.email}</p>
    <iframe src="${hospital.maps}" allowfullscreen="" loading="lazy" style="width:100%;height:180px;border-radius:8px;margin-top:10px;"></iframe>
  `;
  modalOverlay.style.display = 'block';
  modal.style.display = 'block';
}
window.closeModal = function() {
  document.getElementById('modal-overlay').style.display = 'none';
  document.getElementById('modal').style.display = 'none';
};
document.getElementById('modal-overlay').onclick = window.closeModal;

// Patch: Add modal click to top hospitals
function patchTopHospitalCards() {
  document.querySelectorAll('.top-hospital-card').forEach((card, i) => {
    card.onclick = () => showHospitalModal(hospitalsData.topHospitals[i]);
    card.style.cursor = 'pointer';
  });
}
// Patch after rendering top hospitals
function renderTopHospitals() {
  const topHospitalsDiv = document.getElementById('top-hospitals');
  if (!hospitalsData.topHospitals) return;
  topHospitalsDiv.innerHTML = '';
  hospitalsData.topHospitals.forEach(hospital => {
    const card = document.createElement('div');
    card.className = 'top-hospital-card';
    card.innerHTML = `
      <h3>${hospital.name}</h3>
      <p><b>Contact:</b> ${hospital.contact}</p>
      <p><b>Email:</b> ${hospital.email}</p>
      <iframe src="${hospital.maps}" allowfullscreen="" loading="lazy"></iframe>
    `;
    topHospitalsDiv.appendChild(card);
  });
  patchTopHospitalCards();
}

function populateStates() {
  const stateSelect = document.getElementById('state');
  if (!hospitalsData.states) return;
  hospitalsData.states.forEach(state => {
    const option = document.createElement('option');
    option.value = state;
    option.textContent = state;
    stateSelect.appendChild(option);
  });
}

const stateSelect = document.getElementById('state');
stateSelect.addEventListener('change', function() {
  const selectedState = stateSelect.value;
  if (selectedState) {
    window.location.href = `state.html?state=${encodeURIComponent(selectedState)}`;
  }
});

// --- Search Box Logic ---
function setupSearchBox() {
  const searchInput = document.getElementById('state-search');
  const suggestions = document.getElementById('search-suggestions');
  searchInput.placeholder = translations[currentLang].search_placeholder;
  searchInput.addEventListener('input', function() {
    const val = searchInput.value.trim().toLowerCase();
    suggestions.innerHTML = '';
    if (!val) {
      suggestions.classList.remove('show');
      return;
    }
    const matches = allStates.filter(s => s.toLowerCase().includes(val));
    if (matches.length === 0) {
      suggestions.classList.remove('show');
      return;
    }
    matches.forEach(state => {
      const li = document.createElement('li');
      li.textContent = state;
      li.onclick = () => {
        window.location.href = `state.html?state=${encodeURIComponent(state)}`;
      };
      suggestions.appendChild(li);
    });
    suggestions.classList.add('show');
  });
  // Hide suggestions on blur
  searchInput.addEventListener('blur', () => setTimeout(() => suggestions.classList.remove('show'), 200));
}

// --- Multilanguage Logic ---
function updateLangUI() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (translations[currentLang][key]) {
      el.textContent = translations[currentLang][key];
    }
  });
  const searchInput = document.getElementById('state-search');
  if (searchInput) searchInput.placeholder = translations[currentLang].search_placeholder;
  // Update dropdown label
  document.getElementById('lang-selected').textContent = currentLang === 'hi' ? 'हिंदी' : 'EN';
}

// Dropdown logic
const langDropdownBtn = document.getElementById('lang-dropdown-btn');
const langDropdownList = document.getElementById('lang-dropdown-list');
langDropdownBtn.onclick = function(e) {
  e.stopPropagation();
  langDropdownList.classList.toggle('show');
};
document.querySelectorAll('.lang-option').forEach(opt => {
  opt.onclick = function() {
    currentLang = this.getAttribute('data-lang');
    updateLangUI();
    langDropdownList.classList.remove('show');
  };
});
document.body.addEventListener('click', () => langDropdownList.classList.remove('show'));

// Contact form handler (optional, can be expanded)
document.getElementById('contact-form').addEventListener('submit', function(e) {
  e.preventDefault();

  const name = document.getElementById('contact-name').value;
  const email = document.getElementById('contact-email').value;
  const message = document.getElementById('contact-message').value;

  // Replace with your actual Web App URL
  const webAppUrl = 'https://script.google.com/macros/s/AKfycbwSHvaZRelwy_t1SFTC0-Ubus_g6vhB7-Dol0oOqdlmurpMZbrAy6fOcaDz5NuJ_l2W/exec';

  fetch(webAppUrl, {
    method: 'POST',
    body: JSON.stringify({ name, email, message }),
    headers: { 'Content-Type': 'application/json' }
  })
  .then(res => res.json())
  .then(data => {
    document.getElementById('contact-message-status').textContent =
      'Your concern has been submitted.';
    alert('Response submitted');
    document.getElementById('contact-form').reset();
  })
  .catch(err => {
    document.getElementById('contact-message-status').textContent =
      'There was an error submitting your concern.';
  });
});

// --- Sticky Navbar Shadow on Scroll ---
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 10) {
    navbar.classList.add('navbar-scrolled');
  } else {
    navbar.classList.remove('navbar-scrolled');
  }
}); 