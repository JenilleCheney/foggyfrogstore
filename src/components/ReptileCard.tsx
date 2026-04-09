import {Link} from "react-router";
import type {Reptile} from "../types/Reptile.tsx";

export default function ReptileCard({reptile}: { reptile: Reptile }) {
    return (
        <div className="col">
            <Link to={`/details/${reptile.id}`} className="text-decoration-none text-reset">
                <div className="card h-100 shadow-sm border-0" style={{cursor: "pointer"}}>
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
                            <span
                                className="btn"
                                style={{backgroundColor: "#4a7c59", color: "#fff"}}
                            >
                                View Details
                            </span>
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
}
