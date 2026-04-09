interface SearchBarProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
}

export default function SearchBar({searchTerm, onSearchChange}: SearchBarProps) {
    return (
        <div className="mx-auto mb-4" style={{maxWidth: "500px"}}>
            <div className="input-group shadow-sm rounded-pill overflow-hidden">
                <span className="input-group-text border-0 bg-white ps-3">
                    <i className="bi bi-search" style={{color: "#4a7c59"}}></i>
                </span>
                <input
                    type="text"
                    className="form-control border-0 py-2"
                    placeholder="Search by name or type..."
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                />
                {searchTerm && (
                    <button
                        className="btn border-0 bg-white pe-3"
                        onClick={() => onSearchChange("")}
                        aria-label="Clear search"
                    >
                        <i className="bi bi-x-lg text-secondary"></i>
                    </button>
                )}
            </div>
        </div>
    );
}
