document.addEventListener('DOMContentLoaded', () => {

    const gallery = document.getElementById('gallery');
    let currentIndex = 1;

    // 1. DYNAMICALLY GENERATE THE GALLERY (Auto-Detecting Images)
    function loadNextImage() {
        const extensions = ['.jpg', '.JPG'];

        function tryLoad(extIndex) {
            if (extIndex >= extensions.length) {
                console.log(`Finished checking. Gallery loaded with ${currentIndex - 1} photos.`);
                return;
            }

            // Create an image object in memory to test if the file exists
            const testImg = new Image();
            testImg.src = `images/photo (${currentIndex})${extensions[extIndex]}`;

            // If the image loads successfully, add it to the page
            testImg.onload = () => {
                const figure = document.createElement('figure');
                figure.className = 'photo-card';

                if (currentIndex % 5 === 0) figure.classList.add('wide');
                if (currentIndex % 7 === 0) figure.classList.add('tall');

                const img = document.createElement('img');
                img.src = testImg.src;
                img.alt = `Suthan Theiven Photography - Capture ${currentIndex}`;
                img.loading = 'lazy';

                figure.appendChild(img);
                gallery.appendChild(figure);

                // Increment the counter and try to load the NEXT image
                currentIndex++;
                loadNextImage();
            };

            // If it fails, try the next extension. If no extensions left, we are done.
            testImg.onerror = () => {
                tryLoad(extIndex + 1);
            };
        }

        tryLoad(0);
    }

    // Kick off the loading process
    loadNextImage();


    // 2. LIGHTBOX LOGIC (Unchanged)
    const modal = document.getElementById("lightbox");
    const modalImg = document.getElementById("lightbox-img");
    const closeBtn = document.querySelector(".close");

    gallery.addEventListener('click', (e) => {
        if (e.target.tagName === 'IMG') {
            modal.style.display = "flex";
            modal.style.justifyContent = "center";
            modal.style.alignItems = "center";
            modalImg.src = e.target.src;
        }
    });

    closeBtn.addEventListener('click', () => {
        modal.style.display = "none";
    });

    modal.addEventListener('click', (e) => {
        if (e.target !== modalImg) {
            modal.style.display = "none";
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === "Escape" && modal.style.display === "flex") {
            modal.style.display = "none";
        }
    });
});