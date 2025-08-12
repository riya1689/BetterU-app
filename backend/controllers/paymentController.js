// backend/controllers/paymentController.js
const paymentService = require('../services/payment/sslcommerzService');
const Appointment = require('../models/Appointment'); // 👈 ADD THIS LINE

exports.initiatePayment = async (req, res) => {
    try {
        const orderData = req.body;
        console.log('---2. Received order data from frontend: ---', orderData);

        // Map frontend data to your database schema
        const appointmentData = {
            userId: orderData.user_id,
            userName: orderData.user_name,
            userEmail: orderData.cus_email,
            doctorId: orderData.doctor_id, // 👈 Make sure you are sending this from the frontend
            doctorName: orderData.doctor_name,
            date: orderData.session_date,
            time: orderData.session_time,
            problemDescription: orderData.problem_description,
            totalAmount: orderData.total_amount,
            itemId: orderData.item_id,
            transactionId: orderData.item_id, // Use item_id as the initial transactionId
            paymentStatus: 'pending',
        };
        

        // 1. Create and save a new appointment in the database
        const newAppointment = new Appointment(appointmentData);
        await newAppointment.save();
        console.log('Appointment saved to database with ID:', newAppointment._id);

        const gatewayURL = await paymentService.initPayment(orderData);
        console.log('--- 3. GOT GATEWAY URL FROM SERVICE ---');
        console.log(gatewayURL);
        return res.status(200).json({ success: true, url: gatewayURL });
    } catch (error) {
        console.error('!!!Payment initiation Failed!!',error);
        return res.status(500).json({ success: false, error: error.message });
    }
};

// ... (your initiatePayment function remains the same) ...

exports.handleSuccess = async (req, res) => {
    console.log('✅ Received success callback from SSLCommerz:', req.body);
    const tran_id = req.body.tran_id;

    // You should ideally validate the payment here to ensure it's authentic
    // This requires another call to SSLCommerz's validation API
    // For now, we will trust the callback and update the database

    try {
        await Appointment.findOneAndUpdate(
            { transactionId: tran_id },
            { paymentStatus: 'paid' },
            { new: true }
        );
        console.log(`Transaction ${tran_id} successful! Appointment status updated.`);

        // Finally, redirect the user to a success page on your frontend
        return res.redirect(`${process.env.CLIENT_URL}/payment/success`);

    } catch (error) {
        console.error('Error updating appointment on success:', error);
        return res.redirect(`${process.env.CLIENT_URL}/payment/fail`);
    }
};

exports.handleFail = async (req, res) => {
    console.log('❌ Received fail callback from SSLCommerz:', req.body);
    const tran_id = req.body.tran_id;
    try {
        await Appointment.findOneAndUpdate({ transactionId: tran_id }, { paymentStatus: 'failed' });
        return res.redirect(`${process.env.CLIENT_URL}/payment/fail`);
    } catch (error) {
        //...
    }
};

exports.handleCancel = async (req, res) => {
    console.log('🟡 Received cancel callback from SSLCommerz:', req.body);
    const tran_id = req.body.tran_id;
    try {
        await Appointment.findOneAndUpdate({ transactionId: tran_id }, { paymentStatus: 'cancelled' });
        return res.redirect(`${process.env.CLIENT_URL}/payment/cancel`);
    } catch (error) {
        //...
    }
};

exports.handleIPN = async (req, res) => {
    console.log('IPN received:', req.body);
    const { tran_id, status } = req.body;
    
    if (tran_id && status === 'VALID') {
        try {
            await Appointment.findOneAndUpdate({ transactionId: tran_id }, { paymentStatus: 'paid' });
            console.log('IPN validation successful. Appointment status updated to paid.');
        } catch (error) {
            console.error('Error updating appointment via IPN:', error);
        }
    }
    return res.status(200).send('IPN received and processed.');
};