import { Outlet, useNavigate, useLocation, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import styled from "styled-components";
import NavigationSideBar from "../NavigationSideBar";
import LogoutButton from "../LogoutButton";
import { useAuth0 } from "@auth0/auth0-react";

const HomePage = () => {
    const [userName, setUserName] = useState(null);
    const location = useLocation().pathname;
    const navigate = useNavigate();
    const { user } = useAuth0();

    useEffect(() => {
        if(location === "/home") {
            navigate("explore");
        }
    }, [location]);

    useEffect(() => {
        if(user){
            fetch(`/get-user/${user.email}`)
            .then(res => res.json())
            .then(data => {
                if(data.status === 200) {
                    localStorage.setItem("username", JSON.stringify(data.data.username))
                    setUserName(JSON.parse(localStorage.getItem("username")));
                }
                else {
                    return Promise.reject(data);
                }
            })
            .catch(err => {
                console.log(err)
            })
        }
    }, [user])

    return (
        <Wrapper>
            <Header>
                <Link to="/home/explore">TasteBuds</Link>
                {userName 
                ? <p>{`Welcome ${userName.charAt(0).toUpperCase() + userName.slice(1)}!`}</p> 
                : <p>Welcome!</p>
                }
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