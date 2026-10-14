// Gharbee Scaled Ecosystem State Database
const gharbeeEngine = {
    services: ["AC Repair & Service", "Plumbing", "Electrician"],
    partners: [
        { id: "P-101", name: "राहुल प्रकाश", service: "AC Repair & Service", rating: "4.9 ⭐", status: "Online", area: "Gomti Nagar", wallet: 1450, totalJobs: 12 },
        { id: "P-102", name: "अमित वर्मा", service: "AC Repair & Service", rating: "4.7 ⭐", status: "Online", area: "Gomti Nagar", wallet: 890, totalJobs: 5 },
        { id: "P-103", name: "विनोद कुमार", service: "Plumbing", rating: "4.8 ⭐", status: "Online", area: "Hazratganj", wallet: 2100, totalJobs: 18 }
    ],
    bookingsHistory: JSON.parse(localStorage.getItem('gharbee_history')) || []
};

// Global Memory Handlers
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
    
    // Auto-select first active partner of this specific track
    const firstP = gharbeeEngine.partners.find(p => p.service === serviceName && p.area === "Gomti Nagar");
    currentSelectedPartner = firstP ? firstP.id : "";
    renderDynamicContent();
}

function renderDynamicContent() {
    // A. Sub-services inject karne ka logic
    const subContainer = document.getElementById('subservices-target-area');
    if (subContainer) {
        subContainer.innerHTML = "";
        
        // Dynamic subservices default array framework mapping
        const subList = [
            { id: "s1", name: "Deep Foam Cleaning AC", price: "₹499" },
            { id: "s2", name: "Gas Leak Fix & Refill", price: "₹2499" }
        ];
        
        subList.forEach((sub, idx) => {
            if(idx === 0) currentSelectedSub = sub.name;
            subContainer.innerHTML += `
                <div class="subservice-item ${idx === 0 ? 'selected' : ''}" id="sub-${sub.id}" onclick="currentSelectedSub='${sub.name}'; document.querySelectorAll('.subservice-item').forEach(s=>s.style.borderColor='#EAEAEA'); this.style.borderColor='#F5A623';" style="border: 1px solid ${idx===0?'#F5A623':'#EAEAEA'}; padding:12px; margin-bottom:10px; border-radius:12px; display:flex; justify-content:space-between; align-items:center; cursor:pointer; background: ${idx===0?'#FFFDF9':'#fff'}">
                    <div>
                        <div style="font-size:14px; font-weight:700; color:#212121;">${sub.name}</div>
                        <div style="font-size:13px; font-weight:600; color:#F5A623; margin-top:2px;">${sub.price}</div>
                    </div>
                </div>`;
        });
    }

    // B. Live Mechanics/Partners inject karne ka updated safe logic
    const pContainer = document.getElementById('live-partners-target-area');
    if (!pContainer) return;
    pContainer.innerHTML = "";
    
    // Exact mapping filtering logic connected to gharbeeEngine array data structural paths
    const targets = gharbeeEngine.partners.filter(p => p.service === currentSelectedService && p.area === "Gomti Nagar");
    
    if (targets.length === 0) {
        pContainer.innerHTML = `<div style="font-size:13px; color:#999; padding:10px; text-align:center;">No live partners online currently.</div>`;
        return;
    }

    targets.forEach((p, idx) => {
        if(idx === 0) currentSelectedPartner = p.id;
        
        pContainer.innerHTML += `
            <div class="partner-row" id="p-row-${p.id}" onclick="setTargetPartner('${p.id}')" style="cursor:pointer; padding:12px; margin-bottom:8px; border-radius:12px; border:1px solid ${idx===0?'#4CAF50':'#EAEAEA'}; background:${idx===0?'#F5FDF6':'#FFF'}; display:flex; justify-content:space-between; align-items:center;">
                <div>
                    <div style="font-size:13px; font-weight:700; color:#212121;">👤 ${p.name} (${p.rating})</div>
                    <div style="font-size:11px; color:#2E7D32; font-weight:600; margin-top:2px;">${p.status} • Area: ${p.area}</div>
                </div>
                <span class="select-badge" style="font-size:11px; font-weight:700; color: ${idx === 0 ? '#2E7D32' : '#8E8E93'}">${idx === 0 ? '✓ Selected' : 'Tap to Choose'}</span>
            </div>`;
    });
}

function setTargetPartner(id) {
    currentSelectedPartner = id;
    document.querySelectorAll('.partner-row').forEach(r => r.style.borderColor = "#EAEAEA");
    const target = document.getElementById(`p-row-${id}`);
    if(target) target.style.borderColor = "#4CAF50";
}

// 🚀 Core Cascading Booking Engine Execution Link
// Global Match Validation Architecture with Manual Window Storage Signal Dispatch
function processBooking() {
    if(!currentSelectedPartner) { 
        alert("कृपया बुकिंग से पहले एक Live Partner चुनें!"); 
        return; 
    }
    
    const orderId = "GB-" + Math.floor(1000 + Math.random() * 9000);
    const targetPartnerObj = gharbeeEngine.partners.find(p => p.id === currentSelectedPartner);
    
    const bookingPayload = {
        id: orderId,
        service: `${currentSelectedService} (${currentSelectedSub})`,
        primaryPartnerId: currentSelectedPartner,
        partnerName: targetPartnerObj.name,
        partnerPhone: currentSelectedPartner === "P-101" ? "9876543210" : "8765432109", 
        area: "Gomti Nagar",
        date: currentSelectedDate,
        total: 499,
        timestamp: Date.now(),
        status: "Routing Alert Sent ⏳"
    };

    // 1. Storage update network parameters
    localStorage.setItem('gharbee_active_routing', JSON.stringify(bookingPayload));
    localStorage.setItem('gharbee_global_signal', 'NEW_BOOKING_' + Date.now());

    // 2. FIXED FORCE SYNC: Force dispatch storage signaling events to bind all current window threads
    const syncEvent = new StorageEvent('storage', {
        key: 'gharbee_global_signal',
        newValue: 'NEW_BOOKING_' + Date.now(),
        storageArea: localStorage
    });
    window.dispatchEvent(syncEvent);

    alert(`बुकिंग सबमिट हो गई! पार्टनर को अलर्ट भेज दिया गया है। Order ID: ${orderId}`);
}

    // Set transactional pipeline triggers
    localStorage.setItem('gharbee_active_routing', JSON.stringify(bookingPayload));
    localStorage.setItem('gharbee_global_signal', 'NEW_BOOKING_' + Date.now());

    alert(`बुकिंग सबमिट हो गई! पार्टनर ${targetPartnerObj.name} को अलर्ट भेजा गया है। अगर 30 सेकंड में जवाब नहीं आया, तो एरिया के बाकी पार्टनर्स को ऑटो-अलर्ट जाएगा।`);
}

function toggleAppView(view) {
    document.querySelectorAll('.app-screen').forEach(s => s.classList.remove('active'));
    if(view === 'home') document.getElementById('home-screen').classList.add('active');
    if(view === 'bookings') document.getElementById('bookings-screen').classList.add('active');
}

window.onload = () => { initializeLiveLocation(); renderDynamicContent(); };
