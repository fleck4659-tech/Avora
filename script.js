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

// Marketplace Clothes Data
const marketplaceItems = [
    { id: "c1", name: "Azora Classic Tee", type: "shirt", cost: 15, currency: "coins", texture: "normal", emoji: "👕" },
    { id: "c2", name: "Neon Street Pants", type: "pants", cost: 20, currency: "coins", texture: "normal", emoji: "👖" },
    { id: "c3", name: "Cyberpunk Jacket", type: "shirt", cost: 40, currency: "coins", texture: "normal", emoji: "🧥" },
    { id: "d1", name: "Holo-Glitter Diamond Hoodie", type: "shirt", cost: 30, currency: "diamonds", texture: "diamond", emoji: "✨👕" },
    { id: "d2", name: "Frosted Quartz Trouser", type: "pants", cost: 30, currency: "diamonds", texture: "diamond", emoji: "✨👖" }
];

// Create the container automatically for falling phrases
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
    word.style.top = '-50px';
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

function startFallingPhrases() {
    if (spawnInterval) clearInterval(spawnInterval);
    spawnInterval = setInterval(spawnWord, 10000);
}
startFallingPhrases();

// --- Economy Engine: Daily Allowance ---
function checkDailyBonus(account) {
    const today = new Date().toDateString();
    if (account.lastLoginBonusDate !== today) {
        account.coins = (account.coins || 0) + 10;
        account.lastLoginBonusDate = today;
        localStorage.setItem("azoraAccount", JSON.stringify(account));
        alert("🪙 Daily Reward! You received your standard daily allowance of 10 AzoraCoins!");
    }
}

// --- Dynamic Interface Refresh ---
function updateWalletUI() {
    const loggedIn = localStorage.getItem("loggedIn");
    const walletBar = document.getElementById("walletDisplay");
    if (loggedIn === "true") {
        const account = JSON.parse(localStorage.getItem("azoraAccount"));
        if (account) {
            if (walletBar) walletBar.style.display = "flex";
            document.getElementById("coinVal").innerText = account.coins || 0;
            document.getElementById("diamondVal").innerText = account.diamonds || 0;
            
            // Toggle Settings Profile Customizers
            const isMember = account.isMember === true;
            const settingsArea = document.getElementById("memberSettingsArea");
            const settingsHint = document.getElementById("memberSettingsHint");
            const checkboxLabel = document.getElementById("memberCheckboxLabel");
            const holoToggle = document.getElementById("holographicThemeToggle");
            
            if (settingsArea && isMember) {
                settingsArea.classList.add("unlocked");
                if (settingsHint) settingsHint.innerText = "🌟 Active Member Profile Verified!";
                if (checkboxLabel) checkboxLabel.style.pointerEvents = "auto";
                if (holoToggle) holoToggle.disabled = false;
            }
        }
    } else {
        if (walletBar) walletBar.style.display = "none";
    }
}

// --- Currency Exchange Converter ---
function convertDiamonds() {
    const account = JSON.parse(localStorage.getItem("azoraAccount"));
    if (!account) return alert("Please register or sign in to convert currencies.");
    
    if ((account.diamonds || 0) < 10) {
        return alert("❌ You need at least 10 AzoraDiamonds to exchange! (10 Diamonds converts to 100 Coins)");
    }
    
    account.diamonds -= 10;
    account.coins = (account.coins || 0) + 100;
    localStorage.setItem("azoraAccount", JSON.stringify(account));
    updateWalletUI();
    alert("💎 Exchange Authorized! 10 Diamonds turned into 100 AzoraCoins.");
}

// --- Member Subscriptions ---
function buySubscription(price, coinsReward, diamondsReward) {
    const loggedIn = localStorage.getItem("loggedIn");
    if (loggedIn !== "true") {
        alert("Sign up or login to checkout Premium Subscription tier plans!");
        openCreateAccount();
        return;
    }
    
    const account = JSON.parse(localStorage.getItem("azoraAccount"));
    account.isMember = true;
    account.coins = (account.coins || 0) + coinsReward;
    account.diamonds = (account.diamonds || 0) + diamondsReward;
    
    localStorage.setItem("azoraAccount", JSON.stringify(account));
    updateWalletUI();
    alert(`🎉 Success! Your account was upgraded to Member status via the $${price} Tier. Received ${coinsReward} Coins and ${diamondsReward} Diamonds!`);
}

// --- Marketplace Core ---
function renderMarketplace() {
    const marketGrid = document.getElementById("marketGrid");
    if (!marketGrid) return;
    marketGrid.innerHTML = "";
    
    marketplaceItems.forEach(item => {
        const card = document.createElement("div");
        card.className = `clothing-card ${item.texture === 'diamond' ? 'diamond-item' : ''}`;
        
        const currencySymbol = item.currency === "coins" ? "🪙" : "💎";
        const costClass = item.currency === "coins" ? "coin-txt" : "diamond-txt";
        
        card.innerHTML = `
            <div class="clothing-img">${item.emoji}</div>
            <h4 style="margin: 5px 0; font-size:14px;">${item.name}</h4>
            <p style="font-size:11px; color:#aaa; margin:2px 0;">Style: ${item.texture.toUpperCase()}</p>
            <p class="${costClass}" style="font-weight:bold; margin: 5px 0;">${currencySymbol} ${item.cost}</p>
            <button onclick="buyClothing('${item.id}')" style="font-size:11px; padding: 4px 10px; width:100%; border-radius: 8px; cursor: pointer; border: none; background: #fff; color: #1e60ff; font-weight: bold;">Buy Item</button>
        `;
        marketGrid.appendChild(card);
    });
}

function buyClothing(itemId) {
    const loggedIn = localStorage.getItem("loggedIn");
    if (loggedIn !== "true") {
        alert("You must login to proceed with marketplace purchases.");
        openCreateAccount();
        return;
    }
    
    const account = JSON.parse(localStorage.getItem("azoraAccount"));
    const item = marketplaceItems.find(i => i.id === itemId);
    if (!item || !account) return;
    
    // Member verification for specialized clothing textures
    if (item.texture === "diamond" && !account.isMember) {
        return alert("🔒 This contains custom holographic textures! You must purchase an active Premium Membership subscription to buy Diamond-Colored clothes!");
    }
    
    // Funds validation checks
    if (item.currency === "coins") {
        if ((account.coins || 0) < item.cost) return alert("❌ Insufficient AzoraCoins!");
        account.coins -= item.cost;
    } else {
        if ((account.diamonds || 0) < item.cost) return alert("❌ Insufficient AzoraDiamonds!");
        account.diamonds -= item.cost;
    }
    
    if (!account.inventory) account.inventory = [];
    account.inventory.push(itemId);
    
    localStorage.setItem("azoraAccount", JSON.stringify(account));
    updateWalletUI();
    alert(`🛍️ Successfully purchased ${item.name}! Added to avatar customizer inventory.`);
}

// Settings management controls
function openSettings() {
    document.getElementById("settingsOverlay").style.display = "flex";
    updateWalletUI();
}
function closeSettings() {
    document.getElementById("settingsOverlay").style.display = "none";
}
function toggleFallingText() {
    fallingTextActive = document.getElementById("fallingTextToggle").checked;
    if (!fallingTextActive) {
        container.innerHTML = "";
    }
}
function toggleHoloStyle() {
    const toggle = document.getElementById("holographicThemeToggle");
    if (toggle && toggle.checked) {
        document.body.style.background = "radial-gradient(circle, #2c3e50, #000000, #1a252f)";
        alert("✨ Space Diamond Skybox initialized! Holographic home theme loaded.");
    } else {
        document.body.style.background = ""; // Reset
    }
}

function logoutUser() {
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("azoraAccount");
    alert("Signed out.");
    location.reload();
}

// --- Core Navigation and Search Engine ---
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

// Dropdown systems
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

// --- Account Modals Configuration ---
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
        coins: 10, // Daily allowance initiation
        diamonds: 0,
        isMember: false,
        inventory: [],
        lastLoginBonusDate: new Date().toDateString(),
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
    alert("Welcome to Azora, " + username + "!");
    location.reload();
}

document.getElementById("mainButton").addEventListener("click", function () {
    if (this.innerHTML === "Create Account") {
        createAccount();
    } else {
        const username = document.getElementById("username").value.trim();
        if (username) {
            localStorage.setItem("loggedIn", "true");
            let account = JSON.parse(localStorage.getItem("azoraAccount"));
            if (!account) {
                account = { username: username, coins: 10, diamonds: 0, isMember: false };
                localStorage.setItem("azoraAccount", JSON.stringify(account));
            }
            alert("Welcome back, " + username + "!");
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

function handleCreateClick() {
    const loggedIn = localStorage.getItem("loggedIn");
    if (loggedIn === "true") {
        window.open("creator.html", "_blank");
    } else {
        alert("Please sign up first to access the Creator Studio!");
        openCreateAccount();
    }
}

function toggleCharacterService() {
    const isChecked = document.getElementById("charServiceToggle").checked;
    localStorage.setItem("charServiceEnabled", isChecked);
    alert(`BasicCharacterService is now ${isChecked ? "ENABLED" : "DISABLED"}!`);
}

// --- 3D Avatar Rendering (Homepage only) ---
let avatarScene, avatarCamera, avatarRenderer;
let avatarParts = {};

function initAvatarCanvas() {
    const container = document.getElementById("canvas-container");
    if (!container) return;

    avatarScene = new THREE.Scene();
    avatarScene.background = new THREE.Color(0x222222);

    avatarCamera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
    avatarCamera.position.set(0, 1.5, 5);

    avatarRenderer = new THREE.WebGLRenderer({ antialias: true });
    avatarRenderer.setSize(200, 200);
    container.appendChild(avatarRenderer.domElement);

    // Basic Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    avatarScene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 0.8);
    pointLight.position.set(5, 5, 5);
    avatarScene.add(pointLight);

    // Build blocky avatar
    const headGeom = new THREE.BoxGeometry(0.8, 0.8, 0.8);
    const torsoGeom = new THREE.BoxGeometry(1, 1.4, 0.6);
    const limbGeom = new THREE.BoxGeometry(0.4, 1.2, 0.4);

    avatarParts.head = new THREE.Mesh(headGeom, new THREE.MeshStandardMaterial({ color: 0xffcc00 }));
    avatarParts.head.position.y = 1.3;

    avatarParts.torso = new THREE.Mesh(torsoGeom, new THREE.MeshStandardMaterial({ color: 0x1e60ff }));
    avatarParts.torso.position.y = 0.2;

    avatarParts.leftArm = new THREE.Mesh(limbGeom, new THREE.MeshStandardMaterial({ color: 0xffcc00 }));
    avatarParts.leftArm.position.set(-0.75, 0.3, 0);

    avatarParts.rightArm = new THREE.Mesh(limbGeom, new THREE.MeshStandardMaterial({ color: 0xffcc00 }));
    avatarParts.rightArm.position.set(0.75, 0.3, 0);

    avatarParts.leftLeg = new THREE.Mesh(limbGeom, new THREE.MeshStandardMaterial({ color: 0x00ebd4 }));
    avatarParts.leftLeg.position.set(-0.3, -1, 0);

    avatarParts.rightLeg = new THREE.Mesh(limbGeom, new THREE.MeshStandardMaterial({ color: 0x00ebd4 }));
    avatarParts.rightLeg.position.set(0.3, -1, 0);

    Object.values(avatarParts).forEach(part => avatarScene.add(part));

    function animateAvatar() {
        requestAnimationFrame(animateAvatar);
        Object.values(avatarParts).forEach(part => {
            part.rotation.y += 0.01;
        });
        avatarRenderer.render(avatarScene, avatarCamera);
    }
    animateAvatar();
}

function updateAvatarColors() {
    const head = document.getElementById("colorHead").value;
    const torso = document.getElementById("colorTorso").value;
    const leftArm = document.getElementById("colorLeftArm").value;
    const rightArm = document.getElementById("colorRightArm").value;
    const leftLeg = document.getElementById("colorLeftLeg").value;
    const rightLeg = document.getElementById("colorRightLeg").value;

    if (avatarParts.head) avatarParts.head.material.color.set(head);
    if (avatarParts.torso) avatarParts.torso.material.color.set(torso);
    if (avatarParts.leftArm) avatarParts.leftArm.material.color.set(leftArm);
    if (avatarParts.rightArm) avatarParts.rightArm.material.color.set(rightArm);
    if (avatarParts.leftLeg) avatarParts.leftLeg.material.color.set(leftLeg);
    if (avatarParts.rightLeg) avatarParts.rightLeg.material.color.set(rightLeg);

    const account = JSON.parse(localStorage.getItem("azoraAccount"));
    if (account) {
        account.avatar = { head, torso, leftArm, rightArm, leftLeg, rightLeg };
        localStorage.setItem("azoraAccount", JSON.stringify(account));
    }
}

// --- Page Setup ---
window.addEventListener("DOMContentLoaded", () => {
    const loggedIn = localStorage.getItem("loggedIn");
    if (loggedIn === "true") {
        const account = JSON.parse(localStorage.getItem("azoraAccount"));
        if (account) {
            document.getElementById("userPanel").style.display = "block";
            document.getElementById("profileButton").innerHTML = "👤 " + account.username;
            
            checkDailyBonus(account);
            updateWalletUI();
            initAvatarCanvas();

            if (account.avatar) {
                document.getElementById("colorHead").value = account.avatar.head || "#ffcc00";
                document.getElementById("colorTorso").value = account.avatar.torso || "#1e60ff";
                document.getElementById("colorLeftArm").value = account.avatar.leftArm || "#ffcc00";
                document.getElementById("colorRightArm").value = account.avatar.rightArm || "#ffcc00";
                document.getElementById("colorLeftLeg").value = account.avatar.leftLeg || "#00ebd4";
                document.getElementById("colorRightLeg").value = account.avatar.rightLeg || "#00ebd4";
                setTimeout(updateAvatarColors, 100);
            }
        }
    }
    renderMarketplace();
    
    const charServiceEnabled = localStorage.getItem("charServiceEnabled");
    if (charServiceEnabled === "true" && document.getElementById("charServiceToggle")) {
        document.getElementById("charServiceToggle").checked = true;
    }
});
// --- Pop-up Panel Controls ---

function toggleMarketplaceSection() {
    const overlay = document.getElementById("marketPopupOverlay");
    const marketPanel = document.getElementById("marketplacePanel");
    const subsPanel = document.getElementById("subscriptionsPanel");

    // Show the overlay and the marketplace panel, hide the subscription panel
    overlay.style.display = "flex";
    marketPanel.style.display = "block";
    subsPanel.style.display = "none";
}

function toggleSubscriptionsSection() {
    const overlay = document.getElementById("marketPopupOverlay");
    const marketPanel = document.getElementById("marketplacePanel");
    const subsPanel = document.getElementById("subscriptionsPanel");

    // Show the overlay and the subscription panel, hide the marketplace panel
    overlay.style.display = "flex";
    marketPanel.style.display = "none";
    subsPanel.style.display = "block";
}

function closeAllMarketPanels() {
    document.getElementById("marketPopupOverlay").style.display = "none";
}

// Close the panel if the user clicks the dark background space
function closeMarketPopup(event) {
    const overlay = document.getElementById("marketPopupOverlay");
    if (event.target === overlay) {
        closeAllMarketPanels();
    }
}