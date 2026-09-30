/**
 * पारंपरिक विवाह संगीत नियंत्रक (Royal Audio Controller)
 * Plays the user's selected sacred audio track (Aigiri Nandini / Mahishasurmardini Stotra)
 */
class RoyalAudioController {
  constructor() {
    this.audioEl = document.getElementById('weddingAudio');
    this.isPlaying = false;
    this.isMuted = false;
    this.init();
  }

  init() {
    if (this.audioEl) {
      this.audioEl.volume = 0.85;

      this.audioEl.addEventListener('play', () => {
        this.isPlaying = true;
        this.updateUI();
      });

      this.audioEl.addEventListener('pause', () => {
        this.isPlaying = false;
        this.updateUI();
      });

      this.audioEl.addEventListener('ended', () => {
        this.isPlaying = false;
        this.updateUI();
      });
    }
  }

  play() {
    if (!this.audioEl) return;
    this.audioEl.muted = false;
    const playPromise = this.audioEl.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        this.isPlaying = true;
        this.updateUI();
      }).catch(err => {
        console.warn('Audio playback requires user interaction:', err);
      });
    }
  }

  pause() {
    if (!this.audioEl) return;
    this.audioEl.pause();
    this.isPlaying = false;
    this.updateUI();
  }

  toggle() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
    return this.isPlaying;
  }

  seekTo(seconds) {
    if (this.audioEl && !isNaN(seconds)) {
      try {
        this.audioEl.currentTime = seconds;
      } catch (e) {}
    }
  }

  updateUI() {
    const icon = document.getElementById('audioIcon');
    if (icon) {
      icon.textContent = this.isPlaying ? '🎵' : '🔇';
    }
  }

  playTempleBell() {}
  playFlipSound() {}
}

window.RoyalAudioController = RoyalAudioController;
