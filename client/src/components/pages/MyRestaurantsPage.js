import { Outlet, NavLink } from "react-router-dom";
import styled from "styled-components";

import { CATEGORIES } from "../constants/categories";

const MyRestaurantsPage = () => {

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