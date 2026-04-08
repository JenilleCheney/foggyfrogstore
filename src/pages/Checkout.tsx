import {loadStripe} from "@stripe/stripe-js";
import {EmbeddedCheckout, EmbeddedCheckoutProvider} from "@stripe/react-stripe-js";
import {useCallback} from "react";
import Cookies from "js-cookie";

export default function Checkout() {
    const stripePromise = loadStripe("pk_test_51T9qua7zwbDAWBpwNipE9pjybsA2HLGu2BkUA191PMo8YLjfIG4xfnJ9ZtF3cPPbmXgBmAOqxQVVwepavUuowhsb00IxJEu9DY");

    const COOKIE_KEY = "shopping_cart"

    const fetchClientSecret = useCallback(async () => {

        //get shopping cart from cookie
        const cart =Cookies.get(COOKIE_KEY)
        // Create a Checkout Session
        const res = await fetch("http://localhost:8080/checkout/create-checkout-session", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: cart
        });

        const data = await res.json();
        return data.clientSecret;
    }, []);

    const options = {fetchClientSecret};

    return (
        <>
            <h1>Checkout</h1>

            <EmbeddedCheckoutProvider
                stripe={stripePromise}
                options={options}
            >
                <EmbeddedCheckout />
            </EmbeddedCheckoutProvider>
        </>
    )
}