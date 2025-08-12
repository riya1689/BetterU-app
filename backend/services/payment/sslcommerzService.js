// backend/services/payment/sslcommerzService.js
const SSLCommerzPayment = require('sslcommerz-lts');

const store_id = process.env.SSL_STORE_ID;
const store_passwd = process.env.SSL_STORE_PASSWORD;
const is_live = process.env.IS_LIVE === 'true';

const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);

// Function to initiate a payment
exports.initPayment = async (orderData) => {
    const data = {
        total_amount: orderData.total_amount,
        currency: 'BDT',
        tran_id: orderData.item_id, // CHANGE THIS LINE
        success_url: `${process.env.SERVER_URL}/api/payment/success`,
        fail_url: `${process.env.SERVER_URL}/api/payment/fail`,
        cancel_url: `${process.env.SERVER_URL}/api/payment/cancel`,
        ipn_url: `${process.env.SERVER_URL}/api/payment/ipn`,
        shipping_method: 'Courier',
        product_name: orderData.product_name,
        product_category: 'Electronic',
        product_profile: 'general',
        cus_name: orderData.cus_name,
        cus_email: orderData.cus_email,
        cus_add1: 'Dhaka',
        cus_city: 'Dhaka',
        cus_postcode: '1000',
        cus_country: 'Bangladesh',
        cus_phone: '01711111111',
        ship_name: orderData.cus_name,
        ship_add1: 'Dhaka',
        ship_city: 'Dhaka',
        ship_postcode: 1000,
        ship_country: 'Bangladesh',
    };

    try {
        const apiResponse = await sslcz.init(data);
        return apiResponse.GatewayPageURL;
    } catch (error) {
        console.error('SSLCommerz init error:', error);
        throw new Error('Failed to initiate payment.');
    }
};

// Function to validate a transaction
exports.validateTransaction = async (val_id) => {
    const data = { val_id };
    try {
        const response = await sslcz.validate(data);
        return response;
    } catch (error) {
        console.error('SSLCommerz validation error:', error);
        throw new Error('Failed to validate transaction.');
    }
};

// ADD THIS NEW FUNCTION to check the connection status
exports.checkConnection = async () => {
    const checkData = {
        total_amount: 10,
        currency: 'BDT',
        tran_id: 'CHECK_' + Date.now(),
        success_url: 'http://localhost:5000/success',
        fail_url: 'http://localhost:5000/fail',
        cancel_url: 'http://localhost:5000/cancel',
        ipn_url: 'http://localhost:5000/ipn',
        shipping_method: 'Courier',
        product_name: 'Test Product',
        product_category: 'Test',
        product_profile: 'general',
        cus_name: 'Test Customer',
        cus_email: 'test@example.com',
        cus_add1: 'Dhaka',
        cus_city: 'Dhaka',
        cus_postcode: '1000',
        cus_country: 'Bangladesh',
        cus_phone: '01711111111',
        ship_name: 'Test Customer',
        ship_add1: 'Dhaka',
        ship_city: 'Dhaka',
        ship_postcode: 1000,
        ship_country: 'Bangladesh',
    };

    try {
        // Attempt to initialize a payment with test data
        const response = await sslcz.init(checkData);
        if (response && response.status === 'SUCCESS') {
            return { connected: true, message: '✅ SSL Commerz connected successfully!' };
        } else {
            return { connected: false, message: '❌ SSL Commerz could not be connected. Check your credentials.' };
        }
    } catch (error) {
        return { connected: false, message: `❌ SSL Commerz connection failed: ${error.message}` };
    }
};
