import styled from "styled-components";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import CircularProgress from '@mui/material/CircularProgress';

import RestaurantTile from "../RestaurantTile";

const RestaurantsByCategoryPage = () => {
    const [restaurantInfo, setRestaurantInfo] = useState(null);
    const [errorStatus, setErrorStatus] = useState(false);
    const { user } = useAuth0();
    const { category } = useParams();

    useEffect(() => {
        setErrorStatus(false);
        setRestaurantInfo(null);

        if(user) {
            fetch(`/get-user-restaurants/${user.email}`)
            .then(res => res.json())
            .then(results => {
                if(results.status === 200) {
                    if(category === "All") {
                        setRestaurantInfo(results.data.restaurants);
                    }
                    else if(category === "Been_To") {
                        const filteredRestaurants = results.data.restaurants.filter((restaurant) => {
                            return restaurant.restaurantVisitStatus === true;
                        });
                        setRestaurantInfo(filteredRestaurants);
                    }
                    else if(category === "Liked") {
                        const filteredRestaurants = results.data.restaurants.filter((restaurant) => {
                            return restaurant.restaurantCategory === "liked";
                        });
                        setRestaurantInfo(filteredRestaurants);
                    }
                    else if(category === "Disliked") {
                        const filteredRestaurants = results.data.restaurants.filter((restaurant) => {
                            return restaurant.restaurantCategory === "disliked";
                        });
                        setRestaurantInfo(filteredRestaurants);
                    }
                    else if(category === "Favorite") {
                        const filteredRestaurants = results.data.restaurants.filter((restaurant) => {
                            return restaurant.restaurantFavorite === true;
                        });
                        setRestaurantInfo(filteredRestaurants);

                    }
                    else if(category === "Wish_List") {
                        const filteredRestaurants = results.data.restaurants.filter((restaurant) => {
                            return restaurant.restaurantVisitStatus === false;
                        });
                        setRestaurantInfo(filteredRestaurants);
                    }
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
            ?
                restaurantInfo.map((restaurant) => {
                    return <RestaurantTile key={`tile${restaurant._id}`} restaurant={restaurant}/>
                })
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