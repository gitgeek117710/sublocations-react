import React from 'react'
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet'
import 'leaflet/dist/leaflet.css';
import { useRef } from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import '../map/map.css';

export const Map = () => {
    const mapRef = useRef();
    const position = [-1.2928, 36.8219];
    const [geodata, setGeoData] = useState(null);
    useEffect(() => {
        fetch('/data/nairobi_sublocs.geojson')
            .then((res) => res.json())
            .then((data) => setGeoData(data))
            .catch((err) => console.error('Failed to load GeoJSON', err))
    });

    // styles
    const geoStyle = {
        fillColor: "#3388ff",
        fillOpacity: 0,
        color: "yellow",
        weight: 3
    }

    const onEachFeature = (feature, layer) => {
        const name = feature.properties?.SLNAME || "Unnamed";
        layer.bindTooltip(name, {
            permanent: true,
            direction: "center",
            className: "geo-label"
        });
    }

    return (
        <div>
            <h4>Sublocations</h4>
            <MapContainer
                center={position}
                zoom={13}
                scrollWheelZoom={true}
                style={{ height: '400px', width: '800px' }} // 🔥 Required
                ref={mapRef}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {geodata && <GeoJSON data={geodata} style={geoStyle} onEachFeature={onEachFeature} />}
            </MapContainer>
        </div>
    )
}
