import { Outlet, useNavigate, useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import styled from "styled-components";
import NavigationSideBar from "../NavigationSideBar";
import LogoutButton from "../auth0/LogoutButton";

const HomePage = () => {
    const location = useLocation().pathname;
    const navigate = useNavigate();

    useEffect(() => {
        if(location === "/home") {
            navigate("explore");
        }
    }, [location]);

    return (
        <Wrapper>
            <Header>
                <Link to="/home">TasteBuds</Link>
                <p>Welcome User!</p>
                <LogoutButton/>
            </Header>
            <Content>
                <NavigationSideBar/>
                <Outlet />
            </Content>
        </Wrapper>
    )
};

export default HomePage;

const Wrapper = styled.div`
    margin: 10px;
`;

const Header = styled.div`
    display: flex;
    justify-content: space-between;
`;

const Content = styled.div`
    display: flex;
`;