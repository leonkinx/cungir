document.addEventListener('DOMContentLoaded', function() {
    const musicBtn = document.getElementById('musicBtnElegant');
    const birthdayMusic = document.getElementById('birthdayMusic');
    let isPlaying = false;
    
    // Update UI tombol musik
    function updateMusicButton() {
        if (isPlaying) {
            musicBtn.innerHTML = '⏸️';
            musicBtn.classList.add('playing');
        } else {
            musicBtn.innerHTML = '▶️';
            musicBtn.classList.remove('playing');
        }
    }
    
    // Auto play musik saat halaman dimuat
    function autoPlayMusic() {
        birthdayMusic.volume = 0.7;
        
        const playPromise = birthdayMusic.play();
        
        if (playPromise !== undefined) {
            playPromise.then(() => {
                console.log('Musik berhasil diputar otomatis');
                isPlaying = true;
                updateMusicButton();
                
                // Sembunyikan label setelah musik mulai
                setTimeout(() => {
                    const label = document.querySelector('.music-label-elegant');
                    if (label) {
                        label.style.opacity = '0.7';
                        label.style.animation = 'none';
                    }
                }, 3000);
                
            }).catch(error => {
                console.log('Auto-play dicegah:', error);
                isPlaying = false;
                updateMusicButton();
            });
        }
    }
    
    // Event untuk tombol musik
    musicBtn.addEventListener('click', function() {
        if (isPlaying) {
            birthdayMusic.pause();
            isPlaying = false;
        } else {
            birthdayMusic.play().then(() => {
                isPlaying = true;
                
                // Sembunyikan label setelah user mengklik play
                const label = document.querySelector('.music-label-elegant');
                if (label) {
                    label.style.opacity = '0.7';
                    label.style.animation = 'none';
                }
                
            }).catch(error => {
                console.log('Gagal memutar musik:', error);
                isPlaying = false;
            });
        }
        updateMusicButton();
    });
    
    // Event untuk label
    const musicLabel = document.querySelector('.music-label-elegant');
    if (musicLabel) {
        musicLabel.addEventListener('click', function() {
            musicBtn.click();
        });
    }
    
    // Coba auto play setelah sedikit delay
    setTimeout(autoPlayMusic, 1500);
    
    // Handle music ended/error
    birthdayMusic.addEventListener('ended', function() {
        // Loop otomatis
        birthdayMusic.currentTime = 0;
        birthdayMusic.play();
    });
    
    birthdayMusic.addEventListener('error', function() {
        console.error('Error memutar musik');
        isPlaying = false;
        updateMusicButton();
    });
    
    // Bubble animation kecil saja
    function createBubble() {
        const bubbles = document.querySelectorAll('.bubble');
        bubbles.forEach(bubble => {
            // Reset animation
            bubble.style.animation = 'none';
            setTimeout(() => {
                bubble.style.animation = '';
            }, 10);
        });
    }
    
    // Refresh bubbles setiap 30 detik
    setInterval(createBubble, 30000);
});

// Bubble generator kecil & full layar
function createBubbles() {
    const container = document.querySelector('.bubble-container');
    if (!container) return;
    
    const messages = ["Love U", "💖", "You're Amazing", "Happy Birthday", "💕", "Best Wishes"];
    
    const colorSchemes = [
        { color1: '#ffb6c1', color2: '#ff69b4' },
        { color1: '#fffdd0', color2: '#fdf5e6' },
        { color1: '#e6e6fa', color2: '#d8bfd8' },
        { color1: '#ff69b4', color2: '#ff1493' },
        { color1: '#fdf5e6', color2: '#ffefd5' },
        { color1: '#dda0dd', color2: '#ee82ee' }
    ];

    function createSingleBubble() {
        const bubble = document.createElement('div');
        bubble.className = 'bubble';
        
        // Size kecil: 10px - 35px
        const size = Math.random() * 25 + 10;
        const startX = Math.random() * window.innerWidth;
        
        // Random type
        const type = Math.random();
        
        if (type < 0.7) {
            bubble.classList.add('twinkle');
        } else if (type < 0.85) {
            bubble.classList.add('heart');
            const heart = document.createElement('div');
            heart.className = 'heart-shape';
            bubble.appendChild(heart);
        } else {
            bubble.classList.add('message');
            const message = messages[Math.floor(Math.random() * messages.length)];
            bubble.textContent = message;
            bubble.style.fontSize = Math.max(8, size * 0.3) + 'px';
        }
        
        const colors = colorSchemes[Math.floor(Math.random() * colorSchemes.length)];
        
        // STYLING PENTING: bottom: 0 untuk mulai dari bawah
        Object.assign(bubble.style, {
            width: size + 'px',
            height: size + 'px',
            left: startX + 'px',
            bottom: '0px', // PASTIKAN INI
            '--bubble-color1': colors.color1,
            '--bubble-color2': colors.color2,
            '--random-x': (Math.random() * 60 - 30) + 'px',
            animationDelay: (Math.random() * 2) + 's'
        });
        
        container.appendChild(bubble);
        
        setTimeout(() => {
            if (bubble.parentNode) {
                bubble.remove();
            }
        }, 8000);
    }
    
    setInterval(createSingleBubble, 600);
    
    for (let i = 0; i < 8; i++) {
        setTimeout(createSingleBubble, i * 300);
    }
}

// Pastikan dijalankan setelah DOM loaded
document.addEventListener('DOMContentLoaded', createBubbles);