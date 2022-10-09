import SearchPopUp from "./SearchPopUp";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

const Map = ( { restaurants, geoCoordinates } ) => {
    return (
        <MapContainer 
                style={ { height: "500px", width: "100%" } }
                center={ [Number(geoCoordinates[0]), Number(geoCoordinates[1])] } zoom={ 15 } 
                scrollWheelZoom={ true }
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {
                    restaurants.map((restaurant) => {
                        return (
                            <Marker 
                                key={`Marker${restaurant.id}`} 
                                position={ [restaurant.location.lat, restaurant.location.lng] }
                            >
                                <Popup>
                                    <SearchPopUp key={ `search${ restaurant.id }` } restaurant={ restaurant } />
                                </Popup>
                            </Marker>
                        )
                    })
                }
            </MapContainer>
    )
};

export default Map;