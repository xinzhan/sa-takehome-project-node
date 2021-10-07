# Solution
This is a demo e-commerce application for Stripe Press written in Node.js with the [Express framework](https://expressjs.com/).

**Payment flow:** Home Page > Checkout Page > Success Page

Clicking on any of the books on [Home Page](http://localhost:3000) will redirect to the checkout page.

When [checkout page](http://localhost:3000/checkout?item=1) is loaded, the Payment Intent will be created in the background, via [create payment intent](http://localhost:3000/create-payment-intent?item=1) on the server-side using [*stripe.paymentIntents.create*](https://stripe.com/docs/api/payment_intents/create). The client secret received for this Payment Intent is generated with item amount & currency. This client secret is neccessary to complete the credit card transaction without the amount being exposed and potentially be changed in-flight.

On the foreground, when [checkout page](http://localhost:3000/checkout?item=1) is loaded, [*elements.create()*](https://stripe.com/docs/js/elements_object/create_element?type=card) is used to create a "card" Stripe Element for the customer to fill in credit card details for payment. The Stripe Element will perform the validation of the card number & expiry date while allowing the look and feel to be customizable.

When the credit card is filled-in and form is submitted (i.e. Pay $xx is clicked), [*stripe.confirmCardPayment*](https://stripe.com/docs/js/payment_intents/confirm_card_payment) will be triggered to complete the payment (along with any authorization needed).

Upon checkout completion, the success page is loaded with Payment Intent ID (pi_xx). The Payment Intent ID is required to get the Charge ID (ci_xx) and the amount charged via a server-side call to [*stripe.paymentIntents.retrieve*](https://stripe.com/docs/api/payment_intents/retrieve). The success page will then show the Charge ID and amount charged.

## Documentation, Samples and API References
After getting the application to run locally, the first documentation read is for [Stripe Elements](https://stripe.com/docs/stripe-js) to understand how the frontend elements work and to add those in. [Stripe Elements Sample](https://github.com/stripe/elements-examples) is heavily referenced for both client0sdie and server-side coding when adding the payment method.

Potential pitfalls:
- Amount attributes for the APIs are denominated in **cents and not dollars**, and should be in Int and not Float.
- Assuming that Charge ID can be retrived from the client-side [*stripe.confirmCardPayment*] success response

Other References:
- [Stripe.js Documentation](https://stripe.com/docs/js)
- [Payment Flow Documentation](https://stripe.com/docs/payments/integration-builder)
- [Stripe Payments Demo](https://github.com/stripe/stripe-payments-demo)
- [PaymentsIntents API & object reference](https://stripe.com/docs/api/payment_intents)
- [Charges object reference](https://stripe.com/docs/api/charges/object)

## Improvements
Stripe Press is a basic e-commerce site which can be easily enhanced to get more customers and transactions.
Features which drives the usability of the site such as search or "best seller" lists would enhance the customers buying experience.
E-commerce features enhancements such as shopping cart, promo codes and loyalty programs will reduce the friction for the customer to complete their purchase journey.

Some possible improvements can be:
- Checkout Page
  1. Adding address fields for delivery
  2. Able to purchase multiple books in a single transaction
  3. (related to item 2 above) Adding a shopping cart  
  4. Promo code
- Other Site Functional Features
  1. Adding a search feature to search for books by Author, Book Title or Genre
  2. Able to sort/filter book listing
  3. Popular books by number sold (by genre/author)
  4. "Customers who bought this have also bought that"
 - Code Hygiene
  1. Javascript error on home page and success due to missing credit card dom object
