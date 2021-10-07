/**
* xz todo notes:
* @todo : server side process
* 
*/

// get the config from server side
async function getConfig() {
  try {
    const response = await fetch('/config');
    const config = await response.json();
    return config;
  } catch (err) {
    return { error: err.message };
  }
}

// Calls stripe.confirmCardPayment
// If the card requires authentication Stripe shows a pop-up modal to
// prompt the user to enter authentication details without leaving your page.
function payWithCard(stripe, card, clientSecret) {
  stripe
    .confirmCardPayment(clientSecret, {
      payment_method: {
        card: card
      }
    })
    .then(function (result) {
      if (result.error) {
        // Show error to your customer
        showError(result.error);
      } else {
        // The payment succeeded!
        orderComplete(result);
      }

      return result; 
    });
};

function showError(err_message){
  window.location.href = "/success?error="+ err_message.error.message;
};

function orderComplete(payment_res){
  window.location.href = "/success?id="+ payment_res.paymentIntent.id;
};