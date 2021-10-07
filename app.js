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

  // place switch statments into function for reuse
  const book = getBookWithItemID(item);

  res.render('checkout', {
    title: book.title,
    amount: book.amount,
    error: book.error
  });
});

/**
 * Success route
 */
app.get('/success', async (req, res) => {
  const successID = req.query.id;
  const error = req.query.error;
  let chargeID, amt;

  if (successID) {
    const paymentIntent = await stripe.paymentIntents.retrieve(successID);
    // assuming only 1 charge, charge id is at => paymentIntent.charges.data[0].id;
    chargeID = paymentIntent.charges.data[0].id;
    amt = paymentIntent.charges.data[0].amount;
  }

  res.render('success', {
    successID: successID,
    chargeID: chargeID,
    amt: (amt/100).toFixed(2),
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
 */
app.post('/create-payment-intent', async (req, res) => {

  // get the item id
  const {items} = req.body;
  let amt;

  // get book with item id, then the amt from book
  amt = getBookWithItemID(items[0].id).amount;

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: parseInt(amt),
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
 * @author xz
 * Get Book with Item ID
 */
 function getBookWithItemID(itemID) {

  let title, amount, error;

  switch (itemID) {
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
 
  return {
    amount: amount,
    title: title,
    error: error
  };
}