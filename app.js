// Gharbee Mock Database (Services, Partners & History)
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
            { name: "राहुल प्रकाश", rating: "4.9 ⭐", status: "Available Now 🟢" },
            { name: "अमित वर्मा", rating: "4.7 ⭐", status: "Active in 15 mins ⏳" }
        ],
        "Plumbing": [
            { name: "विनोद कुमार", rating: "4.8 ⭐", status: "Available Now 🟢" }
        ],
        "Electrician": [
            { name: "संजय सिंह", rating: "4.9 ⭐", status: "Available Now 🟢" }
        ]
    },
    bookingHistory: [
        { id: "GB-9831", service: "AC Repair (Deep Foam)", date: "10 Oct 2026", total: "₹499", status: "Completed", color: "#2E7D32" }
    ]
};

let currentSelectedService = "AC Repair & Service";
let currentSelectedSub = "";
let currentSelectedDate = "Today";

// 1. Live Location GPS Detection
function initializeLiveLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                document.getElementById('user-current-location').innerText = `Gomti Nagar (Live Lat: ${pos.coords.latitude.toFixed(2)}, Lon: ${pos.coords.longitude.toFixed(2)})`;
            },
            () => { document.getElementById('user-current-location').innerText = "Gomti Nagar, Lucknow (Default GPS)"; }
        );
    }
}

// 2. Change Main Category Service 
function switchMainService(serviceName) {
    document.querySelectorAll('.service-card').forEach(c => c.classList.remove('active'));
    event.currentTarget.classList.add('active');
    currentSelectedService = serviceName;
    renderDynamicContent();
}

// 3. Render Subservices & Available Partners List
function renderDynamicContent() {
    const subContainer = document.getElementById('subservices-target-area');
    subContainer.innerHTML = "";
    appDb.subservices[currentSelectedService].forEach((sub, idx) => {
        if(idx === 0) currentSelectedSub = sub.name;
        subContainer.innerHTML += `
            <div class="subservice-item ${idx === 0 ? 'selected' : ''}" onclick="currentSelectedSub='${sub.name}'; document.querySelectorAll('.subservice-item').forEach(s=>s.classList.remove('selected')); this.classList.add('selected');">
                <div>
                    <div style="font-size:14px; font-weight:700; color:#212121;">${sub.name}</div>
                    <div style="font-size:13px; font-weight:600; color:#F5A623; margin-top:2px;">${sub.price}</div>
                </div>
                <input type="radio" name="sub-opt" ${idx === 0 ? 'checked' : ''}>
            </div>`;
    });

    const partnerContainer = document.getElementById('live-partners-target-area');
    partnerContainer.innerHTML = "";
    appDb.partners[currentSelectedService].forEach(partner => {
        partnerContainer.innerHTML += `
            <div class="partner-row">
                <div>
                    <div style="font-size:13px; font-weight:700; color:#212121;">👤 ${partner.name}</div>
                    <div style="font-size:11px; color:#757575; margin-top:2px;">Rating: ${partner.rating}</div>
                </div>
                <div style="font-size:12px; font-weight:600; color:#2E7D32;">${partner.status}</div>
            </div>`;
    });
}

// 4. Render Booking History Dashboard List
function renderBookingHistory() {
    const pipeline = document.getElementById('history-records-pipeline');
    pipeline.innerHTML = "";
    appDb.bookingHistory.forEach(record => {
        pipeline.innerHTML += `
            <div class="history-card">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                    <span style="font-size:12px; font-weight:700; color:#757575;">ID: ${record.id}</span>
                    <span style="font-size:11px; background:#E8F5E9; color:${record.color}; padding:2px 8px; border-radius:10px; font-weight:700;">${record.status}</span>
                </div>
                <div style="font-size:14px; font-weight:700; color:#212121;">${record.service}</div>
                <div style="display:flex; justify-content:space-between; margin-top:10px; font-size:12px; color:#4A4A4A;">
                    <span>Date: ${record.date}</span>
                    <span style="font-weight:700; color:#212121;">Paid: ${record.total}</span>
                </div>
            </div>`;
    });
}

function toggleDate(el, val) {
    document.querySelectorAll('.date-pill').forEach(p => p.classList.remove('active'));
    el.classList.add('active');
    currentSelectedDate = val;
}

// 5. Navigation Tab Switcher
function toggleAppView(view) {
    document.querySelectorAll('.app-screen').forEach(s => s.classList.remove('active'));
    document.getElementById('nav-home').style.color = "#8E8E93";
    document.getElementById('nav-bookings').style.color = "#8E8E93";

    if(view === 'home') {
        document.getElementById('home-screen').classList.add('active');
        document.getElementById('nav-home').style.color = "#063A25";
    } else {
        document.getElementById('bookings-screen').classList.add('active');
        document.getElementById('nav-bookings').style.color = "#063A25";
        renderBookingHistory();
    }
}

function handleLogout() {
    alert("Gharbee Account Session Terminated.");
}

// 6. Action Form Booking Submit
function processBooking() {
    const generatedId = "GB-" + Math.floor(1000 + Math.random() * 9000);
    appDb.bookingHistory.unshift({
        id: generatedId,
        service: `${currentSelectedService} (${currentSelectedSub})`,
        date: currentSelectedDate === 'Today' ? '14 Oct 2026' : '15 Oct 2026',
        total: "₹499",
        status: "Confirmed 🟢",
        color: "#2E7D32"
    });
    alert(`Success! Booking confirmation generated. Order ID: ${generatedId}`);
    toggleAppView('bookings');
}

// Initialization Trigger Engine
window.onload = () => {
    initializeLiveLocation();
    renderDynamicContent();
};
