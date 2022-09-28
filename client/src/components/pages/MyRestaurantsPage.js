import { Outlet, NavLink, useNavigate, useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import styled from "styled-components";

import { CATEGORIES } from "../constants/categories";

const MyRestaurantsPage = () => {
    const location = useLocation().pathname;
    const navigate = useNavigate();

    useEffect(() => {
        if(location === "/home/myRestaurants") {
            navigate(CATEGORIES[0]);
        }
    }, [location]);

    return (
        <Wrapper>
            <p>My Restaurants</p>
            <LinkSection>
                {
                    CATEGORIES.map((category) => {
                        return (
                            <CateroryLink 
                                key={category} 
                                to={category}>{category.replace("_", " ")}
                            </CateroryLink>
                        );
                    })
                }
            </LinkSection>
            <Outlet/>
        </Wrapper>
    );
};

export default MyRestaurantsPage;

const Wrapper = styled.div`
    margin-top: var(--offset-top);
    font-size: var(--body-font);
`;

const CateroryLink = styled(NavLink)`
    text-decoration: none;
    color: black;
    font-size: var(--body-font);
    margin-left: 15px;

        &.active {
            color: red;
        };
`;

const LinkSection = styled.div`
    margin: 10px 0;
`;