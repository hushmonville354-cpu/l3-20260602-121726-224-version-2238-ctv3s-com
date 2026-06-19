import { H as Hls } from './hls-vendor.js';

(function () {
  const players = Array.from(document.querySelectorAll('[data-hls-src]'));

  players.forEach(function (frame) {
    const video = frame.querySelector('video');
    const button = frame.querySelector('.player-start');
    const source = frame.getAttribute('data-hls-src');
    let attached = false;
    let hlsInstance = null;

    if (!video || !source) {
      return;
    }

    function attachSource() {
      if (attached) {
        return;
      }

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = source;
        attached = true;
        return;
      }

      if (Hls && Hls.isSupported()) {
        hlsInstance = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90
        });
        hlsInstance.loadSource(source);
        hlsInstance.attachMedia(video);
        attached = true;
      }
    }

    function playVideo() {
      attachSource();
      frame.classList.add('is-playing');
      video.play().catch(function () {
        frame.classList.remove('is-playing');
      });
    }

    if (button) {
      button.addEventListener('click', function (event) {
        event.preventDefault();
        playVideo();
      });
    }

    frame.addEventListener('click', function (event) {
      if (event.target === video) {
        return;
      }

      if (!frame.classList.contains('is-playing')) {
        playVideo();
      }
    });

    video.addEventListener('play', function () {
      frame.classList.add('is-playing');
    });

    video.addEventListener('pause', function () {
      if (video.currentTime === 0 || video.ended) {
        frame.classList.remove('is-playing');
      }
    });

    window.addEventListener('pagehide', function () {
      if (hlsInstance) {
        hlsInstance.destroy();
      }
    });
  });
})();
