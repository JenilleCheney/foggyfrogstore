import {Link, Outlet} from "react-router";

const LOGO_URL = "http://127.0.0.1:10000/devstoreaccount1/uploads/foggyfrogslogo.png";

export default function Layout() {
    return(
        <div className="container-fluid">
            <header>
                <nav className="navbar mb-4" style={{borderBottom: "2px solid #4a7c59"}}>
                    <div className="container-fluid">
                        <Link to="/" className="navbar-brand d-flex align-items-center gap-2">
                            <img src={LOGO_URL} alt="Logo" style={{height: "40px", borderRadius: "8px"}} />
                            <span className="fw-bold" style={{color: "#4a7c59"}}>Foggy Frog Exotics</span>
                        </Link>

                        <div className="d-flex">
                            <Link to="/cart" className="fs-4" style={{color: "#4a7c59"}}>
                                <i className="bi bi-cart4"></i>
                            </Link>
                        </div>
                    </div>
                </nav>
            </header>

            <main className="container-fluid">
                <Outlet/>
            </main>

            <footer className="container-fluid mt-5 py-3 text-center text-secondary" style={{borderTop: "2px solid #4a7c59"}}>
                Foggy Frog Exotics, &copy; 2026
            </footer>
        </div>
    )
}
