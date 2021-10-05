const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
require('dotenv').config();
const stripe = require('stripe');

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
app.get('/', function(req, res) {
  res.render('index');
});

/**
 * Checkout route
 */
app.get('/checkout', function(req, res) {
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
app.post('/success', function(req, res) {
  const { items } = req.body;

  res.render('success', {
    items: items
  });

  // // Create a PaymentIntent with the order amount and currency
  // const paymentIntent = await stripe.paymentIntents.create({
  //   amount: calculateOrderAmount(items),
  //   currency: "usd"
  // });
  // res.send({
  //   clientSecret: paymentIntent.client_secret
  // });
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
 * Start server
 */
app.listen(3000, () => {
  console.log('Getting served on port 3000');
});
