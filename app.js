// Gharbee Scaled Ecosystem State Database Master Ledger
const gharbeeEngine = {
    partners: [
        { id: "P-101", name: "राहुल प्रकाश", service: "AC Repair & Service", rating: "4.9 ⭐", status: "Online", area: "Gomti Nagar" },
        { id: "P-102", name: "अमित वर्मा", service: "AC Repair & Service", rating: "4.7 ⭐", status: "Online", area: "Gomti Nagar" },
        { id: "P-103", name: "विनोद कुमार", service: "Plumbing", rating: "4.8 ⭐", status: "Online", area: "Gomti Nagar" },
        { id: "P-104", name: "संजय सिंह", service: "Electrician", rating: "4.9 ⭐", status: "Online", area: "Gomti Nagar" }
    ],
    subservices: {
        "AC Repair & Service": [
            { name: "Deep Foam Cleaning AC", price: "₹499" },
            { name: "Gas Leak Fix & Refill", price: "₹2499" }
        ],
        "Plumbing": [
            { name: "Tap Leakage Repair", price: "₹149" },
            { name: "Drainage Unclogging", price: "₹299" }
        ],
        "Electrician": [
            { name: "Switchboard Installation", price: "₹99" }
        ]
    },
    partsCatalog: [
        { name: "Premium AC Running Capacitor (45uF)", brand: "Havells", price: 450 },
        { name: "Heavy Duty Compressor Brass Valve", brand: "Godrej", price: 890 },
        { name: "Copper Piping Insulated Line (Per Mtr)", brand: "Finolex", price: 320 }
    ],
    bookingHistory: [
        { id: "GB-9831", service: "AC Repair (Deep Foam)", partner: "राहुल प्रकाश", date: "14 Oct 2026", total: "₹499", status: "Completed", color: "#2E7D32" }
    ]
};

let currentSelectedService = "AC Repair & Service";
let currentSelectedSub = "Deep Foam Cleaning AC";
let currentSelectedPartner = "P-101"; 
let currentSelectedDate = "Today";

function initializeLiveLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (pos) => { document.getElementById('user-current-location').innerText = `Gomti Nagar, Lucknow (GPS Lock Active)`; },
            () => { document.getElementById('user-current-location').innerText = "Gomti Nagar, Lucknow"; }
        );
    }
}

function switchMainService(serviceName) {
    document.querySelectorAll('.service-card').forEach(c => c.classList.remove('active'));
    if(event && event.currentTarget) event.currentTarget.classList.add('active');
    currentSelectedService = serviceName;
    renderDynamicContent();
}

function renderDynamicContent() {
    const subArea = document.getElementById('subservices-target-area');
    if(subArea) {
        subArea.innerHTML = "";
        gharbeeEngine.subservices[currentSelectedService].forEach((sub, idx) => {
            if(idx === 0) currentSelectedSub = sub.name;
            subArea.innerHTML += `
                <div class="subservice-item ${idx===0?'selected':''}" onclick="currentSelectedSub='${sub.name}'; document.querySelectorAll('.subservice-item').forEach(s=>s.classList.remove('selected')); this.classList.add('selected');">
                    <div>
                        <div style="font-size:14px; font-weight:700;">${sub.name}</div>
                        <div style="font-size:13px; font-weight:600; color:#F5A623; margin-top:2px;">${sub.price}</div>
                    </div>
                </div>`;
        });
    }

    const partnerArea = document.getElementById('live-partners-target-area');
    if(partnerArea) {
        partnerArea.innerHTML = "";
        const targets = gharbeeEngine.partners.filter(p => p.service === currentSelectedService);
        targets.forEach((p, idx) => {
            if(idx === 0) currentSelectedPartner = p.id;
            partnerArea.innerHTML += `
                <div class="partner-row ${idx===0?'selected-partner':''}" id="p-row-${p.id}" onclick="currentSelectedPartner='${p.id}'; document.querySelectorAll('.partner-row').forEach(r=>r.classList.remove('selected-partner')); this.classList.add('selected-partner');">
                    <div>
                        <div style="font-size:13px; font-weight:700;">👤 ${p.name}</div>
                        <div style="font-size:11px; color:#2E7D32; font-weight:600; margin-top:2px;">${p.status} • Rating: ${p.rating}</div>
                    </div>
                    <span style="font-size:11px; font-weight:700; color:#2E7D32;">✓ Selected</span>
                </div>`;
        });
    }
}

function toggleDate(el, val) {
    document.querySelectorAll('.date-pill').forEach(p => p.classList.remove('active'));
    el.classList.add('active');
    currentSelectedDate = val;
}

function toggleAppView(view) {
    document.querySelectorAll('.app-screen').forEach(s => s.style.display = "none");
    document.getElementById('nav-home').style.color = "#8E8E93";
    document.getElementById('nav-bookings').style.color = "#8E8E93";
    document.getElementById('nav-support').style.color = "#8E8E93";

    if (view === 'home') {
        document.getElementById('home-screen').style.display = "flex";
        document.getElementById('nav-home').style.color = "#063A25";
    } else if (view === 'bookings') {
        document.getElementById('bookings-screen').style.display = "flex";
        document.getElementById('nav-bookings').style.color = "#063A25";
        renderBookingHistory();
    } else if (view === 'support') {
        document.getElementById('support-screen').style.display = "flex";
        document.getElementById('nav-support').style.color = "#063A25";
    }
}

function renderBookingHistory() {
    const pipeline = document.getElementById('history-records-pipeline');
    if (!pipeline) return;
    pipeline.innerHTML = "";
    gharbeeEngine.bookingHistory.forEach(record => {
        pipeline.innerHTML += `
            <div class="history-card" style="border:1px solid #EAEAEA; padding:14px; border-radius:14px; margin-bottom:12px;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                    <span style="font-size:12px; font-weight:700; color:#757575;">ID: ${record.id}</span>
                    <span style="font-size:11px; background:#E8F5E9; color:${record.color || '#2E7D32'}; padding:2px 8px; border-radius:10px; font-weight:700;">${record.status}</span>
                </div>
                <div style="font-size:14px; font-weight:700; color:#212121;">${record.service}</div>
                <div style="font-size:12px; color:#666; margin-top:4px;">Partner: 👤 ${record.partner}</div>
                <div style="display:flex; justify-content:space-between; margin-top:10px; font-size:12px; padding-top:8px; border-top:1px dashed #EEE;">
                    <span>Date: ${record.date}</span>
                    <span style="font-weight:700;">Paid: ${record.total}</span>
                </div>
            </div>`;
    });
}

function processBooking() {
    const orderId = "GB-" + Math.floor(1000 + Math.random() * 9000);
    const targetObj = gharbeeEngine.partners.find(p => p.id === currentSelectedPartner);
    
    const payload = {
        id: orderId,
        service: `${currentSelectedService} (${currentSelectedSub})`,
        primaryPartnerId: currentSelectedPartner,
        partnerName: targetObj.name,
        partnerPhone: currentSelectedPartner === "P-101" ? "9876543210" : "8765432109", 
        area: "Gomti Nagar",
        date: currentSelectedDate,
        total: 499,
        status: "Routing Alert Sent ⏳"
    };

    localStorage.setItem('gharbee_active_routing', JSON.stringify(payload));
    localStorage.setItem('gharbee_global_signal', 'NEW_BOOKING_' + Date.now());

    // Manual custom dispatch triggers safely linking all browser layout tabs
    window.dispatchEvent(new StorageEvent('storage', { key: 'gharbee_global_signal', newValue: 'NEW_BOOKING_' + Date.now() }));
    
    // Add inside history archive real-time array updates
    gharbeeEngine.bookingHistory.unshift({ id: orderId, service: payload.service, partner: targetObj.name, date: "14 Oct 2026", total: "₹499", status: "Active 🟢", color: "#2E7D32" });

    alert(`बुकिंग सबमिट हो गई! पार्टनर को अलर्ट भेज दिया गया है। Order ID: ${orderId}`);
    openCustomerLiveJobCard(orderId, payload.service, targetObj.name);
}

function openCustomerLiveJobCard(orderId, serviceTrack, partnerName) {
    document.getElementById('home-screen').style.display = "none";
    document.getElementById('jobcard-screen').style.display = "flex";

    document.getElementById('jc-order-id').innerText = `Order ID: ${orderId}`;
    document.getElementById('jc-service-title').innerText = `Service: ${serviceTrack}`;
    document.getElementById('jc-assigned-partner').innerText = `Expert: 👤 ${partnerName}`;

    const partsArea = document.getElementById('jc-parts-inventory-list');
    if(partsArea) {
        partsArea.innerHTML = "";
        gharbeeEngine.partsCatalog.forEach(part => {
            partsArea.innerHTML += `
                <div style="background:white; border:1px solid #EAEAEA; padding:14px; border-radius:12px; display:flex; justify-content:space-between; align-items:center; box-shadow:0 2px 5px rgba(0,0,0,0.02);">
                    <div>
                        <div style="font-size:13px; font-weight:700; color:#212121;">${part.name}</div>
                        <div style="font-size:11px; color:#757575; margin-top:2px;">Brand: ${part.brand}</div>
                    </div>
                    <div style="text-align:right;">
                        <span style="font-size:13px; font-weight:700; color:#063A25; display:block;">₹${part.price}</span>
                        <span style="font-size:11px; color:#F5A623; font-weight:700; cursor:pointer;" onclick="alert('Part added to current material statement ledger successfully!')">+ Add Part</span>
                    </div>
                </div>`;
        });
    }
}

function handleLogout() { alert("Session logging out..."); window.location.reload(); }

window.onload = () => {
    initializeLiveLocation();
    renderDynamicContent();
};
