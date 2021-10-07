(async () => {

  // Get the config from server side
  const config = await getConfig();

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
        color: '#000',
        fontWeight: 500,
        fontFamily: 'Roboto, Open Sans, Segoe UI, sans-serif',
        fontSize: '16px',
        fontSmoothing: 'antialiased',

        ':-webkit-autofill': {
          color: '#fce883',
        },
        '::placeholder': {
          color: 'grey',
        },
      },
      invalid: {
        iconColor: 'red',
        color: 'red',
      },
    },
  });

  // Mount Stripe Card to UI div
  card.mount('#credit-card');

  /**
   * Clientside helper functions
   */
  $(document).ready(function () {
    var amounts = document.getElementsByClassName("amount");

    // iterate through all "amount" elements and convert from cents to dollars
    for (var i = 0; i < amounts.length; i++) {
      amount = amounts[i].getAttribute('data-amount') / 100;
      amounts[i].innerHTML = amount.toFixed(2);
    }

    // since we know there is only one item selected
    // else will need to loop here to get all ids
    const item = new URLSearchParams(window.location.search).get('item');

    var intentBody = {
      items: [{ id: item }]
    };

    // Get the Payment Intent ClientSecret
    fetch("/create-payment-intent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(intentBody)
    })
      .then(function (result) {
        return result.json();
      })
      .then(function (data) {
        console.log('clientSecret: ' + data.clientSecret);

        // Put the event listener to pay
        var form = document.getElementById("payment-form");
        form.addEventListener("submit", function (event) {
          event.preventDefault();
          // Complete payment when the submit button is clicked
          payWithCard(stripe, card, data.clientSecret);
        });

      });

  });

})();