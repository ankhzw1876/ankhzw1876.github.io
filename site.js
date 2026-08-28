(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const progress = document.querySelector('.scroll-progress span');
  const heroTitle = document.querySelector('.hero-title');
  const portraitCrop = document.querySelector('.portrait-crop');
  const navLinks = [...document.querySelectorAll('.chapter-nav a, .mobile-dock a')];
  const sections = [...document.querySelectorAll('[data-section]')];
  const toast = document.querySelector('.copy-toast');

  if (heroTitle) requestAnimationFrame(() => heroTitle.classList.add('is-visible'));

  if (portraitCrop && !reducedMotion && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    let portraitFrame = 0;
    const setPortraitTilt = (event) => {
      const bounds = portraitCrop.getBoundingClientRect();
      const nx = Math.max(-1, Math.min(1, ((event.clientX - bounds.left) / bounds.width - .5) * 2));
      const ny = Math.max(-1, Math.min(1, ((event.clientY - bounds.top) / bounds.height - .5) * 2));
      window.cancelAnimationFrame(portraitFrame);
      portraitFrame = window.requestAnimationFrame(() => {
        portraitCrop.classList.add('is-tracking');
        portraitCrop.style.setProperty('--portrait-rx', `${(-ny * 5).toFixed(2)}deg`);
        portraitCrop.style.setProperty('--portrait-ry', `${(nx * 6).toFixed(2)}deg`);
        portraitCrop.style.setProperty('--portrait-scale', '1.025');
      });
    };
    const resetPortraitTilt = () => {
      window.cancelAnimationFrame(portraitFrame);
      portraitCrop.classList.remove('is-tracking');
      portraitCrop.style.setProperty('--portrait-rx', '0deg');
      portraitCrop.style.setProperty('--portrait-ry', '0deg');
      portraitCrop.style.setProperty('--portrait-scale', '1');
    };
    portraitCrop.addEventListener('pointermove', setPortraitTilt, { passive: true });
    portraitCrop.addEventListener('pointerleave', resetPortraitTilt);
  }

  const revealItems = [...document.querySelectorAll('.reveal')];
  if ('IntersectionObserver' in window && !reducedMotion) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -7% 0px' });

    revealItems.forEach((item, index) => {
      item.style.transitionDelay = `${Math.min((index % 4) * 55, 165)}ms`;
      revealObserver.observe(item);
    });
  } else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  }

  if ('IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      const id = visible.target.dataset.section;
      navLinks.forEach((link) => {
        const active = link.getAttribute('href') === `#${id}`;
        link.classList.toggle('is-active', active);
        if (active) link.setAttribute('aria-current', 'true');
        else link.removeAttribute('aria-current');
      });
    }, { rootMargin: '-28% 0px -52% 0px', threshold: 0 });
    sections.forEach((section) => sectionObserver.observe(section));
  }

  let ticking = false;
  const updateScrollEffects = () => {
    const scrollRange = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = scrollRange > 0 ? window.scrollY / scrollRange : 0;
    if (progress) progress.style.transform = `scaleX(${Math.min(Math.max(ratio, 0), 1)})`;

    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(updateScrollEffects);
  }, { passive: true });
  updateScrollEffects();

  document.querySelectorAll('.copy-wechat').forEach((button) => {
    button.addEventListener('click', async () => {
      const value = button.dataset.copy || 'ankhzw';
      try {
        await navigator.clipboard.writeText(value);
      } catch {
        const input = document.createElement('textarea');
        input.value = value;
        input.setAttribute('readonly', '');
        input.style.position = 'fixed';
        input.style.opacity = '0';
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        input.remove();
      }
      if (!toast) return;
      toast.classList.add('is-visible');
      window.setTimeout(() => toast.classList.remove('is-visible'), 1800);
    });
  });

  const updateGithubData = async () => {
    try {
      const userResponse = await fetch('https://api.github.com/users/ankhzw1876');
      if (userResponse.ok) {
        const user = await userResponse.json();
        document.querySelectorAll('[data-repo-count]').forEach((node) => {
          node.textContent = String(user.public_repos);
        });
      }

      const projects = [...document.querySelectorAll('[data-repo]')];
      await Promise.all(projects.map(async (project) => {
        const name = project.dataset.repo;
        const response = await fetch(`https://api.github.com/repos/ankhzw1876/${name}`);
        if (!response.ok) return;
        const repo = await response.json();
        const stars = project.querySelector('[data-stars]');
        if (stars) stars.textContent = String(repo.stargazers_count);
      }));
    } catch {
      // Static values remain visible when GitHub is unavailable or rate-limited.
    }
  };

  updateGithubData();
})();
