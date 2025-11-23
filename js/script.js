// ambil elemen
const input = document.getElementById('pin-input');
const buttons = document.querySelectorAll('.num');
const clearBtn = document.querySelector('.clear');
const okBtn = document.querySelector('.ok');
const meowSalah = document.getElementById('meow2');
const meowBenar = document.getElementById('meow1');
const notif = document.getElementById('notif');
const pinDots = document.querySelectorAll('.pin-dot');
const pinPlaceholder = document.getElementById('pin-placeholder');

// PIN yang benar
const correctPIN = "271103";

// fungsi update PIN dots
function updatePinDots() {
  const value = input.value;
  const length = value.length;
  
  // Reset semua dots
  pinDots.forEach(dot => {
    dot.classList.remove('filled');
  });
  
  // Isi dots sesuai jumlah karakter
  for (let i = 0; i < length; i++) {
    if (pinDots[i]) {
      pinDots[i].classList.add('filled');
    }
  }
  
  // Sembunyikan placeholder jika ada input
  if (length > 0) {
    pinPlaceholder.style.display = 'none';
  } else {
    pinPlaceholder.style.display = 'flex';
  }
}

// fungsi notif
function showNotif(text) {
  notif.textContent = text;
  notif.style.display = 'block';
  setTimeout(() => {
    notif.style.display = 'none';
  }, 1500);
}

// klik tombol angka
buttons.forEach(btn => {
  btn.addEventListener('click', () => {
    if (input.value.length < 6) {
      input.value += btn.textContent;
      updatePinDots();
    }
  });
});

// tombol hapus (C)
clearBtn.addEventListener('click', () => {
  input.value = "";
  updatePinDots();
});

// tombol OK
okBtn.addEventListener('click', () => {
  const entered = input.value;

  if (entered === correctPIN) {
    // mainkan suara benar
    meowBenar.currentTime = 0;
    meowBenar.play();

    // nonaktifkan tombol biar gak bisa diklik ulang
    buttons.forEach(b => b.disabled = true);
    clearBtn.disabled = true;
    okBtn.disabled = true;

    // delay biar suaranya sempat terdengar
    setTimeout(() => {
      window.location.href = "game.html";
    }, 1000);

  } else {
    // mainkan suara salah dan reset input
    if (entered.length > 0) {
      meowSalah.currentTime = 0;
      meowSalah.play();
    }
    input.value = "";
    updatePinDots();
    showNotif("KALO PACAR AKU GA AKAN SALAH 😡");

    // efek getar lucu
    input.classList.add('shake');
    setTimeout(() => input.classList.remove('shake'), 400);
  }
});

// Bubble animation
const colors = [
  "rgba(138, 43, 226, 0.5)",  // Purple
  "rgba(255, 253, 208, 0.5)", // Cream
  "rgba(255, 255, 255, 0.4)"  // White
];

function createBubble() {
  const bubble = document.createElement("div");
  bubble.classList.add("bubble");

  const size = Math.random() * 40 + 20;
  bubble.style.width = `${size}px`;
  bubble.style.height = `${size}px`;
  bubble.style.left = `${Math.random() * 100}%`;
  bubble.style.animationDuration = `${8 + Math.random() * 4}s`;
  bubble.style.animationDelay = `${Math.random() * 5}s`;

  bubble.style.background = colors[Math.floor(Math.random() * colors.length)];

  document.body.appendChild(bubble);

  setTimeout(() => {
    bubble.remove();
  }, 12000);
}

setInterval(createBubble, 500);
createBubble();

// Inisialisasi PIN dots
updatePinDots();