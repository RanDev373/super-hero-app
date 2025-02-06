import React, { useEffect, useState } from "react";

interface Superhero {
    id: number;
    name: string;
    superpower: string;
    humilityScore: number;
}

function App() {
    const [superheroes, setSuperheroes] = useState<Superhero[]>([]);
    const [name, setName] = useState("");
    const [superpower, setSuperpower] = useState("");
    const [humilityScore, setHumilityScore] = useState(5);

    // Fetch superheroes from the backend
    useEffect(() => {
        fetch("http://localhost:3000/superheroes")
            .then((res) => res.json())
            .then((data) => setSuperheroes(data))
            .catch((err) => console.error("Error fetching superheroes:", err));
    }, []);

    // Handle adding a new superhero
    const addSuperhero = async (e: React.FormEvent) => {
        e.preventDefault();
        const newHero = { name, superpower, humility: humilityScore };

        const response = await fetch("http://localhost:3000/superheroes", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newHero),
        });

        if (response.ok) {
            const addedHero = await response.json();
            setSuperheroes([...superheroes, addedHero].sort((a, b) => a.humilityScore - b.humilityScore));
            setName("");
            setSuperpower("");
            setHumilityScore(5);
        } else {
            console.error("Error adding superhero");
        }
    };

    return (
        <div style={{ textAlign: "center", maxWidth: "500px", margin: "auto" }}>
            <h1>Superheros</h1>

            {/* Form to Add Superhero */}
            <form onSubmit={addSuperhero}>
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" required />
                <input value={superpower} onChange={(e) => setSuperpower(e.target.value)} placeholder="Superpower" required />
                <input type="number" value={humilityScore} onChange={(e) => setHumilityScore(Number(e.target.value))} min="1" max="10" required />
                <button type="submit">Add Superhero</button>
            </form>

            {/* Display List of Superheroes */}
            <ul>
                {superheroes.map((hero) => (
                    <li key={hero.id}>
                        <strong>{hero.name}</strong> - {hero.superpower} (Humility: {hero.humilityScore})
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default App;
