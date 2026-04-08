import {useParams, Link} from "react-router";
import {useEffect, useState} from "react";
import type {Reptile} from "../types/Reptile.tsx";
import type {Cart, CartItem} from "../types/Cart.tsx";
import Cookies from "js-cookie";

export default function Details() {
    const {id} = useParams();
    const [reptile, setReptile] = useState<Reptile | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [showMessage, setShowMessage] = useState<boolean>(false);
    const COOKIE_KEY = "shopping_cart";

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`http://localhost:8080/reptiles/${id}`);
                if (!res.ok) throw new Error("Not found");
                const data = await res.json();
                setReptile(data);
            } catch (error) {
                console.error("Failed to fetch reptile:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handleAddToCart = () => {
        if (!reptile) return;

        const raw = Cookies.get(COOKIE_KEY);
        const cart: Cart = raw ? JSON.parse(raw) : {items: []};

        const existing = cart.items.find((item: CartItem) => item.id === reptile.id);
        const quantity = 1;
        const updatedItems = existing
            ? cart.items.map((item: CartItem) =>
                item.id === reptile.id
                    ? {...item, quantity: item.quantity + quantity}
                    : item
            )
            : [...cart.items, {id: reptile.id, quantity}];

        Cookies.set(COOKIE_KEY, JSON.stringify({items: updatedItems}), {expires: 1});
        setShowMessage(true);
        setTimeout(() => setShowMessage(false), 3000);
    };

    if (loading) {
        return (
            <div className="text-center mt-5">
                <div className="spinner-border" style={{color: "#4a7c59"}} role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3 text-secondary">Loading details...</p>
            </div>
        );
    }

    if (!reptile) {
        return (
            <div className="text-center mt-5">
                <h2 className="text-danger">Reptile not found</h2>
                <Link to="/" className="btn mt-3" style={{backgroundColor: "#4a7c59", color: "#fff"}}>
                    Back to Home
                </Link>
            </div>
        );
    }

    return (
        <div className="container py-4">
            {/* Success Alert */}
            {showMessage && (
                <div className="alert alert-success d-flex align-items-center" role="alert">
                    <i className="bi bi-check-circle-fill me-2"></i>
                    Item added to cart successfully!
                </div>
            )}

            <Link to="/" className="text-decoration-none mb-4 d-inline-block" style={{color: "#4a7c59"}}>
                <i className="bi bi-arrow-left me-1"></i> Back to all reptiles
            </Link>

            <div className="row g-4 mt-1">
                {/* Image */}
                <div className="col-md-6">
                    {reptile.imageFileName ? (
                        <img
                            src={reptile.imageFileName}
                            alt={reptile.name}
                            className="img-fluid rounded shadow"
                            style={{width: "100%", maxHeight: "500px", objectFit: "cover"}}
                        />
                    ) : (
                        <div className="bg-light rounded d-flex align-items-center justify-content-center"
                             style={{height: "400px"}}>
                            <i className="bi bi-image text-secondary" style={{fontSize: "4rem"}}></i>
                        </div>
                    )}
                </div>

                {/* Details */}
                <div className="col-md-6">
                    <span className="badge mb-2" style={{backgroundColor: "#4a7c59", fontSize: "0.85rem"}}>
                        {reptile.type}
                    </span>
                    <h1 className="fw-bold mb-1">{reptile.name}</h1>
                    <p className="text-secondary mb-3">{reptile.morph}</p>

                    <h2 className="fw-bold mb-4" style={{color: "#4a7c59"}}>
                        ${reptile.price.toFixed(2)}
                    </h2>

                    <p className="mb-4" style={{lineHeight: "1.8"}}>{reptile.description}</p>

                    {/* Info Grid */}
                    <div className="row g-3 mb-4">
                        <div className="col-6">
                            <div className="p-3 rounded" style={{backgroundColor: "#eef4e8"}}>
                                <small className="text-secondary d-block">Gender</small>
                                <strong>{reptile.gender}</strong>
                            </div>
                        </div>
                        <div className="col-6">
                            <div className="p-3 rounded" style={{backgroundColor: "#eef4e8"}}>
                                <small className="text-secondary d-block">Age</small>
                                <strong>{reptile.age} {reptile.age === 1 ? "year" : "years"}</strong>
                            </div>
                        </div>
                        <div className="col-6">
                            <div className="p-3 rounded" style={{backgroundColor: "#eef4e8"}}>
                                <small className="text-secondary d-block">Environment</small>
                                <strong>{reptile.environment}</strong>
                            </div>
                        </div>
                        <div className="col-6">
                            <div className="p-3 rounded" style={{backgroundColor: "#eef4e8"}}>
                                <small className="text-secondary d-block">In Stock</small>
                                <strong>{reptile.quantityAvailable} available</strong>
                            </div>
                        </div>
                    </div>

                    {/* Add to Cart */}
                    {reptile.quantityAvailable > 0 ? (
                        <button
                            className="btn btn-lg w-100"
                            style={{backgroundColor: "#4a7c59", color: "#fff"}}
                            onClick={handleAddToCart}
                        >
                            <i className="bi bi-cart-plus me-2"></i>
                            Add to Cart
                        </button>
                    ) : (
                        <button className="btn btn-lg w-100 btn-secondary" disabled>
                            Out of Stock
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
