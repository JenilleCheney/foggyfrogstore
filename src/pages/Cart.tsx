import {Link} from "react-router";

export default function Cart() {
    return (
        <>
            <h1>Cart</h1>

            <p>
                Show all products in shopping cart (stored in cookie). Show link to proceed to checkout.
            </p>
            <p>
                <Link to="/Checkout" className="btn btn-primary">Proceed to Checkout</Link>
            </p>
        </>
    )
}