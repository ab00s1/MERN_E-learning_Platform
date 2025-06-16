const express = require('express');
const mongoose = require('mongoose');
const paypal = require('paypal-rest-sdk');
const cors = require('cors');
require('dotenv').config();

// PayPal SDK configuration
paypal.configure({
  mode: process.env.PAYPAL_MODE, // 'sandbox' or 'live'
  client_id: process.env.PAYPAL_CLIENT_ID,
  client_secret: process.env.PAYPAL_SECRET
});

const app = express();
app.use(express.json());
app.use(cors());

const port = process.env.PORT;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection error:', err));

app.use("/uploads", express.static('uploads'));

app.use('/api', require('./routes/authRoute'));
app.use('/api', require('./routes/userRoute'));
app.use('/api/admin', require('./routes/adminRoute'));
app.use('/api/course', require('./routes/courseRoute'));
app.use('/api/paypal', require('./routes/paymentRoute'));
app.use('/api/doubt', require('./routes/aiDoubtResolver'));


app.listen(port);
console.log(`Server is running on port ${port}`);
