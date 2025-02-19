document.addEventListener('mousemove', (e) => {
    const aura = document.querySelector('.aura');
    const lightBeams = document.querySelector('.light-beams');
    const x = e.clientX;
    const y = e.clientY;
    
    const rect = aura.getBoundingClientRect();
    const auraX = rect.left + rect.width / 2;
    const auraY = rect.top + rect.height / 2;
    
    // More subtle movement
    const moveX = (x - auraX) * 0.03;
    const moveY = (y - auraY) * 0.03;
    
    aura.style.transform = `translate(${moveX}px, ${moveY}px)`;

    // Calculate distance from right edge
    const windowWidth = window.innerWidth;
    const distanceFromRight = windowWidth - (rect.left + rect.width);
    
    // Smoother transition for light interaction
    if (distanceFromRight < 400) {
        lightBeams.style.opacity = Math.max(0, 1 - (distanceFromRight / 400));
    } else {
        lightBeams.style.opacity = 0;
    }
});
