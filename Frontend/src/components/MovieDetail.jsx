// === IMPORTS ===
import React, {useEffect, useState} from "react";
// useEffect: Für Side-Effects (API Call beim Laden)
// useState: Für State Management (movie, loading, error)
import {Link, useParams} from "react-router-dom";
// useParams: Holt die :id aus der URL (z.B. /movie/550 → id = 550)
// Link: Component für Navigation zurück zur Home-Page
import Spinner from "./Spinner.jsx";
// Loading-Animation während API Call läuft


// === API KONFIGURATION ===
const API_BASE_URL = 'https://api.themoviedb.org/3';
// Basis-URL für alle TMDB API Calls

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
// API Key aus deiner .env Datei (VITE_TMDB_API_KEY=...)

const API_OPTIONS = {
    method: 'GET',                    // HTTP GET Request
    headers: {
        accept: 'application/json',    // Wir wollen JSON zurück
        Authorization: `Bearer ${API_KEY}`  // Auth mit Bearer Token
    }
};


// === COMPONENT START ===
const MovieDetail = () => {
    const { id } = useParams();
    // Holt die movie ID aus der URL
    // Beispiel: /movie/550 → id = "550"

    // === STATE MANAGEMENT ===
    const [movie, setMovie] = useState(null);
    // Speichert die Film-Details (null = noch nicht geladen)

    const [isLoading, setIsLoading] = useState(true);
    // true = zeigt Spinner, false = zeigt Content

    const [errorMessage, setErrorMessage] = useState('');
    // Speichert Fehlermeldungen falls API Call fehlschlägt


    // === API CALL BEIM COMPONENT MOUNT ===
    useEffect(() => {
        // useEffect läuft NACH dem ersten Render

        const fetchMovieDetails = async () => {
            setIsLoading(true);        // Zeige Spinner
            setErrorMessage('');       // Reset alte Errors

            try {
                // API Call zu TMDB
                const response = await fetch(
                    `${API_BASE_URL}/movie/${id}?append_to_response=credits,videos`,
                    //                    ↑ ID aus URL   ↑ Extra Daten in einem Call
                    API_OPTIONS
                );

                if (!response.ok) {
                    // HTTP Error (404, 500, etc.)
                    throw new Error('Failed to fetch movie details');
                }

                const data = await response.json();
                // Parse JSON Response

                setMovie(data);
                // Speichere Film-Details im State

                console.log('Movie Details:', data);
                // Debug: Zeigt alle verfügbaren Daten in Console

            } catch (error) {
                console.error(`Error fetching movie details: ${error}`);
                setErrorMessage('Failed to load movie details');
            } finally {
                setIsLoading(false);
                // Egal ob Erfolg oder Error: Loading ist fertig
            }
        };

        fetchMovieDetails();  // Führe die Funktion aus

    }, [id]);
    // [id] = Dependency Array
    // useEffect läuft NEU wenn sich die ID ändert
    // (z.B. von /movie/550 zu /movie/551)


    // === CONDITIONAL RENDERING ===

    if (isLoading) return (
        <div className="min-h-screen flex items-center justify-center bg-primary">
            <Spinner />
        </div>
    );
    // Wenn noch lädt → zeige nur Spinner

    if (errorMessage) return (
        <p className="text-red-500 text-center mt-10">{errorMessage}</p>
    );
    // Wenn Error → zeige Fehlermeldung

    if (!movie) return null;
    // Wenn kein Film geladen → zeige nichts
    // (Sollte nicht passieren, aber Sicherheit)


    // === MAIN RENDER ===
    return (
        <main className="min-h-screen bg-primary text-white">
            {/* Volle Bildschirmhöhe, primary Background, weißer Text */}

            <div className="pattern"></div>
            {/* Hintergrund-Pattern (aus index.css) */}

            <div className="wrapper relative z-10">
                {/* Container mit Padding (aus index.css), z-10 über Pattern */}

                {/* === BACK BUTTON === */}
                <Link to="/" className="text-light-200 hover:text-white mb-6 inline-block">
                    ← Back to Home
                </Link>
                {/* Link navigiert zu Home ("/"), hover-Effekt auf Text */}


                {/* === BACKDROP IMAGE === */}
                <div className="relative rounded-2xl overflow-hidden mb-8">
                    {/* Container: rounded corners, hidden overflow, margin-bottom */}

                    {movie.backdrop_path && (
                        /* Nur rendern wenn backdrop_path existiert (Optional Chaining) */

                        <div className="relative h-[400px]">
                            {/* Container mit fixer Höhe von 400px */}

                            <img
                                src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
                                // TMDB Image URL: original = höchste Qualität
                                // Beispiel: /t/p/original/fCayJrkfRaCRCTh8GqN30f8oyQF.jpg

                                alt={movie.title}
                                className="w-full h-full object-cover"
                                // w-full: 100% Breite
                                // h-full: 100% Höhe
                                // object-cover: Bild füllt Container ohne Verzerrung
                            />

                            <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/30 to-transparent"></div>
                            {/* Gradient Overlay ÜBER dem Bild:
                                - absolute: positioned über Image
                                - inset-0: top/right/bottom/left = 0 (füllt parent)
                                - gradient von unten (primary) nach oben (transparent)
                                - via-primary/60: Mitte ist 60% transparent
                            */}
                        </div>
                    )}
                </div>


                {/* === MAIN CONTENT: POSTER + DETAILS === */}
                <div className="flex flex-col lg:flex-row gap-8">
                    {/*
                        Flexbox Layout:
                        - Mobile: Column (Poster oben, Details unten)
                        - Desktop (lg): Row (Poster links, Details rechts)
                        - gap-8: 32px Abstand zwischen Items
                    */}

                    {/* === POSTER === */}
                    <div className="flex-shrink-0">
                        {/* flex-shrink-0: Poster behält seine Größe (wird nicht kleiner) */}

                        <img
                            src={movie.poster_path
                                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                                // Wenn poster_path existiert: TMDB URL mit w500 (Breite 500px)
                                : '/no-movie.png'
                                // Fallback: Placeholder Image
                            }
                            alt={movie.title}
                            className="w-full lg:w-80 rounded-2xl shadow-2xl"
                            // Mobile: volle Breite
                            // Desktop (lg): feste Breite 320px (w-80)
                            // rounded-2xl: starke Rundung
                            // shadow-2xl: großer Schatten
                        />
                    </div>


                    {/* === DETAILS SECTION === */}
                    <div className="flex-1 min-w-0">
                        {/* flex-1: Nimmt restlichen Platz ein */}

                        {/* === TITLE === */}
                        <h2 className="text-4xl font-bold mb-2">{movie.title}</h2>
                        {/* text-4xl: ~36px, font-bold: 700 weight, mb-2: margin-bottom */}

                        {/* === TAGLINE (Optional) === */}
                        {movie.tagline && (
                            /* Nur zeigen wenn tagline existiert */
                            <p className="text-light-200 italic mb-4">"{movie.tagline}"</p>
                            // italic Text, light-200 Color (heller grau)
                        )}


                        {/* === META INFO (Rating, Year, Runtime, Language) === */}
                        <div className="flex flex-wrap gap-4 mb-6 text-light-200">
                            {/*
                                flex: Items nebeneinander
                                flex-wrap: Wenn zu wenig Platz → neue Zeile
                                gap-4: 16px Abstand
                            */}

                            {/* Rating */}
                            <div className="flex items-center gap-2">
                                <img src="/star.svg" alt="Rating" className="w-5 h-5" />
                                <span>{movie.vote_average?.toFixed(1)} / 10</span>
                                {/*
                                    vote_average?: Optional Chaining (safe access)
                                    toFixed(1): Rundet auf 1 Dezimalstelle
                                    Beispiel: 8.365 → 8.4
                                */}
                            </div>

                            <span>•</span>  {/* Bullet Point Separator */}

                            {/* Release Year */}
                            <span>{movie.release_date?.split('-')[0]}</span>
                            {/*
                                release_date: "2024-03-15"
                                split('-'): ["2024", "03", "15"]
                                [0]: "2024" ← erstes Element
                            */}

                            <span>•</span>

                            {/* Runtime */}
                            <span>{movie.runtime} min</span>
                            {/* Beispiel: "142 min" */}

                            <span>•</span>

                            {/* Original Language */}
                            <span className="uppercase">{movie.original_language}</span>
                            {/* uppercase: en → EN */}
                        </div>


                        {/* === GENRES === */}
                        <div className="flex flex-wrap gap-2 mb-6">
                            {movie.genres?.map(genre => (
                                /*
                                    genres ist ein Array: [{id: 28, name: "Action"}, ...]
                                    map: Loope über alle genres
                                */
                                <span
                                    key={genre.id}
                                    // React Key: eindeutiger Identifier (wichtig!)

                                    className="px-4 py-2 bg-light-100/10 rounded-full text-sm"
                                    // px-4: Padding horizontal 16px
                                    // py-2: Padding vertikal 8px
                                    // bg-light-100/10: light-100 mit 10% opacity
                                    // rounded-full: Pill Shape
                                    // text-sm: kleinere Schrift
                                >
                                    {genre.name}
                                </span>
                            ))}
                        </div>


                        {/* === OVERVIEW === */}
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold mb-3">Overview</h2>
                            <p className="text-light-200 leading-relaxed">
                                {movie.overview}
                                {/* leading-relaxed: mehr Zeilenabstand für Lesbarkeit */}
                            </p>
                        </div>


                        {/* === ADDITIONAL INFO GRID === */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            {/*
                                CSS Grid:
                                - Mobile: 1 Spalte
                                - Tablet+ (md): 2 Spalten
                                - gap-4: 16px zwischen Grid Items
                            */}

                            {/* Status */}
                            <div>
                                <h3 className="text-lg font-semibold mb-2">Status</h3>
                                <p className="text-light-200">{movie.status}</p>
                                {/* z.B. "Released", "In Production" */}
                            </div>

                            {/* Budget */}
                            <div>
                                <h3 className="text-lg font-semibold mb-2">Budget</h3>
                                <p className="text-light-200">
                                    {movie.budget
                                        ? `$${movie.budget.toLocaleString()}`
                                        // toLocaleString(): Fügt Tausender-Trennzeichen hinzu
                                        // 160000000 → "160,000,000"
                                        : 'N/A'
                                    }
                                </p>
                            </div>

                            {/* Revenue */}
                            <div>
                                <h3 className="text-lg font-semibold mb-2">Revenue</h3>
                                <p className="text-light-200">
                                    {movie.revenue
                                        ? `$${movie.revenue.toLocaleString()}`
                                        : 'N/A'
                                    }
                                </p>
                            </div>

                            {/* Production Countries */}
                            <div>
                                <h3 className="text-lg font-semibold mb-2">Production Countries</h3>
                                <p className="text-light-200">
                                    {movie.production_countries?.map(c => c.name).join(', ') || 'N/A'}
                                    {/*
                                        Array von Ländern: [{iso_3166_1: "US", name: "United States"}, ...]
                                        map(c => c.name): Nur die Namen extrahieren
                                        join(', '): Mit Komma verbinden
                                        Ergebnis: "United States, United Kingdom"
                                    */}
                                </p>
                            </div>
                        </div>


                        {/* === PRODUCTION COMPANIES === */}
                        {movie.production_companies && movie.production_companies.length > 0 && (
                            /* Nur zeigen wenn:
                               1. production_companies existiert UND
                               2. Array ist nicht leer
                            */
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold mb-3">Production Companies</h3>
                                <div className="flex flex-wrap gap-4">
                                    {movie.production_companies.map(company => (
                                        <div key={company.id} className="flex items-center gap-2">
                                            {company.logo_path ? (
                                                /* Wenn Logo vorhanden: zeige Logo */
                                                <img
                                                    src={`https://image.tmdb.org/t/p/w200${company.logo_path}`}
                                                    alt={company.name}
                                                    className="h-15 object-contain bg-white/100 p-2 rounded"
                                                    // h-8: Höhe 32px
                                                    // object-contain: Behält Aspect Ratio
                                                    // bg-white/10: leichter weißer Hintergrund
                                                />
                                            ) : (
                                                /* Kein Logo: zeige Text */
                                                <span className="text-light-200">{company.name}</span>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}


                        {/* === CAST (Top 12) === */}
                        {movie.credits?.cast && movie.credits.cast.length > 0 && (
                            /*
                                Nur zeigen wenn credits existiert (von append_to_response)
                                UND cast Array ist nicht leer
                            */
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold mb-3">Top Cast</h3>
                                <div className="flex flex-wrap overflow-x-auto gap-4 pb-4 hide-scrollbar">
                                    {/*
                                        overflow-x-auto: Horizontal scrollbar wenn zu viele Items
                                        hide-scrollbar: Custom CSS (aus index.css)
                                        pb-4: Padding-bottom für Scrollbar-Space
                                    */}

                                    {movie.credits.cast.slice(0, 12).map(person => (
                                        /*
                                            slice(0, 10): Nur erste 10 Cast Members
                                            Array von: {id, name, character, profile_path, ...}
                                        */
                                        <div key={person.id} className="flex-shrink-0 w-32">
                                            {/*
                                                flex-shrink-0: Behält Breite (kein Squishing)
                                                w-32: Feste Breite 128px
                                            */}

                                            {/* Actor Photo */}
                                            <img
                                                src={person.profile_path
                                                    ? `https://image.tmdb.org/t/p/w200${person.profile_path}`
                                                    : '/no-movie.png'
                                                }
                                                alt={person.name}
                                                className="w-32 h-48 object-cover rounded-lg mb-2"
                                                // w-32: 128px Breite
                                                // h-48: 192px Höhe (portrait ratio)
                                                // object-cover: Füllt Container
                                            />

                                            {/* Actor Name */}
                                            <p className="text-sm font-semibold">{person.name}</p>

                                            {/* Character Name */}
                                            <p className="text-xs text-light-200">{person.character}</p>
                                            {/* text-xs: sehr klein (12px) */}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}


                        {/* === OFFICIAL WEBSITE LINK === */}
                        {movie.homepage && (
                            /* Nur zeigen wenn homepage URL existiert */
                            <a
                            href={movie.homepage}
                            target="_blank"
                            // Öffnet in neuem Tab

                            rel="noopener noreferrer"
                            // Sicherheit: Verhindert window.opener access

                            className="inline-block px-6 py-3 bg-light-100/20 hover:bg-light-100/30 rounded-lg transition"
                            // inline-block: Macht <a> zu einem Button-Style Element
                            // hover:bg-light-100/30: Heller bei Mouse-Over
                            // transition: Smooth animation
                            >
                            Visit Official Website →
                            </a>
                            )}
                    </div>
                </div>
            </div>
        </main>
    );
};

export default MovieDetail;