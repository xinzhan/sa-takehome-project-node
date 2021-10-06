const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

var app = express();

// view engine setup (Handlebars)
app.engine('hbs', exphbs({
  defaultLayout: 'main',
  extname: '.hbs'
}));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }))
app.use(express.json({}));

/**
 * Home route
 */
app.get('/', function (req, res) {
  res.render('index');
});

/**
 * Checkout route
 */
app.get('/checkout', function (req, res) {
  // Just hardcoding amounts here to avoid using a database
  const item = req.query.item;
  let title, amount, error;

  switch (item) {
    case '1':
      title = "The Art of Doing Science and Engineering"
      amount = 2300
      break;
    case '2':
      title = "The Making of Prince of Persia: Journals 1985-1993"
      amount = 2500
      break;
    case '3':
      title = "Working in Public: The Making and Maintenance of Open Source"
      amount = 2800
      break;
    default:
      // Included in layout view, feel free to assign error
      error = "No item selected"
      break;
  }

  res.render('checkout', {
    title: title,
    amount: amount,
    error: error
  });
});

/**
 * Success route
 */
app.get('/success', async (req, res) => {
  const successID = req.query.id;
  const error = req.query.error;

  var chargeID = '';

  if (successID) {
    chargeID = await getChargeIDWithPaymentIntent(successID);
  }

  res.render('success', {
    successID: successID,
    chargeID: chargeID,
    error: error
  });

});

/**
 * @author xz
 * Expose the Stripe publishable key
 */
app.get('/config', (req, res) => {
  res.json({
    stripePublishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  });
});

/**
 * @author xz
 * Create Payment Intent
 * Do not pass the amount directly
 */
app.post('/create-payment-intent', async (req, res) => {

  const { amt } = req.body;

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: parseInt(amt) * 100,
    currency: "usd"
  });

  // client_secret to verify that this is working
  // @todo - remove in PROD
  console.log('paymentIntent.client_secret: ' + paymentIntent.client_secret);

  res.send({
    clientSecret: paymentIntent.client_secret
  });
});

/**
 * Start server
 */
app.listen(3000, () => {
  console.log('Getting served on port 3000');
});


/**
 * Get Charge ID from Payment Intent ID
 */
async function getChargeIDWithPaymentIntent(paymentIntentID) {
  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentID);
  // asuming only 1 charge, string is at => paymentIntent.charges.data[0].id;
  // console.log('Charge ID: ' + paymentIntent.charges.data[0].id);

  return paymentIntent.charges.data[0].id;
}