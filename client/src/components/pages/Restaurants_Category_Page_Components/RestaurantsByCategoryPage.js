import styled from "styled-components";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import CircularProgress from '@mui/material/CircularProgress';

import RestaurantTile from "./RestaurantTile";
import SearchBar from "./SearchBar";
import Map from "../../Map_Components/Map";

//default map is centered on coordinates of Montreal
const INITIAL_STATE_GEOCOORDINATES = [45.501690, -73.567253];

const RestaurantsByCategoryPage = () => {
    const [restaurantInfo, setRestaurantInfo] = useState(null);
    const [errorStatus, setErrorStatus] = useState(false);
    const [mapStatus, setMapStatus] = useState(false);
    const [locationInputStatus, setLocationInputStatus] = useState(false);
    const [location, setLocation] = useState("");
    const [flyToGeolocation, setFlyToGeolocation] = useState(INITIAL_STATE_GEOCOORDINATES);
    const [locationError, setLocationError] = useState(false);
    const { user } = useAuth0();
    const { category } = useParams();

    useEffect(() => {
        setErrorStatus(false);
        setRestaurantInfo(null);
        setMapStatus(false);
        setLocationError(false);
        setLocationInputStatus(false);
        setLocation("");
        setFlyToGeolocation(INITIAL_STATE_GEOCOORDINATES)
        
        if(user) {
            fetch(`/get-user-restaurants/${ user.email }/${ category }`)
            .then(res => res.json())
            .then(results => {
                if(results.status === 200) {
                    setRestaurantInfo(results.data.restaurants);
                }
                else {
                    setErrorStatus(true);
                    return Promise.reject(results);
                }
            })
            .catch(err => {
                setErrorStatus(true);
                console.log(err)
            })
        }
    }, [category]);

    const handleSubmit = () => {
        fetch(`/get-location/${location.toLowerCase().trim()}`)
        .then(res => res.json())
        .then(result => {
            if(result.status === 200) {
                setLocationInputStatus(false);
                setFlyToGeolocation([result.data.lat, result.data.lng]);
            }
            else {
                setLocationError(true);
                return Promise.reject(result);
            }
        })
        .catch(err => {
            setLocationError(true);
            console.log(err)
        })
    };

    return (
        <Wapper>
            {errorStatus ? <p>Restaurants Not Found</p> : null}
            {restaurantInfo 
            ? restaurantInfo.length >= 1 
            ? <>
                <div>
                    <SearchBar restaurants={ restaurantInfo }/>
                    {mapStatus 
                    ? <>
                        <ListViewBtn 
                        onClick={ () => {
                            setLocationInputStatus(false);
                            setLocationError(false);
                            setMapStatus(false);
                            setFlyToGeolocation(INITIAL_STATE_GEOCOORDINATES)
                        } }
                        >
                            View List
                        </ListViewBtn>
                        {!locationInputStatus 
                        ? <>
                            <ChangeLocationBtn 
                                onClick={ () => setLocationInputStatus(true) }
                            >
                                Change location
                            </ChangeLocationBtn>
                            { flyToGeolocation[0] !== INITIAL_STATE_GEOCOORDINATES[0] 
                                && flyToGeolocation[2] !== INITIAL_STATE_GEOCOORDINATES[1]
                            ? <ResetLocationBtn
                                onClick={ () => setFlyToGeolocation(INITIAL_STATE_GEOCOORDINATES)}
                            >
                                Reset Location
                            </ResetLocationBtn>
                            : null
                            }
                        </>
                        : <LocationInputSection>
                            <Input 
                                placeholder="city and country"
                                onChange={ (e) => {
                                    setLocationError(false);
                                    setLocation(e.target.value);
                                } }
                            />
                            <SubmitAndCancelBtnSection>
                                <SubmitBtn 
                                    onClick={ handleSubmit }
                                >
                                    Submit
                                </SubmitBtn>
                                <CancelBtn
                                    onClick={ () => {
                                        setLocationError(false);
                                        setLocationInputStatus(false);
                                        setLocation("");
                                    }}
                                >
                                    Cancel
                                </CancelBtn>
                            </SubmitAndCancelBtnSection>
                        </LocationInputSection>
                        }
                        { locationError 
                        ? <LocationErrorMessage>
                            Cannot find address
                        </LocationErrorMessage>
                        : null
                        }
                        <MapMessage>
                            Only Restaurants saved using searches will appear on map.
                        </MapMessage>
                        <Map 
                            restaurants={ restaurantInfo } 
                            geoCoordinates={ INITIAL_STATE_GEOCOORDINATES } 
                            search={ false }
                            flyToGeoCoordinations={ flyToGeolocation }
                        />
                    </>
                    : <>
                        <MapViewBtn 
                            onClick={ () => setMapStatus(true) }
                        >
                            View Map
                        </MapViewBtn>
                        <RestaurantTilesSection>
                            { restaurantInfo.map((restaurant) => {
                                return <RestaurantTile key={`tile${ restaurant._id }`} restaurant={ restaurant }/>
                            })}
                        </RestaurantTilesSection>
                    </>
                    }
                </div>
            </>
            : <p>No restaurants in this category</p>
            : (
                <LoadingSection>
                    <CircularProgress />
                </LoadingSection>
            )}
        </Wapper>
    )
};

export default RestaurantsByCategoryPage;

const Wapper =  styled.div`
    display: flex;
    flex-direction: column;
    margin: var(--offset-top) 20px;
    font-family: var(--body-font);
`;

const LoadingSection = styled.div`
    position: absolute;
    left: 50%;
    top: 25%;
`;

const MapViewBtn = styled.button`
    margin-left: 10px;
    font-family: var(--body-font);
    font-size: 0.95rem;
    padding: 5px 10px;
    border: 1px solid #0c5a4a;
    border-radius: 10px;
    background-color: #0c5a4a;
    color: white;

    &:hover {
        cursor: pointer;
        border: 1px solid #0c5a4a;
        background-color: transparent;
        color: #0c5a4a;
    };

    &:active {
        transform: scale(0.85);
    }
`;

const ListViewBtn = styled(MapViewBtn)`
    margin: 0 0 10px 10px;
`;

const MapMessage = styled.p`
    font-size: 1rem;
    margin-bottom: 5px;
`;

const ChangeLocationBtn = styled(MapViewBtn)`
    @media (max-width: 545px) {
        margin: 0 10px 10px 0;
    };
`;

const LocationInputSection = styled.div`
    display: inline-block;
    margin: 0 0 10px 10px;

    @media (max-width: 975px) {
        display: block;
        position: relative;
        left: -5px;
    };
`;

const Input = styled.input`
    font-family: var(--body-font);
    font-size: 1rem;
    border: 1px solid #d9d9d9;
    border-radius: 5px;
    padding: 5px;
`;

const SubmitBtn = styled(MapViewBtn)`
    margin-left: 5px;
`;

const ResetLocationBtn = styled(MapViewBtn)`
`;

const CancelBtn = styled(MapViewBtn)`
`;

const LocationErrorMessage = styled.p`
    margin: 15px 0;
    color: red;
    font-size: 1rem;
`;

const SubmitAndCancelBtnSection = styled.div`
    display: inline-block;
    margin-top: 5px;
`;

const RestaurantTilesSection = styled.div`
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
`;