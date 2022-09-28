import { NavLink } from "react-router-dom";
import styled from "styled-components";

const NavigationSideBar = () => {
    return (
        <NavigationSection>
            <NavLink to="/home">Home</NavLink>
            <NavLink to="profile">Profile</NavLink>
            <NavLink to="myRestaurants">My Restaurants</NavLink>
            <NavLink to="AddRestaurant">Add a Restaurant</NavLink>
        </NavigationSection>
    );
};

export default NavigationSideBar;

const NavigationSection = styled.nav`
    width: 200px;
    height: calc(100vh - 50px);
    display: flex;
    flex-direction: column;
    border: 1px solid black;
`;