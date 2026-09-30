/**
 * मुख्य नियंत्रक (Main Application Orchestrator)
 * Connects Audio, Particles, Cinematic Film, 3D Booklet, WhatsApp Share,
 * Calendar ICS Generation, and Wishes Guestbook.
 */
document.addEventListener('DOMContentLoaded', () => {
  // Initialize Subsystems
  const petalEngine = new RoyalPetalEngine('petalCanvas');
  const audioCtrl = new RoyalAudioController();
  const cinematicFilm = new RoyalCinematicFilm(audioCtrl);
  const booklet3D = new Royal3DBooklet(audioCtrl);
  const videoRecorder = new RoyalVideoRecorder(audioCtrl);

  // Welcome Overlay Handling
  const welcomeOverlay = document.getElementById('welcomeOverlay');
  const btnEnterInvitation = document.getElementById('btnEnterInvitation');
  const btnEnterMuted = document.getElementById('btnEnterMuted');

  function enterInvitation(withMusic = true) {
    if (welcomeOverlay) {
      welcomeOverlay.classList.add('hidden');
    }
    if (withMusic) {
      audioCtrl.play();
    }
    // Start Cinematic Film
    cinematicFilm.start();
  }

  if (btnEnterInvitation) {
    btnEnterInvitation.addEventListener('click', () => enterInvitation(true));
  }
  if (btnEnterMuted) {
    btnEnterMuted.addEventListener('click', () => enterInvitation(false));
  }

  // Mode Toggle (Cinematic vs Booklet)
  const btnModeCinematic = document.getElementById('btnModeCinematic');
  const btnModeBooklet = document.getElementById('btnModeBooklet');
  const cinematicContainer = document.getElementById('cinematicContainer');
  const bookletContainer = document.getElementById('bookletContainer');

  function switchToCinematic() {
    document.body.classList.remove('mode-booklet');
    document.body.classList.add('mode-cinematic');
    btnModeCinematic.classList.add('active');
    btnModeBooklet.classList.remove('active');
    btnModeCinematic.setAttribute('aria-selected', 'true');
    btnModeBooklet.setAttribute('aria-selected', 'false');

    cinematicContainer.classList.remove('hidden');
    bookletContainer.classList.add('hidden');
    cinematicContainer.style.display = 'flex';
    bookletContainer.style.display = 'none';

    window.scrollTo({ top: 0, behavior: 'instant' });
    cinematicFilm.play();
  }

  function switchToBooklet(targetPage = 1) {
    document.body.classList.remove('mode-cinematic');
    document.body.classList.add('mode-booklet');
    btnModeBooklet.classList.add('active');
    btnModeCinematic.classList.remove('active');
    btnModeBooklet.setAttribute('aria-selected', 'true');
    btnModeCinematic.setAttribute('aria-selected', 'false');

    cinematicContainer.classList.add('hidden');
    bookletContainer.classList.remove('hidden');
    cinematicContainer.style.display = 'none';
    bookletContainer.style.display = 'flex';

    window.scrollTo({ top: 0, behavior: 'instant' });
    cinematicFilm.pause();
    booklet3D.goToPage(targetPage, true);
  }

  if (btnModeCinematic) btnModeCinematic.addEventListener('click', switchToCinematic);
  if (btnModeBooklet) btnModeBooklet.addEventListener('click', () => switchToBooklet(1));

  // Quick navigation buttons from film to booklet
  const btnSkipToBooklet = document.getElementById('btnSkipToBooklet');
  const btnOpenBookletFromFilm = document.getElementById('btnOpenBookletFromFilm');

  if (btnSkipToBooklet) btnSkipToBooklet.addEventListener('click', () => switchToBooklet(1));
  if (btnOpenBookletFromFilm) btnOpenBookletFromFilm.addEventListener('click', () => switchToBooklet(1));

  // Audio Toggle
  const btnAudioToggle = document.getElementById('btnAudioToggle');
  if (btnAudioToggle) {
    btnAudioToggle.addEventListener('click', () => {
      audioCtrl.toggle();
    });
  }

  // Petals Shower Toggle
  const btnPetalsToggle = document.getElementById('btnPetalsToggle');
  const petalsIcon = document.getElementById('petalsIcon');
  if (btnPetalsToggle) {
    btnPetalsToggle.addEventListener('click', () => {
      const active = petalEngine.toggle();
      if (petalsIcon) petalsIcon.textContent = active ? '🌸' : '🍂';
    });
  }

  // Fullscreen Toggle
  const btnFullscreen = document.getElementById('btnFullscreen');
  if (btnFullscreen) {
    btnFullscreen.addEventListener('click', () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
      } else {
        document.exitFullscreen().catch(() => {});
      }
    });
  }

  // WhatsApp Share Functionality
  function generateWhatsAppMessage() {
    return `॥ श्री गणेशाय नमः ॥\n॥ शुभ विवाह ॥\n\nपरमपिता परमात्मा एवं कुलदेवी के असीम आशीर्वाद से हमारे परिवार के प्रिय:\n\nवर: चि. शशांक गुर्जर\n(सुपुत्र: श्रीमती ज्ञानेश्वरी जी एवं श्री प्रवीणजी गुर्जर)\nसंग\nवधू: आयु. अर्चना पाण्डेय\n(सुपुत्री: श्रीमती बाबिताजी पाण्डेय एवं श्री कृष्ण कुमार जी पाण्डेय)\n\nका पावन परिणय संस्कार तय हुआ है।\n\n🗓️ विवाह तिथि: 10 दिसंबर\n📍 स्थल: KRB, Kadola, Harda\n\nमांगलिक कार्यक्रम:\n• 7 दिसंबर: मिट्टी (प्रातः 7:30 – 8:30 बजे)\n• 8 दिसंबर: माता पूजन (सायं 4:00 बजे) एवं गणेश पूजन (सायं 7:00 बजे)\n• 9 दिसंबर: मंडप (प्रातः 7:30 बजे), हल्दी (अपराह्न 3:00 बजे), सगाई (सायं 4:30 बजे), तत्पश्चात महिला संगीत\n• 10 दिसंबर: स्वरुचि भोज (प्रातः 10:00 बजे से), शादी (अपराह्न 1:30 – 3:00 बजे), बारात (सायं 5:00 बजे)\n\n"आपकी उपस्थिति हमारे लिए सम्मान, आपका स्नेह हमारी खुशी, और आपका आशीर्वाद हमारा सबसे अनमोल उपहार है।"\n\nसादर आमंत्रित: गुर्जर एवं पाण्डेय परिवार\n\nडिजिटल निमंत्रण पत्र देखें:\n${window.location.href}`;
  }

  function shareOnWhatsApp() {
    const text = encodeURIComponent(generateWhatsAppMessage());
    const waUrl = `https://api.whatsapp.com/send?text=${text}`;
    window.open(waUrl, '_blank');
  }

  const btnShareWhatsApp = document.getElementById('btnShareWhatsApp');
  const btnShareBookletWhatsApp = document.getElementById('btnShareBookletWhatsApp');
  if (btnShareWhatsApp) btnShareWhatsApp.addEventListener('click', shareOnWhatsApp);
  if (btnShareBookletWhatsApp) btnShareBookletWhatsApp.addEventListener('click', shareOnWhatsApp);

  // Add to Calendar (.ICS file download)
  const btnAddToCalendar = document.getElementById('btnAddToCalendar');
  if (btnAddToCalendar) {
    btnAddToCalendar.addEventListener('click', () => {
      // 10 December Event
      const icsContent = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Shashank and Archana Royal Wedding//HI',
        'CALSCALE:GREGORIAN',
        'METHOD:PUBLISH',
        'BEGIN:VEVENT',
        'UID:shashank-archana-wedding-10dec',
        'DTSTART;VALUE=DATE:20261210',
        'DTEND;VALUE=DATE:20261211',
        'SUMMARY:शुभ विवाह - शशांक संग अर्चना (Shashank & Archana Wedding)',
        'DESCRIPTION:श्री शशांक गुर्जर एवं सुश्री अर्चना पाण्डेय का पावन परिणय संस्कार।\\nसमय: 10 दिसंबर को प्रातः 10:00 बजे से स्वरुचि भोज, अपराह्न 1:30 बजे शादी, सायं 5:00 बजे बारात।',
        'LOCATION:KRB, Kadola, Harda',
        'STATUS:CONFIRMED',
        'END:VEVENT',
        'END:VCALENDAR'
      ].join('\r\n');

      const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.setAttribute('download', 'Shashank_Archana_Wedding_10Dec.ics');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }

  // Blessings / Ashirwad Guestbook Modal
  const blessingsModal = document.getElementById('blessingsModal');
  const btnOpenBlessingsModal = document.getElementById('btnOpenBlessingsModal');
  const btnCloseBlessingsModal = document.getElementById('btnCloseBlessingsModal');
  const blessingForm = document.getElementById('blessingForm');
  const blessingsList = document.getElementById('blessingsList');

  // Sample initial blessings
  const defaultBlessings = [
    { name: 'श्री रमेश जी गुर्जर', city: 'हरदा', message: 'चि. शशांक और आयु. अर्चना को परिणय सूत्र में बंधने पर अनंत बधाई व स्नेहिल आशीर्वाद।' },
    { name: 'श्रीमती सुनीता एवं अनिल पाण्डेय', city: 'भोपाल', message: 'सुखी और समृद्ध दांपत्य जीवन के लिए प्रभु श्री राम और माता जानकी का आशीर्वाद आप पर सदैव बना रहे।' },
    { name: 'राकेश शर्मा सपरिवार', city: 'इंदौर', message: 'विवाह की हार्दिक शुभकामनाएँ! नवयुगल सदा खुश रहे।' }
  ];

  function getSavedBlessings() {
    try {
      const stored = localStorage.getItem('royal_wedding_blessings');
      return stored ? JSON.parse(stored) : defaultBlessings;
    } catch (e) {
      return defaultBlessings;
    }
  }

  function saveBlessings(list) {
    try {
      localStorage.setItem('royal_wedding_blessings', JSON.stringify(list));
    } catch (e) {}
  }

  function renderBlessings() {
    if (!blessingsList) return;
    const list = getSavedBlessings();
    blessingsList.innerHTML = '';
    list.forEach(item => {
      const div = document.createElement('div');
      div.className = 'blessing-entry';
      div.innerHTML = `
        <div>
          <span class="blessing-author">${escapeHtml(item.name)}</span>
          ${item.city ? `<span class="blessing-city">(${escapeHtml(item.city)})</span>` : ''}
        </div>
        <p class="blessing-text">“${escapeHtml(item.message)}”</p>
      `;
      blessingsList.appendChild(div);
    });
  }

  function escapeHtml(str) {
    return (str || '').replace(/[&<>"']/g, (m) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    })[m]);
  }

  if (btnOpenBlessingsModal) {
    btnOpenBlessingsModal.addEventListener('click', () => {
      renderBlessings();
      if (blessingsModal) blessingsModal.classList.remove('hidden');
    });
  }

  if (btnCloseBlessingsModal) {
    btnCloseBlessingsModal.addEventListener('click', () => {
      if (blessingsModal) blessingsModal.classList.add('hidden');
    });
  }

  if (blessingForm) {
    blessingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const nameInput = document.getElementById('guestName');
      const cityInput = document.getElementById('guestCity');
      const msgInput = document.getElementById('guestMessage');

      const name = nameInput.value.trim();
      const city = cityInput.value.trim();
      const msg = msgInput.value.trim();

      if (name && msg) {
        const list = getSavedBlessings();
        list.unshift({ name, city, message: msg });
        saveBlessings(list);
        renderBlessings();

        // Reset form
        nameInput.value = '';
        cityInput.value = '';
        msgInput.value = '';

        alert('आपका स्नेहभरा आशीर्वाद सफलतापूर्वक दर्ज हो गया है! धन्यवाद।');
      }
    });
  }

  // Close modals on clicking outside
  window.addEventListener('click', (e) => {
    if (e.target === blessingsModal) {
      blessingsModal.classList.add('hidden');
    }
    const exportModal = document.getElementById('videoExportModal');
    if (e.target === exportModal) {
      exportModal.classList.add('hidden');
    }
  });

  // Pre-render blessings
  renderBlessings();
});
