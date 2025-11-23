class LabirinGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.stepsElement = document.getElementById('steps');
        this.finalStepsElement = document.getElementById('finalSteps');
        this.winScreen = document.getElementById('winScreen');
        this.startScreen = document.getElementById('startScreen');
        this.startBtn = document.getElementById('startBtn');
        this.winRestartBtn = document.getElementById('winRestartBtn');
        
        // Elemen baru
        this.notification = document.getElementById('notification');
        this.birthdayScreen = document.getElementById('birthdayScreen');
        this.letterBtn = document.getElementById('letterBtn');
        this.birthdayCake = document.getElementById('birthdayCake');
        
        // Kontrol buttons
        this.upBtn = document.getElementById('upBtn');
        this.downBtn = document.getElementById('downBtn');
        this.leftBtn = document.getElementById('leftBtn');
        this.rightBtn = document.getElementById('rightBtn');
        
        // Load gambar karakter
        this.images = {
            cewe: document.getElementById('cewe'),
            cowoKucing: document.getElementById('cowoKucing'),
            kue: document.getElementById('kue')
        };
        
        // Ukuran dinamis berdasarkan layar
        this.cellSize = 0;
        this.rows = 10;
        this.cols = 10;
        
        // Posisi start yang tetap (blok pertama)
        this.startPosition = { x: 1, y: 1 };
        
        this.init();
        this.setupEventListeners();
        this.setupCanvasSize();
        
        // Handle resize
        window.addEventListener('resize', () => {
            this.setupCanvasSize();
            if (this.gameStarted) {
                this.draw();
            }
        });
    }
    
    setupCanvasSize() {
        const gameBoard = this.canvas.parentElement;
        const size = Math.min(gameBoard.clientWidth, gameBoard.clientHeight);
        
        this.canvas.width = size;
        this.canvas.height = size;
        this.cellSize = size / this.cols;
        
        console.log('Canvas size:', size, 'Cell size:', this.cellSize);
    }
    
    init() {
        this.gameStarted = false;
        this.gameWon = false;
        this.steps = 0;
        
        // Posisi karakter - FIXED POSITION
        this.player = { x: 1, y: 1 };
        this.target = { x: 8, y: 8 };
        
        // Generate labirin tetap
        this.generateFixedMaze();
        
        // Update tampilan
        this.stepsElement.textContent = '0';
        this.startScreen.style.display = 'flex';
        this.winScreen.style.display = 'none';
        this.notification.style.display = 'none';
        this.birthdayScreen.style.display = 'none';
        
        console.log('Game initialized');
    }
    
    generateFixedMaze() {
        this.maze = [
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
            [1, 1, 1, 0, 1, 0, 1, 1, 0, 1],
            [1, 0, 0, 0, 0, 0, 1, 0, 0, 1],
            [1, 0, 1, 1, 1, 1, 1, 0, 1, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 1, 1, 0, 1, 1, 1, 1, 0, 1],
            [1, 0, 0, 0, 1, 0, 0, 0, 0, 1],
            [1, 0, 1, 0, 0, 0, 1, 1, 0, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
        ];
        
        this.maze[this.player.y][this.player.x] = 0;
        this.maze[this.target.y][this.target.x] = 0;
        
        console.log('Maze generated');
    }
    
    setupEventListeners() {
        console.log('Setting up event listeners...');
        
        // Start button
        this.startBtn.addEventListener('click', () => {
            console.log('Start button clicked');
            this.startGame();
        });
        
        // Restart button
        this.winRestartBtn.addEventListener('click', () => {
            console.log('Restart button clicked');
            this.restartGame();
        });
        
        // Letter button untuk membuka surat
        this.letterBtn.addEventListener('click', () => {
            console.log('Letter button clicked');
            this.openLetter();
        });
        
        // Control buttons - FIXED: Gunakan arrow functions
        this.upBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Up button clicked');
            this.move(0, -1);
        });
        
        this.downBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Down button clicked');
            this.move(0, 1);
        });
        
        this.leftBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Left button clicked');
            this.move(-1, 0);
        });
        
        this.rightBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Right button clicked');
            this.move(1, 0);
        });
        
        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            if (!this.gameStarted || this.gameWon) return;
            
            console.log('Key pressed:', e.key);
            
            switch(e.key) {
                case 'ArrowUp': 
                    e.preventDefault();
                    this.move(0, -1); 
                    break;
                case 'ArrowDown': 
                    e.preventDefault();
                    this.move(0, 1); 
                    break;
                case 'ArrowLeft': 
                    e.preventDefault();
                    this.move(-1, 0); 
                    break;
                case 'ArrowRight': 
                    e.preventDefault();
                    this.move(1, 0); 
                    break;
            }
        });
        
        console.log('Event listeners setup complete');
    }
    
    startGame() {
        console.log('Starting game...');
        this.gameStarted = true;
        this.gameWon = false;
        this.startScreen.style.display = 'none';
        this.draw();
    }
    
    restartGame() {
        this.init();
        this.startGame();
    }
    
    move(dx, dy) {
        if (!this.gameStarted || this.gameWon) {
            console.log('Cannot move - game not started or already won');
            return;
        }
        
        const newX = this.player.x + dx;
        const newY = this.player.y + dy;
        
        console.log(`Attempting move from (${this.player.x}, ${this.player.y}) to (${newX}, ${newY})`);
        
        // Cek apakah gerakan valid
        if (newX >= 0 && newX < this.cols && newY >= 0 && newY < this.rows && this.maze[newY][newX] === 0) {
            this.player.x = newX;
            this.player.y = newY;
            this.steps++;
            this.stepsElement.textContent = this.steps;
            this.draw();
            
            console.log(`Move successful to (${newX}, ${newY})`);
            this.checkWinCondition();
        } else {
            console.log('Move blocked by wall or out of bounds');
        }
    }
    
    checkWinCondition() {
        if (this.player.x === this.target.x && this.player.y === this.target.y) {
            console.log('Win condition met!');
            this.gameWon = true;
            this.showNotification();
        }
    }
    
    showNotification() {
        console.log('Showing notification');
        this.notification.style.display = 'flex';
        
        // Setelah 3 detik, lanjut ke birthday screen
        setTimeout(() => {
            this.notification.style.display = 'none';
            this.showBirthdayScreen();
        }, 3000);
    }
    
    showBirthdayScreen() {
        console.log('Showing birthday screen');
        
        // Sembunyikan game container
        document.querySelector('.game-container').style.display = 'none';
        
        // Tampilkan birthday screen
        this.birthdayScreen.style.display = 'flex';
        
        // Preload gambar kue
        if (this.images.kue.complete) {
            this.birthdayCake.src = this.images.kue.src;
        }
        
        // Tambahkan efek konfeti
        this.createConfetti();
    }
    
  createConfetti() {
    const colors = ['#FFFDD0', '#8A2BE2', '#FFFFFF', '#6A0DAD', '#E6E6FA'];
    
    for (let i = 0; i < 30; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.style.cssText = `
                position: fixed;
                width: 8px;
                height: 8px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                border-radius: 0;
                top: -10px;
                left: ${Math.random() * 100}%;
                animation: pixelFall ${2 + Math.random() * 3}s linear forwards;
                z-index: 2001;
                border: 1px solid #FFFDD0;
            `;
            
            document.body.appendChild(confetti);
            
            setTimeout(() => {
                confetti.remove();
            }, 5000);
        }, i * 100);
    }
}
    
    openLetter() {
        console.log('Opening letter...');
        // Redirect ke halaman surat
        window.location.href = 'page3.html';
    }
    
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawElegantMaze();
        this.drawCharacters();
        this.drawInstructions();
    }
    
    drawElegantMaze() {
        // Background putih
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.cols; x++) {
                const cellX = x * this.cellSize;
                const cellY = y * this.cellSize;
                
                if (this.maze[y][x] === 1) {
                    this.drawElegantWall(cellX, cellY);
                } else {
                    this.drawElegantPath(cellX, cellY);
                }
            }
        }
        
        this.drawDecorations();
    }
    
    drawElegantWall(x, y) {
        const gradient = this.ctx.createLinearGradient(x, y, x + this.cellSize, y + this.cellSize);
        gradient.addColorStop(0, '#8A2BE2');
        gradient.addColorStop(0.5, '#7B1FA2');
        gradient.addColorStop(1, '#6A0DAD');
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(x, y, this.cellSize, this.cellSize);
        
        this.ctx.strokeStyle = '#4A148C';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(x + 2, y + 2, this.cellSize - 4, this.cellSize - 4);
    }
    
    drawElegantPath(x, y) {
        const gradient = this.ctx.createLinearGradient(x, y, x + this.cellSize, y + this.cellSize);
        gradient.addColorStop(0, '#FFFFFF');
        gradient.addColorStop(1, '#FFFDD0');
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(x, y, this.cellSize, this.cellSize);
        
        this.ctx.strokeStyle = '#E6EE9C';
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(x, y, this.cellSize, this.cellSize);
    }
    
    drawDecorations() {
        this.drawStartMarker();
        this.drawEndMarker();
    }
    
    drawStartMarker() {
        // PERBAIKAN: Tulisan START tetap di posisi awal (1,1)
        const x = this.startPosition.x * this.cellSize;
        const y = this.startPosition.y * this.cellSize;
        
        this.ctx.fillStyle = '#4CAF50';
        this.ctx.font = `${Math.max(10, this.cellSize/5)}px "Press Start 2P"`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'bottom';
        this.ctx.fillText('START', x + this.cellSize/2, y - 5);
    }
    
    drawEndMarker() {
        const x = this.target.x * this.cellSize;
        const y = this.target.y * this.cellSize;
        
        this.ctx.fillStyle = '#F44336';
        this.ctx.font = `${Math.max(10, this.cellSize/5)}px "Press Start 2P"`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'bottom';
        this.ctx.fillText('FINISH', x + this.cellSize/2, y - 5);
    }
    
    drawCharacters() {
        this.drawCharacter(this.player.x, this.player.y, this.images.cewe, '#8A2BE2', '👩');
        
        if (!(this.player.x === this.target.x && this.player.y === this.target.y)) {
            this.drawCharacter(this.target.x, this.target.y, this.images.cowoKucing, '#6A0DAD', '👦🐱');
        }
    }
    
    drawCharacter(x, y, image, fallbackColor, emoji) {
        const charX = x * this.cellSize + this.cellSize / 2;
        const charY = y * this.cellSize + this.cellSize / 2;
        const size = this.cellSize * 0.7;
        
        if (image && image.complete) {
            this.ctx.drawImage(
                image,
                charX - size/2,
                charY - size/2,
                size,
                size
            );
        } else {
            this.ctx.fillStyle = fallbackColor;
            this.ctx.beginPath();
            this.ctx.arc(charX, charY, size/2, 0, Math.PI * 2);
            this.ctx.fill();
            
            this.ctx.font = `${size/2}px Arial`;
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillStyle = '#FFFFFF';
            this.ctx.fillText(emoji, charX, charY);
        }
    }
    
    drawInstructions() {
        this.ctx.fillStyle = '#8A2BE2';
        this.ctx.font = `${Math.max(12, this.cellSize/4)}px "Press Start 2P"`;
        this.ctx.textAlign = 'left';
        this.ctx.textBaseline = 'top';
        
        const foundTarget = this.player.x === this.target.x && this.player.y === this.target.y;
        
        let status = foundTarget ? 
            '🎉 SELAMAT!' : 
            '✨ Cari cowo & kucing!';
        
        this.ctx.fillText(status, 10, 10);
        
        this.ctx.textAlign = 'right';
        this.ctx.fillText(`Langkah: ${this.steps}`, this.canvas.width - 10, 10);
    }
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing game...');
    new LabirinGame();
});

// Add confetti animation style
if (!document.getElementById('confetti-style')) {
    const style = document.createElement('style');
    style.id = 'confetti-style';
    style.textContent = `
        @keyframes pixelFall {
            to {
                transform: translateY(100vh) rotate(${Math.random() * 360}deg);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}
// Animasi JavaScript untuk Page 3
document.addEventListener('DOMContentLoaded', function() {
    // ... kode musik yang sudah ada ...
    
    // ==================== ANIMASI FLOATING HEARTS ====================
    function createFloatingHearts() {
        const heartsContainer = document.createElement('div');
        heartsContainer.className = 'floating-hearts-container';
        heartsContainer.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 4;
        `;
        document.body.appendChild(heartsContainer);

        function createHeart() {
            const heart = document.createElement('div');
            heart.innerHTML = '❤️';
            heart.style.cssText = `
                position: absolute;
                font-size: ${Math.random() * 20 + 15}px;
                opacity: ${Math.random() * 0.6 + 0.3};
                top: 100%;
                left: ${Math.random() * 100}%;
                animation: floatHeart ${Math.random() * 10 + 8}s ease-in forwards;
                filter: drop-shadow(0 0 5px rgba(255, 105, 180, 0.5));
            `;

            heartsContainer.appendChild(heart);

            // Hapus heart setelah animasi selesai
            setTimeout(() => {
                if (heart.parentNode) {
                    heart.remove();
                }
            }, 12000);
        }

        // Buat heart setiap 1.5 detik
        setInterval(createHeart, 1500);
        
        // Buat beberapa heart langsung
        for (let i = 0; i < 5; i++) {
            setTimeout(createHeart, i * 300);
        }
    }

    // ==================== ANIMASI SPARKLE EFFECT ====================
    function createSparkleEffect() {
        function createSparkle() {
            const sparkle = document.createElement('div');
            sparkle.innerHTML = '✨';
            sparkle.style.cssText = `
                position: fixed;
                font-size: ${Math.random() * 25 + 15}px;
                opacity: 0;
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                z-index: 4;
                pointer-events: none;
                animation: sparklePop ${Math.random() * 2 + 1}s ease-out forwards;
                filter: drop-shadow(0 0 8px rgba(255, 215, 0, 0.7));
            `;

            document.body.appendChild(sparkle);

            setTimeout(() => {
                if (sparkle.parentNode) {
                    sparkle.remove();
                }
            }, 3000);
        }

        // Buat sparkle setiap 2 detik
        setInterval(createSparkle, 2000);
        
        // Buat beberapa sparkle langsung
        for (let i = 0; i < 8; i++) {
            setTimeout(createSparkle, i * 500);
        }
    }

    // ==================== ANIMASI FLOATING WORDS ====================
    function createFloatingWords() {
        const words = ['Happy', 'Birthday', 'Love', 'You', 'Special', 'Amazing', 'Beautiful'];
        
        function createWord() {
            const word = document.createElement('div');
            const randomWord = words[Math.floor(Math.random() * words.length)];
            word.textContent = randomWord;
            word.style.cssText = `
                position: fixed;
                font-size: ${Math.random() * 16 + 12}px;
                color: #FFFDD0;
                font-weight: bold;
                opacity: 0;
                left: ${Math.random() * 100}%;
                top: 100%;
                z-index: 4;
                pointer-events: none;
                text-shadow: 2px 2px 0 #8A2BE2;
                animation: floatWord ${Math.random() * 8 + 6}s ease-in forwards;
                font-family: 'Press Start 2P', cursive;
            `;

            document.body.appendChild(word);

            setTimeout(() => {
                if (word.parentNode) {
                    word.remove();
                }
            }, 10000);
        }

        // Buat word setiap 3 detik
        setInterval(createWord, 3000);
    }

    // ==================== ANIMASI PULSING EFFECT ====================
    function createPulsingEffect() {
        const title = document.querySelector('.title');
        if (title) {
            setInterval(() => {
                title.style.transform = 'scale(1.05)';
                title.style.transition = 'transform 0.3s ease';
                
                setTimeout(() => {
                    title.style.transform = 'scale(1)';
                }, 300);
            }, 4000);
        }
    }

    // ==================== ANIMASI SCROLL GLOW ====================
    function createScrollGlow() {
        const scroll = document.querySelector('.scroll');
        if (scroll) {
            let isGlowing = false;
            
            setInterval(() => {
                if (!isGlowing) {
                    scroll.style.boxShadow = `
                        8px 8px 0 rgba(0, 0, 0, 0.3),
                        inset 2px 2px 0 rgba(255, 255, 255, 0.2),
                        0 0 20px rgba(138, 43, 226, 0.6)
                    `;
                    isGlowing = true;
                } else {
                    scroll.style.boxShadow = `
                        8px 8px 0 rgba(0, 0, 0, 0.3),
                        inset 2px 2px 0 rgba(255, 255, 255, 0.2)
                    `;
                    isGlowing = false;
                }
            }, 5000);
        }
    }

    // ==================== ANIMASI MUSIC VISUALIZER ====================
    function createMusicVisualizer() {
        const audio = document.getElementById('birthdayMusic');
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 2;
            opacity: 0.1;
        `;
        document.body.appendChild(canvas);

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        let audioContext, analyser, dataArray;

        function initAudioVisualizer() {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            analyser = audioContext.createAnalyser();
            const source = audioContext.createMediaElementSource(audio);
            source.connect(analyser);
            analyser.connect(audioContext.destination);
            
            analyser.fftSize = 64;
            dataArray = new Uint8Array(analyser.frequencyBinCount);
        }

        function drawVisualizer() {
            if (!analyser) return;

            requestAnimationFrame(drawVisualizer);
            analyser.getByteFrequencyData(dataArray);

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Draw circles based on music frequency
            for (let i = 0; i < dataArray.length; i++) {
                const value = dataArray[i];
                const x = Math.random() * canvas.width;
                const y = Math.random() * canvas.height;
                const radius = value / 10;
                
                ctx.beginPath();
                ctx.arc(x, y, radius, 0, 2 * Math.PI);
                ctx.fillStyle = `rgba(138, 43, 226, ${value / 255 * 0.3})`;
                ctx.fill();
            }
        }

        // Initialize when music plays
        audio.addEventListener('play', () => {
            if (!audioContext) {
                initAudioVisualizer();
            }
            drawVisualizer();
        });
    }

    // ==================== INISIALISASI SEMUA ANIMASI ====================
    function initAllAnimations() {
        createFloatingHearts();
        createSparkleEffect();
        createFloatingWords();
        createPulsingEffect();
        createScrollGlow();
        createMusicVisualizer();
    }

    // Mulai semua animasi
    setTimeout(initAllAnimations, 2000);

    // ... kode bubble animation yang sudah ada ...
});