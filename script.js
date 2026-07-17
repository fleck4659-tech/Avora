// Configuration - Adjust these to change speed and phrases
const fallSpeed = 2; // Higher number = faster fall
const rotationSpeed = 0.5; // Higher number = faster rotation
const phrases = ["wow!", "this is cool!", "awesome!", "amazing!", "leemoon!"];

let fallingTextActive = true;
let spawnInterval;

// --- Customizable Bot State ---
let botName = localStorage.getItem("customBotName") || "Aza_Bot";

// --- Blocked Words List (Anti-Bypass Moderation) ---
const blockedWords = ["admin", "moderator", "staff", "exploit", "hack", "scam", "bypass", "system", "owner", "trash", "toxic"];

// Silent moderation check
function isUsernameBlocked(username) {
    const cleanUsername = username.toLowerCase().replace(/[^a-z0-9]/g, ''); // strip special symbols
    return blockedWords.some(word => cleanUsername.includes(word) || username.toLowerCase().includes(word));
}

// Cleaned database: The only player in the user list is your unique companion!
const database = {
    get users() {
        return [
            { username: botName + " [Companion Bot 🤖]", profileLink: "#", isBot: true }
        ];
    },
    games: [
        { title: "Super Azora Run", author: "603blox", link: "#" },
        { title: "Avatar Customizer Tycoon", author: "AzoraDeveloper", link: "#" },
        { title: "Sword Fighting Arena", author: "System", link: "#" }
    ]
};

let currentSearchTab = "users";

// Create the container automatically
const container = document.createElement('div');
container.id = 'falling-text-container';
document.body.appendChild(container);

// Function to spawn a random word
function spawnWord() {
    if (!fallingTextActive) return;
    const word = document.createElement('div');
    word.className = 'falling-word';
    word.innerText = phrases[Math.floor(Math.random() * phrases.length)];
    
    word.style.left = Math.random() * 90 + 'vw';
    word.style.top = '-50px'; // Start just above the screen

    // --- Dynamic Color Customization ---
    // If you want random colors for the phrases, keep this section. 
    // If you prefer the original version 2.7 white/styled text, you can comment this block out!
    const colors = ['#ffffff', '#ffd700', '#00ebd4', '#ff3b30', '#1e60ff'];
    word.style.color = colors[Math.floor(Math.random() * colors.length)];
    
    container.appendChild(word);
    
    let currentTop = -50;
    let currentRotation = 0;
    const rotationDirection = Math.random() > 0.5 ? 1 : -1; 

    // Moves the words down smoothly (the 2.7 classic way!)
    const interval = setInterval(() => {
        currentTop += fallSpeed;
        currentRotation += rotationSpeed * rotationDirection;
        
        word.style.top = currentTop + 'px';
        word.style.transform = `rotate(${currentRotation}deg)`;
        
        if (currentTop > window.innerHeight) {
            clearInterval(interval);
            word.remove();
        }
    }, 20);
}

// Change the interval inside your DOMContentLoaded or spawning initiator block:
clearInterval(spawnInterval); // Clear old timer
spawnInterval = setInterval(spawnWord, 10000); // Trigger every 10 seconds!
// Add this line inside your window / DOMContentLoaded listener:
updateAvatarLoginGuard();
}
startFallingPhrases();

// --- Settings Logic ---
function openSettings() {
    document.getElementById("settingsOverlay").style.display = "flex";
}
function closeSettings() {
    document.getElementById("settingsOverlay").style.display = "none";
}
function toggleFallingText() {
    fallingTextActive = document.getElementById("fallingTextToggle").checked;
    if (!fallingTextActive) {
        container.innerHTML = ""; // instantly clear screen of phrases
    }
}
function logoutUser() {
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("azoraAccount");
    alert("Logged out successfully.");
    location.reload();
// Add this line right after your login/signup/logout storage updates run:
updateAvatarLoginGuard();
}

// --- Search Logic ---
function openSearch() {
    document.getElementById("searchOverlay").style.display = "flex";
    document.getElementById("searchInput").focus();
    performSearch();
}
function closeSearch() {
    document.getElementById("searchOverlay").style.display = "none";
}
function setSearchTab(tab) {
    currentSearchTab = tab;
    document.getElementById("searchUsersTab").classList.toggle("active", tab === "users");
    document.getElementById("searchGamesTab").classList.toggle("active", tab === "games");
    document.getElementById("searchInput").placeholder = tab === "users" ? "Search usernames..." : "Search games...";
    performSearch();
}
function performSearch() {
    const query = document.getElementById("searchInput").value.trim().toLowerCase();
    const resultsContainer = document.getElementById("searchResultsContainer");
    resultsContainer.innerHTML = "";

    let localUsers = [];
    const localAcc = localStorage.getItem("azoraAccount");
    if (localAcc) {
        try {
            const parsed = JSON.parse(localAcc);
            localUsers.push({ username: parsed.username, profileLink: "#" });
        } catch (e) {}
    }

    const allUsers = [...database.users, ...localUsers];
    const uniqueUsers = Array.from(new Map(allUsers.map(item => [item.username.toLowerCase(), item])).values());

    let results = [];
    if (currentSearchTab === "users") {
        results = uniqueUsers.filter(u => u.username.toLowerCase().includes(query));
    } else {
        results = database.games.filter(g => g.title.toLowerCase().includes(query) || g.author.toLowerCase().includes(query));
    }

    if (results.length === 0) {
        resultsContainer.innerHTML = "<div class='no-results'>No results found.</div>";
        return;
    }

    results.forEach(item => {
        const row = document.createElement("div");
        row.className = "search-result-item";
        if (currentSearchTab === "users") {
            row.innerHTML = `👤 <strong>${item.username}</strong> <a href="${item.profileLink}" class="search-action-btn">View</a>`;
        } else {
            row.innerHTML = `🎮 <strong>${item.title}</strong> <span class="creator-by">by ${item.author}</span> <a href="${item.link}" class="search-action-btn">Play</a>`;
        }
        resultsContainer.appendChild(row);
    });
}

// --- Dropdown Socials logic ---
let lockedOpen = false;
function toggleDropdown() {
    const menu = document.getElementById("socialDropdown");
    lockedOpen = !lockedOpen;
    menu.style.display = lockedOpen ? "block" : "none";
}

const dropdown = document.querySelector(".dropdown");
if (dropdown) {
    dropdown.addEventListener("mouseenter", function () {
        if (!lockedOpen) {
            document.getElementById("socialDropdown").style.display = "block";
        }
    });

    dropdown.addEventListener("mouseleave", function () {
        if (!lockedOpen) {
            document.getElementById("socialDropdown").style.display = "none";
        }
    });
}

// --- Account Popup Modal Logic ---
function openCreateAccount() {
    document.getElementById("accountOverlay").style.display = "flex";
    document.getElementById("popupTitle").innerHTML = "Join Azora";
    document.getElementById("popupSubtitle").style.display = "block";
    document.getElementById("confirmPassword").style.display = "block";
    document.getElementById("email").style.display = "block";
    document.querySelectorAll("#accountOverlay .checkbox").forEach(el => el.style.display = "block");
    document.getElementById("mainButton").innerHTML = "Create Account";
    document.getElementById("switchMode").innerHTML = "Log In";
    document.querySelector(".popup p").childNodes[0].textContent = "Already have an account? ";
}

function openLogin() {
    document.getElementById("accountOverlay").style.display = "flex";
    document.getElementById("popupTitle").innerHTML = "Welcome Back!";
    document.getElementById("popupSubtitle").style.display = "none";
    document.getElementById("confirmPassword").style.display = "none";
    document.getElementById("email").style.display = "none";
    document.querySelectorAll("#accountOverlay .checkbox").forEach(el => el.style.display = "none");
    document.getElementById("mainButton").innerHTML = "Log In";
    document.getElementById("switchMode").innerHTML = "Create Account";
    document.querySelector(".popup p").childNodes[0].textContent = "Don't have an account? ";
}

function createAccount() {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;

    if (!username || !password) {
        alert("Please fill out all required fields!");
        return;
    }

    const account = {
        username: username,
        password: password,
        avatar: {
            head: "#ffcc00",
            torso: "#1e60ff",
            leftArm: "#ffcc00",
            rightArm: "#ffcc00",
            leftLeg: "#00ebd4",
            rightLeg: "#00ebd4",
            face: "default"
        }
    };

     const usernameInput = document.getElementById("username").value.trim();
if (!checkRegistrationUsername(usernameInput)) {
    return; // Stop registration completely without explaining why!
}
    localStorage.setItem("loggedIn", "true");

    alert("🎉 Welcome to Azora, " + username + "!");
    location.reload(); 
}

document.getElementById("mainButton").addEventListener("click", function () {
    if (this.innerHTML === "Create Account") {
        createAccount();
    } else {
        const username = document.getElementById("username").value.trim();
        if (username) {
            localStorage.setItem("loggedIn", "true");
            alert("👋 Welcome back, " + username + "!");
            location.reload();
        }
    }
});

document.getElementById("switchMode").addEventListener("click", function (e) {
    e.preventDefault();
    if (this.innerHTML === "Log In") {
        openLogin();
    } else {
        openCreateAccount();
    }
});

document.querySelectorAll(".overlay").forEach(overlay => {
    overlay.addEventListener("click", function (e) {
        if (e.target === this) {
            this.style.display = "none";
        }
    });
});

// --- Creator site handling ---
function handleCreateClick() {
    const loggedIn = localStorage.getItem("loggedIn");
    if (loggedIn === "true") {
        window.open("creator.html", "_blank");
    } else {
        alert("Please sign up first to access the Creator Studio!");
        openCreateAccount();
    }
}

// --- BasicCharacterService toggle ---
function toggleCharacterService() {
    const isChecked = document.getElementById("charServiceToggle").checked;
    localStorage.setItem("charServiceEnabled", isChecked);
    alert(`BasicCharacterService is now ${isChecked ? "ENABLED" : "DISABLED"}!`);
}

// --- TOS Modal Toggle Logic ---
function openTOS(event) {
    event.preventDefault();
    document.getElementById("tosOverlay").style.display = "flex";
}

function closeTOS() {
    document.getElementById("tosOverlay").style.display = "none";
}

// --- 3D Avatar Global Variables ---
let scene, camera, renderer;
let headMesh, torsoMesh, leftArmMesh, rightArmMesh, leftLegMesh, rightLegMesh;
let characterGroup; // Global character holder group

function init3DAvatar() {
    const container = document.getElementById("avatar3d-canvas");
    if (!container) return;

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(0, 1.3, 4.2);

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
    directionalLight.position.set(5, 10, 7);
    scene.add(directionalLight);

    // Master Group so everything rotates as one unified model
    characterGroup = new THREE.Group();

    const headGeo = new THREE.BoxGeometry(0.6, 0.6, 0.6);
    const headMat = new THREE.MeshLambertMaterial({ color: 0xffcc00 });
    headMesh = new THREE.Mesh(headGeo, headMat);
    headMesh.position.y = 1.1;

    // --- ADD THE AVATAR FACE TO THE HEAD (2.9 Improvement) ---
    const faceMat = new THREE.MeshBasicMaterial({ color: 0x333333, side: THREE.DoubleSide });
    
    // Smile Geometry
    const smileGeom = new THREE.RingGeometry(0.08, 0.12, 16, 1, Math.PI, Math.PI);
    const smile = new THREE.Mesh(smileGeom, faceMat);
    smile.position.set(0, -0.08, 0.31); 
    headMesh.add(smile);

    // Eye Geometry
    const eyeGeom = new THREE.BoxGeometry(0.08, 0.08, 0.02);
    const leftEye = new THREE.Mesh(eyeGeom, faceMat);
    leftEye.position.set(-0.12, 0.1, 0.31);
    headMesh.add(leftEye);

    const rightEye = new THREE.Mesh(eyeGeom, faceMat);
    rightEye.position.set(0.12, 0.1, 0.31);
    headMesh.add(rightEye);

    characterGroup.add(headMesh);

    const torsoGeo = new THREE.BoxGeometry(0.8, 1.0, 0.4);
    const torsoMat = new THREE.MeshLambertMaterial({ color: 0x1e60ff });
    torsoMesh = new THREE.Mesh(torsoGeo, torsoMat);
    torsoMesh.position.y = 0.3;
    characterGroup.add(torsoMesh);

    const armGeo = new THREE.BoxGeometry(0.35, 1.0, 0.35);
    const armMat = new THREE.MeshLambertMaterial({ color: 0xffcc00 });

    leftArmMesh = new THREE.Mesh(armGeo, armMat);
    leftArmMesh.position.set(-0.6, 0.3, 0);
    characterGroup.add(leftArmMesh);

    rightArmMesh = new THREE.Mesh(armGeo, armMat);
    rightArmMesh.position.set(0.6, 0.3, 0);
    characterGroup.add(rightArmMesh);

    const legGeo = new THREE.BoxGeometry(0.35, 1.0, 0.35);
    const legMat = new THREE.MeshLambertMaterial({ color: 0x00ebd4 });

    leftLegMesh = new THREE.Mesh(legGeo, legMat);
    leftLegMesh.position.set(-0.2, -0.7, 0);
    characterGroup.add(leftLegMesh);

    rightLegMesh = new THREE.Mesh(legGeo, legMat);
    rightLegMesh.position.set(0.2, -0.7, 0);
    characterGroup.add(rightLegMesh);

    scene.add(characterGroup);

    function animate() {
        requestAnimationFrame(animate);
        // Clean rotation on the entire character group
        characterGroup.rotation.y += 0.008;
        renderer.render(scene, camera);
    }
    animate();
}

// --- Dynamic Color Moderation Rules ---
const RESTRICTED_COLORS = {
    white: ["#ffffff", "#f0f0f0", "#e6e6e6"],
    red: ["#ff0000", "#e60000", "#cc0000"],
    blue: ["#0000ff", "#0000e6", "#0000cc"]
};

function moderateCharacterColors(head, torso, leftArm, rightArm, leftLeg, rightLeg) {
    const cHead = head.toLowerCase();
    const cTorso = torso.toLowerCase();
    const cLeftArm = leftArm.toLowerCase();
    const cRightArm = rightArm.toLowerCase();
    const cLeftLeg = leftLeg.toLowerCase();
    const cRightLeg = rightLeg.toLowerCase();

    let safeTorso = cTorso;
    let moderated = false;

    for (const colorGroup in RESTRICTED_COLORS) {
        const restrictedList = RESTRICTED_COLORS[colorGroup];
        if (
            restrictedList.includes(cHead) && 
            restrictedList.includes(cTorso) && 
            restrictedList.includes(cLeftArm) &&
            restrictedList.includes(cRightArm) &&
            restrictedList.includes(cLeftLeg) &&
            restrictedList.includes(cRightLeg)
        ) {
            safeTorso = "#1e293b"; 
            moderated = true;
            break;
        }
    }

    return {
        head: cHead,
        torso: safeTorso,
        leftArm: cLeftArm,
        rightArm: cRightArm,
        leftLeg: cLeftLeg,
        rightLeg: cRightLeg,
        wasModerated: moderated
    };
}

function updateAvatarColors() {
    const rawHead = document.getElementById("colorHead").value;
    const rawTorso = document.getElementById("colorTorso").value;
    const rawLeftArm = document.getElementById("colorLeftArm").value;
    const rawRightArm = document.getElementById("colorRightArm").value;
    const rawLeftLeg = document.getElementById("colorLeftLeg").value;
    const rawRightLeg = document.getElementById("colorRightLeg").value;

    const validated = moderateCharacterColors(rawHead, rawTorso, rawLeftArm, rawRightArm, rawLeftLeg, rawRightLeg);

    headMesh.material.color.set(validated.head);
    torsoMesh.material.color.set(validated.torso);
    leftArmMesh.material.color.set(validated.leftArm);
    rightArmMesh.material.color.set(validated.rightArm);
    leftLegMesh.material.color.set(validated.leftLeg);
    rightLegMesh.material.color.set(validated.rightLeg);

    const warning = document.getElementById("modWarning");
    if (validated.wasModerated) {
        warning.style.display = "block";
    } else {
        warning.style.display = "none";
    }
}

function saveAvatar() {
    const account = JSON.parse(localStorage.getItem("azoraAccount"));
    if (!account) {
        alert("Please log in or create an account to save your custom 3D avatar!");
        return;
    }

    const validated = moderateCharacterColors(
        document.getElementById("colorHead").value,
        document.getElementById("colorTorso").value,
        document.getElementById("colorLeftArm").value,
        document.getElementById("colorRightArm").value,
        document.getElementById("colorLeftLeg").value,
        document.getElementById("colorRightLeg").value
    );

    account.avatar = {
        head: validated.head,
        torso: validated.torso,
        leftArm: validated.leftArm,
        rightArm: validated.rightArm,
        leftLeg: validated.leftLeg,
        rightLeg: validated.rightLeg,
        face: "default"
    };

    localStorage.setItem("azoraAccount", JSON.stringify(account));
    alert("3D Avatar saved successfully to your Azora account!");
}

// --- App Start ---
window.addEventListener("DOMContentLoaded", () => {
    init3DAvatar();
    
    const loggedIn = localStorage.getItem("loggedIn");
    if (loggedIn === "true") {
        const account = JSON.parse(localStorage.getItem("azoraAccount"));
        if (account) {
            document.getElementById("guestButtons").style.display = "none";
            document.getElementById("userPanel").style.display = "flex";
            document.getElementById("profileButton").innerHTML = "👤 " + account.username;
            
            if (account.avatar) {
                document.getElementById("colorHead").value = account.avatar.head || "#ffcc00";
                document.getElementById("colorTorso").value = account.avatar.torso || "#1e60ff";
                document.getElementById("colorLeftArm").value = account.avatar.leftArm || "#ffcc00";
                document.getElementById("colorRightArm").value = account.avatar.rightArm || "#ffcc00";
                document.getElementById("colorLeftLeg").value = account.avatar.leftLeg || "#00ebd4";
                document.getElementById("colorRightLeg").value = account.avatar.rightLeg || "#00ebd4";
                updateAvatarColors();
            }
        }
    }
    
    const charServiceEnabled = localStorage.getItem("charServiceEnabled");
    if (charServiceEnabled === "true" && document.getElementById("charServiceToggle")) {
        document.getElementById("charServiceToggle").checked = true;
    }
});
// --- Bot Rename & Sign-Up Block System ---

function renameCompanionBot() {
    const newNameInput = document.getElementById("botRenameInput");
    if (!newNameInput) return;
    
    const newName = newNameInput.value.trim();
    
    if (!newName) {
        alert("An error occurred. Please try again."); // Generic error
        return;
    }
    
    // Check lengths and blocked words
    if (newName.length < 2 || newName.length > 15 || isUsernameBlocked(newName)) {
        alert("An unexpected system error occurred. Please try again later."); // Generic error so they can't bypass
        return;
    }
    
    botName = newName;
    localStorage.setItem("customBotName", newName);
    newNameInput.value = "";
    
    // Update displays across the site
    updateBotUI();
    if (typeof renderGlobalSearchResults === 'function') {
        renderGlobalSearchResults();
    }
    alert(`✨ Companion bot successfully renamed to: ${newName}!`);
}

function updateBotUI() {
    const botDisplayEls = document.querySelectorAll(".bot-name-display");
    botDisplayEls.forEach(el => {
        el.innerText = botName;
    });
}

// Hook into register system to check blocked names silently
function checkRegistrationUsername(username) {
    if (isUsernameBlocked(username)) {
        alert("An error occurred during account registration."); // Generic vague error
        return false;
    }
    return true;
}

// Run on setup
document.addEventListener("DOMContentLoaded", () => {
    updateBotUI();
});
// --- 3D Avatar Guard System ---
function updateAvatarLoginGuard() {
    const loggedIn = localStorage.getItem("loggedIn") === "true";
    const warningEl = document.getElementById("avatarLoggedOutWarning");
    const avatarCanvasParent = document.getElementById("avatar3D"); // Target container of your 3D viewport

    if (loggedIn) {
        // User is logged in: Hide warning, show 3D Avatar
        if (warningEl) warningEl.style.display = "none";
        if (avatarCanvasParent) {
            avatarCanvasParent.style.display = "block";
            // Optional: Trigger your Three.js resize or render update if needed
            if (typeof updateAvatarColors === 'function') {
                updateAvatarColors();
            }
        }
    } else {
        // User is guest/logged out: Show warning, hide 3D Avatar
        if (warningEl) warningEl.style.display = "flex";
        if (avatarCanvasParent) avatarCanvasParent.style.display = "none";
    }
}
// --- Settings Panel Category Switching ---
function switchSettingsTab(tabName) {
    const basicBtn = document.getElementById("btnBasicTab");
    const customBtn = document.getElementById("btnCustomTab");
    const basicSec = document.getElementById("settingsBasicSection");
    const customSec = document.getElementById("settingsCustomSection");

    if (tabName === 'basic') {
        basicBtn.classList.add("active");
        customBtn.classList.remove("active");
        basicSec.style.display = "block";
        customSec.style.display = "none";
    } else {
        customBtn.classList.add("active");
        basicBtn.classList.remove("active");
        customSec.style.display = "block";
        basicSec.style.display = "none";
    }
}

// --- Theme Application System ---
function applyPresetTheme(type) {
    // Disable custom overrides when preset is chosen
    document.getElementById("customColorsToggle").checked = false;
    toggleCustomColorPickers();

    // Clean up premium classes
    document.body.classList.remove("metallic-theme", "glossy-theme");

    if (type === 'dark') {
        document.documentElement.style.setProperty('--bg-gradient', 'linear-gradient(180deg, #05070c 0%, #080c14 50%, #020306 100%)');
        document.documentElement.style.setProperty('--card-bg', 'rgba(8, 12, 20, 0.85)');
        document.documentElement.style.setProperty('--accent-color', '#1e60ff');
        document.documentElement.style.setProperty('--btn-gradient', 'linear-gradient(135deg, #1e60ff 0%, #00aaff 100%)');
    } else if (type === 'light') {
        // Theme elements inspired directly by the logo colors (White base + Cyan & Electric Blue accents)
        document.documentElement.style.setProperty('--bg-gradient', 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)');
        document.documentElement.style.setProperty('--card-bg', 'rgba(255, 255, 255, 0.85)');
        document.documentElement.style.setProperty('--border-color', 'rgba(30, 96, 255, 0.15)');
        document.documentElement.style.setProperty('--accent-color', '#00ebff');
        document.documentElement.style.setProperty('--btn-gradient', 'linear-gradient(135deg, #00ebff 0%, #1e60ff 100%)');
        // Let's adjust general dark text visibility overrides for light mode:
        document.body.style.color = "#0f172a";
    }
    localStorage.setItem("selectedTheme", type);
}

// Custom Theme Controls Toggle
function toggleCustomColorPickers() {
    const isChecked = document.getElementById("customColorsToggle").checked;
    const container = document.getElementById("customColorPickersContainer");
    if (isChecked) {
        container.style.display = "block";
        applyCustomColors();
    } else {
        container.style.display = "none";
        // Reset to standard properties
        document.documentElement.style.removeProperty('--bg-gradient');
        document.documentElement.style.removeProperty('--card-bg');
        document.documentElement.style.removeProperty('--accent-color');
    }
}

// Custom Theme Color Binding updates
function applyCustomColors() {
    const bg = document.getElementById("customBgColor").value;
    const card = document.getElementById("customCardColor").value;
    const accent = document.getElementById("customAccentColor").value;

    document.documentElement.style.setProperty('--bg-gradient', bg);
    document.documentElement.style.setProperty('--card-bg', card);
    document.documentElement.style.setProperty('--accent-color', accent);
    document.documentElement.style.setProperty('--btn-gradient', `linear-gradient(135deg, ${accent} 0%, #000000 150%)`);
}

// --- Premium System Guard ---
function applyPremiumTheme(premiumType) {
    // Basic verification check: Is the premium pass unlocked/active?
    const hasPremium = localStorage.getItem("isPremium") === "true";

    if (!hasPremium) {
        alert("🔒 The " + premiumType.toUpperCase() + " material theme is part of the Premium Package! Acquire the Azora Members pass first.");
        return;
    }

    // Disable custom overrides when preset is active
    document.getElementById("customColorsToggle").checked = false;
    toggleCustomColorPickers();

    document.body.classList.remove("metallic-theme", "glossy-theme");

    if (premiumType === 'metallic') {
        document.body.classList.add("metallic-theme");
    } else if (premiumType === 'glossy') {
        document.body.classList.add("glossy-theme");
    }
    
    alert("✨ Premium " + premiumType.toUpperCase() + " style successfully rendered!");
}