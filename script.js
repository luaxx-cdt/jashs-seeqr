// =============================================
// SECTION DATA — Official JASHS Grade 12 List
// =============================================
const SECTION_DATA = {
    "12": {
        "STEM": [
            { name: "Knowledge", room: "B1 - 301", adviser: "Kristene C. Dela Cruz" },
            { name: "Wisdom", room: "B1 - 302", adviser: "Kimberly Joy Bustamante" },
            { name: "Understanding", room: "B1 - 303", adviser: "Marissa V. Soriano" },
            { name: "Judgment", room: "B1 - 202", adviser: "Noyek Gulay" }
        ],
        "ASSH": [
            { name: "Faith", room: "B1 - 401", adviser: "Paul Gavasan" },
            { name: "Hope", room: "B1 - 402", adviser: "Lorena S. Club" },
            { name: "Love", room: "B1 - 403", adviser: "Lermelyn Mendoza" },
            { name: "Peace", room: "B1 - 404", adviser: "Lalaine Enilo" },
            { name: "Joy", room: "B1 - 304", adviser: "Emily B. Franco" },
            { name: "Humility", room: "B2 - 204", adviser: "Mark Lester Felipe" }
        ],
        "BE": [
            { name: "Perseverance", room: "B2 - 401", adviser: "Shiloh Datumgam" },
            { name: "Industry", room: "B2 - 402", adviser: "Marc Noel C. Carino" }
        ],
        "ICT": [
            { name: "Integrity", room: "B2 - 302", adviser: "Gibson J. Olazo" },
            { name: "Honesty", room: "B2 - 303", adviser: "Nigee Pascua" },
            { name: "Patience", room: "B2 - 304", adviser: "Christian Orlina" }
        ],
        "HOSPITALITY": [
            { name: "Charity", room: "B2 - 403", adviser: "Ma. Edita Tagapan" },
            { name: "Generosity", room: "B2 - 202", adviser: "Jan Isiah Nicanor" },
            { name: "Kindness", room: "B2 - 201", adviser: "Allysa Kaye Dela Luna" },
            { name: "Compassion", room: "B2 - 404", adviser: "Jomar Badiac-on" }
        ],
        "INDUSTRIAL": [
            { name: "Prudence", room: "B2 - 102", adviser: "Noel G. Bergania" }
        ],
        "CONSTRUCTION": [
            { name: "Diligence", room: "B2 - 103/203", adviser: "Jacqueline Cascasan" }
        ]
    },
    "11": {}
};

// =============================================
// ACCOUNT & DATA STORAGE — PRESERVES YOUR PROGRESS
// =============================================
// Load existing data — KEEPS your records!
let account = JSON.parse(localStorage.getItem("jashsAccount")) || {
    username: "admin",
    password: "admin123",
    contact: "09123456789",
    photo: ""
};
let studentRecords = JSON.parse(localStorage.getItem("jashesRecords")) || [];
let selectedStudentId = null;
let currentQRDataURL = "";
let generatedOTP = null;

// =============================================
// LOGIN & OTP FLOW — FIXED
// =============================================
function login() {
    const user = document.getElementById("username").value.trim();
    const pass = document.getElementById("password").value.trim();

    if (user === account.username && pass === account.password) {
        sendOTP();
    } else {
        alert("❌ Invalid username or password");
    }
}

function sendOTP() {
    generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();
    alert(`📲 Your verification code: ${generatedOTP}\n(Sent to: ${account.contact})`);
    document.getElementById("loginFormArea").style.display = "none";
    document.getElementById("otpArea").style.display = "block";
}

function showOTPRequest() {
    const user = prompt("Enter your username:");
    if (user === account.username) sendOTP();
    else alert("❌ Username not found");
}

function verifyOTP() {
    const entered = document.getElementById("otpInput").value.trim();
    if (entered === generatedOTP) {
        document.getElementById("loginScreen").style.display = "none";
        document.getElementById("dashboardScreen").style.display = "flex";
        loadProfilePhoto();
        updateSectionOptions();
        applyAllFilters();
    } else {
        alert("❌ Invalid code. Please try again.");
    }
}

function backToLogin() {
    document.getElementById("otpArea").style.display = "none";
    document.getElementById("loginFormArea").style.display = "block";
    generatedOTP = null;
}

function logout() {
    document.getElementById("dashboardScreen").style.display = "none";
    document.getElementById("loginScreen").style.display = "flex";
    document.getElementById("username").value = "";
    document.getElementById("password").value = "";
    document.getElementById("otpInput").value = "";
    document.getElementById("accountMenu").style.display = "none";
    generatedOTP = null;
}

function toggleAccountMenu() {
    const m = document.getElementById("accountMenu");
    m.style.display = m.style.display === "block" ? "none" : "block";
}

// =============================================
// PROFILE MANAGEMENT
// =============================================
function openProfile() {
    document.getElementById("accountMenu").style.display = "none";
    document.getElementById("profileUsername").value = account.username;
    document.getElementById("profileContact").value = account.contact || "";
    document.getElementById("profileModal").style.display = "flex";
}

function previewPhoto() {
    const file = document.getElementById("profilePhoto").files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = e => {
            document.getElementById("profilePreview").src = e.target.result;
        };
        reader.readAsDataURL(file);
    }
}

function loadProfilePhoto() {
    if (account.photo) {
        document.getElementById("navProfilePic").src = account.photo;
        document.getElementById("profilePreview").src = account.photo;
    }
}

function saveProfile() {
    const newUser = document.getElementById("profileUsername").value.trim();
    const newPass = document.getElementById("profileNewPass").value.trim();
    const newContact = document.getElementById("profileContact").value.trim();
    const previewSrc = document.getElementById("profilePreview").src;

    if (!newUser) { alert("❌ Username cannot be empty"); return; }

    account.username = newUser;
    if (newPass) account.password = newPass;
    account.contact = newContact;
    if (previewSrc && previewSrc.startsWith("data:")) account.photo = previewSrc;

    localStorage.setItem("jashsAccount", JSON.stringify(account));
    loadProfilePhoto();
    alert("✅ Profile saved successfully!");
    closeModal("profileModal");
}

// =============================================
// EXPORT / IMPORT — Offline Data Sharing
// =============================================
function exportData() {
    document.getElementById("accountMenu").style.display = "none";
    const exportObj = {
        exportedAt: new Date().toLocaleString(),
        version: "1.0",
        records: studentRecords
    };
    const exportText = JSON.stringify(exportObj, null, 2);
    
    const textarea = document.createElement("textarea");
    textarea.value = exportText;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
    
    const blob = new Blob([exportText], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `JASHS_SeeQR_Backup_${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    alert("✅ Data exported & copied to clipboard!\n\nPaste this into the other device's Import box.");
}

function showImport() {
    document.getElementById("accountMenu").style.display = "none";
    document.getElementById("importDataArea").value = "";
    document.getElementById("importModal").style.display = "flex";
}

function doImport() {
    const text = document.getElementById("importDataArea").value.trim();
    if (!text) { alert("❌ Paste data first"); return; }
    
    try {
        const imported = JSON.parse(text);
        if (!imported.records || !Array.isArray(imported.records)) {
            throw new Error("Invalid format");
        }
        
        const overwrite = document.getElementById("overwriteMode").checked;
        if (overwrite) {
            studentRecords = imported.records;
        } else {
            const existingIds = new Set(studentRecords.map(r => r.id));
            const newRecords = imported.records.filter(r => !existingIds.has(r.id));
            studentRecords = [...studentRecords, ...newRecords];
        }
        
        localStorage.setItem("jashesRecords", JSON.stringify(studentRecords));
        applyAllFilters();
        closeModal("importModal");
        alert(`✅ Imported ${imported.records.length} record(s) successfully!`);
    } catch (e) {
        alert("❌ Invalid data format. Make sure you copied the full exported text.");
    }
}

// =============================================
// TWO SEPARATE QR CODES
// =============================================
function getBaseURL() {
    const href = window.location.href;
    if (href.startsWith("file://")) {
        return "⚠️ Upload to GitHub Pages to get working links";
    }
    return href.split('#')[0];
}

function showDatabaseQR() {
    document.getElementById("accountMenu").style.display = "none";
    document.getElementById("databaseQRModal").style.display = "flex";
    
    const baseURL = getBaseURL();
    if (baseURL.startsWith("⚠️")) {
        document.getElementById("databaseQRDisplay").innerHTML = 
            `<p style="color:#7e57c2; padding:20px;">Upload to GitHub Pages first to get working links.</p>`;
        return;
    }
    
    document.getElementById("databaseQRDisplay").innerHTML = "";
    new QRCode(document.getElementById("databaseQRDisplay"), {
        text: baseURL,
        width: 220,
        height: 220,
        colorDark: "#7e57c2",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.M
    });
}

function showEntryQR() {
    document.getElementById("accountMenu").style.display = "none";
    document.getElementById("entryQRModal").style.display = "flex";
    
    const baseURL = getBaseURL();
    if (baseURL.startsWith("⚠️")) {
        document.getElementById("entryQRDisplay").innerHTML = 
            `<p style="color:#ce93d8; padding:20px;">Upload to GitHub Pages first to get working links.</p>`;
        return;
    }
    
    document.getElementById("entryQRDisplay").innerHTML = "";
    new QRCode(document.getElementById("entryQRDisplay"), {
        text: baseURL + "#add",
        width: 220,
        height: 220,
        colorDark: "#ce93d8",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.M
    });
}

// =============================================
// DROPDOWN & SECTION LOGIC
// =============================================
function updateSectionOptions() {
    const grade = document.getElementById("gradeLevel").value;
    const strand = document.getElementById("strandFilter").value;
    const select = document.getElementById("sectionFilter");

    select.innerHTML = `<option value="All">All Sections</option>`;
    if (grade === "All" || strand === "All" || !SECTION_DATA[grade]) return;

    const sections = SECTION_DATA[grade][strand] || [];
    sections.forEach(s => {
        const opt = document.createElement("option");
        opt.value = s.name;
        opt.textContent = s.name;
        select.appendChild(opt);
    });
}

function populateNewSections() {
    const grade = document.getElementById("new-grade").value;
    const strand = document.getElementById("new-strand").value;
    const select = document.getElementById("new-section");

    select.innerHTML = `<option value="">Select Section</option>`;
    if (!grade || !strand || !SECTION_DATA[grade]) return;

    const sections = SECTION_DATA[grade][strand] || [];
    sections.forEach(s => {
        const opt = document.createElement("option");
        opt.value = s.name;
        opt.textContent = `${s.name} — Room ${s.room}`;
        select.appendChild(opt);
    });
}

// =============================================
// FILTERS & SEARCH
// =============================================
function applyAllFilters() {
    const grade = document.getElementById("gradeLevel").value;
    const strand = document.getElementById("strandFilter").value;
    const section = document.getElementById("sectionFilter").value;
    const search = document.getElementById("globalSearch").value.toLowerCase().trim();

    let filtered = studentRecords.filter(s => {
        const matchGrade = grade === "All" || s.grade === grade;
        const matchStrand = strand === "All" || s.strand === strand;
        const matchSection = section === "All" || s.section === section;
        const matchSearch = !search ||
            s.fullName.toLowerCase().includes(search) ||
            s.section.toLowerCase().includes(search) ||
            (s.bloodType && s.bloodType.toLowerCase().includes(search)) ||
            s.adviser.toLowerCase().includes(search);

        return matchGrade && matchStrand && matchSection && matchSearch;
    });

    renderStudentList(filtered);
}

function renderStudentList(list) {
    const container = document.getElementById("studentList");
    if (list.length === 0) {
        container.innerHTML = `<p class="empty-msg">No students found</p>`;
        return;
    }
    container.innerHTML = list.map(s => `
        <div class="student-name-item ${selectedStudentId === s.id ? 'selected' : ''}" 
             onclick="selectStudent(${s.id})">
            <strong>${s.fullName}</strong><br>
            <small style="color:#888;">${s.section} • ${s.bloodType || "Unknown"}</small>
        </div>
    `).join("");
}

// =============================================
// STUDENT DETAILS DISPLAY
// =============================================
function selectStudent(id) {
    selectedStudentId = id;
    const s = studentRecords.find(x => x.id === id);
    if (!s) return;

    applyAllFilters();
    document.getElementById("selectHint").style.display = "none";
    document.getElementById("studentDetails").style.display = "block";

    document.getElementById("d-name").textContent = s.fullName;
    document.getElementById("d-strand").textContent = `Grade ${s.grade} — ${s.strand}`;
    document.getElementById("d-section").textContent = `${s.section} | Room ${s.room}`;
    document.getElementById("d-adviser").textContent = s.adviser;
    document.getElementById("d-blood").textContent = s.bloodType || "Not Recorded";
    document.getElementById("d-allergies").textContent = s.allergies || "None recorded";
    document.getElementById("d-conditions").textContent = s.conditions || "None recorded";
    document.getElementById("d-medicines").textContent = s.medicines || "None recorded";
    document.getElementById("d-special").textContent = s.specialNeeds || "None recorded";
    document.getElementById("d-doctor").textContent = s.doctor || "Not specified";
    document.getElementById("d-ec-person").textContent = s.emergencyPerson;
    document.getElementById("d-ec-relation").textContent = s.relationship || "Not specified";
    document.getElementById("d-ec-num").textContent = s.emergencyContact;
    document.getElementById("d-ec-alt").textContent = s.alternateContact || "Not provided";

    generateStudentQR(s);
}

function generateStudentQR(s) {
    const text = 
`JASHS EMERGENCY HEALTH RECORD
══════════════════════════════
NAME: ${s.fullName}
GRADE: ${s.grade} — ${s.strand}
SECTION: ${s.section}
ROOM: ${s.room}
ADVISER: ${s.adviser}
BLOOD TYPE: ${s.bloodType || "Not Recorded"}

MEDICAL INFORMATION
──────────────────────────────
ALLERGIES:
${s.allergies || "None recorded"}

CONDITIONS:
${s.conditions || "None recorded"}

MEDICINES:
${s.medicines || "None recorded"}

SPECIAL INSTRUCTIONS:
${s.specialNeeds || "None recorded"}

ATTENDING DOCTOR:
${s.doctor || "Not specified"}

EMERGENCY CONTACT
──────────────────────────────
${s.emergencyPerson}
Relationship: ${s.relationship || "Not specified"}
Phone: ${s.emergencyContact}
Alt: ${s.alternateContact || "Not provided"}

───
JASHS See-QR System`;

    document.getElementById("qrcodeDisplay").innerHTML = "";
    new QRCode(document.getElementById("qrcodeDisplay"), {
        text, width: 220, height: 220,
        colorDark: "#7e57c2", colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.M
    });

    setTimeout(() => {
        const canvas = document.querySelector("#qrcodeDisplay canvas");
        if (canvas) currentQRDataURL = canvas.toDataURL("image/png");
    }, 300);
}

function downloadQR() {
    if (!currentQRDataURL || !selectedStudentId) return;
    const s = studentRecords.find(x => x.id === selectedStudentId);
    const link = document.createElement("a");
    link.href = currentQRDataURL;
    link.download = `JASHS_SeeQR_${s.fullName.replace(/\s+/g, "_")}.png`;
    link.click();
}

// =============================================
// ADD NEW STUDENT
// =============================================
function openAddForm() {
    document.getElementById("addModal").style.display = "flex";
}

function closeModal(id) {
    document.getElementById(id).style.display = "none";
    if (id === "addModal") {
        document.getElementById("new-grade").value = "";
        document.getElementById("new-strand").value = "";
        document.getElementById("new-section").innerHTML = `<option value="">Select Section</option>`;
        document.getElementById("new-blood").value = "Unknown";
        document.getElementById("new-allergies").value = "";
        document.getElementById("new-conditions").value = "";
        document.getElementById("new-medicines").value = "";
        document.getElementById("new-special").value = "";
        document.getElementById("new-doctor").value = "";
        document.getElementById("new-ec-person").value = "";
        document.getElementById("new-ec-relation").value = "";
        document.getElementById("new-ec-num").value = "";
        document.getElementById("new-ec-alt").value = "";
    }
}

function saveNewStudent() {
    const grade = document.getElementById("new-grade").value;
    const strand = document.getElementById("new-strand").value;
    const sectionVal = document.getElementById("new-section").value;
    const sectionData = SECTION_DATA[grade]?.[strand]?.find(s => s.name === sectionVal);
    
    if (!grade || !strand || !sectionVal) {
        alert("❌ Please fill all required fields");
        return;
    }

    const newStudent = {
        id: Date.now(),
        fullName: document.getElementById("new-name").value.trim(),
        grade,
        strand,
        section: sectionVal,
        room: sectionData?.room || "Not set",
        adviser: sectionData?.adviser || "Not set",
        bloodType: document.getElementById("new-blood").value,
        allergies: document.getElementById("new-allergies").value.trim(),
        conditions: document.getElementById("new-conditions").value.trim(),
        medicines: document.getElementById("new-medicines").value.trim(),
        specialNeeds: document.getElementById("new-special").value.trim(),
        doctor: document.getElementById("new-doctor").value.trim(),
        emergencyPerson: document.getElementById("new-ec-person").value.trim(),
        relationship: document.getElementById("new-ec-relation").value.trim(),
        emergencyContact: document.getElementById("new-ec-num").value.trim(),
        alternateContact: document.getElementById("new-ec-alt").value.trim()
    };

    if (!newStudent.fullName) { alert("❌ Full name is required"); return; }
    if (!newStudent.emergencyContact) { alert("❌ Emergency contact number is required"); return; }

    studentRecords.push(newStudent);
    localStorage.setItem("jashesRecords", JSON.stringify(studentRecords));
    
    alert("✅ Student added successfully!");
    closeModal("addModal");
    applyAllFilters();
}

// =============================================
// AUTO-INITIALIZE
// =============================================
document.addEventListener("DOMContentLoaded", function() {
    console.log("✅ JASHS See-QR Loaded");
});