const express = require('express');
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// 1. रिपेयर पार्ट्स इन्वेंटरी डेटाबेस (Company Wise & Fixed Price)
const repairPartsInventory = [
    { id: 101, partName: "AC Capacitor 25mF", company: "Havells", price: 450 },
    { id: 102, partName: "AC Gas R32 (per kg)", company: "Godrej", price: 2500 },
    { id: 201, partName: "Water Tap Spindle", company: "Jaquar", price: 350 },
    { id: 202, partName: "Flush Valve", company: "Hindware", price: 850 },
    { id: 301, partName: "Copper Wire 1.5mm (per meter)", company: "Finolex", price: 45 }
];

// 2. सिस्टम यूज़र्स और पार्टनर्स का डेटाबेस स्टोर
let platformUsers = [
    { id: 1, name: "Abhishek", role: "SUPER_ADMIN" },
    { id: 2, name: "SubAdmin Lucknow", role: "SUB_ADMIN" },
    { id: 3, name: "Supervisor Aliganj", role: "SUPERVISOR" }
];

let partners = [
    { id: 501, name: "Ravi Prakash", skill: "AC Repair", status: "PENDING_VERIFICATION", approvedByTL: null, approvedBySubAdmin: null }
];

let activeJobCards = {}; // लाइव जॉब ट्रैकिंग के लिए

// रूट यूआरएल
app.get('/', (req, res) => {
    res.send('🚀 Gharbee Enterprise Engine with 4-Tier Approval & Live Job Cards is Running!');
});

// ==================== 4-LEVEL APPROVAL FLOW ====================

// स्टेप A: Supervisor द्वारा पहला अप्रूवल (1st Verification Approval)
app.post('/api/approve/supervisor', (req, res) => {
    const { supervisorId, partnerId } = req.body;
    let partner = partners.find(p => p.id === partnerId);
    if (!partner) return res.status(404).json({ success: false, message: "पार्टनर नहीं मिला।" });

    partner.status = "TL_APPROVED";
    partner.approvedByTL = supervisorId;
    res.json({ success: true, message: "Supervisor ने डॉक्यूमेंट वेरिफाई कर दिए हैं। अब 2nd approval के लिए Sub-Admin के पास भेजा गया है।", partner });
});

// स्टेप B: Sub-Admin द्वारा दूसरा अप्रूवल (2nd Final Approval & Onboarding)
app.post('/api/approve/subadmin', (req, res) => {
    const { subAdminId, partnerId } = req.body;
    let partner = partners.find(p => p.id === partnerId);
    if (!partner) return res.status(404).json({ success: false, message: "पार्टनर नहीं मिला।" });
    if (partner.status !== "TL_APPROVED") return res.status(400).json({ success: false, message: "पहले Supervisor का अप्रूवल ज़रूरी है।" });

    partner.status = "ONBOARDED";
    partner.approvedBySubAdmin = subAdminId;
    res.json({ success: true, message: "Sub-Admin ने फाइनल अप्रूवल दे दिया है। पार्टनर अब काम करने के लिए एक्टिव है!", partner });
});

// स्टेप C: Sub-Admin द्वारा किसी को हटाना (Remove User/Partner Control)
app.post('/api/subadmin/remove-user', (req, res) => {
    const { subAdminId, targetUserId } = req.body;
    // Sub-admin किसी भी पार्टनर या नॉर्मल यूजर को हटा सकता है, लेकिन सुपर एडमिन को नहीं
    partners = partners.filter(p => p.id !== targetUserId);
    res.json({ success: true, message: "Sub-Admin ने यूज़र/पार्टनर को सिस्टम से सफलतापूर्वक हटा दिया है।" });
});


// ==================== LIVE JOB CARD & REPAIR PARTS SYSTEM ====================

// 1. जब पार्टनर काम शुरू करे - ओपन जॉब कार्ड
app.post('/api/jobcard/open', (req, res) => {
    const { bookingId, partnerId, customerId } = req.body;
    activeJobCards[bookingId] = {
        bookingId,
        partnerId,
        customerId,
        jobStatus: "OPEN",
        addedParts: [],
        baseServicePrice: 399,
        totalBill: 399
    };
    res.json({ success: true, message: "जॉब कार्ड ओपन हो गया है। कस्टमर अब लाइव ट्रैकिंग देख सकता है।", jobCard: activeJobCards[bookingId] });
});

// 2. काम के दौरान पार्टनर द्वारा रिपेयर पार्ट जोड़ना
app.post('/api/jobcard/add-part', (req, res) => {
    const { bookingId, partId } = req.body;
    let job = activeJobCards[bookingId];
    if (!job || job.jobStatus !== "OPEN") return res.status(400).json({ success: false, message: "जॉब कार्ड खुला नहीं है या बंद हो चुका है।" });

    let part = repairPartsInventory.find(p => p.id === partId);
    if (!part) return res.status(404).json({ success: false, message: "यह पार्ट इन्वेंटरी में उपलब्ध नहीं है।" });

    job.addedParts.push(part);
    job.totalBill += part.price;

    res.json({ success: true, message: "रिपेयर पार्ट जॉब कार्ड में जोड़ दिया गया है और बिल लाइव अपडेट हो गया है।", currentJobCard: job });
});

// 3. कस्टमर के लिए लाइव व्यू एपीआई (जब तक जॉब कार्ड ओपन है)
app.get('/api/jobcard/customer-view/:bookingId', (req, res) => {
    const { bookingId } = req.params;
    let job = activeJobCards[bookingId];
    if (!job) return res.status(404).json({ success: false, message: "कोई एक्टिव जॉब कार्ड नहीं मिला।" });
    
    res.json({
        success: true,
        status: job.jobStatus,
        message: "यह लिस्ट आपके फोन पर लाइव दिख रही है जब तक काम चल रहा है।",
        basePrice: job.baseServicePrice,
        changedParts: job.addedParts,
        liveTotalBill: job.totalBill
    });
});

// 4. काम खत्म होने पर जॉब कार्ड बंद करना (Close Job Card)
app.post('/api/jobcard/close', (req, res) => {
    const { bookingId } = req.body;
    if (activeJobCards[bookingId]) {
        activeJobCards[bookingId].jobStatus = "CLOSED";
        res.json({ success: true, message: "जॉब कार्ड बंद कर दिया गया है। फाइनल बिल जेनरेट हो गया है।", finalInvoice: activeJobCards[bookingId] });
    } else {
        res.status(404).json({ success: false, message: "जॉब कार्ड नहीं मिला।" });
    }
});

app.listen(PORT, () => {
    console.log(`● Gharbee Enterprise Core Running on Port ${PORT}`);
});
