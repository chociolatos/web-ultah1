// ================================================================
// ⚙️ SEKSI KONFIGURASI APLIKASI
// ================================================================
const CONFIG = {
    pin: "130908",
    lockHint: "(Hint: Tanggal Ulang Tahun / PIN: 130908)",
    lockCaption: "For My Birthday Girl",

    lockPhotoUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500",
    mainPhotoUrl: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=500",

    brandName: "HBD Love",
    mainTitle: "Selamat Ulang Tahun, Sayang!",
    greetingHeader: "Dearest Love,",
    paragraph1: "Selamat bertambah usia ya! Semoga di usiamu yang baru ini, kamu selalu dilimpahi kebahagiaan, kesehatan, rezeki yang melimpah, dan semua cita-citamu tercapai.",
    paragraph2: "Terima kasih sudah menjadi sosok yang luar biasa dan selalu membawa senyuman di setiap hariku. I am so lucky to have you in my life!",

    whatsappNumber: "6285777112483" // Nomor WA tujuan tanpa '+'
};

// --- 1. SETTING INITIAL DATA ---
function applyConfig() {
    document.getElementById("lockImg").src = CONFIG.lockPhotoUrl;
    document.getElementById("lockCaptionText").innerText = CONFIG.lockCaption;
    document.getElementById("lockHintText").innerHTML = CONFIG.lockHint;

    document.getElementById("navBrandText").innerText = CONFIG.brandName;
    document.getElementById("mainTitleText").innerText = CONFIG.mainTitle;
    document.getElementById("mainImg").src = CONFIG.mainPhotoUrl;
    
    document.getElementById("greetingText").innerText = CONFIG.greetingHeader;
    document.getElementById("letterTextParagraph1").innerText = CONFIG.paragraph1;
    document.getElementById("letterTextParagraph2").innerText = CONFIG.paragraph2;
}

// --- 2. LOCK SCREEN LOGIC ---
function unlockApp() {
    const pinInput = document.getElementById("pinInput").value;
    const errorMsg = document.getElementById("errorMsg");
    const lockScreen = document.getElementById("lockScreen");
    const mainApp = document.getElementById("mainApp");

    if (pinInput === CONFIG.pin) {
        lockScreen.style.display = "none";
        mainApp.style.display = "block";
        triggerConfetti();
    } else {
        errorMsg.style.display = "block";
    }
}

function checkEnter(event) {
    if (event.key === "Enter") {
        unlockApp();
    }
}

function triggerConfetti() {
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ff4d6d', '#ff8fa3', '#fff0f3', '#ffb3c1']
    });
}

// --- 3. WORD SEARCH GAME (DRAG / SERET) ---
const gridLetters = [
    ['S','A','Y','A','N','G','A','B'],
    ['X','C','I','N','T','A','K','L'],
    ['M','N','O','P','Q','R','S','T'],
    ['U','L','T','A','H','U','V','W'],
    ['A','B','C','D','E','F','G','H'],
    ['B','A','H','A','G','I','A','I'],
    ['J','K','L','M','N','O','P','Q'],
    ['K','E','N','C','A','N','R','S']
];

const targetWords = {
    "SAYANG": [[0,0],[0,1],[0,2],[0,3],[0,4],[0,5]],
    "CINTA":  [[1,1],[1,2],[1,3],[1,4],[1,5]],
    "ULTAH":  [[3,0],[3,1],[3,2],[3,3],[3,4]],
    "BAHAGIA":[[5,0],[5,1],[5,2],[5,3],[5,4],[5,5],[5,6]],
    "KENCAN": [[7,0],[7,1],[7,2],[7,3],[7,4],[7,5]]
};

let selectedCells = [];
let isDragging = false;
let foundWordsCount = 0;
const totalWords = Object.keys(targetWords).length;

function renderGrid() {
    const gridEl = document.getElementById("wordGrid");
    const listEl = document.getElementById("wordTargetList");
    
    gridEl.innerHTML = "";
    listEl.innerHTML = "";

    for (let word in targetWords) {
        const li = document.createElement("li");
        li.id = `word-${word}`;
        li.innerHTML = `<i class="fa-regular fa-circle"></i> ${word}`;
        listEl.appendChild(li);
    }

    for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
            const cell = document.createElement("div");
            cell.classList.add("grid-cell");
            cell.innerText = gridLetters[r][c];
            cell.dataset.row = r;
            cell.dataset.col = c;
            gridEl.appendChild(cell);
        }
    }

    gridEl.addEventListener("mousedown", startSelection);
    gridEl.addEventListener("mousemove", continueSelection);
    window.addEventListener("mouseup", endSelection);

    gridEl.addEventListener("touchstart", handleTouchStart, { passive: false });
    gridEl.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", endSelection);
}

function startSelection(e) {
    if (!e.target.classList.contains("grid-cell")) return;
    isDragging = true;
    clearSelection();
    selectCell(e.target);
}

function continueSelection(e) {
    if (!isDragging) return;
    if (e.target.classList.contains("grid-cell")) {
        selectCell(e.target);
    }
}

function handleTouchStart(e) {
    e.preventDefault();
    const touch = e.touches[0];
    const elem = document.elementFromPoint(touch.clientX, touch.clientY);
    if (elem && elem.classList.contains("grid-cell")) {
        isDragging = true;
        clearSelection();
        selectCell(elem);
    }
}

function handleTouchMove(e) {
    if (!isDragging) return;
    e.preventDefault();
    const touch = e.touches[0];
    const elem = document.elementFromPoint(touch.clientX, touch.clientY);
    if (elem && elem.classList.contains("grid-cell")) {
        selectCell(elem);
    }
}

function selectCell(cellEl) {
    if (cellEl.classList.contains("found-cell")) return;

    const r = parseInt(cellEl.dataset.row);
    const c = parseInt(cellEl.dataset.col);

    const alreadySelected = selectedCells.some(item => item.r === r && item.c === c);
    if (!alreadySelected) {
        selectedCells.push({ r, c, cellEl });
        cellEl.classList.add("selected");
    }
}

function clearSelection() {
    selectedCells.forEach(item => item.cellEl.classList.remove("selected"));
    selectedCells = [];
}

function endSelection() {
    if (!isDragging) return;
    isDragging = false;
    checkSelectedWord();
}

function checkSelectedWord() {
    let wordFound = false;

    for (let word in targetWords) {
        const coords = targetWords[word];
        if (coords.length === selectedCells.length) {
            let match = coords.every(coord => 
                selectedCells.some(sel => sel.r === coord[0] && sel.c === coord[1])
            );

            if (match) {
                wordFound = true;
                selectedCells.forEach(item => {
                    item.cellEl.classList.remove("selected");
                    item.cellEl.classList.add("found-cell");
                });
                
                document.getElementById(`word-${word}`).classList.add("found");
                document.getElementById(`word-${word}`).innerHTML = `<i class="fa-solid fa-circle-check"></i> ${word}`;
                
                selectedCells = [];
                delete targetWords[word];
                foundWordsCount++;

                if (foundWordsCount === totalWords) {
                    setTimeout(() => {
                        document.getElementById("envelopeModal").style.display = "flex";
                        triggerConfetti();
                    }, 400);
                }
                break;
            }
        }
    }

    if (!wordFound) {
        clearSelection();
    }
}

// --- 4. AMPLOP & FORM LOGIC ---
function openEnvelope() {
    const wrapper = document.getElementById("envelopeWrapper");
    wrapper.classList.add("open");

    setTimeout(() => {
        wrapper.style.display = "none";
        document.getElementById("dateFormContainer").classList.remove("hidden");
    }, 1000);
}

// --- 5. E-TICKET GENERATOR & WHATSAPP IMAGE LOGIC ---
let globalFormattedDate = "";
let globalActivity = "";

function generateTicket(event) {
    event.preventDefault();
    
    const dateVal = document.getElementById("dateInput").value;
    const activityVal = document.getElementById("activityInput").value;
    const noteVal = document.getElementById("noteInput").value;

    globalFormattedDate = new Date(dateVal).toLocaleDateString('id-ID', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    });
    globalActivity = activityVal;

    const ticketHTML = `
        <div id="captureTicket" class="ticket-card">
            <div class="ticket-header">
                <i class="fa-solid fa-ticket"></i> E-TICKET BIRTHDAY DATE
            </div>
            <div class="ticket-body">
                <div class="ticket-row">
                    <div class="ticket-label">Nama Tamu VIP:</div>
                    <div class="ticket-value">My Birthday Girl & You</div>
                </div>
                <div class="ticket-row">
                    <div class="ticket-label">Tanggal Kencan:</div>
                    <div class="ticket-value">${globalFormattedDate}</div>
                </div>
                <div class="ticket-row">
                    <div class="ticket-label">Rencana Aktivitas:</div>
                    <div class="ticket-value">${activityVal}</div>
                </div>
                <div class="ticket-row">
                    <div class="ticket-label">Catatan / Hadiah:</div>
                    <div class="ticket-value">${noteVal}</div>
                </div>
            </div>
            <div class="ticket-footer">
                <span class="barcode">E-TICKET-2026</span>
                <span style="font-size:0.8rem; color:#888;">Valid For 2 Person</span>
            </div>
        </div>
        <button class="btn-primary" onclick="window.print()"><i class="fa-solid fa-print"></i> Cetak / Simpan E-Ticket</button>
        <button class="btn-whatsapp" onclick="sendTicketToWhatsApp()"><i class="fa-brands fa-whatsapp"></i> Kirim Gambar Tiket ke WhatsApp</button>
    `;

    document.getElementById("ticketContainer").innerHTML = ticketHTML;
    document.getElementById("envelopeModal").style.display = "none";
    
    document.getElementById("ticketSection").classList.remove("hidden");
    document.getElementById("navTicketLink").classList.remove("hidden");

    document.getElementById("ticketSection").scrollIntoView({ behavior: 'smooth' });
    triggerConfetti();
}

// FUNGSI CONVERT KOTAK TIKET MENJADI GAMBAR & TERKIRIM KE WHATSAPP
function sendTicketToWhatsApp() {
    const ticketNode = document.getElementById("captureTicket");

    // Mengubah elemen kotak tiket menjadi canvas/gambar
    html2canvas(ticketNode, { scale: 2 }).then(canvas => {
        // Otomatis download file gambar tiket ke HP/komputer pengguna
        const image = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = image;
        link.download = `E-Ticket_Birthday_Date.png`;
        link.click();

        // Siapkan pesan dan buka WhatsApp
        const waText = encodeURIComponent(`Hai sayang! Ini gambar E-Ticket kencan ultah kita: ${globalFormattedDate} - ${globalActivity}.\n\n(Gambar tiketnya sudah tersimpan di galeri/download, tinggal kamu lampirkan foto/file-nya di sini ya!)`);
        
        setTimeout(() => {
            window.open(`https://wa.me/${CONFIG.whatsappNumber}?text=${waText}`, '_blank');
        }, 800);
    });
}

// Inisialisasi
window.onload = () => {
    applyConfig();
    renderGrid();
};