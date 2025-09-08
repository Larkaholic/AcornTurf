// Drawer logic
    const drawer = document.getElementById('drawer');
    const backdrop = document.getElementById('drawerBackdrop');
    const openBtn = document.getElementById('openDrawer');
    const closeBtn = document.getElementById('closeDrawer');

    function openDrawer() {
      drawer.classList.remove('hidden');
      backdrop.classList.remove('hidden');
      document.body.classList.add('overflow-hidden');
    }
    function closeDrawer() {
      drawer.classList.add('hidden');
      backdrop.classList.add('hidden');
      document.body.classList.remove('overflow-hidden');
    }
    openBtn.addEventListener('click', openDrawer);
    closeBtn.addEventListener('click', closeDrawer);
    backdrop.addEventListener('click', closeDrawer);
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeDrawer(); });
    drawer.querySelectorAll('a').forEach(a => a.addEventListener('click', closeDrawer));

    // Scroll reveal with IntersectionObserver
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('active'); });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    document.querySelectorAll('.reveal').forEach(el => io.observe(el));

    // FAQ accordion
    document.querySelectorAll('.faq-toggle').forEach(btn => {
      btn.addEventListener('click', () => {
        const wrap = btn.parentElement;
        const content = wrap.querySelector('.faq-content');
        const icon = wrap.querySelector('.faq-icon');
        const isHidden = content.classList.contains('hidden');
        // collapse all others
        document.querySelectorAll('#faq .faq-content').forEach(c => { if (c !== content) c.classList.add('hidden'); });
        // toggle this one
        content.classList.toggle('hidden', !isHidden ? true : false);
        // rotate icon if needed (optional)
      });
    });