// src/components/MapView.js
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { database, ref, onValue } from '../firebaseConfig';
import L from 'leaflet';

// Fix for Leaflet marker icon not displaying correctly
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const MapView = () => {
    const [locations, setLocations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch data from Firebase Realtime Database
    useEffect(() => {
        const locationsRef = ref(database, '/locations');

        // Attach real-time listener
        const unsubscribe = onValue(
            locationsRef,
            (snapshot) => {
                const data = snapshot.val();
                const locationArray = data ? Object.values(data) : [];
                setLocations(locationArray);
                setLoading(false);
            },
            (err) => {
                console.error("Error fetching data:", err);
                setError("Failed to fetch data");
                setLoading(false);
            }
        );

        // Cleanup listener on component unmount
        return () => unsubscribe();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: "100vh", width: "100%" }}>
            {/* Railway map tile layer */}
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            
            {locations.map((location, index) => (
                <Marker
                    key={index}
                    position={[location.latitude, location.longitude]}
                    icon={L.divIcon({
                        className: 'custom-marker',
                        html: '<div style="background:red;width:10px;height:10px;border-radius:50%;"></div>'
                    })}
                >
                    <Popup>
                        <b>Latitude</b>: {location.latitude}<br />
                        <b>Longitude</b>: {location.longitude}<br />
                        <b>Timestamp</b>: {new Date(location.timestamp).toLocaleString()}
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    );
};

export default MapView;
