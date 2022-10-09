import styled from "styled-components";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import CircularProgress from '@mui/material/CircularProgress';

import RestaurantTile from "./RestaurantTile";
import SearchBar from "./SearchBar";
import Map from "../../Map_Components/Map";

//default map is centered on coordinates of Montreal
const GEOCOORDINATES = [45.501690, -73.567253];

const RestaurantsByCategoryPage = () => {
    const [restaurantInfo, setRestaurantInfo] = useState(null);
    const [errorStatus, setErrorStatus] = useState(false);
    const [mapStatus, setMapStatus] = useState(false);
    const { user } = useAuth0();
    const { category } = useParams();

    useEffect(() => {
        setErrorStatus(false);
        setRestaurantInfo(null);
        setMapStatus(false);
        
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
    }, [category])

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
                        onClick={ () => setMapStatus(false) }
                        >
                            View List
                        </ListViewBtn>
                        <MapMessage>
                            Only Restaurants saved using searches will appear on map.
                        </MapMessage>
                        <Map restaurants={restaurantInfo} geoCoordinates={GEOCOORDINATES} search={false}/>
                    </>
                    : <>
                        <MapViewBtn 
                        onClick={ () => setMapStatus(true) }
                        >
                            View Map
                        </MapViewBtn>
                        <>
                            { restaurantInfo.map((restaurant) => {
                                return <RestaurantTile key={`tile${ restaurant._id }`} restaurant={ restaurant }/>
                            })}
                        </>
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