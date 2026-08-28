(() => {
  const root = document.documentElement;
  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  const viewIds = ['about', 'writing', 'github', 'xiaohongshu'];
  const viewMeta = {
    about: { number: '01 / 04', title: '关于我', path: '~/portfolio/about' },
    writing: { number: '02 / 04', title: '文章作品', path: '~/portfolio/writing' },
    github: { number: '03 / 04', title: 'GitHub 作品', path: '~/portfolio/github' },
    xiaohongshu: { number: '04 / 04', title: '小红书', path: '~/portfolio/xiaohongshu' }
  };

  const views = new Map(viewIds.map((id) => [id, document.querySelector(`[data-view="${id}"]`)]));
  const navLinks = [...document.querySelectorAll('[data-view-link]')];
  const pathLabel = document.querySelector('[data-view-path]');
  const viewNumber = document.querySelector('[data-view-number]');
  const viewTitle = document.querySelector('[data-view-title]');
  const workspace = document.querySelector('.workspace');
  const toast = document.querySelector('.copy-toast');
  let currentView = null;

  const getHashView = () => {
    const candidate = window.location.hash.slice(1);
    return viewIds.includes(candidate) ? candidate : 'about';
  };

  const normalizeHash = () => {
    const candidate = window.location.hash.slice(1);
    if (viewIds.includes(candidate)) return candidate;
    window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}#about`);
    return 'about';
  };

  const animateLabel = (node) => {
    if (!node || motionQuery.matches || !node.animate) return;
    node.animate([
      { opacity: .15, transform: 'translateY(5px)' },
      { opacity: 1, transform: 'translateY(0)' }
    ], { duration: 340, easing: 'cubic-bezier(.16,1,.3,1)' });
  };

  const activateView = (id, options = {}) => {
    const nextId = viewIds.includes(id) ? id : 'about';
    const nextView = views.get(nextId);
    if (!nextView) return;

    const previousView = currentView ? views.get(currentView) : null;
    const focusWasInside = previousView && previousView.contains(document.activeElement);
    const changed = currentView !== nextId;

    views.forEach((view, viewId) => {
      if (!view) return;
      const active = viewId === nextId;
      view.hidden = !active;
      view.inert = !active;
      view.classList.toggle('is-active', active);
      if (active) view.removeAttribute('aria-hidden');
      else view.setAttribute('aria-hidden', 'true');
    });

    navLinks.forEach((link) => {
      const active = link.dataset.viewLink === nextId;
      link.classList.toggle('is-active', active);
      if (active) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });

    const meta = viewMeta[nextId];
    if (pathLabel) pathLabel.textContent = meta.path;
    if (viewNumber) viewNumber.textContent = meta.number;
    if (viewTitle) viewTitle.textContent = meta.title;
    if (workspace) workspace.dataset.currentView = nextId;
    document.title = `${meta.title}｜王天宇`;

    if (changed && !motionQuery.matches) {
      nextView.classList.remove('is-entering');
      void nextView.offsetWidth;
      nextView.classList.add('is-entering');
      nextView.addEventListener('animationend', () => nextView.classList.remove('is-entering'), { once: true });
      animateLabel(pathLabel);
    }

    if (focusWasInside || options.focusHeading) {
      const heading = nextView.querySelector('h1, h2');
      requestAnimationFrame(() => heading?.focus({ preventScroll: true }));
    }

    currentView = nextId;
  };

  const initialView = normalizeHash();
  activateView(initialView);
  root.classList.add('app-ready');

  window.addEventListener('hashchange', () => activateView(getHashView()));

  navLinks.forEach((link, index) => {
    link.addEventListener('click', (event) => {
      if (link.dataset.viewLink !== currentView) return;
      event.preventDefault();
      const activeView = views.get(currentView);
      activeView?.scrollTo({ top: 0, behavior: motionQuery.matches ? 'auto' : 'smooth' });
    });

    link.addEventListener('keydown', (event) => {
      const previousKey = event.key === 'ArrowLeft' || event.key === 'ArrowUp';
      const nextKey = event.key === 'ArrowRight' || event.key === 'ArrowDown';
      if (!previousKey && !nextKey && event.key !== 'Home' && event.key !== 'End') return;
      event.preventDefault();
      let targetIndex = index;
      if (previousKey) targetIndex = (index - 1 + navLinks.length) % navLinks.length;
      if (nextKey) targetIndex = (index + 1) % navLinks.length;
      if (event.key === 'Home') targetIndex = 0;
      if (event.key === 'End') targetIndex = navLinks.length - 1;
      const target = navLinks[targetIndex];
      target.focus();
      if (window.location.hash !== target.getAttribute('href')) window.location.hash = target.getAttribute('href');
      else activateView(target.dataset.viewLink);
    });
  });

  class CardDeck {
    constructor(element) {
      this.element = element;
      this.viewport = element.querySelector('[data-deck-viewport]');
      this.cards = [...element.querySelectorAll('[data-card]')];
      this.status = element.querySelector('[data-deck-status]');
      this.pagination = element.querySelector('[data-deck-pagination]');
      this.index = 0;
      this.pointerStart = null;
      this.buildPagination();
      this.bind();
      this.render();
    }

    buildPagination() {
      if (!this.pagination) return;
      this.cards.forEach((card, index) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.textContent = String(index + 1);
        button.setAttribute('aria-label', `显示${card.dataset.title || `第 ${index + 1} 张`}`);
        button.addEventListener('click', () => this.goTo(index));
        this.pagination.appendChild(button);
      });
    }

    bind() {
      this.element.querySelector('[data-deck-prev]')?.addEventListener('click', () => this.goTo(this.index - 1));
      this.element.querySelector('[data-deck-next]')?.addEventListener('click', () => this.goTo(this.index + 1));

      this.cards.forEach((card, index) => {
        card.querySelector('[data-card-select]')?.addEventListener('click', () => this.goTo(index));
      });

      this.viewport?.addEventListener('keydown', (event) => {
        if (event.target.closest('a, button') && event.target !== this.viewport) return;
        if (event.key === 'ArrowLeft') {
          event.preventDefault();
          this.goTo(this.index - 1);
        }
        if (event.key === 'ArrowRight') {
          event.preventDefault();
          this.goTo(this.index + 1);
        }
      });

      this.viewport?.addEventListener('pointerdown', (event) => {
        if (event.pointerType === 'mouse' || event.target.closest('a, button')) return;
        this.pointerStart = { x: event.clientX, y: event.clientY, id: event.pointerId };
      }, { passive: true });

      this.viewport?.addEventListener('pointerup', (event) => {
        if (!this.pointerStart || this.pointerStart.id !== event.pointerId) return;
        const dx = event.clientX - this.pointerStart.x;
        const dy = event.clientY - this.pointerStart.y;
        this.pointerStart = null;
        if (Math.abs(dx) < 54 || Math.abs(dx) < Math.abs(dy) * 1.25) return;
        this.goTo(dx < 0 ? this.index + 1 : this.index - 1);
      }, { passive: true });

      this.viewport?.addEventListener('pointercancel', () => { this.pointerStart = null; }, { passive: true });
    }

    goTo(index) {
      const count = this.cards.length;
      this.index = (index + count) % count;
      this.render();
    }

    render() {
      const count = this.cards.length;
      const mobile = window.matchMedia('(max-width: 600px)').matches;
      const spacing = mobile ? 88 : 76;

      this.cards.forEach((card, cardIndex) => {
        let offset = cardIndex - this.index;
        if (offset > count / 2) offset -= count;
        if (offset < -count / 2) offset += count;
        const distance = Math.abs(offset);
        const active = distance === 0;
        const adjacent = distance === 1;
        const far = distance > 1;
        const direction = Math.sign(offset);

        card.style.setProperty('--card-x', `${offset * spacing}%`);
        card.style.setProperty('--card-y', `${distance * 7}px`);
        card.style.setProperty('--card-z', `${distance * -170}px`);
        card.style.setProperty('--card-rotate', `${offset * -14}deg`);
        card.style.setProperty('--card-scale', `${Math.max(.78, 1 - distance * .1)}`);
        card.style.setProperty('--card-opacity', active ? '1' : adjacent ? '.62' : '0');
        card.style.setProperty('--card-saturation', active ? '1' : '.68');
        card.style.setProperty('--card-brightness', active ? '1' : '.82');
        card.style.setProperty('--card-blur', active ? '0px' : adjacent ? '.35px' : '3px');
        card.style.setProperty('--card-order', String(20 - distance));
        card.classList.toggle('is-active', active);
        card.classList.toggle('is-adjacent', adjacent);
        card.classList.toggle('is-far', far);
        card.inert = far;
        if (far) card.setAttribute('aria-hidden', 'true');
        else card.removeAttribute('aria-hidden');
        if (active) card.setAttribute('aria-current', 'true');
        else card.removeAttribute('aria-current');

        const selectButton = card.querySelector('[data-card-select]');
        const focusable = [...card.querySelectorAll('a, button')];
        focusable.forEach((node) => {
          const enabled = active ? node !== selectButton : adjacent && node === selectButton;
          if (enabled) node.removeAttribute('tabindex');
          else node.setAttribute('tabindex', '-1');
        });
        if (selectButton) selectButton.setAttribute('aria-hidden', active || far ? 'true' : 'false');
      });

      [...(this.pagination?.children || [])].forEach((button, index) => {
        const active = index === this.index;
        button.classList.toggle('is-active', active);
        if (active) button.setAttribute('aria-current', 'true');
        else button.removeAttribute('aria-current');
      });

      const activeCard = this.cards[this.index];
      if (this.status && activeCard) this.status.textContent = `${this.index + 1} / ${count} · ${activeCard.dataset.title || ''}`;
      this.element.dataset.index = String(this.index);
    }
  }

  const decks = [...document.querySelectorAll('[data-deck]')].map((element) => new CardDeck(element));
  window.addEventListener('resize', () => decks.forEach((deck) => deck.render()), { passive: true });

  const portraitStage = document.querySelector('.portrait-stage');
  const portraitMotion = document.querySelector('.portrait-motion');
  if (portraitStage && portraitMotion && !motionQuery.matches && finePointer.matches) {
    let frame = 0;
    const setTilt = (event) => {
      const bounds = portraitStage.getBoundingClientRect();
      const nx = Math.max(-1, Math.min(1, ((event.clientX - bounds.left) / bounds.width - .5) * 2));
      const ny = Math.max(-1, Math.min(1, ((event.clientY - bounds.top) / bounds.height - .5) * 2));
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        portraitMotion.style.setProperty('--portrait-rx', `${(-ny * 12).toFixed(2)}deg`);
        portraitMotion.style.setProperty('--portrait-ry', `${(nx * 12).toFixed(2)}deg`);
        portraitMotion.style.setProperty('--portrait-scale', '1.09');
      });
    };
    const resetTilt = () => {
      cancelAnimationFrame(frame);
      portraitMotion.style.setProperty('--portrait-rx', '0deg');
      portraitMotion.style.setProperty('--portrait-ry', '0deg');
      portraitMotion.style.setProperty('--portrait-scale', '1');
    };
    portraitStage.addEventListener('pointermove', setTilt, { passive: true });
    portraitStage.addEventListener('pointerleave', resetTilt);
    portraitStage.addEventListener('pointercancel', resetTilt);
    window.addEventListener('blur', resetTilt);
  }

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
      window.setTimeout(() => toast.classList.remove('is-visible'), 1600);
    });
  });

  const updateGithubData = async () => {
    try {
      const userResponse = await fetch('https://api.github.com/users/ankhzw1876');
      if (userResponse.ok) {
        const user = await userResponse.json();
        document.querySelectorAll('[data-repo-count]').forEach((node) => { node.textContent = String(user.public_repos); });
      }

      const projects = [...document.querySelectorAll('[data-repo]')];
      await Promise.all(projects.map(async (project) => {
        const response = await fetch(`https://api.github.com/repos/ankhzw1876/${project.dataset.repo}`);
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
