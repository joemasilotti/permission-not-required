class PodcastPlayer {
  constructor() {
    this.audio = document.getElementById('podcast-audio');
    this.playerBar = document.getElementById('player-bar');
    this.state = {
      playing: false,
      muted: false,
      currentTime: 0,
      duration: 0,
      playbackRate: 1,
      episode: null
    };

    this.playbackRates = [1, 1.5, 2];
    this.playbackRateIndex = 0;

    this.bindEvents();
    this.bindControls();
  }

  bindEvents() {
    this.audio.addEventListener('play', () => {
      this.state.playing = true;
      this.updateUI();
    });

    this.audio.addEventListener('pause', () => {
      this.state.playing = false;
      this.updateUI();
    });

    this.audio.addEventListener('timeupdate', () => {
      this.state.currentTime = Math.floor(this.audio.currentTime);
      this.updateTimeDisplay();
      this.updateSlider();
    });

    this.audio.addEventListener('durationchange', () => {
      this.state.duration = Math.floor(this.audio.duration);
      this.updateTimeDisplay();
      this.updateSlider();
    });

    this.audio.addEventListener('loadedmetadata', () => {
      this.state.duration = Math.floor(this.audio.duration);
      this.updateTimeDisplay();
      this.updateSlider();
    });
  }

  bindControls() {
    // Episode play buttons
    document.querySelectorAll('[data-podcast-play]').forEach(button => {
      button.addEventListener('click', () => {
        const episodeNumber = button.dataset.episodeNumber;
        const episodeTitle = button.dataset.episodeTitle;
        const audioUrl = button.dataset.audioUrl;

        if (this.state.episode && this.state.episode.number === episodeNumber && this.state.playing) {
          this.pause();
        } else {
          this.play({ number: episodeNumber, title: episodeTitle, audioUrl: audioUrl });
        }
      });
    });

    // Player bar controls
    document.querySelector('[data-player-play]')?.addEventListener('click', () => this.toggle());
    document.querySelector('[data-player-rewind]')?.addEventListener('click', () => this.seekBy(-10));
    document.querySelector('[data-player-forward]')?.addEventListener('click', () => this.seekBy(10));
    document.querySelector('[data-player-mute]')?.addEventListener('click', () => this.toggleMute());
    document.querySelector('[data-player-rate]')?.addEventListener('click', () => this.cyclePlaybackRate());

    // Slider
    const slider = document.querySelector('[data-player-slider]');
    if (slider) {
      let wasPlaying = false;

      slider.addEventListener('mousedown', () => {
        wasPlaying = this.state.playing;
        if (wasPlaying) this.pause();
      });

      slider.addEventListener('input', () => {
        this.state.currentTime = parseInt(slider.value, 10);
        this.updateTimeDisplay();
      });

      slider.addEventListener('change', () => {
        this.seek(parseInt(slider.value, 10));
        if (wasPlaying) this.play();
      });
    }
  }

  play(episode) {
    if (episode) {
      this.state.episode = episode;

      if (this.audio.src !== episode.audioUrl) {
        const currentRate = this.audio.playbackRate;
        this.audio.src = episode.audioUrl;
        this.audio.load();
        this.audio.playbackRate = currentRate;
        this.audio.currentTime = 0;
      }

      this.showPlayerBar();
      this.updateEpisodeTitle();
    }

    this.audio.play();
  }

  pause() {
    this.audio.pause();
  }

  toggle() {
    if (this.state.playing) {
      this.pause();
    } else {
      this.play();
    }
  }

  seek(time) {
    this.audio.currentTime = time;
  }

  seekBy(seconds) {
    this.audio.currentTime = Math.max(0, Math.min(this.audio.currentTime + seconds, this.state.duration));
  }

  toggleMute() {
    this.state.muted = !this.state.muted;
    this.audio.muted = this.state.muted;
    this.updateMuteButton();
  }

  cyclePlaybackRate() {
    this.playbackRateIndex = (this.playbackRateIndex + 1) % this.playbackRates.length;
    const rate = this.playbackRates[this.playbackRateIndex];
    this.state.playbackRate = rate;
    this.audio.playbackRate = rate;
    this.updatePlaybackRateButton();
  }

  showPlayerBar() {
    if (this.playerBar) {
      this.playerBar.classList.remove('hidden');
    }
  }

  updateUI() {
    this.updatePlayButton();
    this.updateEpisodeButtons();
  }

  updatePlayButton() {
    const playButton = document.querySelector('[data-player-play]');
    if (!playButton) return;

    const playIcon = playButton.querySelector('.play-icon');
    const pauseIcon = playButton.querySelector('.pause-icon');

    if (this.state.playing) {
      playIcon?.classList.add('hidden');
      pauseIcon?.classList.remove('hidden');
      playButton.setAttribute('aria-label', 'Pause');
    } else {
      playIcon?.classList.remove('hidden');
      pauseIcon?.classList.add('hidden');
      playButton.setAttribute('aria-label', 'Play');
    }
  }

  updateEpisodeButtons() {
    document.querySelectorAll('[data-podcast-play]').forEach(button => {
      const episodeNumber = button.dataset.episodeNumber;
      const isCurrentEpisode = this.state.episode && this.state.episode.number === episodeNumber;
      const isPlaying = isCurrentEpisode && this.state.playing;

      const playIcon = button.querySelector('.play-icon');
      const pauseIcon = button.querySelector('.pause-icon');

      if (isPlaying) {
        playIcon?.classList.add('hidden');
        pauseIcon?.classList.remove('hidden');
      } else {
        playIcon?.classList.remove('hidden');
        pauseIcon?.classList.add('hidden');
      }
    });
  }

  updateEpisodeTitle() {
    const titleEl = document.querySelector('[data-player-title]');
    if (titleEl && this.state.episode) {
      titleEl.textContent = this.state.episode.title;
      titleEl.title = this.state.episode.title;
    }
  }

  updateTimeDisplay() {
    const currentTimeEl = document.querySelector('[data-player-current-time]');
    const totalTimeEl = document.querySelector('[data-player-total-time]');

    if (currentTimeEl) {
      currentTimeEl.textContent = this.formatTime(this.state.currentTime);
    }
    if (totalTimeEl) {
      totalTimeEl.textContent = this.formatTime(this.state.duration);
    }
  }

  updateSlider() {
    const slider = document.querySelector('[data-player-slider]');
    if (slider) {
      slider.max = this.state.duration || 0;
      slider.value = this.state.currentTime;

      // Update slider fill
      const percent = this.state.duration > 0 ? (this.state.currentTime / this.state.duration) * 100 : 0;
      slider.style.setProperty('--slider-progress', `${percent}%`);
    }
  }

  updateMuteButton() {
    const muteButton = document.querySelector('[data-player-mute]');
    if (!muteButton) return;

    const muteIcon = muteButton.querySelector('.mute-icon');
    const unmuteIcon = muteButton.querySelector('.unmute-icon');

    if (this.state.muted) {
      muteIcon?.classList.add('hidden');
      unmuteIcon?.classList.remove('hidden');
      muteButton.setAttribute('aria-label', 'Unmute');
    } else {
      muteIcon?.classList.remove('hidden');
      unmuteIcon?.classList.add('hidden');
      muteButton.setAttribute('aria-label', 'Mute');
    }
  }

  updatePlaybackRateButton() {
    const rateButton = document.querySelector('[data-player-rate]');
    if (!rateButton) return;

    const icons = rateButton.querySelectorAll('[data-rate]');
    icons.forEach(icon => {
      const rate = parseFloat(icon.dataset.rate);
      icon.classList.toggle('hidden', rate !== this.state.playbackRate);
    });
  }

  formatTime(totalSeconds) {
    if (!totalSeconds || isNaN(totalSeconds)) return '0:00';

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60);

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.podcastPlayer = new PodcastPlayer();
});
