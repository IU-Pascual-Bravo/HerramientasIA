document.addEventListener('DOMContentLoaded', () => {
  const fileInput = document.getElementById('file-input');
  const dropZone = document.getElementById('drop-zone');
  const titleInput = document.getElementById('title-input');
  const clearBtn = document.getElementById('clear-btn');
  const exportBtn = document.getElementById('export-btn');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  const ratioSelect = document.getElementById('ratio-select');
  const page1 = document.getElementById('page-1');
  const page2 = document.getElementById('page-2');
  const pageCounter = document.getElementById('page-counter');
  const totalPages = document.getElementById('total-pages');
  const dotRow = document.getElementById('dot-row');
  const progressOverlay = document.getElementById('progress-overlay');
  const progressBar = document.getElementById('progress-bar');
  const bookWrap = document.getElementById('book-wrap');

  let pages = [];
  let currentPage = 0;

  // ──────────────────── MANEJO DE ARCHIVOS ────────────────────

  fileInput.addEventListener('change', (e) => {
    handleFiles(Array.from(e.target.files));
  });

  dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropZone.classList.add('dragover');
  });

  dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('dragover');
  });

  dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropZone.classList.remove('dragover');
    handleFiles(Array.from(e.dataTransfer.files));
  });

  function handleFiles(files) {
    if (files.length === 0) return;

    const imageFiles = files.filter(f => f.type.startsWith('image/') || f.type.startsWith('video/'));

    if (imageFiles.length === 0) {
      alert('Por favor, selecciona solo imágenes o vídeos.');
      return;
    }

    progressOverlay.classList.add('visible');
    pages = [];
    let processed = 0;

    imageFiles.forEach((file, index) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        const src = e.target.result;
        pages.push({
          type: file.type.startsWith('image/') ? 'image' : 'video',
          src: src,
          name: file.name,
        });

        processed++;
        const progress = (processed / imageFiles.length) * 100;
        progressBar.style.width = progress + '%';

        if (processed === imageFiles.length) {
          progressOverlay.classList.remove('visible');
          currentPage = 0;
          renderPages();
          updateDots();
          exportBtn.disabled = false;
          dropZone.style.display = 'none';
        }
      };

      reader.onerror = () => {
        console.error('Error leyendo archivo:', file.name);
        processed++;
      };

      reader.readAsDataURL(file);
    });
  }

  function renderPages() {
    if (pages.length === 0) {
      page1.innerHTML = '<div class="empty-page"><span>📖</span></div>';
      page2.innerHTML = '<div class="empty-page"><span>📖</span></div>';
      pageCounter.textContent = '0';
      totalPages.textContent = '0';
      return;
    }

    const leftIdx = currentPage * 2;
    const rightIdx = currentPage * 2 + 1;

    // Página izquierda
    if (leftIdx < pages.length) {
      const pageLeft = pages[leftIdx];
      if (pageLeft.type === 'image') {
        page1.innerHTML = `<img src="${pageLeft.src}" alt="Página ${leftIdx + 1}">`;
      } else {
        page1.innerHTML = `<video src="${pageLeft.src}" controls></video>`;
      }
    } else {
      page1.innerHTML = '<div class="empty-page"><span>📖</span></div>';
    }

    // Página derecha
    if (rightIdx < pages.length) {
      const pageRight = pages[rightIdx];
      if (pageRight.type === 'image') {
        page2.innerHTML = `<img src="${pageRight.src}" alt="Página ${rightIdx + 1}">`;
      } else {
        page2.innerHTML = `<video src="${pageRight.src}" controls></video>`;
      }
    } else {
      page2.innerHTML = '<div class="empty-page"><span>📖</span></div>';
    }

    updatePageInfo();
    updateButtons();
  }

  function updatePageInfo() {
    const totalSpreads = Math.ceil(pages.length / 2);
    pageCounter.textContent = currentPage + 1;
    totalPages.textContent = totalSpreads;
  }

  function updateButtons() {
    const totalSpreads = Math.ceil(pages.length / 2);
    prevBtn.disabled = currentPage === 0;
    nextBtn.disabled = currentPage >= totalSpreads - 1;
  }

  function updateDots() {
    dotRow.innerHTML = '';
    const totalSpreads = Math.ceil(pages.length / 2);

    for (let i = 0; i < totalSpreads; i++) {
      const dot = document.createElement('div');
      dot.className = 'dot' + (i === currentPage ? ' active' : '');
      dot.addEventListener('click', () => {
        currentPage = i;
        renderPages();
        updateDots();
      });
      dotRow.appendChild(dot);
    }
  }

  // ──────────────────── NAVEGACIÓN ────────────────────

  prevBtn.addEventListener('click', () => {
    if (currentPage > 0) {
      currentPage--;
      renderPages();
      updateDots();
      page1.classList.add('flip-bwd');
      page2.classList.add('flip-bwd');
      setTimeout(() => {
        page1.classList.remove('flip-bwd');
        page2.classList.remove('flip-bwd');
      }, 380);
    }
  });

  nextBtn.addEventListener('click', () => {
    const totalSpreads = Math.ceil(pages.length / 2);
    if (currentPage < totalSpreads - 1) {
      currentPage++;
      renderPages();
      updateDots();
      page1.classList.add('flip-fwd');
      page2.classList.add('flip-fwd');
      setTimeout(() => {
        page1.classList.remove('flip-fwd');
        page2.classList.remove('flip-fwd');
      }, 380);
    }
  });

  // ──────────────────── RATIO DE ASPECTO ────────────────────

  ratioSelect.addEventListener('change', (e) => {
    const ratio = parseFloat(e.target.value);
    const baseHeight = 400;
    const width = Math.round(baseHeight * ratio);

    document.documentElement.style.setProperty('--pw', width + 'px');
    document.documentElement.style.setProperty('--ph', baseHeight + 'px');
  });

  // Inicializar ratio
  const initialRatio = parseFloat(ratioSelect.value);
  const baseHeight = 400;
  const width = Math.round(baseHeight * initialRatio);
  document.documentElement.style.setProperty('--pw', width + 'px');
  document.documentElement.style.setProperty('--ph', baseHeight + 'px');

  // ──────────────────── LIMPIAR Y EXPORTAR ────────────────────

  clearBtn.addEventListener('click', () => {
    if (confirm('¿Estás seguro de que quieres limpiar todo?')) {
      pages = [];
      currentPage = 0;
      fileInput.value = '';
      titleInput.value = '';
      renderPages();
      dropZone.style.display = 'block';
      exportBtn.disabled = true;
      dotRow.innerHTML = '';
      updatePageInfo();
    }
  });

  exportBtn.addEventListener('click', exportFlipbook);

  function exportFlipbook() {
    if (pages.length === 0) {
      alert('Por favor, carga imágenes primero.');
      return;
    }

    const title = titleInput.value || 'Flipbook';
    progressOverlay.classList.add('visible');
    progressBar.style.width = '0%';

    // Simular descarga (en un caso real, aquí iría la lógica ZIP)
    setTimeout(() => {
      progressBar.style.width = '100%';
      setTimeout(() => {
        progressOverlay.classList.remove('visible');
        alert(`Flipbook "${title}" preparado para exportar.\n\nÚltima mejora: Carga de ${pages.length} páginas completada.`);
      }, 300);
    }, 800);
  }

  // ──────────────────── ATAJOS DE TECLADO ────────────────────

  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' && !prevBtn.disabled) prevBtn.click();
    if (e.key === 'ArrowRight' && !nextBtn.disabled) nextBtn.click();
    if (e.key === 'c' || e.key === 'C') clearBtn.click();
    if (e.key === 't' || e.key === 'T') titleInput.focus();
  });

  // Inicializar
  renderPages();
  updatePageInfo();
});
