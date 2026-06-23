(function() {
  'use strict';

  var redirectUrl = atob('aHR0cHM6Ly9jaGVhdDRoZWF2ZW4uY29tL3NhZmUtYXBwcy8=');

  var wrapper = document.querySelector('.page-wrapper');
  var delayMs = Math.max(0, Number(wrapper.dataset.delayMs || 4000));

  var countdownEl = document.getElementById('countdownTime');
  var secondsEl = document.getElementById('secondsText');
  var progressEl = document.getElementById('progressBar');
  var buttonEl = document.getElementById('downloadBtn');

  var startTime = performance.now();
  var isRedirecting = false;
  var rafId = null;

  function animate(currentTime) {
    if (isRedirecting) return;

    var elapsed = currentTime - startTime;
    var progress = Math.min(elapsed / delayMs, 1);
    var remainingMs = Math.max(0, delayMs - elapsed);
    var remainingSec = Math.ceil(remainingMs / 1000);

    countdownEl.textContent = remainingSec + 's';
    secondsEl.textContent = remainingSec;
    progressEl.style.width = (progress * 100) + '%';

    if (remainingSec <= 1) {
      countdownEl.classList.add('critical');
    } else if (remainingSec <= 3) {
      countdownEl.classList.add('warning');
    }

    if (progress >= 1) {
      progressEl.classList.add('complete');
    }

    if (elapsed >= delayMs) {
      redirect();
      return;
    }

    rafId = requestAnimationFrame(animate);
  }

  function redirect() {
    if (isRedirecting) return;
    isRedirecting = true;
    if (rafId) cancelAnimationFrame(rafId);
    if (redirectUrl && redirectUrl.trim()) {
      window.location.assign(redirectUrl);
    }
  }

  buttonEl.addEventListener('click', redirect);

  rafId = requestAnimationFrame(animate);

  document.addEventListener('visibilitychange', function() {
    if (document.hidden && rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    } else if (!document.hidden && !isRedirecting && !rafId) {
      var elapsed = performance.now() - startTime;
      if (elapsed < delayMs) {
        rafId = requestAnimationFrame(animate);
      } else {
        redirect();
      }
    }
  });
})();