/**
 * शाही 3D डिजिटल बुकलेट संचालक (Royal 3D Digital Booklet Engine)
 * Features 3D page curl flip animation, touch swipe gestures for mobile,
 * keyboard controls, pagination indicators, and sound effects.
 */
class Royal3DBooklet {
  constructor(audioController) {
    this.audioController = audioController;
    this.currentPage = 1;
    this.totalPages = 8;
    this.isAnimating = false;

    // Touch gesture variables
    this.touchStartX = 0;
    this.touchStartY = 0;
    this.touchEndX = 0;
    this.touchEndY = 0;

    // DOM Elements
    this.container = document.getElementById('bookletContainer');
    this.pages = document.querySelectorAll('.book-page');
    this.btnPrev = document.getElementById('btnPrevPage');
    this.btnNext = document.getElementById('btnNextPage');
    this.btnFooterPrev = document.getElementById('btnBookletPrev');
    this.btnFooterNext = document.getElementById('btnBookletNext');
    this.pageIndicator = document.getElementById('pageIndicatorText');
    this.paginationDots = document.querySelectorAll('.page-dot');

    this.init();
  }

  init() {
    this.bindEvents();
    this.updatePaginationUI();
  }

  bindEvents() {
    // Desktop Nav Buttons
    if (this.btnPrev) this.btnPrev.addEventListener('click', () => this.prevPage());
    if (this.btnNext) this.btnNext.addEventListener('click', () => this.nextPage());

    // Footer Nav Buttons
    if (this.btnFooterPrev) this.btnFooterPrev.addEventListener('click', () => this.prevPage());
    if (this.btnFooterNext) this.btnFooterNext.addEventListener('click', () => this.nextPage());

    // Pagination Dots
    this.paginationDots.forEach(dot => {
      dot.addEventListener('click', () => {
        const targetPage = parseInt(dot.getAttribute('data-page-target'), 10);
        this.goToPage(targetPage);
      });
    });

    // Touch Swipe Gestures (Mobile-First)
    const stage = document.getElementById('bookStage');
    if (stage) {
      stage.addEventListener('touchstart', (e) => {
        this.touchStartX = e.changedTouches[0].screenX;
        this.touchStartY = e.changedTouches[0].screenY;
      }, { passive: true });

      stage.addEventListener('touchend', (e) => {
        this.touchEndX = e.changedTouches[0].screenX;
        this.touchEndY = e.changedTouches[0].screenY;
        this.handleSwipe();
      }, { passive: true });
    }

    // Keyboard Arrow Keys
    window.addEventListener('keydown', (e) => {
      if (this.container && !this.container.classList.contains('hidden')) {
        if (e.key === 'ArrowRight' || e.key === 'PageDown') {
          this.nextPage();
        } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
          this.prevPage();
        }
      }
    });
  }

  handleSwipe() {
    const deltaX = this.touchEndX - this.touchStartX;
    const deltaY = this.touchEndY - this.touchStartY;

    // Check if horizontal swipe is significant and dominant over vertical scroll
    if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX < 0) {
        // Swiped Left -> Go Next Page
        this.nextPage();
      } else {
        // Swiped Right -> Go Previous Page
        this.prevPage();
      }
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.goToPage(this.currentPage + 1);
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.goToPage(this.currentPage - 1);
    }
  }

  goToPage(pageNum, force = false) {
    if (pageNum < 1 || pageNum > this.totalPages) return;
    if (!force && pageNum === this.currentPage) return;
    if (this.isAnimating && !force) return;

    this.isAnimating = true;

    // Trigger flip audio effect
    if (this.audioController && !force) {
      this.audioController.playFlipSound();
    }

    this.currentPage = pageNum;

    // Update 3D page classes
    this.pages.forEach(page => {
      const pNum = parseInt(page.getAttribute('data-page'), 10);
      
      page.classList.remove('active', 'flipped');

      if (pNum < this.currentPage) {
        page.classList.add('flipped');
      } else if (pNum === this.currentPage) {
        page.classList.add('active');
      }
    });

    this.updatePaginationUI();

    setTimeout(() => {
      this.isAnimating = false;
    }, 400);
  }

  updatePaginationUI() {
    if (this.pageIndicator) {
      this.pageIndicator.textContent = `पृष्ठ ${this.currentPage} / ${this.totalPages}`;
    }

    this.paginationDots.forEach(dot => {
      const target = parseInt(dot.getAttribute('data-page-target'), 10);
      if (target === this.currentPage) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });

    // Disable/Enable Nav buttons
    if (this.btnPrev) this.btnPrev.style.opacity = this.currentPage === 1 ? '0.4' : '1';
    if (this.btnNext) this.btnNext.style.opacity = this.currentPage === this.totalPages ? '0.4' : '1';
    if (this.btnFooterPrev) this.btnFooterPrev.disabled = (this.currentPage === 1);
    if (this.btnFooterNext) this.btnFooterNext.disabled = (this.currentPage === this.totalPages);
  }
}

window.Royal3DBooklet = Royal3DBooklet;
