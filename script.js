document.addEventListener('DOMContentLoaded', () => {

    const gallery = document.getElementById('gallery');
    let currentIndex = 1;
    let isLoading = false;
    let allLoaded = false;
    const loadedImages = []; // Track all loaded img elements for lightbox navigation

    // --- 1. PROGRESSIVE LOADING ---

    // Sentinel element at the bottom of the gallery triggers loading more images
    const sentinel = document.createElement('div');
    sentinel.id = 'load-sentinel';
    sentinel.style.cssText = 'height:1px; width:100%;';
    gallery.after(sentinel);

    // How many images to load per batch
    const BATCH_SIZE = 6;

    function loadBatch() {
        if (isLoading || allLoaded) return;
        isLoading = true;

        let loaded = 0;
        let batchStart = currentIndex;

        function loadOne(index) {
            const extensions = ['.jpg', '.JPG'];

            function tryExt(extIndex) {
                if (extIndex >= extensions.length) {
                    // This index doesn't exist — we're done
                    allLoaded = true;
                    isLoading = false;
                    sentinelObserver.disconnect();
                    console.log(`All photos loaded. Total: ${loadedImages.length}`);
                    return;
                }

                const testImg = new Image();
                testImg.src = `images/photo (${index})${extensions[extIndex]}`;

                testImg.onload = () => {
                    const figure = document.createElement('figure');
                    figure.className = 'photo-card';

                    if (index % 5 === 0) figure.classList.add('wide');
                    if (index % 7 === 0) figure.classList.add('tall');

                    const img = document.createElement('img');
                    img.src = testImg.src;
                    img.alt = `Suthan Theiven Photography - Capture ${index}`;
                    img.loading = 'lazy';

                    // Store reference for lightbox navigation
                    img.dataset.galleryIndex = loadedImages.length;
                    loadedImages.push(img);

                    figure.appendChild(img);
                    gallery.appendChild(figure);

                    loaded++;
                    currentIndex++;

                    if (loaded < BATCH_SIZE) {
                        loadOne(currentIndex);
                    } else {
                        isLoading = false;
                        // Re-observe sentinel in case it's still in view
                        sentinelObserver.observe(sentinel);
                    }
                };

                testImg.onerror = () => tryExt(extIndex + 1);
            }

            tryExt(0);
        }

        loadOne(currentIndex);
    }

    // IntersectionObserver watches the sentinel div below the gallery
    const sentinelObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            loadBatch();
        }
    }, {
        rootMargin: '400px' // Start loading 400px before sentinel enters viewport
    });

    sentinelObserver.observe(sentinel);

    // Kick off first batch immediately
    loadBatch();


    // --- 2. LIGHTBOX WITH NAVIGATION ---

    const modal = document.getElementById('lightbox');
    const modalImg = document.getElementById('lightbox-img');
    const closeBtn = document.querySelector('.close');
    const prevBtn = document.getElementById('lightbox-prev');
    const nextBtn = document.getElementById('lightbox-next');

    let lightboxIndex = 0;

    function openLightbox(index) {
        lightboxIndex = index;
        modalImg.src = loadedImages[index].src;
        modal.style.display = 'flex';
        updateNavButtons();
    }

    function updateNavButtons() {
        prevBtn.style.opacity = lightboxIndex === 0 ? '0.2' : '1';
        prevBtn.style.pointerEvents = lightboxIndex === 0 ? 'none' : 'auto';
        nextBtn.style.opacity = lightboxIndex === loadedImages.length - 1 ? '0.2' : '1';
        nextBtn.style.pointerEvents = lightboxIndex === loadedImages.length - 1 ? 'none' : 'auto';
    }

    function showPrev() {
        if (lightboxIndex > 0) {
            lightboxIndex--;
            modalImg.src = loadedImages[lightboxIndex].src;
            updateNavButtons();
        }
    }

    function showNext() {
        if (lightboxIndex < loadedImages.length - 1) {
            lightboxIndex++;
            modalImg.src = loadedImages[lightboxIndex].src;
            updateNavButtons();
        }
    }

    function closeLightbox() {
        modal.style.display = 'none';
    }

    // Open lightbox on image click
    gallery.addEventListener('click', (e) => {
        if (e.target.tagName === 'IMG') {
            const index = parseInt(e.target.dataset.galleryIndex, 10);
            openLightbox(index);
        }
    });

    prevBtn.addEventListener('click', (e) => { e.stopPropagation(); showPrev(); });
    nextBtn.addEventListener('click', (e) => { e.stopPropagation(); showNext(); });
    closeBtn.addEventListener('click', closeLightbox);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
        if (modal.style.display !== 'flex') return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') showPrev();
        if (e.key === 'ArrowRight') showNext();
    });
});