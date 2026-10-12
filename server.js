const express = require('express');
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

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
    console.log(`Server is live on port ${PORT}`);
});
