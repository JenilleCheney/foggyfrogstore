import {useEffect, useState} from "react";
import {Navigate, Link} from "react-router";
import Cookies from "js-cookie";

export default function Confirmation() {
    const [status, setStatus] = useState(null);
    const [customerEmail, setCustomerEmail] = useState('');
    const COOKIE_KEY = "shopping_cart";

    useEffect(() => {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        const sessionId = urlParams.get('session_id');

        fetch(`http://localhost:8080/checkout/session-status?sessionId=${sessionId}`)
            .then((res) => res.json())
            .then((data) => {
                setStatus(data.status);
                setCustomerEmail(data.customer_email);
            });
    }, []);

    if (status === 'open') {
        return <Navigate to="/checkout"/>;
    }

    if (status === 'complete') {
        Cookies.remove(COOKIE_KEY);
        return (
            <div className="container py-5 text-center">
                <div className="mb-4">
                    <i className="bi bi-check-circle-fill" style={{fontSize: "5rem", color: "#4a7c59"}}></i>
                </div>
                <h1 className="fw-bold mb-3" style={{color: "#4a7c59"}}>Order Confirmed!</h1>
                <p className="lead text-secondary mb-4">
                    Thank you for your purchase! A confirmation email will be sent to <strong>{customerEmail}</strong>.
                </p>
                <p className="text-secondary">
                    If you have any questions, please email{" "}
                    <a href="mailto:orders@foggyfrogexotics.com" style={{color: "#4a7c59"}}>
                        orders@foggyfrogexotics.com
                    </a>.
                </p>
                <Link to="/" className="btn btn-lg mt-3" style={{backgroundColor: "#4a7c59", color: "#fff"}}>
                    <i className="bi bi-house me-2"></i>
                    Back to Home
                </Link>
            </div>
        );
    }

    return (
        <div className="text-center mt-5">
            <div className="spinner-border" style={{color: "#4a7c59"}} role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3 text-secondary">Processing your order...</p>
        </div>
    );
}