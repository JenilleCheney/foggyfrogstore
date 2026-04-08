import {loadStripe} from "@stripe/stripe-js";
import {EmbeddedCheckout, EmbeddedCheckoutProvider} from "@stripe/react-stripe-js";
import {useCallback} from "react";
import {Link} from "react-router";
import Cookies from "js-cookie";

export default function Checkout() {
    const stripePromise = loadStripe("pk_test_51T9qua7zwbDAWBpwNipE9pjybsA2HLGu2BkUA191PMo8YLjfIG4xfnJ9ZtF3cPPbmXgBmAOqxQVVwepavUuowhsb00IxJEu9DY");

    const COOKIE_KEY = "shopping_cart";

    const fetchClientSecret = useCallback(async () => {
        const cart = Cookies.get(COOKIE_KEY);
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
        <div className="container py-4">
            <Link to="/cart" className="text-decoration-none mb-4 d-inline-block" style={{color: "#4a7c59"}}>
                <i className="bi bi-arrow-left me-1"></i> Back to Cart
            </Link>

            <h1 className="fw-bold mb-4" style={{color: "#4a7c59"}}>
                <i className="bi bi-credit-card me-2"></i>Checkout
            </h1>

            <div className="card border-0 shadow-sm p-3">
                <EmbeddedCheckoutProvider
                    stripe={stripePromise}
                    options={options}
                >
                    <EmbeddedCheckout/>
                </EmbeddedCheckoutProvider>
            </div>
        </div>
    );
}