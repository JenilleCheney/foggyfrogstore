import {useState, useEffect} from "react";
import {Link} from "react-router";
import type {Reptile} from "../types/Reptile.tsx";

const LOGO_URL = "http://127.0.0.1:10000/devstoreaccount1/uploads/foggyfrogslogo.png";

const CATEGORIES = [
    {type: "Snake", emoji: "🐍", label: "Snakes"},
    {type: "Frog", emoji: "🐸", label: "Frogs"},
    {type: "Lizard", emoji: "🦎", label: "Lizards"},
];

function ReptileCard({reptile}: { reptile: Reptile }) {
    return (
        <div className="col">
            <div className="card h-100 shadow-sm border-0">
                {reptile.imageFileName ? (
                    <img
                        src={reptile.imageFileName}
                        className="card-img-top"
                        alt={reptile.name}
                        style={{height: "220px", objectFit: "cover"}}
                    />
                ) : (
                    <div className="card-img-top bg-light d-flex align-items-center justify-content-center"
                         style={{height: "220px"}}>
                        <i className="bi bi-image text-secondary" style={{fontSize: "3rem"}}></i>
                    </div>
                )}
                <div className="card-body d-flex flex-column">
                    <h5 className="card-title fw-bold">{reptile.name}</h5>
                    <p className="card-text text-secondary mb-1">
                        <small>{reptile.morph}</small>
                    </p>
                    <p className="card-text fs-5 fw-semibold" style={{color: "#4a7c59"}}>
                        ${reptile.price.toFixed(2)}
                    </p>
                    <div className="mt-auto d-flex justify-content-between align-items-center">
                        <small className="text-secondary">
                            {reptile.quantityAvailable > 0
                                ? `${reptile.quantityAvailable} in stock`
                                : "Out of stock"}
                        </small>
                        <Link
                            to={`/details/${reptile.id}`}
                            className="btn"
                            style={{backgroundColor: "#4a7c59", color: "#fff"}}
                        >
                            View Details
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function Home() {
    const [reptiles, setReptiles] = useState<Reptile[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('http://localhost:8080/reptiles/');
                const data = await res.json();
                setReptiles(data);
            } catch (error) {
                console.error("Failed to fetch reptiles:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const groupedReptiles = CATEGORIES.map(cat => ({
        ...cat,
        items: reptiles.filter(r => r.type.toLowerCase() === cat.type.toLowerCase()),
    }));

    return (
        <>
            {/* Hero Section */}
            <div className="text-center mb-5">
                <img
                    src={LOGO_URL}
                    alt="Foggy Frog Exotics Logo"
                    className="mb-3"
                    style={{maxWidth: "280px"}}
                />
                <h1 className="display-4 fw-bold" style={{color: "#4a7c59"}}>
                    Foggy Frog Exotics
                </h1>
                <p className="lead text-secondary">
                    Your trusted source for captive-bred reptiles &amp; amphibians 🐸🦎🐍
                </p>
                <hr className="mx-auto" style={{maxWidth: "400px", borderColor: "#4a7c59"}}/>
            </div>

            {loading ? (
                <div className="text-center mt-5">
                    <div className="spinner-border" style={{color: "#4a7c59"}} role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-3 text-secondary">Loading reptiles...</p>
                </div>
            ) : reptiles.length === 0 ? (
                <div className="text-center mt-5">
                    <p className="text-secondary fs-5">No reptiles available at the moment. Check back soon!</p>
                </div>
            ) : (
                <>
                    {groupedReptiles.map(category => (
                        category.items.length > 0 && (
                            <section key={category.type} className="mb-5">
                                <h2 className="fw-bold mb-3 d-flex align-items-center gap-2"
                                    style={{color: "#4a7c59"}}>
                                    <span style={{fontSize: "1.5rem"}}>{category.emoji}</span>
                                    {category.label}
                                </h2>
                                <hr style={{borderColor: "#4a7c59", opacity: 0.3}} className="mb-4"/>
                                <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
                                    {category.items.map(reptile => (
                                        <ReptileCard key={reptile.id} reptile={reptile}/>
                                    ))}
                                </div>
                            </section>
                        )
                    ))}

                    {/* Show any reptiles that don't match the 3 categories */}
                    {reptiles.filter(r =>
                        !CATEGORIES.some(c => c.type.toLowerCase() === r.type.toLowerCase())
                    ).length > 0 && (
                        <section className="mb-5">
                            <h2 className="fw-bold mb-3" style={{color: "#4a7c59"}}>
                                🐾 Other Reptiles
                            </h2>
                            <hr style={{borderColor: "#4a7c59", opacity: 0.3}} className="mb-4"/>
                            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
                                {reptiles
                                    .filter(r => !CATEGORIES.some(c => c.type.toLowerCase() === r.type.toLowerCase()))
                                    .map(reptile => (
                                        <ReptileCard key={reptile.id} reptile={reptile}/>
                                    ))}
                            </div>
                        </section>
                    )}
                </>
            )}
        </>
    );
}

