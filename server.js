const express = require('express');
const app = express();

// CORS एरर को हमेशा के लिए खत्म करने के लिए हेडर सेट करना
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

app.use(express.json());

const PORT = process.env.PORT || 3000;

let bookings = [];
let partners = [
    { id: 1, name: "Ramesh Kumar", skill: "Plumber", city: "Lucknow", status: "Active" },
    { id: 2, name: "Suresh Yadav", skill: "Electrician", city: "Lucknow", status: "Active" }
];

app.get('/', (req, res) => {
    res.send('🚀 Gharbee Cloud Server with CORS Support is Live!');
});

// पार्टनर रजिस्ट्रेशन एपीआई
app.post('/api/partner/register', (req, res) => {
    const { name, skill, city } = req.body;
    const newPartner = { id: partners.length + 1, name, skill, city, status: "PENDING_VERIFICATION" };
    partners.push(newPartner);
    res.status(201).json({ success: true, message: 'पार्टनर रजिस्ट्रेशन सफल!', partner: newPartner });
});

// सब-एडमिन अप्रूवल एपीआई
app.post('/api/approve/subadmin', (req, res) => {
    const { partnerId } = req.body;
    let partner = partners.find(p => p.id === partnerId);
    if (partner) {
        partner.status = "ONBOARDED";
        return res.json({ success: true, partner });
    }
    res.status(404).json({ success: false, message: "पार्टनर नहीं मिला" });
});

// एडमिन के लिए लाइव डेटा
app.get('/api/admin/crm-data', (req, res) => {
    res.json({
        success: true,
        verifiedPartners: partners
    });
});

app.listen(PORT, () => {
    console.log(`● Gharbee CORS Engine Running on Port ${PORT}`);
});
