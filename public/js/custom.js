(async () => {

  /**
   * Clientside helper functions
   */
 var amounts = document.getElementsByClassName("amount");
  // iterate through all "amount" elements and convert from cents to dollars
  for (var i = 0; i < amounts.length; i++) {
    amount = amounts[i].getAttribute('data-amount') / 100;  
    amounts[i].innerHTML = amount.toFixed(2);
  }

  /**
   * indication of custom code
   */
  // Get the config from server side
  const config = await getConfig();
  console.log('done getting config: ' + config.stripePublishableKey);

  // Create a Stripe client.
  const stripe = Stripe(config.stripePublishableKey);

  // Config for Stripe Element
  var elements = stripe.elements({
    fonts: [
      {
        cssSrc: 'https://fonts.googleapis.com/css?family=Roboto',
      },
    ],
    // Stripe's examples are localized to specific languages, but if
    // you wish to have Elements automatically detect your user's locale,
    // use `locale: 'auto'` instead.
    locale: window.__exampleLocale
  });
  
  // Create Stripe Card Element
  var card = elements.create('card', {
    iconStyle: 'solid',
    style: {
      base: {
        iconColor: '#c4f0ff',
        color: '#fff',
        fontWeight: 500,
        fontFamily: 'Roboto, Open Sans, Segoe UI, sans-serif',
        fontSize: '16px',
        fontSmoothing: 'antialiased',
  
        ':-webkit-autofill': {
          color: '#fce883',
        },
        '::placeholder': {
          color: '#87BBFD',
        },
      },
      invalid: {
        iconColor: '#FFC7EE',
        color: '#FFC7EE',
      },
    },
  });

  // Mount Stripe Card to UI div
  card.mount('#credit-card');
  
  registerElements([card], 'credit-card');

})();