document.addEventListener('DOMContentLoaded', () => {

    const gallery = document.getElementById('gallery');
    const totalPhotos = 94;

    // 1. DYNAMICALLY GENERATE THE GALLERY
    for (let i = 1; i <= totalPhotos; i++) {
        // Create the figure container
        const figure = document.createElement('figure');
        figure.className = 'photo-card';

        // Add layout variety: Every 5th photo is wide, every 7th is tall
        if (i % 5 === 0) figure.classList.add('wide');
        if (i % 7 === 0) figure.classList.add('tall');

        // Create the image element
        const img = document.createElement('img');
        img.src = `images/photo (${i}).jpg`;
        img.alt = `Suthan Theiven Photography - Capture ${i}`;

        // CRITICAL: Native lazy loading so the page loads instantly
        img.loading = 'lazy';

        // Assemble and inject into the page
        figure.appendChild(img);
        gallery.appendChild(figure);
    }


    // 2. LIGHTBOX LOGIC (Using Event Delegation for Performance)
    const modal = document.getElementById("lightbox");
    const modalImg = document.getElementById("lightbox-img");
    const closeBtn = document.querySelector(".close");

    // Listen for clicks on the entire gallery container
    gallery.addEventListener('click', (e) => {
        // Only open lightbox if an image was actually clicked
        if (e.target.tagName === 'IMG') {
            modal.style.display = "flex";
            modal.style.justifyContent = "center";
            modal.style.alignItems = "center";
            modalImg.src = e.target.src;
        }
    });

    // Close on 'X' click
    closeBtn.addEventListener('click', () => {
        modal.style.display = "none";
    });

    // Close when clicking the dark background
    modal.addEventListener('click', (e) => {
        if (e.target !== modalImg) {
            modal.style.display = "none";
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === "Escape" && modal.style.display === "flex") {
            modal.style.display = "none";
        }
    });
});