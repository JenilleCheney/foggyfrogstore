import {useState, useEffect} from "react";
import {Link} from "react-router";
import type {Reptile} from "../types/Reptile.tsx";

const LOGO_URL = "http://127.0.0.1:10000/devstoreaccount1/uploads/foggyfrogslogo.png";

export default function Home() {
    const [reptiles, setReptiles] = useState<Reptile[]>([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('http://localhost:8080/reptiles/');
                const reptiles = await res.json();
                setReptiles(reptiles)
            } catch (error) {
                console.error("Failed to fetch reptiles:", error)
            }
        }

        fetchData()
    }, [])

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
                    Your trusted source for captive-bred reptiles 🐸🦎
                </p>
                <hr className="mx-auto" style={{maxWidth: "400px", borderColor: "#4a7c59"}} />
            </div>

            {/* Reptile Cards */}
            {reptiles.length > 0 ? (
                <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
                    {reptiles.map(reptile => (
                        <div className="col" key={reptile.id}>
                            <div className="card h-100 shadow-sm border-0">
                                {reptile.imageFileName && (
                                    <img
                                        src={reptile.imageFileName}
                                        className="card-img-top"
                                        alt={reptile.name}
                                        style={{height: "220px", objectFit: "cover"}}
                                    />
                                )}
                                <div className="card-body d-flex flex-column">
                                    <h5 className="card-title fw-bold">{reptile.name}</h5>
                                    <p className="card-text text-secondary mb-1">
                                        <small>{reptile.type} &bull; {reptile.morph}</small>
                                    </p>
                                    <p className="card-text fs-5 fw-semibold" style={{color: "#4a7c59"}}>
                                        ${reptile.price.toFixed(2)}
                                    </p>
                                    <Link
                                        to={`/details/${reptile.id}`}
                                        className="btn mt-auto"
                                        style={{backgroundColor: "#4a7c59", color: "#fff"}}
                                    >
                                        View Details
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center mt-5">
                    <div className="spinner-border" style={{color: "#4a7c59"}} role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-3 text-secondary">Loading reptiles...</p>
                </div>
            )}
        </>

    )
}

