import React, { useState, useRef, useEffect } from "react";

export default function AirportAutocomplete({ label, value, onChange, searchUrl }) {
    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        if (!value || value.length < 2) {
            setOptions([]);
            return;
        }

        setLoading(true);
        const controller = new AbortController();

        console.log(`Searching airports: ${searchUrl}?term=${value}`);

        fetch(`${searchUrl}?term=${encodeURIComponent(value)}`, {
            signal: controller.signal,
            headers: {
                "X-Requested-With": "XMLHttpRequest",
                "Authorization": `Bearer ${localStorage.getItem('access')}`
            }
        })
            .then(res => {
                console.log("RESPONSE STATUS:", res.status);
                return res.json();
            })
            .then(data => {
                console.log("DATA FROM SERVER:", data);
                if (Array.isArray(data)) {
                    const formattedOptions = data.map(airport =>
                        `${airport.city ? `${airport.city} - ` : ''}${airport.name} (${airport.iataCode})`
                    );
                    setOptions(formattedOptions);
                } else {
                    setOptions([]);
                }
            })
            .catch(err => console.error("Airport search error:", err))
            .finally(() => setLoading(false));

        return () => controller.abort();
    }, [value, searchUrl]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (ref.current && !ref.current.contains(e.target)) {
                setOptions([]);
            }
        };
        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    const handleSelect = (selectedOption) => {
        const iataMatch = selectedOption.match(/\(([^)]+)\)/);
        const iataCode = iataMatch ? iataMatch[1] : selectedOption;

        console.log(`Selected ${label}: ${iataCode}`);
        onChange(iataCode);
        setOptions([]);
    };

    return (
        <div className="form-group position-relative" ref={ref} style={{ marginBottom: "1rem" }}>
            <label>{label}</label>
            <input
                type="text"
                className="form-control"
                placeholder={`Enter ${label.toLowerCase()}`}
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
            {loading && <small className="text-muted">Searching...</small>}

            {options.length > 0 && (
                <ul
                    className="list-group position-absolute w-100"
                    style={{ zIndex: 1000, top: "100%", maxHeight: "200px", overflowY: "auto" }}
                >
                    {options.map((opt, i) => (
                        <li
                            key={i}
                            className="list-group-item list-group-item-action"
                            onClick={() => handleSelect(opt)}
                            style={{ cursor: "pointer" }}
                        >
                            {opt}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}