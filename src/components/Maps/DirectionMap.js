import React, { useState, useEffect, useCallback } from 'react';
import { GoogleMap, DirectionsService, DirectionsRenderer, useJsApiLoader, MarkerF } from '@react-google-maps/api';

const containerStyle = {
    width: '100%',
    height: '400px',
    marginTop: '10px',
    borderRadius: '8px',
};

// Tọa độ mặc định (ví dụ: Chợ Bến Thành)
const defaultCenter = {
    lat: 10.7721,
    lng: 106.6983,
};

const DirectionMap = ({ restaurantAddress }) => {
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: 'AIzaSyAJhzMq7h-R_8IjTESBGYTMfqKT1eZgzzA',
    });

    const [userLocation, setUserLocation] = useState(null);
    const [directionsResponse, setDirectionsResponse] = useState(null);
    const [routeError, setRouteError] = useState(null);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    });
                },
                (error) => {
                    console.error('Lỗi Geolocation:', error);
                },
            );
        }
    }, []);

    const directionsCallback = useCallback((response) => {
        if (response !== null) {
            if (response.status === 'OK') {
                setDirectionsResponse(response);
            } else {
                console.error('Directions failed: ', response);
                setRouteError(response.status);
            }
        }
    }, []);

    useEffect(() => {
        setDirectionsResponse(null);
    }, [restaurantAddress]);

    if (!isLoaded) return <div>Đang tải bản đồ...</div>;

    return (
        <GoogleMap mapContainerStyle={containerStyle} center={userLocation || defaultCenter} zoom={14}>
            {userLocation && <MarkerF position={userLocation} title="Vị trí của bạn" />}

            {userLocation && restaurantAddress && !directionsResponse && (
                <DirectionsService
                    options={{
                        destination: restaurantAddress,
                        origin: userLocation,
                        travelMode: 'DRIVING',
                    }}
                    callback={directionsCallback}
                />
            )}
            {directionsResponse && (
                <DirectionsRenderer
                    options={{
                        directions: directionsResponse,
                    }}
                />
            )}
        </GoogleMap>
    );
};

export default React.memo(DirectionMap);
