const express = require('express');
const app = express();

// CORS बायपास हेडर
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    if (req.method === 'OPTIONS') return res.sendStatus(200);
    next();
});

app.use(express.json());
const PORT = process.env.PORT || 3000;

// एडवांस डेटाबेस सिमुलेशन
let activeJobCards = {};
let partners = [
    { 
        id: 501, 
        name: "Rahul Prakash", 
        skill: "AC Repair", 
        status: "Active", 
        isOnline: false, 
        onlineHoursToday: 0, 
        rating: 5.0, 
        totalJobsDone: 0 
    }
];

app.get('/', (req, res) => {
    res.send('🚀 Gharbee Hyper-Operations Engine is Running Live!');
});

// 1. पार्टनर ऑनलाइन/ऑफलाइन टॉगल (Online/Offline Toggle with 8-Hour Alert)
app.post('/api/partner/toggle-status', (req, res) => {
    const { partnerId, isOnline } = req.body;
    let partner = partners.find(p => p.id === partnerId);
    if (!partner) return res.status(404).json({ success: false, message: "पार्टनर नहीं मिला।" });

    partner.isOnline = isOnline;
    if(isOnline) {
        partner.onlineHoursToday = 8; // टेस्टिंग के लिए सीधे 8 घंटे सिमुलेट कर रहे हैं
    }
    
    res.json({ 
        success: true, 
        isOnline: partner.isOnline, 
        onlineHoursToday: partner.onlineHoursToday,
        message: isOnline ? "आप ऑनलाइन हैं। नए ऑर्डर अलर्ट मिलना शुरू हो जाएंगे।" : "आप ऑफलाइन हैं। आज आपने 8 घंटे की ड्यूटी पूरी की।" 
    });
});

// 2. जब पार्टनर काम स्वीकार करे - कस्टमर की लाइव लोकेशन देना (Job Accept -> Show Location)
app.post('/api/job/accept', (req, res) => {
    const { partnerId, bookingId } = req.body;
    let partner = partners.find(p => p.id === partnerId);
    
    // सिर्फ ऑनलाइन पार्टनर्स को ही काम मिलेगा
    if (!partner || !partner.isOnline) {
        return res.status(400).json({ success: false, message: "काम स्वीकार करने के लिए ऑनलाइन होना अनिवार्य है।" });
    }

    // 4 अंकों का गुप्त कस्टमर वेरिफिकेशन OTP जनरेट करना
    const startOtp = Math.floor(1000 + Math.random() * 9000).toString();

    activeJobCards[bookingId] = {
        bookingId,
        partnerId,
        jobStatus: "ACCEPTED",
        customerLocation: "Flat 402, Royal Apartments, Gomti Nagar, Lucknow", // लाइव नेविगेशन डेटा
        startOtp: startOtp, 
        basePrice: 399,
        addedPartsCost: 0,
        invoiceGenerated: false
    };

    res.json({ 
        success: true, 
        message: "ऑर्डर स्वीकार कर लिया गया है। कस्टमर की लोकेशन नीचे लाइव दिख रही है।", 
        jobDetails: activeJobCards[bookingId] 
    });
});

// 3. कस्टमर के घर पहुँचने पर OTP से काम शुरू करना (Verify Customer Start OTP)
app.post('/api/job/start-work', (req, res) => {
    const { bookingId, enteredOtp } = req.body;
    let job = activeJobCards[bookingId];
    if (!job) return res.status(404).json({ success: false, message: "जॉब कार्ड नहीं मिला।" });

    if (job.startOtp === enteredOtp || enteredOtp === "1234") { // 1234 बाईपास टेस्टिंग के लिए
        job.jobStatus = "IN_PROGRESS";
        res.json({ success: true, message: "कस्टमर OTP वेरिफाई हो गया। काम शुरू करने की अनुमति है!", status: job.jobStatus });
    } else {
        res.status(400).json({ success: false, message: "गलत कस्टमर OTP! कृपया ग्राहक से पूछकर सही नंबर डालें।" });
    }
});

// 4. काम खत्म होना और डिजिटल इनवॉइस जनरेट करना (Job Close -> Auto Invoice)
app.post('/api/job/complete', (req, res) => {
    const { bookingId, addedPartsCost } = req.body;
    let job = activeJobCards[bookingId];
    if (!job) return res.status(404).json({ success: false, message: "जॉb नहीं मिली।" });

    job.addedPartsCost = addedPartsCost || 0;
    job.jobStatus = "COMPLETED";
    job.invoiceGenerated = true;

    const totalBill = job.basePrice + job.addedPartsCost;

    res.json({ 
        success: true, 
        message: "जॉब सफलतापूर्वक पूरी हो गई। ऑनलाइन इनवॉइस जनरेट कर दी गई है।", 
        invoice: {
            invoiceId: `INV-${Math.floor(100000 + Math.random() * 900000)}`,
            bookingId: job.bookingId,
            basePrice: job.basePrice,
            partsCost: job.addedPartsCost,
            totalTax: (totalBill * 0.05).toFixed(2), // 5% GST
            finalAmount: (totalBill * 1.05).toFixed(2),
            payableToGharbee: (totalBill * 0.20).toFixed(2) // आपका 20% कमीशन
        }
    });
});

// 5. कस्टमर फीडबैक और रेटिंग एल्गोरिदम (Customer Feedback Loop)
app.post('/api/job/feedback', (req, res) => {
    const { bookingId, partnerId, rating } = req.body;
    let partner = partners.find(p => p.id === partnerId);
    if (!partner) return res.status(404).json({ success: false, message: "पार्टनर नहीं मिला।" });

    partner.totalJobsDone += 1;
    // नया औसत रेटिंग स्कोर कैलकुलेट करना
    partner.rating = ((partner.rating * (partner.totalJobsDone - 1)) + rating) / partner.totalJobsDone;

    res.json({ 
        success: true, 
        message: "फीडबैक दर्ज कर लिया गया है। रेटिंग एल्गोरिदम ने पार्टनर का नया स्कोर अपडेट कर दिया है।", 
        newPartnerRating: partner.rating.toFixed(1)
    });
});

app.listen(PORT, () => {
    console.log(`● Gharbee Operations Engine Running on Port ${PORT}`);
});
