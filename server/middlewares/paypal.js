const paypal = require('paypal-rest-sdk');
require('dotenv').config();
const Payment = require('../models/Payment');
const mongoose = require('mongoose');

paypal.configure({
  mode: process.env.PAYPAL_MODE, // 'sandbox' or 'live'
  client_id: process.env.PAYPAL_CLIENT_ID,
  client_secret: process.env.PAYPAL_SECRET
});

// PayPal create payment
const createPayment = (req, res) => {
  const { amount, currency = 'USD', courseId } = req.body;
  const userId = req.userId;

  const create_payment_json = {
    intent: 'sale',
    payer: {
      payment_method: 'paypal'
    },
    redirect_urls: {
      return_url: `http://localhost:${process.env.PORT}/api/paypal/execute-payment?courseId=${courseId}&userId=${userId}`,
      cancel_url: `http://localhost:5173/payment/cancel?courseId=${courseId}`
    },
    transactions: [{
      amount: {
        currency,
        total: amount
      },
      description: `Purchase course ${courseId}`
    }]
  };
  paypal.payment.create(create_payment_json, (error, payment) => {
    if (error) {
      return res.status(500).json({ error: error.response });
    } else {
      const approvalUrl = payment.links.find(link => link.rel === 'approval_url');
      res.json({ id: payment.id, approval_url: approvalUrl ? approvalUrl.href : null });
    }
  });
};

// PayPal execute payment 
const executePayment = async (req, res) => {
  const paymentId = req.query.paymentId;
  const payerId = req.query.PayerID;
  const courseId = req.query.courseId;
  const execute_payment_json = {
    payer_id: payerId
  };
  paypal.payment.execute(paymentId, execute_payment_json, async (error, payment) => {
    if (error) {
      return res.status(500).json({ error: error.response });
    } else {
      // Save payment details in Database
      try {
        const transaction = payment.transactions && payment.transactions[0];
        const relatedResource = transaction && transaction.related_resources && transaction.related_resources[0];
        const sale = relatedResource && relatedResource.sale;
        const userId = req.query.userId;
        // Convert courseId to ObjectId if needed
        const paymentData = {
          user: new mongoose.Types.ObjectId(userId),
          course: new mongoose.Types.ObjectId(courseId),
          payerId: payment.payer.payer_info.payer_id,
          paymentMethod: payment.payer.payment_method,
          paymentState: payment.state,
          transactionId: sale ? sale.id : undefined,
          paymentId: payment.id,
          receipt: payment
        };
        // console.log('Saving payment:', paymentData);
        await Payment.create(paymentData);
      } catch (dbError) {
        console.error('DB Error:', dbError);
        return res.status(500).json({ error: 'Payment executed but failed to save transaction.' });
      }
      res.redirect(`http://localhost:5173/payment/success?courseId=${courseId}&paymentId=${paymentId}`);
    }
  });
};

// to get the receipt of a payment
const receipt = async (req, res) => {
  const paymentId = req.params.id;
  try {
    const payment = await Payment.findOne({ paymentId }).populate('course');
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    res.status(200).json({ message: 'Payment receipt fetched successfully', payment });
  } catch (error) {
    console.error('Error fetching payment receipt:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  createPayment,
  executePayment,
  receipt
};