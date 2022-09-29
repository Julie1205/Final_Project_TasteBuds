import { Outlet, useNavigate, useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import styled from "styled-components";
import NavigationSideBar from "../NavigationSideBar";
import LogoutButton from "../LogoutButton";
import { useAuth0 } from "@auth0/auth0-react";

const HomePage = () => {
    const location = useLocation().pathname;
    const navigate = useNavigate();
    const { user } = useAuth0();

    useEffect(() => {
        if(location === "/home") {
            navigate("explore");
        }
    }, [location]);

    return (
        <Wrapper>
            <Header>
                <Link to="/home/explore">TasteBuds</Link>
                {user ? <p>{`Welcome ${user.nickname}!`}</p> : null}
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
    font-size: var(--body-font);
    margin: 10px;
`;

const Header = styled.div`
    display: flex;
    justify-content: space-between;
`;

const Content = styled.div`
    display: flex;
`;