const express = require('express');
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// शुरुआत में बिना किसी डेटाबेस एरर के सीधे टेस्टिंग के लिए
app.get('/', (req, res) => {
    res.send('🚀 Gharbee Cloud Server is Running Successfully!');
});

// ओटीपी जनरेट करने की लाइव एपीआई
app.post('/api/send-otp', (req, res) => {
    const { mobileNumber } = req.body;
    // टेस्टिंग मोड में हर नंबर के लिए "1234" ओटीपी फिक्स कर दिया है
    res.status(200).json({ 
        success: true, 
        message: 'OTP Generate Ho Gya!',
        demoOtp: '1234' 
    });
});

// ओटीपी वेरीफाई करने की एपीआई
app.post('/api/verify-otp', (req, res) => {
    const { otp } = req.body;
    if (otp === '1234') {
        res.status(200).json({ success: true, message: 'Login Successful!' });
    } else {
        res.status(400).json({ success: false, message: 'Galat OTP!' });
    }
});

// बुकिंग एपीआई
app.post('/api/book', (req, res) => {
    const { serviceId } = req.body;
    const randId = Math.floor(100000 + Math.random() * 900000);
    res.status(201).json({ 
        success: true, 
        bookingDetails: { bookingId: `GB-${randId}` } 
    });
});

app.listen(PORT, () => {
    console.log(`● HELLO, WORLD! Server live on ${PORT}`);
});
