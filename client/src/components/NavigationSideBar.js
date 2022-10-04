import { NavLink } from "react-router-dom";
import styled from "styled-components";

const NavigationSideBar = () => {
    return (
        <NavigationSection>
            <HomeLink to="/home/explore">Home</HomeLink>
            <MyRestaurantsLink to="myRestaurants/All">My Restaurants</MyRestaurantsLink>
            <FindARestaurantsLink to="findARestaurant">Find a Restaurant</FindARestaurantsLink>
            <AddRestaurantsLink to="addRestaurant">Add a Restaurant</AddRestaurantsLink>
        </NavigationSection>
    );
};

export default NavigationSideBar;

const NavigationSection = styled.nav`
    width: 200px;
    height: calc(100vh - 60px);
    display: flex;
    flex-direction: column;
    border: 1px solid black;
    margin-top: var(--offset-top);
`;

const HomeLink = styled(NavLink)`
    text-decoration: none;
    color: black;
    font-size: var(--body-font);

        &.active {
            color: red;
        };
`;

const MyRestaurantsLink = styled(HomeLink)`
`;

const AddRestaurantsLink = styled(HomeLink)`
`;

const FindARestaurantsLink = styled(HomeLink)`
`;