import {useState, useEffect} from "react";
import type {Reptile} from "../types/Reptile.tsx";
import SearchBar from "../components/SearchBar.tsx";
import ChatWidget from "../components/ChatWidget.tsx";
import ReptileCard from "../components/ReptileCard.tsx";

const LOGO_URL = "http://127.0.0.1:10000/devstoreaccount1/uploads/foggyfrogslogo.png";

const CATEGORIES = [
    {type: "Frog", label: "Frogs"},
    {type: "Snake", label: "Snakes"},
    {type: "Lizard", label: "Lizards"},
];


export default function Home() {
    const [reptiles, setReptiles] = useState<Reptile[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [searchTerm, setSearchTerm] = useState<string>("");

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

    const filteredReptiles = reptiles.filter(r => {
        const term = searchTerm.toLowerCase();
        return r.name.toLowerCase().includes(term) || r.type.toLowerCase().includes(term);
    });

    const groupedReptiles = CATEGORIES.map(cat => ({
        ...cat,
        items: filteredReptiles.filter(r => r.type.toLowerCase() === cat.type.toLowerCase()),
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
                    Your trusted source for captive-bred reptiles &amp; amphibians
                </p>
                <hr className="mx-auto" style={{maxWidth: "400px", borderColor: "#4a7c59"}}/>
                <ChatWidget />
            </div>

            {/* Search Bar */}
            {!loading && reptiles.length > 0 && (
                <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
            )}

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
                    {/* No results message */}
                    {filteredReptiles.length === 0 && searchTerm && (
                        <div className="text-center mt-4 mb-5">
                            <i className="bi bi-emoji-frown" style={{fontSize: "3rem", color: "#4a7c59"}}></i>
                            <p className="text-secondary fs-5 mt-2">
                                No reptiles found matching "<strong>{searchTerm}</strong>"
                            </p>
                        </div>
                    )}

                    {groupedReptiles.map(category => (
                        category.items.length > 0 && (
                            <section key={category.type} className="mb-5">
                                <h2 className="fw-bold mb-3"
                                    style={{color: "#4a7c59"}}>
                                    {category.label}
                                </h2>
                                <hr style={{borderColor: "#4a7c59", opacity: 0.3}} className="mb-4"/>
                                <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4">
                                    {category.items.map(reptile => (
                                        <ReptileCard key={reptile.id} reptile={reptile}/>
                                    ))}
                                </div>
                            </section>
                        )
                    ))}

                    {/* Show any reptiles that don't match the 3 categories */}
                    {filteredReptiles.filter(r =>
                        !CATEGORIES.some(c => c.type.toLowerCase() === r.type.toLowerCase())
                    ).length > 0 && (
                        <section className="mb-5">
                            <h2 className="fw-bold mb-3" style={{color: "#4a7c59"}}>
                                Other Reptiles
                            </h2>
                            <hr style={{borderColor: "#4a7c59", opacity: 0.3}} className="mb-4"/>
                            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4">
                                {filteredReptiles
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

