import {useParams} from "react-router";
import {useEffect, useState} from "react";
import type {Reptile} from "../types/Reptile.tsx";
import type {Cart,CartItem} from "../types/Cart.tsx";
import Cookies from "js-cookie";;

export default function Details() {
    const {id} = useParams()
    const [reptile, setReptile] = useState<Reptile>();
    const [showmessage, setShowMessage] = useState<boolean>(false);
    const COOKIE_KEY = "shopping_cart";

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch(`https://localhost:8080/reptiles/`+id);
            const reptile = await res.json();
            setReptile(reptile)
        }
        fetchData()
    },[])

    const handleAddToCart = () => {

        const raw = Cookies.get(COOKIE_KEY)

        const cart: Cart = raw ? JSON.parse(raw) : { items: [] }

        const existing = cart.items.find((item: CartItem) => item.id === reptile?.id)
        const quantity = 1 // turn into a drop-down based on stock
        const updatedItems = existing
            ? cart.items.map((item: CartItem) =>
                item.id === reptile?.id
                    ? { ...item, quantity: item.quantity + quantity }
                    : item
            )
            //: [...cart.items, { id: movie.id, price: movie.price, quantity }]
            : [...cart.items, { id: reptile?.id, quantity }]

        Cookies.set(COOKIE_KEY, JSON.stringify({ items: updatedItems }), { expires: 1 })

        setShowMessage(true)
    }

    return (
        <>
            {
                showmessage && (
                <p className="text-success">
                    Item added to cart successfully!
                </p>
                )
            }
        <h1>Details</h1>
        {
            reptile && (
                <div>
                    {reptile.imageFileName && (
                        <img
                            src={reptile.imageFileName}
                            alt={reptile.name}
                            className="img-fluid rounded mb-3"
                            style={{maxHeight: "400px", objectFit: "cover"}}
                        />
                    )}
                    <h2>{reptile.name}</h2>
                    <p>{reptile.morph}</p>
                    <p>{reptile.description}</p>
                    <button className="btn btl-primary" onClick={handleAddToCart}>
                        Add to cart
                    </button>
                </div>
            )
        }
        </>
    );
}
