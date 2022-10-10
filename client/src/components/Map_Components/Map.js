import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useEffect, useRef } from 'react';

import SearchPopUp from "./SearchPopUp";
import InfoPopUp from "./InfoPopUp";

const Map = ( { restaurants, geoCoordinates, search, flyToGeoCoordinations } ) => {
    const ref = useRef(null);

    useEffect(() => {
        if(flyToGeoCoordinations && ref.current) {
            const map = ref.current;
            map.setView(flyToGeoCoordinations, 10);
        }
    }, [flyToGeoCoordinations])

    return (
        <MapContainer 
                ref={ref}
                style={ { height: "500px", width: "100%" } }
                center={ 
                    [Number(geoCoordinates[0]), Number(geoCoordinates[1])] } 
                    zoom={ search === "area" 
                        ? 15
                        : search === "place" 
                        ? 13 
                        : 10 } 
                scrollWheelZoom={ true }
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {
                    restaurants.map((restaurant) => {
                        if(restaurant.location && restaurant.location.lat && restaurant.location.lng) {
                            return (
                                <Marker 
                                    key={search 
                                        ? `Marker${restaurant.id}` 
                                        : `Marker${restaurant._id}`
                                    } 
                                    position={ [restaurant.location.lat, restaurant.location.lng] }
                                >
                                    <Popup>
                                        {search 
                                        ? <SearchPopUp 
                                            key={ `search${ restaurant.id }` } 
                                            restaurant={ restaurant } 
                                        />
                                        : <InfoPopUp
                                            key={ `info${ restaurant._id }` } 
                                            restaurant={ restaurant }
                                        />
                                        }
                                    </Popup>
                                </Marker>
                            )
                        }
                        else {
                            return null;
                        }
                    })
                }
            </MapContainer>
    )
};

export default Map;