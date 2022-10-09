import SearchPopUp from "./SearchPopUp";
import InfoPopUp from "./InfoPopUp";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

const Map = ( { restaurants, geoCoordinates, search } ) => {

    return (
        <MapContainer 
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