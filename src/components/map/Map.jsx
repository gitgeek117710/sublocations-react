import React from 'react'
import { MapContainer, LayersControl, TileLayer, GeoJSON, LayerGroup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css';
import { useRef } from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import '../map/map.css';
import SearchBar from '../searchplace/SearchBar';

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
                <LayersControl position="topright">
                    <LayersControl.BaseLayer checked name="OpenStreetMap">
                        <TileLayer
                            attribution='&copy; OpenStreetMap contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                    </LayersControl.BaseLayer>

                    <LayersControl.BaseLayer name="Esri Satellite">
                        <LayerGroup>
                            <TileLayer
                                attribution='Tiles &copy; Esri &mdash; Source: Esri'
                                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                            />
                            <TileLayer
                                attribution='Labels &copy; Esri'
                                url="https://services.arcgisonline.com/arcgis/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
                            />
                        </LayerGroup>
                    </LayersControl.BaseLayer>
                </LayersControl>
                {geodata && <GeoJSON data={geodata} style={geoStyle} onEachFeature={onEachFeature} />}
                <SearchBar />
            </MapContainer>
        </div>
    )
}
