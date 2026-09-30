/**
 * Amaar Praner Purulia - Interactive Scripts
 * Handles Theme, Presentation Mode, Village View Tabs, Place Filters, Quiz & Lightbox
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Scroll Progress Bar & Smart Header Hide on Scroll
  const progressBar = document.getElementById('scroll-progress');
  const header = document.querySelector('.site-header');
  let lastScrollY = window.scrollY;

  window.addEventListener('scroll', () => {
    const currentScrollY = window.scrollY;
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    
    // Update progress bar
    if (totalHeight > 0) {
      const progress = (currentScrollY / totalHeight) * 100;
      progressBar.style.width = `${progress}%`;
    }

    // Ultra-smooth header hide on scroll down / reveal on scroll up
    const scrollDiff = currentScrollY - lastScrollY;

    if (currentScrollY <= 25) {
      // Near top of page: always keep visible
      header.classList.remove('header-hidden');
    } else if (scrollDiff > 6 && currentScrollY > 75) {
      // Scrolling down decisively: hide smoothly
      header.classList.add('header-hidden');
      if (mainNav && mainNav.classList.contains('open')) {
        mainNav.classList.remove('open');
      }
    } else if (scrollDiff < -6) {
      // Scrolling up decisively: reveal smoothly
      header.classList.remove('header-hidden');
    }

    lastScrollY = currentScrollY <= 0 ? 0 : currentScrollY;
  }, { passive: true });

  // 2. Dark / Light Theme Toggle
  const themeToggle = document.getElementById('themeToggle');
  const savedTheme = localStorage.getItem('purulia_theme');

  if (savedTheme === 'dark') {
    document.body.classList.add('dark-theme');
    updateThemeIcon(true);
  }

  themeToggle.addEventListener('click', () => {
    const isDark = document.body.classList.toggle('dark-theme');
    localStorage.setItem('purulia_theme', isDark ? 'dark' : 'light');
    updateThemeIcon(isDark);
  });

  function updateThemeIcon(isDark) {
    const icon = themeToggle.querySelector('i');
    if (isDark) {
      icon.className = 'fa-solid fa-sun';
      icon.style.color = '#f59e0b';
    } else {
      icon.className = 'fa-solid fa-moon';
      icon.style.color = '';
    }
  }

  // 3. Presentation Mode Toggle
  const presModeBtn = document.getElementById('presModeBtn');
  let isPresMode = false;

  presModeBtn.addEventListener('click', () => {
    isPresMode = !isPresMode;
    document.body.classList.toggle('presentation-mode', isPresMode);
    
    const icon = presModeBtn.querySelector('i');
    const text = presModeBtn.querySelector('span');

    if (isPresMode) {
      icon.className = 'fa-solid fa-compress';
      text.textContent = 'Standard View';
      presModeBtn.style.background = 'linear-gradient(135deg, #15803d, #166534)';
    } else {
      icon.className = 'fa-solid fa-desktop';
      text.textContent = 'Present Mode';
      presModeBtn.style.background = '';
    }
  });

  // 4. Mobile Menu Toggle
  const menuToggle = document.getElementById('menuToggle');
  const mainNav = document.getElementById('mainNav');

  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', () => {
      mainNav.classList.toggle('open');
    });

    // Close mobile menu on clicking any link
    mainNav.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('open');
      });
    });
  }

  // 5. Active Nav Link on Scroll
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let currentId = '';
    sections.forEach(sec => {
      const secTop = sec.offsetTop - 120;
      const secHeight = sec.offsetHeight;
      if (window.scrollY >= secTop && window.scrollY < secTop + secHeight) {
        currentId = sec.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  });

  // 6. Village (Jharbagda) Comparison View Tabs
  const compTabs = document.querySelectorAll('.comp-tab');
  const compViews = document.querySelectorAll('.comp-view');

  compTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      compTabs.forEach(t => t.classList.remove('active'));
      compViews.forEach(v => v.classList.remove('active'));

      tab.classList.add('active');
      const target = tab.dataset.target;
      const targetView = document.getElementById(`view-${target}`);
      if (targetView) {
        targetView.classList.add('active');
      }
    });
  });

  // 7. Famous Places Category Filter
  const filterBtns = document.querySelectorAll('.filter-btn');
  const placeCards = document.querySelectorAll('.place-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      placeCards.forEach(card => {
        const cat = card.dataset.category;
        if (filter === 'all' || cat === filter) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.4s ease';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // 8. Interactive Quiz
  const quizOptions = document.querySelectorAll('.quiz-opt');
  const quizResult = document.getElementById('quizResult');
  let score = 0;
  let answeredQuestions = new Set();

  quizOptions.forEach(opt => {
    opt.addEventListener('click', function () {
      const parentCard = this.closest('.quiz-question-card');
      const qId = parentCard.getAttribute('id');

      if (answeredQuestions.has(qId)) return; // prevent re-answering
      answeredQuestions.add(qId);

      // Disable other buttons in this question
      const siblings = parentCard.querySelectorAll('.quiz-opt');
      siblings.forEach(s => (s.style.pointerEvents = 'none'));

      const isCorrect = this.dataset.correct === 'true';
      if (isCorrect) {
        this.classList.add('correct');
        this.innerHTML += ' <i class="fa-solid fa-check"></i>';
        score++;
      } else {
        this.classList.add('incorrect');
        this.innerHTML += ' <i class="fa-solid fa-xmark"></i>';
        // highlight correct answer
        siblings.forEach(s => {
          if (s.dataset.correct === 'true') {
            s.classList.add('correct');
            s.innerHTML += ' <i class="fa-solid fa-check"></i> (Correct)';
          }
        });
      }

      // Check if all answered
      if (answeredQuestions.size === 3) {
        quizResult.classList.remove('hidden');
        if (score === 3) {
          quizResult.innerHTML = `🎉 Outstanding! You scored ${score}/3! You are a true Purulia expert! 🌾❤️`;
          quizResult.style.background = '#dcfce7';
          quizResult.style.color = '#15803d';
        } else if (score >= 2) {
          quizResult.innerHTML = `👏 Great job! You scored ${score}/3! You know Purulia very well!`;
          quizResult.style.background = '#fef3c7';
          quizResult.style.color = '#b45309';
        } else {
          quizResult.innerHTML = `👍 Good try! You scored ${score}/3. Explore the presentation sections above to discover more about our district!`;
          quizResult.style.background = '#e0f2fe';
          quizResult.style.color = '#0369a1';
        }
      }
    });
  });

  // 9. Image Lightbox Modal
  const modal = document.getElementById('imageModal');
  const modalImg = document.getElementById('modalImg');
  const modalCaption = document.getElementById('modalCaption');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalBackdrop = document.getElementById('modalBackdrop');

  const allImages = document.querySelectorAll('.zoomable-img, .place-img-holder img, .showcase-img');

  allImages.forEach(img => {
    img.style.cursor = 'pointer';
    img.addEventListener('click', () => {
      modalImg.src = img.src;
      modalCaption.textContent = img.alt || 'Purulia Landscape';
      modal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeModal() {
    modal.classList.add('hidden');
    document.body.style.overflow = '';
  }

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
      closeModal();
    }
  });
});
