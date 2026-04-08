import {Link} from "react-router";
import {useEffect, useState} from "react";
import Cookies from "js-cookie";
import type {Reptile} from "../types/Reptile.tsx";
import type {Cart as CartType, CartItem} from "../types/Cart.tsx";

interface CartDisplayItem {
    reptile: Reptile;
    quantity: number;
}

const COOKIE_KEY = "shopping_cart";

export default function Cart() {
    const [cartItems, setCartItems] = useState<CartDisplayItem[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const loadCart = async () => {
        const raw = Cookies.get(COOKIE_KEY);
        if (!raw) {
            setCartItems([]);
            setLoading(false);
            return;
        }

        const cart: CartType = JSON.parse(raw);
        if (!cart.items || cart.items.length === 0) {
            setCartItems([]);
            setLoading(false);
            return;
        }

        try {
            const items: CartDisplayItem[] = [];
            for (const item of cart.items) {
                const res = await fetch(`http://localhost:8080/reptiles/${item.id}`);
                if (res.ok) {
                    const reptile: Reptile = await res.json();
                    items.push({reptile, quantity: item.quantity});
                }
            }
            setCartItems(items);
        } catch (error) {
            console.error("Failed to load cart items:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCart();
    }, []);

    const updateCookie = (items: CartDisplayItem[]) => {
        const cartData: CartType = {
            items: items.map(i => ({id: i.reptile.id, quantity: i.quantity}))
        };
        Cookies.set(COOKIE_KEY, JSON.stringify(cartData), {expires: 1});
    };

    const handleQuantityChange = (id: number, delta: number) => {
        const updated = cartItems.map(item => {
            if (item.reptile.id === id) {
                const newQty = Math.max(1, Math.min(item.quantity + delta, item.reptile.quantityAvailable));
                return {...item, quantity: newQty};
            }
            return item;
        });
        setCartItems(updated);
        updateCookie(updated);
    };

    const handleRemove = (id: number) => {
        const updated = cartItems.filter(item => item.reptile.id !== id);
        setCartItems(updated);
        updateCookie(updated);
    };

    const total = cartItems.reduce((sum, item) => sum + item.reptile.price * item.quantity, 0);

    if (loading) {
        return (
            <div className="text-center mt-5">
                <div className="spinner-border" style={{color: "#4a7c59"}} role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3 text-secondary">Loading cart...</p>
            </div>
        );
    }

    if (cartItems.length === 0) {
        return (
            <div className="text-center mt-5">
                <i className="bi bi-cart-x" style={{fontSize: "4rem", color: "#4a7c59"}}></i>
                <h2 className="mt-3">Your cart is empty</h2>
                <p className="text-secondary">Looks like you haven't added any reptiles yet.</p>
                <Link to="/" className="btn mt-2" style={{backgroundColor: "#4a7c59", color: "#fff"}}>
                    Browse Reptiles
                </Link>
            </div>
        );
    }

    return (
        <div className="container py-4">
            <h1 className="fw-bold mb-4" style={{color: "#4a7c59"}}>
                <i className="bi bi-cart4 me-2"></i>Shopping Cart
            </h1>

            <div className="row g-4">
                {/* Cart Items */}
                <div className="col-lg-8">
                    {cartItems.map(item => (
                        <div key={item.reptile.id}
                             className="card mb-3 border-0 shadow-sm">
                            <div className="row g-0">
                                <div className="col-md-3">
                                    {item.reptile.imageFileName ? (
                                        <img
                                            src={item.reptile.imageFileName}
                                            alt={item.reptile.name}
                                            className="img-fluid rounded-start"
                                            style={{height: "100%", objectFit: "cover", minHeight: "150px"}}
                                        />
                                    ) : (
                                        <div className="bg-light rounded-start d-flex align-items-center justify-content-center"
                                             style={{height: "100%", minHeight: "150px"}}>
                                            <i className="bi bi-image text-secondary" style={{fontSize: "2rem"}}></i>
                                        </div>
                                    )}
                                </div>
                                <div className="col-md-9">
                                    <div className="card-body d-flex flex-column justify-content-between h-100">
                                        <div>
                                            <div className="d-flex justify-content-between align-items-start">
                                                <div>
                                                    <h5 className="card-title fw-bold mb-1">{item.reptile.name}</h5>
                                                    <p className="text-secondary mb-0">
                                                        <small>{item.reptile.type} &bull; {item.reptile.morph}</small>
                                                    </p>
                                                </div>
                                                <button
                                                    className="btn btn-sm btn-outline-danger"
                                                    onClick={() => handleRemove(item.reptile.id)}
                                                    title="Remove from cart"
                                                >
                                                    <i className="bi bi-trash"></i>
                                                </button>
                                            </div>
                                        </div>
                                        <div className="d-flex justify-content-between align-items-center mt-3">
                                            <div className="d-flex align-items-center gap-2">
                                                <button
                                                    className="btn btn-sm btn-outline-secondary"
                                                    onClick={() => handleQuantityChange(item.reptile.id, -1)}
                                                    disabled={item.quantity <= 1}
                                                >
                                                    <i className="bi bi-dash"></i>
                                                </button>
                                                <span className="fw-bold px-2">{item.quantity}</span>
                                                <button
                                                    className="btn btn-sm btn-outline-secondary"
                                                    onClick={() => handleQuantityChange(item.reptile.id, 1)}
                                                    disabled={item.quantity >= item.reptile.quantityAvailable}
                                                >
                                                    <i className="bi bi-plus"></i>
                                                </button>
                                            </div>
                                            <span className="fw-bold fs-5" style={{color: "#4a7c59"}}>
                                                ${(item.reptile.price * item.quantity).toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Order Summary */}
                <div className="col-lg-4">
                    <div className="card border-0 shadow-sm" style={{position: "sticky", top: "20px"}}>
                        <div className="card-body">
                            <h5 className="fw-bold mb-3">Order Summary</h5>
                            <hr/>
                            {cartItems.map(item => (
                                <div key={item.reptile.id}
                                     className="d-flex justify-content-between mb-2">
                                    <span className="text-secondary">
                                        {item.reptile.name} × {item.quantity}
                                    </span>
                                    <span>${(item.reptile.price * item.quantity).toFixed(2)}</span>
                                </div>
                            ))}
                            <hr/>
                            <div className="d-flex justify-content-between fw-bold fs-5">
                                <span>Total</span>
                                <span style={{color: "#4a7c59"}}>${total.toFixed(2)}</span>
                            </div>
                            <Link
                                to="/checkout"
                                className="btn btn-lg w-100 mt-4"
                                style={{backgroundColor: "#4a7c59", color: "#fff"}}
                            >
                                <i className="bi bi-credit-card me-2"></i>
                                Proceed to Checkout
                            </Link>
                            <Link to="/" className="btn btn-outline-secondary w-100 mt-2">
                                Continue Shopping
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}