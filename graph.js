document.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('page-loaded');

  document.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (!href || href.startsWith('#')) return;
      e.preventDefault();
      document.body.classList.remove('page-loaded');
      setTimeout(() => {
        window.location.href = href;
      }, 350);
    });
  });
});
