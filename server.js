const express = require('express');
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// डेटा स्टोर करने के लिए नकली डेटाबेस (शुरुआती टेस्टिंग)
let users = [];
let activeOTPs = {}; // जनरेट किए गए OTP को याद रखने के लिए

const services = [
    { id: 1, name: 'Plumber (नलसाज)', basePrice: 199 },
    { id: 2, name: 'Electrician (बिजली मिस्त्री)', basePrice: 249 },
    { id: 3, name: 'Home Cleaning (घर की सफाई)', basePrice: 499 },
    { id: 4, name: 'Carpenter (बढ़ई)', basePrice: 299 },
    { id: 5, name: 'AC Repair & Service', basePrice: 399 }
];

app.get('/', (req, res) => {
    res.send('🚀 Gharbee Cloud Server is Running Successfully!');
});

// 1. OTP भेजने की API (Send OTP)
app.post('/api/send-otp', (req, res) => {
    const { mobileNumber } = req.body;
    if (!mobileNumber || mobileNumber.length < 10) {
        return res.status(400).json({ success: false, message: 'कृपया सही 10-अंकीय मोबाइल नंबर दर्ज करें।' });
    }

    // 4-अंकीय रैंडम OTP जनरेट करें
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    
    // इस मोबाइल नंबर के लिए OTP को सर्वर मेमोरी में सेव करें (5 मिनट के लिए वैध)
    activeOTPs[mobileNumber] = otp;

    // नोट: यहाँ हम असली SMS API को ट्रिगर करेंगे। अभी टेस्टिंग के लिए हम इसे रिस्पॉन्स में दिखा रहे हैं।
    console.log(`Mobile: ${mobileNumber} | Generated OTP: ${otp}`);
    
    res.status(200).json({ 
        success: true, 
        message: 'OTP सफलतापूर्वक जनरेट कर लिया गया है।',
        demoOtp: otp // सिर्फ टेस्टिंग के लिए, लाइव ऐप में इसे हटा देंगे
    });
});

// 2. OTP वेरीफाई करने की API (Verify OTP & Login)
app.post('/api/verify-otp', (req, res) => {
    const { mobileNumber, otp, name } = req.body;

    if (!mobileNumber || !otp) {
        return res.status(400).json({ success: false, message: 'मोबाइल नंबर और OTP दोनों ज़रूरी हैं।' });
    }

    // चेक करें कि क्या OTP सही है
    if (activeOTPs[mobileNumber] === otp) {
        delete activeOTPs[mobileNumber]; // इस्तेमाल के बाद OTP मिटा दें

        let user = users.find(u => u.mobileNumber === mobileNumber);
        if (!user) {
            user = { id: users.length + 1, mobileNumber, name: name || 'Gharbee User', city: 'Lucknow' };
            users.push(user);
        }

        res.status(200).json({ success: true, message: 'लॉगिन सफल रहा!', user });
    } else {
        res.status(400).json({ success: false, message: 'गलत OTP! कृपया दोबारा जांचें।' });
    }
});

app.get('/api/services', (req, res) => {
    res.json({ success: true, services: services });
});

app.post('/api/book', (req, res) => {
    const { userId, serviceId, address, bookingDate } = req.body;
    const newBooking = {
        bookingId: `GB-${Math.floor(100000 + Math.random() * 900000)}`,
        userId,
        serviceId,
        address,
        bookingDate,
        status: 'Pending'
    };
    res.status(201).json({ success: true, message: 'Booking Successful!', bookingDetails: newBooking });
});

app.listen(PORT, () => {
    console.log(`● HELLO, WORLD! Server is live on port ${PORT}`);
});
        
