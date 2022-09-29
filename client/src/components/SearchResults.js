import styled from "styled-components";
import { Link } from "react-router-dom";

const restaurant = ( { restaurant } ) => {
    return (
        <RestaurantInfo>
            <div>
                <p>{`Name: ${restaurant.name}`}</p>
                <p>{`Address: ${restaurant.address}`}</p>
                {restaurant.phone_number ? <p>{`Phone Number: ${restaurant.phone_number}`}</p> : null}
                {restaurant.website ? <p>
                    Website: 
                    <a href={`${restaurant.website}`}>{restaurant.website}</a>
                </p> : null}
                <p>{`Distance: ${restaurant.distance}m`}</p>
            </div>
            <button>Save</button>
        </RestaurantInfo>
    )
};

export default restaurant;

const RestaurantInfo = styled.div`
    margin: 15px 0;
    max-width: 60vw;
    border: 1px solid black;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
`;