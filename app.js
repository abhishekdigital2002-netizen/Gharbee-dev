// Gharbee Complete Production Database (Services, Partners & History)
const appDb = {
    subservices: {
        "AC Repair & Service": [
            { id: "ac-deep", name: "Deep Foam Cleaning AC", price: "₹499" },
            { id: "ac-gas", name: "Gas Leak Fix & Refill", price: "₹2499" }
        ],
        "Plumbing": [
            { id: "plum-leak", name: "Tap Leakage Repair", price: "₹149" },
            { id: "plum-drain", name: "Drainage Unclogging", price: "₹299" }
        ],
        "Electrician": [
            { id: "elec-switch", name: "Switchboard Installation", price: "₹99" }
        ]
    },
    partners: {
        "AC Repair & Service": [
            { id: "p1", name: "राहुल प्रकाश", rating: "4.9 ⭐", status: "Available Now 🟢" },
            { id: "p2", name: "अमित वर्मा", rating: "4.7 ⭐", status: "Active in 15 mins ⏳" }
        ],
        "Plumbing": [
            { id: "p3", name: "विनोद कुमार", rating: "4.8 ⭐", status: "Available Now 🟢" }
        ],
        "Electrician": [
            { id: "p4", name: "संजय सिंह", rating: "4.9 ⭐", status: "Available Now 🟢" }
        ]
    },
    bookingHistory: [
        { id: "GB-9831", service: "AC Repair (Deep Foam)", partner: "राहुल प्रकाश", date: "10 Oct 2026", total: "₹499", status: "Completed", color: "#2E7D32" }
    ]
};

// Global App State Variables
let currentSelectedService = "AC Repair & Service";
let currentSelectedSub = "";
let currentSelectedPartner = ""; 
let currentSelectedDate = "Today";
// 1. GPS Live Location Detection Engine
function initializeLiveLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                document.getElementById('user-current-location').innerText = `Gomti Nagar (Live Lat: ${pos.coords.latitude.toFixed(2)}, Lon: ${pos.coords.longitude.toFixed(2)})`;
            },
            () => { 
                document.getElementById('user-current-location').innerText = "Gomti Nagar, Lucknow (Default GPS)"; 
            }
        );
    } else {
        document.getElementById('user-current-location').innerText = "Gomti Nagar, Lucknow";
    }
}

// 2. Change Main Category Service Grid
function switchMainService(serviceName) {
    document.querySelectorAll('.service-card').forEach(c => c.classList.remove('active'));
    if (event && event.currentTarget) {
        event.currentTarget.classList.add('active');
    }
    currentSelectedService = serviceName;
    currentSelectedPartner = ""; // Reset partner selection
    renderDynamicContent();
}

// 3. Render Subservices & LIVE Partner Selection Lists
function renderDynamicContent() {
    const subContainer = document.getElementById('subservices-target-area');
    if (subContainer) {
        subContainer.innerHTML = "";
        appDb.subservices[currentSelectedService].forEach((sub, idx) => {
            if(idx === 0) currentSelectedSub = sub.name;
            subContainer.innerHTML += `
                <div class="subservice-item ${idx === 0 ? 'selected' : ''}" onclick="selectSubService('${sub.name}', this)">
                    <div>
                        <div style="font-size:14px; font-weight:700; color:#212121;">${sub.name}</div>
                        <div style="font-size:13px; font-weight:600; color:#F5A623; margin-top:2px;">${sub.price}</div>
                    </div>
                    <input type="radio" name="sub-opt" ${idx === 0 ? 'checked' : ''}>
                </div>`;
        });
    }

    const partnerContainer = document.getElementById('live-partners-target-area');
    if (partnerContainer) {
        partnerContainer.innerHTML = "";
        appDb.partners[currentSelectedService].forEach((partner, idx) => {
            if(idx === 0) currentSelectedPartner = partner.name;
            partnerContainer.innerHTML += `
                <div class="partner-row ${idx === 0 ? 'selected-partner' : ''}" id="partner-${partner.id}" onclick="selectLivePartner('${partner.name}', '${partner.id}')" style="cursor:pointer; border: 1px solid #EAEAEA; border-left: 4px solid #4CAF50; padding:12px; margin-bottom:8px; border-radius:12px; display:flex; justify-content:space-between; align-items:center; background: ${idx === 0 ? '#F5FDF6' : '#F9F9F9'}">
                    <div>
                        <div style="font-size:13px; font-weight:700; color:#212121;">👤 ${partner.name}</div>
                        <div style="font-size:11px; color:#757575; margin-top:2px;">Rating: ${partner.rating}</div>
                    </div>
                    <div style="text-align: right;">
                        <div style="font-size:12px; font-weight:600; color:#2E7D32; margin-bottom:4px;">${partner.status}</div>
                        <span class="select-badge" style="font-size:11px; font-weight:700; color: ${idx === 0 ? '#2E7D32' : '#8E8E93'}">${idx === 0 ? '✓ Selected' : 'Tap to Choose'}</span>
                    </div>
                </div>`;
        });
    }
}
function selectSubService(name, element) {
    document.querySelectorAll('.subservice-item').forEach(s => s.classList.remove('selected'));
    element.classList.add('selected');
    const radio = element.querySelector('input[type="radio"]');
    if(radio) radio.checked = true;
    currentSelectedSub = name;
}

function selectLivePartner(partnerName, partnerId) {
    document.querySelectorAll('[id^="partner-"]').forEach(row => {
        row.style.background = "#F9F9F9";
        row.style.borderColor = "#EAEAEA";
        const badge = row.querySelector('.select-badge');
        if(badge) { badge.innerText = "Tap to Choose"; badge.style.color = "#8E8E93"; }
    });

    const targetRow = document.getElementById(`partner-${partnerId}`);
    if(targetRow) {
        targetRow.style.background = "#F5FDF6";
        targetRow.style.borderColor = "#4CAF50";
        const badge = targetRow.querySelector('.select-badge');
        if(badge) { badge.innerText = "✓ Selected"; badge.style.color = "#2E7D32"; }
    }
    currentSelectedPartner = partnerName;
}

function toggleAppView(view) {
    document.querySelectorAll('.app-screen').forEach(s => s.classList.remove('active'));
    document.getElementById('nav-home').style.color = "#8E8E93";
    document.getElementById('nav-bookings').style.color = "#8E8E93";
    document.getElementById('nav-support').style.color = "#8E8E93";

    if (view === 'home') {
        document.getElementById('home-screen').classList.add('active');
        document.getElementById('nav-home').style.color = "#063A25";
    } else if (view === 'bookings') {
        document.getElementById('bookings-screen').classList.add('active');
        document.getElementById('nav-bookings').style.color = "#063A25";
        renderBookingHistory();
    } else if (view === 'support') {
        document.getElementById('support-screen').classList.add('active');
        document.getElementById('nav-support').style.color = "#063A25";
    }
}

function renderBookingHistory() {
    const pipeline = document.getElementById('history-records-pipeline');
    if (pipeline) {
        pipeline.innerHTML = "";
        appDb.bookingHistory.forEach(record => {
            pipeline.innerHTML += `
                <div class="history-card">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                        <span style="font-size:12px; font-weight:700; color:#757575;">ID: ${record.id}</span>
                        <span style="font-size:11px; background:#E8F5E9; color:${record.color}; padding:2px 8px; border-radius:10px; font-weight:700;">${record.status}</span>
                    </div>
                    <div style="font-size:14px; font-weight:700; color:#212121;">${record.service}</div>
                    <div style="font-size:12px; color:#666; margin-top:4px;">Partner: 👤 ${record.partner || 'Assigned'}</div>
                    <div style="display:flex; justify-content:space-between; margin-top:10px; font-size:12px; color:#4A4A4A; border-top:1px dashed #EEE; padding-top:8px;">
                        <span>Date: ${record.date}</span>
                        <span style="font-weight:700; color:#212121;">Paid: ${record.total}</span>
                    </div>
                </div>`;
        });
    }
}

function toggleDate(el, val) {
    document.querySelectorAll('.date-pill').forEach(p => p.classList.remove('active'));
    el.classList.add('active');
    currentSelectedDate = val;
}

function handleLogout() {
    const confirmation = confirm("क्या आप Gharbee App से Logout करना चाहते हैं?");
    if(confirmation) { alert("Logout successful! Session ended safely."); window.location.reload(); }
}

function processBooking() {
    if(!currentSelectedPartner) { alert("कृपया बुकिंग से पहले एक Live Partner चुनें!"); return; }
    const generatedId = "GB-" + Math.floor(1000 + Math.random() * 9000);
    appDb.bookingHistory.unshift({
        id: generatedId,
        service: `${currentSelectedService} (${currentSelectedSub})`,
        partner: currentSelectedPartner,
        date: currentSelectedDate === 'Today' ? '14 Oct 2026' : '15 Oct 2026',
        total: "₹499",
        status: "Confirmed 🟢",
        color: "#2E7D32"
    });
    alert(`बधाई हो! आपकी बुकिंग 👤 ${currentSelectedPartner} के साथ कन्फर्म हो गई है। Order ID: ${generatedId}`);
    toggleAppView('bookings');
}

window.onload = () => { initializeLiveLocation(); renderDynamicContent(); };
