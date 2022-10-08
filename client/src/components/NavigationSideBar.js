import { NavLink } from "react-router-dom";
import styled from "styled-components";
import { FaHome } from "react-icons/fa";
import { IoRestaurantOutline } from "react-icons/io5";
import { BiSearchAlt } from "react-icons/bi";
import { BsBookmarkPlus } from "react-icons/bs";

const NavigationSideBar = () => {
    return (
        <NavigationSection>
            <HomeLink to="/home/explore">
                <FaHome/>
                <HomeText>
                    Home
                </HomeText>
            </HomeLink>
            <MyRestaurantsLink to="myRestaurants/All">
                <IoRestaurantOutline/>
                <MyRestaurantsText>
                    My Restaurants
                </MyRestaurantsText>
            </MyRestaurantsLink>
            <FindARestaurantsLink to="findARestaurant">
                <BiSearchAlt/>
                <FindARestaurantText>
                    Find a Restaurant
                </FindARestaurantText>
                </FindARestaurantsLink>
            <AddRestaurantsLink to="addRestaurant">
                <BsBookmarkPlus/>
                <AddARestaurantText>
                    Add a Restaurant
                </AddARestaurantText>
            </AddRestaurantsLink>
        </NavigationSection>
    );
};

export default NavigationSideBar;

const NavigationSection = styled.nav`
    padding: 10px 0 0 10px;
    max-width: 200px;
    display: flex;
    flex-direction: column;
    background-color: #cde5d1;
`;

const HomeLink = styled(NavLink)`
    text-decoration: none;
    color: #1e4833;
    font-size: 1.2rem;
    font-weight: bold;
    margin: 10px 0;
    padding: 5px 10px;
    border-radius: 5px 0 0 5px;
    display: flex;
    align-items: center;

    &.active {
        color: white;
        background-color: #37865e;
    };

    @media (max-width: 850px) {
        font-size: 1.5rem;
    };
`;

const MyRestaurantsLink = styled(HomeLink)`
`;

const AddRestaurantsLink = styled(HomeLink)`
`;

const FindARestaurantsLink = styled(HomeLink)`
`;

const HomeText = styled.span`
    margin-left: 10px;

    @media (max-width: 850px) {
        display: none;
    };
`;

const MyRestaurantsText = styled(HomeText)`
`;

const FindARestaurantText = styled(HomeText)`
`;

const AddARestaurantText = styled(HomeText)`
`;