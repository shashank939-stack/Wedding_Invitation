/**
 * सिनेमैटिक विवाह फिल्म संचालक (Cinematic Wedding Film Engine)
 * Controls 5 distinct royal scenes with accurate timelines, smooth transitions,
 * audio triggers, and scrubber interaction.
 */
class RoyalCinematicFilm {
  constructor(audioController) {
    this.audioController = audioController;
    this.currentScene = 1;
    this.totalScenes = 5;
    this.isPlaying = false;
    this.elapsedTime = 0; // In seconds
    
    // Scene durations in seconds (Total: 70 seconds)
    this.sceneDurations = [12, 14, 15, 14, 15];
    this.totalDuration = this.sceneDurations.reduce((a, b) => a + b, 0);

    // DOM Elements
    this.container = document.getElementById('cinematicContainer');
    this.scenes = document.querySelectorAll('.film-scene');
    this.btnPlayPause = document.getElementById('btnFilmPlayPause');
    this.playPauseIcon = document.getElementById('filmPlayPauseIcon');
    this.btnRestart = document.getElementById('btnFilmRestart');
    this.progressBarFill = document.getElementById('progressBarFill');
    this.progressThumb = document.getElementById('progressThumb');
    this.progressBarContainer = document.getElementById('progressBarContainer');
    this.currentTimeDisplay = document.getElementById('currentTimeDisplay');
    this.totalTimeDisplay = document.getElementById('totalTimeDisplay');
    this.scenePills = document.querySelectorAll('.scene-pill');

    this.timerInterval = null;
    this.init();
  }

  init() {
    this.updateTotalTimeDisplay();
    this.bindEvents();
  }

  bindEvents() {
    if (this.btnPlayPause) {
      this.btnPlayPause.addEventListener('click', () => this.togglePlayPause());
    }

    if (this.btnRestart) {
      this.btnRestart.addEventListener('click', () => {
        this.seekTo(0);
        this.play();
      });
    }

    if (this.progressBarContainer) {
      this.progressBarContainer.addEventListener('click', (e) => {
        const rect = this.progressBarContainer.getBoundingClientRect();
        const clickRatio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        this.seekTo(clickRatio * this.totalDuration);
      });
    }

    // Scene jump pills
    this.scenePills.forEach(pill => {
      pill.addEventListener('click', () => {
        const sceneNum = parseInt(pill.getAttribute('data-jump-scene'), 10);
        this.jumpToScene(sceneNum);
      });
    });

    // Replay button on Scene 5
    const btnReplay = document.getElementById('btnReplayFilm');
    if (btnReplay) {
      btnReplay.addEventListener('click', () => {
        this.seekTo(0);
        this.play();
      });
    }
  }

  updateTotalTimeDisplay() {
    if (this.totalTimeDisplay) {
      this.totalTimeDisplay.textContent = this.formatTime(this.totalDuration);
    }
  }

  formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  play() {
    this.isPlaying = true;
    if (this.playPauseIcon) this.playPauseIcon.textContent = '⏸️';
    
    // Play or synchronize wedding music
    if (this.audioController) {
      this.audioController.play();
    }

    clearInterval(this.timerInterval);
    this.timerInterval = setInterval(() => {
      this.tick();
    }, 100);
  }

  pause() {
    this.isPlaying = false;
    if (this.playPauseIcon) this.playPauseIcon.textContent = '▶️';
    clearInterval(this.timerInterval);
    if (this.audioController) {
      this.audioController.pause();
    }
  }

  togglePlayPause() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  tick() {
    this.elapsedTime += 0.1;

    if (this.elapsedTime >= this.totalDuration) {
      this.elapsedTime = this.totalDuration;
      this.pause();
      this.updateProgressUI();
      return;
    }

    this.syncSceneWithTime();
    this.updateProgressUI();
  }

  syncSceneWithTime() {
    let accumulated = 0;
    let targetScene = 1;

    for (let i = 0; i < this.sceneDurations.length; i++) {
      accumulated += this.sceneDurations[i];
      if (this.elapsedTime < accumulated) {
        targetScene = i + 1;
        break;
      }
      if (i === this.sceneDurations.length - 1) {
        targetScene = this.totalScenes;
      }
    }

    if (targetScene !== this.currentScene) {
      this.transitionToScene(targetScene);
    }

    // Special scene internal micro-animations (e.g. sequentially highlight ritual cards in Scene 3)
    if (this.currentScene === 3) {
      this.animateRitualCards();
    }
  }

  animateRitualCards() {
    const startOfScene3 = this.sceneDurations[0] + this.sceneDurations[1];
    const timeInScene = this.elapsedTime - startOfScene3;
    const cards = document.querySelectorAll('.ritual-cinema-card');
    
    cards.forEach((card, index) => {
      // Light up each card in 3-second segments
      if (timeInScene >= index * 3.2) {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0) scale(1)';
      } else {
        card.style.opacity = '0.4';
        card.style.transform = 'translateY(8px) scale(0.97)';
      }
    });
  }

  transitionToScene(sceneNum) {
    this.currentScene = sceneNum;

    this.scenes.forEach(scene => {
      const num = parseInt(scene.getAttribute('data-scene'), 10);
      if (num === sceneNum) {
        scene.classList.add('active');
      } else {
        scene.classList.remove('active');
      }
    });

    // Update scene pills
    this.scenePills.forEach(pill => {
      const num = parseInt(pill.getAttribute('data-jump-scene'), 10);
      if (num === sceneNum) {
        pill.classList.add('active');
      } else {
        pill.classList.remove('active');
      }
    });

    // Audio triggers
    if (sceneNum === 1 && this.audioController) {
      this.audioController.playTempleBell();
    }
  }

  jumpToScene(sceneNum) {
    let targetTime = 0;
    for (let i = 0; i < sceneNum - 1; i++) {
      targetTime += this.sceneDurations[i];
    }
    this.seekTo(targetTime + 0.1);
  }

  seekTo(seconds) {
    this.elapsedTime = Math.max(0, Math.min(this.totalDuration, seconds));
    if (this.audioController) {
      this.audioController.seekTo(this.elapsedTime);
    }
    this.syncSceneWithTime();
    this.updateProgressUI();
  }

  updateProgressUI() {
    const progressPercent = (this.elapsedTime / this.totalDuration) * 100;
    if (this.progressBarFill) {
      this.progressBarFill.style.width = `${progressPercent}%`;
    }
    if (this.progressThumb) {
      this.progressThumb.style.left = `${progressPercent}%`;
    }
    if (this.currentTimeDisplay) {
      this.currentTimeDisplay.textContent = this.formatTime(this.elapsedTime);
    }
  }

  start() {
    this.transitionToScene(1);
    this.seekTo(0);
    this.play();
  }
}

window.RoyalCinematicFilm = RoyalCinematicFilm;
