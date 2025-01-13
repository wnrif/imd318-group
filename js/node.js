// server.js (Node.js example)
const express = require('express');
const stripe = require('stripe')('your-secret-key-here'); // Replace with your secret key
const app = express();
const bodyParser = require('body-parser');

// Middleware
app.use(bodyParser.json());

// Endpoint to create a checkout session
app.post('/create-checkout-session', async (req, res) => {
    const { productName, productPrice } = req.body;

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'myr',
                        product_data: {
                            name: productName,
                        },
                        unit_amount: productPrice * 100,  // Convert RM to cents
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: 'http://localhost:3000/success',
            cancel_url: 'http://localhost:3000/cancel',
        });

        res.json({ sessionId: session.id });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error creating session');
    }
});

// Start server
app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
