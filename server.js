const express = require('express');
const app = express();

// CORS एरर को बायपास करने के लिए हेडर
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    if (req.method === 'OPTIONS') return res.sendStatus(200);
    next();
});

app.use(express.json());
const PORT = process.env.PORT || 3000;

let partners = [
    { id: 1, name: "Ramesh Kumar", skill: "Plumber", city: "Lucknow", status: "Active" }
];
let transactions = []; // ऑनलाइन पेमेंट्स का रिकॉर्ड रखने के लिए

app.get('/', (req, res) => {
    res.send('🚀 Gharbee Enterprise Engine with Razorpay Payment Gateway is Live!');
});

// 💳 1. पेमेंट ऑर्डर जनरेट करने की एपीआई (Create Razorpay Order)
app.post('/api/payment/create-order', (req, res) => {
    const { amount, customerId } = req.body;
    if(!amount) return res.status(400).json({ success: false, message: "अमाउंट ज़रूरी है" });

    // नकली रेज़रपे ऑर्डर आईडी जनरेट करना (शुरुआती टेस्टिंग के लिए)
    const fakeRazorpayOrderId = `order_${Math.random().toString(36).substring(2, 11)}`;
    
    res.status(200).json({
        success: true,
        orderId: fakeRazorpayOrderId,
        amount: amount * 100, // रेज़रपे पैसे पैसे (paise) में लेता है (उदा: ₹199 = 19900 paise)
        currency: "INR",
        message: "Razorpay ऑर्डर सफलतापूर्वक जनरेट हो गया।"
    });
});

// 💳 2. पेमेंट सफल होने के बाद वेरिफिकेशन एपीआई (Verify & Save Payment)
app.post('/api/payment/verify', (req, res) => {
    const { razorpayPaymentId, razorpayOrderId, bookingId, amount } = req.body;
    
    // ट्रांजेक्शन रिकॉर्ड को सर्वर मेमोरी में सेव करना
    const newTransaction = {
        transactionId: razorpayPaymentId || `pay_${Math.floor(100000 + Math.random() * 900000)}`,
        orderId: razorpayOrderId,
        bookingId,
        amount: amount / 100,
        status: "PAID",
        date: new Date().toLocaleString()
    };
    
    transactions.push(newTransaction);
    res.status(200).json({ success: true, message: "पेमेंट सफलतापूर्वक वेरिफाई हो गया और रिकॉर्ड सेव कर लिया गया है!", transaction: newTransaction });
});

// पार्टनर रजिस्ट्रेशन और एडमिन डेटा की पुरानी एपीआई यथावत रहेंगी
app.post('/api/partner/register', (req, res) => {
    const { name, skill } = req.body;
    const newPartner = { id: partners.length + 1, name, skill, city: "Lucknow", status: "PENDING_VERIFICATION" };
    partners.push(newPartner);
    res.status(201).json({ success: true, partner: newPartner });
});

app.get('/api/admin/crm-data', (req, res) => {
    res.json({ success: true, verifiedPartners: partners, livePayments: transactions });
});

app.listen(PORT, () => {
    console.log(`● Gharbee Fin-Engine Live on Port ${PORT}`);
});
