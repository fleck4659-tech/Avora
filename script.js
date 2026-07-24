// Configuration - Adjust these to change speed and phrases
const fallSpeed = 2; // Higher number = faster fall
const rotationSpeed = 0.5; // Higher number = faster rotation
const phrases = ["wow!", "this is cool!", "awesome!", "amazing!", "leemoon!"];

let fallingTextActive = true;
let spawnInterval;

// Mock database for search demonstration
const database = {
    users: [
        { username: "603blox", profileLink: "https://www.roblox.com/users/9744531169/profile" },
        { username: "AzoraDeveloper", profileLink: "#" },
        { username: "LeemoonFan", profileLink: "#" },
        { username: "Guest1337", profileLink: "#" }
    ],
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
    
    container.appendChild(word);
    
    let currentTop = -50;
    let currentRotation = 0;
    const rotationDirection = Math.random() > 0.5 ? 1 : -1; 

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

// Spawn a new word every 10.0 seconds
function startFallingPhrases() {
    if (spawnInterval) clearInterval(spawnInterval);
    spawnInterval = setInterval(spawnWord, 10000);
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

    // Load custom dynamic profiles from local storage to include newly made accounts in user searches!
    let localUsers = [];
    const localAcc = localStorage.getItem("azoraAccount");
    if (localAcc) {
        try {
            const parsed = JSON.parse(localAcc);
            localUsers.push({ username: parsed.username, profileLink: "#" });
        } catch (e) {}
    }

    const allUsers = [...database.users, ...localUsers];
    // Remove duplicates from demo array
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

    // Default character customization template matching the 6-joint setup
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

    localStorage.setItem("azoraAccount", JSON.stringify(account));
    localStorage.setItem("loggedIn", "true");

    alert("🎉 Welcome to Azora, " + username + "!");
    location.reload(); 
}

// Attach main account modal button action
document.getElementById("mainButton").addEventListener("click", function () {
    if (this.innerHTML === "Create Account") {
        createAccount();
    } else {
        const username = document.getElementById("username").value.trim();
        if (username) {
            localStorage.setItem("loggedIn", "true");
            alert("✨ Welcome back, " + username + "!");
            location.reload();
        }
    }
});

// Switch Mode Toggle link inside the popup
document.getElementById("switchMode").addEventListener("click", function (e) {
    e.preventDefault();
    if (this.innerHTML === "Log In") {
        openLogin();
    } else {
        openCreateAccount();
    }
});

// Close popups when clicking outside the box
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

    const characterGroup = new THREE.Group();

    const headGeo = new THREE.BoxGeometry(0.6, 0.6, 0.6);
    const headMat = new THREE.MeshLambertMaterial({ color: 0xffcc00 });
    headMesh = new THREE.Mesh(headGeo, headMat);
    headMesh.position.y = 1.1;
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

// ============================================================
// THEME SYSTEM — MUST stay OUTSIDE DOMContentLoaded
// ============================================================
function getCurrentHour() {
    return new Date().getHours();
}

function isNightTime() {
    const hour = getCurrentHour();
    return hour < 7 || hour >= 20; // 8 PM – 7 AM
}

function applyTheme(theme) {
    let effective = theme;
    if (theme === "auto") {
        effective = isNightTime() ? "dark" : "light";
    }
    document.documentElement.setAttribute(
        "data-theme",
        effective === "dark" ? "dark" : "light"
    );
    localStorage.setItem("azoraTheme", theme);
    console.log("[Azora] Theme →", theme, "effective:", effective);
}

function changeTheme(value) {
    applyTheme(value);
}

function loadTheme() {
    const saved = localStorage.getItem("azoraTheme") || "auto";
    const sel = document.getElementById("themeSelect");
    if (sel) sel.value = saved;
    applyTheme(saved);
}

window.changeTheme = changeTheme;
window.applyTheme = applyTheme;
window.loadTheme = loadTheme;

setInterval(function () {
    if ((localStorage.getItem("azoraTheme") || "auto") === "auto") {
        applyTheme("auto");
    }
}, 3600000);

// ============================================================
// APP START
// ============================================================
window.addEventListener("DOMContentLoaded", function () {
    init3DAvatar();

    var splash = document.getElementById("introSplash");
    var loggedIn = localStorage.getItem("loggedIn");

    if (loggedIn === "true") {
        if (splash) splash.style.display = "none";
    } else if (splash) {
        splash.style.display = "flex";
        setTimeout(function () {
            splash.classList.add("fade-out");
            setTimeout(function () {
                splash.style.display = "none";
                if (typeof openCreateAccount === "function") {
                    openCreateAccount();
                } else {
                    var ov = document.getElementById("accountOverlay");
                    if (ov) ov.style.display = "flex";
                }
            }, 500);
        }, 6400);
    }

    if (loggedIn === "true") {
        try {
            var account = JSON.parse(localStorage.getItem("azoraAccount"));
            if (account) {
                var gb = document.getElementById("guestButtons");
                var up = document.getElementById("userPanel");
                var pb = document.getElementById("profileButton");
                if (gb) gb.style.display = "none";
                if (up) up.style.display = "flex";
                if (pb) pb.innerHTML = "👤 " + account.username;

                if (account.avatar) {
                    var map = {
                        colorHead: "head", colorTorso: "torso",
                        colorLeftArm: "leftArm", colorRightArm: "rightArm",
                        colorLeftLeg: "leftLeg", colorRightLeg: "rightLeg"
                    };
                    for (var id in map) {
                        var el = document.getElementById(id);
                        if (el && account.avatar[map[id]]) {
                            el.value = account.avatar[map[id]];
                        }
                    }
                    if (typeof updateAvatarColors === "function") updateAvatarColors();
                }
            }
        } catch (e) {}
    }

    var cse = localStorage.getItem("charServiceEnabled");
    if (cse === "true") {
        var t = document.getElementById("charServiceToggle");
        if (t) t.checked = true;
    }

    loadTheme();
});


// ============================================================
// AzaFn-1.0 — AI Game Generator + Social Feed
// ============================================================
let azaFnConversation = [];
let azaFnPendingDescription = "";
let azaFnGames = [];

function openAzaFn() {
    if (localStorage.getItem("loggedIn") !== "true") {
        alert("Please log in to use AzaFn-1.0!");
        openCreateAccount();
        return;
    }
    document.getElementById("azafnOverlay").style.display = "flex";
    loadAzaFnGames();
    if (azaFnConversation.length === 0) {
        addAzaFnAIMessage(
            "Hi! I'm <strong>AzaFn-1.0</strong> 🤖 — Azora's game-building AI.<br><br>" +
            "Tell me what kind of game you want to create. Be as detailed as you like!<br><br>" +
            "⚠️ <strong>Important:</strong> You must clearly say whether you want a <strong>2D</strong> or <strong>3D</strong> game. " +
            "I cannot assume the dimensions — if you don't specify, I'll ask."
        );
    }
    renderAzaFnMessages();
    switchAzaFnTab("chat");
}

function closeAzaFn() {
    document.getElementById("azafnOverlay").style.display = "none";
}

function switchAzaFnTab(tab) {
    var chat = document.getElementById("azafnChatPanel");
    var feed = document.getElementById("azafnFeedPanel");
    var tChat = document.getElementById("azafnTabChat");
    var tFeed = document.getElementById("azafnTabFeed");
    if (tab === "chat") {
        chat.classList.remove("hidden");
        feed.classList.remove("active");
        tChat.classList.add("active");
        tFeed.classList.remove("active");
    } else {
        chat.classList.add("hidden");
        feed.classList.add("active");
        tChat.classList.remove("active");
        tFeed.classList.add("active");
        renderAzaFnFeed();
    }
}

function detectDimensions(text) {
    var t = text.toLowerCase();
    var has3d = /\b3[\s-]?d\b|\bthree[\s-]?dimensional\b|\bin 3d\b/.test(t);
    var has2d = /\b2[\s-]?d\b|\btwo[\s-]?dimensional\b|\bin 2d\b/.test(t);
    if (has3d && !has2d) return "3D";
    if (has2d && !has3d) return "2D";
    if (has3d && has2d) return "ambiguous";
    return null;
}

function addAzaFnAIMessage(html) { azaFnConversation.push({ role: "ai", text: html }); }
function addAzaFnUserMessage(text) { azaFnConversation.push({ role: "user", text: text }); }

function escapeHtml(str) {
    return String(str).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
}

function renderAzaFnMessages() {
    var box = document.getElementById("azafnMessages");
    if (!box) return;
    box.innerHTML = "";
    azaFnConversation.forEach(function (msg, idx) {
        var div = document.createElement("div");
        div.className = "azafn-msg " + (msg.role === "user" ? "user" : "ai");
        if (msg.role === "ai") {
            div.innerHTML =
                '<div class="azafn-msg-label">AzaFn-1.0</div><div>' + msg.text + '</div>' +
                '<button class="azafn-build-btn" onclick="azaFnBuild(' + idx + ')">' +
                '<img src="logo.jpg" alt="Build"> Build</button>';
        } else {
            div.innerHTML = '<div class="azafn-msg-label">You</div><div>' + escapeHtml(msg.text) + '</div>';
        }
        box.appendChild(div);
    });
    box.scrollTop = box.scrollHeight;
}

function sendAzaFnMessage() {
    var input = document.getElementById("azafnInput");
    var text = (input.value || "").trim();
    if (!text) return;
    input.value = "";
    addAzaFnUserMessage(text);
    azaFnPendingDescription = text;
    var dims = detectDimensions(text);
    if (!dims) {
        addAzaFnAIMessage(
            "I heard your idea! 🎮<br><br>Before I can help you build it, I need to know the <strong>dimensions</strong>.<br><br>" +
            "Do you want this game to be <strong>2D</strong> (side-view, top-down, etc.) or <strong>3D</strong> (full 3D world with depth)?<br><br>" +
            "Please reply with <strong>2D</strong> or <strong>3D</strong> — I cannot assume."
        );
    } else if (dims === "ambiguous") {
        addAzaFnAIMessage("You mentioned both 2D and 3D. Please pick <strong>one</strong> clearly.");
    } else {
        addAzaFnAIMessage(
            "Great! Here's what I understood:<br><br>📐 <strong>Dimensions:</strong> " + dims +
            "<br>📝 <strong>Your idea:</strong> " + escapeHtml(text) +
            "<br><br>When you're ready, press the blue <strong>Build</strong> button below to generate your game and publish it to the Feed!"
        );
    }
    renderAzaFnMessages();
}

function azaFnBuild(msgIndex) {
    var description = azaFnPendingDescription;
    for (var i = msgIndex - 1; i >= 0; i--) {
        if (azaFnConversation[i].role === "user") { description = azaFnConversation[i].text; break; }
    }
    if (!description || description.trim().length < 3) {
        addAzaFnAIMessage("Please describe your game idea first, then press Build!");
        renderAzaFnMessages(); return;
    }
    var finalDims = detectDimensions(description);
    if (!finalDims || finalDims === "ambiguous") {
        for (var j = azaFnConversation.length - 1; j >= 0; j--) {
            if (azaFnConversation[j].role === "user") {
                var d = detectDimensions(azaFnConversation[j].text);
                if (d === "2D" || d === "3D") { finalDims = d; break; }
            }
        }
    }
    if (!finalDims || finalDims === "ambiguous") {
        addAzaFnAIMessage("I still don't know if this should be <strong>2D</strong> or <strong>3D</strong>. Please tell me clearly, then press Build again.");
        renderAzaFnMessages(); return;
    }
    var account = JSON.parse(localStorage.getItem("azoraAccount") || "{}");
    var username = account.username || "Player";
    var words = description.trim().split(/\s+/).slice(0, 5).join(" ");
    var title = (words.length > 40 ? words.slice(0, 40) + "…" : words) + " (" + finalDims + ")";
    var game = {
        id: "game_" + Date.now() + "_" + Math.random().toString(36).slice(2, 7),
        title: title, description: description, dimensions: finalDims,
        creator: username, createdAt: Date.now(), likes: 0, likedBy: [], savedBy: [], comments: [], published: true
    };
    azaFnGames.unshift(game);
    saveAzaFnGames();
    addAzaFnAIMessage(
        "✅ <strong>Game built and published!</strong><br><br>🎮 <strong>" + escapeHtml(game.title) +
        "</strong><br>📐 " + finalDims +
        "<br><br>It's now live in the <strong>Feed</strong>! Click the <strong>🎮 Feed</strong> button at the top of the page to see it, like, comment, save, or share. " +
        "As the creator you can also <strong>Edit</strong> it — republishing pushes it back into the algorithm!"
    );
    renderAzaFnMessages();
}

function loadAzaFnGames() {
    try { azaFnGames = JSON.parse(localStorage.getItem("azoraAzaFnGames") || "[]"); }
    catch (e) { azaFnGames = []; }
}
function saveAzaFnGames() { localStorage.setItem("azoraAzaFnGames", JSON.stringify(azaFnGames)); }

function renderAzaFnFeed() {
    var panel = document.getElementById("azafnFeedPanel");
    if (!panel) return;
    loadAzaFnGames();
    if (azaFnGames.length === 0) {
        panel.innerHTML = '<div class="empty-feed">No games yet! Please come back later!</div>';
        return;
    }
    var account = JSON.parse(localStorage.getItem("azoraAccount") || "{}");
    var myName = account.username || "";
    panel.innerHTML = "";
    azaFnGames.forEach(function (game) {
        var isOwner = game.creator === myName;
        var liked = (game.likedBy || []).indexOf(myName) !== -1;
        var saved = (game.savedBy || []).indexOf(myName) !== -1;
        var initial = (game.creator || "?")[0].toUpperCase();
        var timeStr = new Date(game.createdAt).toLocaleString();
        var commentsHtml = "";
        (game.comments || []).forEach(function (c) {
            commentsHtml += '<div class="game-comment"><strong>' + escapeHtml(c.user) + ':</strong> ' + escapeHtml(c.text) + '</div>';
        });
        var card = document.createElement("div");
        card.className = "game-card";
        card.innerHTML =
            '<div class="game-card-header"><div class="game-card-avatar">' + initial + '</div>' +
            '<div class="game-card-meta"><strong>' + escapeHtml(game.creator) + '</strong><span>' + timeStr + '</span></div></div>' +
            '<div class="game-card-title">' + escapeHtml(game.title) + '</div>' +
            '<div class="game-card-dims">' + escapeHtml(game.dimensions) + '</div>' +
            '<div class="game-card-desc">' + escapeHtml(game.description) + '</div>' +
            '<div class="game-card-actions">' +
            '<button class="game-action-btn' + (liked?' liked':'') + '" onclick="azaFnLike(\'' + game.id + '\')">' + (liked?'❤️ ':'🤍 ') + (game.likes||0) + '</button>' +
            '<button class="game-action-btn" onclick="azaFnToggleComments(\'' + game.id + '\')">💬 Comments (' + (game.comments||[]).length + ')</button>' +
            '<button class="game-action-btn' + (saved?' saved':'') + '" onclick="azaFnSave(\'' + game.id + '\')">' + (saved?'🔖 Saved':'📑 Save') + '</button>' +
            '<button class="game-action-btn" onclick="azaFnShare(\'' + game.id + '\')">📤 Share</button>' +
            (isOwner ? '<button class="game-action-btn" onclick="azaFnToggleEdit(\'' + game.id + '\')">✏️ Edit</button>' : '') +
            '</div>' +
            '<div class="game-comments" id="comments_' + game.id + '">' + commentsHtml +
            '<div class="comment-input-row"><input type="text" id="commentInput_' + game.id + '" placeholder="Write a comment...">' +
            '<button onclick="azaFnAddComment(\'' + game.id + '\')">Post</button></div></div>' +
            (isOwner ? '<div class="game-edit-area" id="edit_' + game.id + '"><textarea id="editDesc_' + game.id + '">' + escapeHtml(game.description) +
            '</textarea><button onclick="azaFnRepublish(\'' + game.id + '\')" style="margin-top:8px;background:#1e60ff;color:#fff;">🚀 Publish Changes</button></div>' : '');
        panel.appendChild(card);
    });
}

function azaFnLike(gameId) {
    var myName = (JSON.parse(localStorage.getItem("azoraAccount") || "{}")).username || "";
    if (!myName) return;
    var game = azaFnGames.find(function (g) { return g.id === gameId; });
    if (!game) return;
    game.likedBy = game.likedBy || [];
    var idx = game.likedBy.indexOf(myName);
    if (idx === -1) { game.likedBy.push(myName); game.likes = (game.likes || 0) + 1; }
    else { game.likedBy.splice(idx, 1); game.likes = Math.max(0, (game.likes || 0) - 1); }
    saveAzaFnGames(); renderAzaFnFeed();
}

function azaFnSave(gameId) {
    var myName = (JSON.parse(localStorage.getItem("azoraAccount") || "{}")).username || "";
    if (!myName) return;
    var game = azaFnGames.find(function (g) { return g.id === gameId; });
    if (!game) return;
    game.savedBy = game.savedBy || [];
    var idx = game.savedBy.indexOf(myName);
    if (idx === -1) game.savedBy.push(myName); else game.savedBy.splice(idx, 1);
    saveAzaFnGames(); renderAzaFnFeed();
}

function azaFnShare(gameId) {
    var game = azaFnGames.find(function (g) { return g.id === gameId; });
    if (!game) return;
    var text = 'Check out "' + game.title + '" by ' + game.creator + ' on Azora! 🎮';
    if (navigator.clipboard && navigator.clipboard.writeText)
        navigator.clipboard.writeText(text).then(function () { alert("Copied!\n\n" + text); });
    else alert(text);
}

function azaFnToggleComments(gameId) {
    var el = document.getElementById("comments_" + gameId);
    if (el) el.classList.toggle("open");
}

function azaFnAddComment(gameId) {
    var input = document.getElementById("commentInput_" + gameId);
    var text = (input && input.value || "").trim();
    if (!text) return;
    var myName = (JSON.parse(localStorage.getItem("azoraAccount") || "{}")).username || "Guest";
    var game = azaFnGames.find(function (g) { return g.id === gameId; });
    if (!game) return;
    game.comments = game.comments || [];
    game.comments.push({ user: myName, text: text, at: Date.now() });
    saveAzaFnGames(); renderAzaFnFeed();
    var el = document.getElementById("comments_" + gameId);
    if (el) el.classList.add("open");
}

function azaFnToggleEdit(gameId) {
    var el = document.getElementById("edit_" + gameId);
    if (el) el.classList.toggle("open");
}

function azaFnRepublish(gameId) {
    var textarea = document.getElementById("editDesc_" + gameId);
    var newDesc = (textarea && textarea.value || "").trim();
    if (!newDesc) { alert("Description cannot be empty!"); return; }
    var game = azaFnGames.find(function (g) { return g.id === gameId; });
    if (!game) return;
    var dims = detectDimensions(newDesc);
    if (!dims || dims === "ambiguous") dims = game.dimensions;
    game.description = newDesc;
    game.dimensions = dims;
    var words = newDesc.trim().split(/\s+/).slice(0, 5).join(" ");
    game.title = (words.length > 40 ? words.slice(0, 40) + "…" : words) + " (" + dims + ")";
    game.createdAt = Date.now();
    azaFnGames = azaFnGames.filter(function (g) { return g.id !== gameId; });
    azaFnGames.unshift(game);
    saveAzaFnGames();
    alert("🚀 Changes published! Your game is back at the top of the Feed.");
    renderAzaFnFeed();
}

window.openAzaFn = openAzaFn;
window.closeAzaFn = closeAzaFn;
window.switchAzaFnTab = switchAzaFnTab;
window.sendAzaFnMessage = sendAzaFnMessage;
window.azaFnBuild = azaFnBuild;
window.azaFnLike = azaFnLike;
window.azaFnSave = azaFnSave;
window.azaFnShare = azaFnShare;
window.azaFnToggleComments = azaFnToggleComments;
window.azaFnAddComment = azaFnAddComment;
window.azaFnToggleEdit = azaFnToggleEdit;
window.azaFnRepublish = azaFnRepublish;


// --- Public Game Feed (topbar button for everyone) ---
function openPublicFeed() {
    document.getElementById("publicFeedOverlay").style.display = "flex";
    renderPublicFeed();
}

function closePublicFeed() {
    document.getElementById("publicFeedOverlay").style.display = "none";
}

function renderPublicFeed() {
    var panel = document.getElementById("publicFeedPanel");
    if (!panel) return;
    loadAzaFnGames();

    if (azaFnGames.length === 0) {
        panel.innerHTML = '<div class="empty-feed">No games yet! Please come back later!</div>';
        return;
    }

    // Reuse the same card renderer as AzaFn feed
    // Temporarily point azafnFeedPanel logic at public panel by rendering into publicFeedPanel
    var account = JSON.parse(localStorage.getItem("azoraAccount") || "{}");
    var myName = account.username || "";
    var loggedIn = localStorage.getItem("loggedIn") === "true";
    panel.innerHTML = "";

    azaFnGames.forEach(function (game) {
        var isOwner = loggedIn && game.creator === myName;
        var liked = loggedIn && (game.likedBy || []).indexOf(myName) !== -1;
        var saved = loggedIn && (game.savedBy || []).indexOf(myName) !== -1;
        var initial = (game.creator || "?")[0].toUpperCase();
        var timeStr = new Date(game.createdAt).toLocaleString();
        var commentsHtml = "";
        (game.comments || []).forEach(function (c) {
            commentsHtml += '<div class="game-comment"><strong>' + escapeHtml(c.user) + ':</strong> ' + escapeHtml(c.text) + '</div>';
        });

        var card = document.createElement("div");
        card.className = "game-card";
        card.innerHTML =
            '<div class="game-card-header">' +
                '<div class="game-card-avatar">' + initial + '</div>' +
                '<div class="game-card-meta"><strong>' + escapeHtml(game.creator) + '</strong><span>' + timeStr + '</span></div>' +
            '</div>' +
            '<div class="game-card-title">' + escapeHtml(game.title) + '</div>' +
            '<div class="game-card-dims">' + escapeHtml(game.dimensions) + '</div>' +
            '<div class="game-card-desc">' + escapeHtml(game.description) + '</div>' +
            '<div class="game-card-actions">' +
                '<button class="game-action-btn' + (liked ? ' liked' : '') + '" onclick="azaFnLike(\'' + game.id + '\'); renderPublicFeed();">' +
                    (liked ? '❤️ ' : '🤍 ') + (game.likes || 0) +
                '</button>' +
                '<button class="game-action-btn" onclick="azaFnToggleComments(\'' + game.id + '\')">💬 Comments (' + (game.comments || []).length + ')</button>' +
                (loggedIn
                    ? '<button class="game-action-btn' + (saved ? ' saved' : '') + '" onclick="azaFnSave(\'' + game.id + '\'); renderPublicFeed();">' +
                        (saved ? '🔖 Saved' : '📑 Save') + '</button>'
                    : '') +
                '<button class="game-action-btn" onclick="azaFnShare(\'' + game.id + '\')">📤 Share</button>' +
                (isOwner
                    ? '<button class="game-action-btn" onclick="azaFnToggleEdit(\'' + game.id + '\')">✏️ Edit</button>'
                    : '') +
            '</div>' +
            '<div class="game-comments" id="comments_' + game.id + '">' + commentsHtml +
                (loggedIn
                    ? '<div class="comment-input-row">' +
                        '<input type="text" id="commentInput_' + game.id + '" placeholder="Write a comment...">' +
                        '<button onclick="azaFnAddComment(\'' + game.id + '\'); renderPublicFeed();">Post</button>' +
                      '</div>'
                    : '<p style="color:rgba(255,255,255,0.7);font-size:13px;">Log in to comment.</p>') +
            '</div>' +
            (isOwner
                ? '<div class="game-edit-area" id="edit_' + game.id + '">' +
                    '<textarea id="editDesc_' + game.id + '">' + escapeHtml(game.description) + '</textarea>' +
                    '<button onclick="azaFnRepublish(\'' + game.id + '\'); renderPublicFeed();" style="margin-top:8px;background:#1e60ff;color:#fff;">🚀 Publish Changes</button>' +
                  '</div>'
                : '');
        panel.appendChild(card);
    });
}

window.openPublicFeed = openPublicFeed;
window.closePublicFeed = closePublicFeed;
window.renderPublicFeed = renderPublicFeed;
