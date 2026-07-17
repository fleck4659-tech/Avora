// Global Client Balances
let balances = { coins: 100, diamonds: 0, cubes: 0 };
let authMode = "create"; // create vs login
let currentLoggedInUser = null;

// Taken usernames catalog for nice error notification verification
const registeredUsernames = ["603blox", "leemoon", "azora", "system", "administrator"];

// Clothing Inventory Uploaded by Official AI Account: "Azora"
const aiClothingCatalog = [
    { id: "c1", name: "Official Cyber Cloak", price: 25, type: "Shirt" },
    { id: "c2", name: "AI Enforcement Matrix Boots", price: 40, type: "Pants" },
    { id: "c3", name: "Moderator Oversight Cap", price: 15, type: "Hat" },
    { id: "c4", name: "Azora Admin Neon Hoodie", price: 50, type: "Shirt" },
    { id: "c5", name: "Quantum Security Trousers", price: 35, type: "Pants" }
];

document.addEventListener("DOMContentLoaded", () => {
    initThreeJsAvatar();
    refreshBalanceDisplay();
    generateMarketItems();
});

// --- FIX: Three.js Avatar Initialization Routine ---
let scene, camera, renderer, avatarCube;
function initThreeJsAvatar() {
    const container = document.getElementById("avatar-container");
    if (!container) return;

    // Clear old canvases
    container.innerHTML = "";

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // Build a stylized abstract modular avatar entity representation
    const geometry = new THREE.BoxGeometry(2, 2, 2);
    const material = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true });
    avatarCube = new THREE.Mesh(geometry, material);
    scene.add(avatarCube);

    camera.position.z = 5;

    function animate() {
        requestAnimationFrame(animate);
        if (avatarCube) {
            avatarCube.rotation.x += 0.01;
            avatarCube.rotation.y += 0.015;
        }
        renderer.render(scene, camera);
    }
    animate();

    // Re-adjust sizing values on window layout scale shifts
    window.addEventListener('resize', () => {
        if (!container || !camera || !renderer) return;
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
}

// --- Account Setup Validation Engine ---
function openAuthModal(mode) {
    authMode = mode;
    document.getElementById("accountOverlay").style.display = "flex";
    updateAuthPopupUI();
}

function closeAccountModal() {
    document.getElementById("accountOverlay").style.display = "none";
}

function toggleAuthMode() {
    authMode = (authMode === "create") ? "login" : "create";
    updateAuthPopupUI();
}

function updateAuthPopupUI() {
    const title = document.getElementById("popupTitle");
    const submitBtn = document.getElementById("authSubmitBtn");
    const switchTxt = document.getElementById("authSwitchText");
    const extendedFields = document.getElementById("extendedAuthFields");

    if (authMode === "create") {
        title.innerText = "Join Azora";
        submitBtn.innerText = "Create Account";
        switchTxt.innerText = "Already have an account? Log In";
        extendedFields.style.display = "block";
    } else {
        title.innerText = "Welcome Back";
        submitBtn.innerText = "Log In";
        switchTxt.innerText = "Need an account? Sign Up";
        extendedFields.style.display = "none";
    }
}

function processAuth() {
    const userInp = document.getElementById("username").value.trim();
    if (!userInp) {
        alert("Please specify a valid username.");
        return;
    }

    if (authMode === "create") {
        // Nice, non-harsh username availability verification lookup
        if (registeredUsernames.includes(userInp.toLowerCase())) {
            alert(`✨ Oh! It looks like "${userInp}" is already being used by another creator in the community. Would you like to try adding a few creative numbers or variations to it?`);
            return;
        }
        registeredUsernames.push(userInp.toLowerCase());
        currentLoggedInUser = userInp;
        alert(`🎉 Success! Account safely provisioned for player: ${userInp}`);
    } else {
        currentLoggedInUser = userInp;
        alert(`👋 Welcome back to the grid, ${userInp}!`);
    }

    document.getElementById("guestButtons").style.display = "none";
    document.getElementById("userPanel").style.display = "flex";
    document.getElementById("profileButton").innerText = "👤 " + currentLoggedInUser;
    closeAccountModal();
}

function logoutUser() {
    currentLoggedInUser = null;
    document.getElementById("guestButtons").style.display = "block";
    document.getElementById("userPanel").style.display = "none";
    alert("Logged out securely.");
}

// --- Subscription Engine Logic ---
function toggleSubsModal(show) {
    document.getElementById("subsOverlay").style.display = show ? "flex" : "none";
}

function purchaseSubscription(tier) {
    if (!currentLoggedInUser) {
        alert("🔒 Please create an account or log in prior to configuring membership passes!");
        return;
    }

    if (tier === 'lite') {
        alert("💳 Lite subscription processed successfully!\n\n⏱️ Your 30 AzoraCoins and 30 AzoraDiamonds have entered processing and will arrive in your wallet in exactly 30 days!");
    } else if (tier === 'elite') {
        alert("💳 Elite subscription processed successfully!\n\n⏱️ Your 100 AzoraCoins and 100 AzoraDiamonds have entered processing and will arrive in your wallet in exactly 30 days!");
    } else if (tier === 'mythic') {
        alert("💳 ULTIMATE MYTHIC subscription processed successfully!\n\n⏱️ Delivery Schedule:\n- 1,000 Coins & 1,000 Diamonds will hit your profile in 30 days.\n- 10,000 Ultra-Scarce AzoraCubes will complete cultivation and load in exactly 1 YEAR!");
    }
    toggleSubsModal(false);
}

// --- Conversion Wizard Popup Processing ---
function openConvertModal() {
    if (!currentLoggedInUser) {
        alert("Please log in to make conversions.");
        return;
    }
    document.getElementById("convertOverlay").style.display = "flex";
}

function closeConvertModal() {
    document.getElementById("convertOverlay").style.display = "none";
}

function executeConversion() {
    const amount = parseInt(document.getElementById("convertAmount").value);
    const mode = document.getElementById("convertSourceCurrency").value;
    const finishBtn = document.getElementById("finishTransactionBtn");
    const loader = document.getElementById("convertLoader");

    if (!amount || amount <= 0) {
        alert("Please specify a valid quantity to proceed with transaction conversion.");
        return;
    }

    // Process Ledger Checks
    if (mode === "DiamondsToCoins" && balances.diamonds < amount) {
        alert("Insufficient Azora Diamonds to complete conversion."); return;
    }
    if ((mode === "CubesToCoins" || mode === "CubesToDiamonds") && balances.cubes < amount) {
        alert("Insufficient Azora Cubes to complete conversion."); return;
    }

    // Trigger visual simulation lock delay delay
    finishBtn.disabled = true;
    loader.style.display = "block";

    setTimeout(() => {
        let outputText = "";
        
        if (mode === "DiamondsToCoins") {
            balances.diamonds -= amount;
            const output = amount * 10;
            balances.coins += output;
            outputText = `${output} AzoraCoins`;
        } else if (mode === "CubesToCoins") {
            balances.cubes -= amount;
            const output = amount * 100;
            balances.coins += output;
            outputText = `${output} AzoraCoins`;
        } else if (mode === "CubesToDiamonds") {
            balances.cubes -= amount;
            const output = amount * 10;
            balances.diamonds += output;
            outputText = `${output} AzoraDiamonds`;
        }

        finishBtn.disabled = false;
        loader.style.display = "none";
        closeConvertModal();
        refreshBalanceDisplay();

        alert(`Done! You now have ${outputText}!`);
    }, 4000); // 4-second quick-test version for simulation
}

// --- Marketplace Core ---
function toggleMarketModal(show) {
    document.getElementById("marketOverlay").style.display = show ? "flex" : "none";
}

function generateMarketItems() {
    const grid = document.getElementById("aiMarketGrid");
    if (!grid) return;
    grid.innerHTML = "";

    aiClothingCatalog.forEach(item => {
        const itemBox = document.createElement("div");
        itemBox.className = "market-item";
        itemBox.innerHTML = `
            <strong>${item.name}</strong>
            <div class="market-author">By: AI Account [Azora] 🤖</div>
            <p style="font-size:12px; margin:5px 0;">🏷️ Type: ${item.type}</p>
            <button style="font-size:11px; padding:4px 8px;" onclick="buyMarketItem('${item.name}', ${item.price})">🪙 ${item.price}</button>
        `;
        grid.appendChild(itemBox);
    });
}

function buyMarketItem(name, price) {
    if (!currentLoggedInUser) { alert("Please log in first."); return; }
    if (balances.coins < price) { alert("Insufficient AzoraCoins."); return; }
    balances.coins -= price;
    refreshBalanceDisplay();
    alert(`🛍️ Successfully acquired "${name}" from official AI account "Azora"! Asset added to wardrobe matrix.`);
}

function refreshBalanceDisplay() {
    document.getElementById("displayCoins").innerText = balances.coins;
    document.getElementById("displayDiamonds").innerText = balances.diamonds;
    document.getElementById("displayCubes").innerText = balances.cubes;
}

// --- Hook for external System Appeals Interface Integration ---
window.submitAppealHook = function(username, text) {
    console.log("Transmission redirected to target system channel...");
    setTimeout(() => {
        alert(`📨 [System Account Auto-Response]: Hello ${username},\n\nYour ban/termination appeal context has been fully analyzed by the automated internal System ledger pipeline.\n\nVerdict Status: [ACCEPTED]. Your core permissions have been fully reinstated. Please adhere closely to safety catalog guidelines going forward.`);
    }, 1500);
};