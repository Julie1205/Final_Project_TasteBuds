import { Outlet, useNavigate, useLocation, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import styled from "styled-components";
import NavigationSideBar from "../NavigationSideBar";
import LogoutButton from "../LogoutButton";
import Logo from "../../assets/Logo2.png";
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
            fetch(`/get-user/${ user.email }`)
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
                <LogoLink to="/home/explore">
                    <LogoImg src={ Logo } alt="TasteBud Logo"/>
                    <AppName>TasteBuds</AppName>
                </LogoLink>
                <WelcomeMessage>
                    {userName 
                    ? <p>{ `Welcome ${ userName.charAt(0).toUpperCase() + userName.slice(1) }!` }</p> 
                    : <p>Welcome!</p>
                    }
                </WelcomeMessage>
                <LogOutSection>
                    <LogoutButton/>
                </LogOutSection>
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
    font-family: var(--body-font);
    display: grid;
    grid-template-rows: 100px calc(100vh - 100px);

    @media (max-width: 850px) {
        grid-template-rows: 75px calc(100vh - 75px);
    };
`;

const Header = styled.div`
    display: grid;
    grid-template-columns: 25% 50% 25%;
    align-items: center;
    justify-content: center;
    background-color: #0c5a5a;
    padding: 10px;
`;

const Content = styled.div`
    display: grid;
    grid-template-columns: 215px calc(100vw - 250px);

    @media (max-width: 850px) {
        grid-template-columns: 15% 85%;
    };
`;

const LogoImg = styled.img`
    width: 20%;
    max-width: 100px;
    min-width: 60px;
`;

const LogoLink = styled(Link)`
    display: flex;
    align-items: center;
    width: 40vw;
    text-decoration: none;

    @media (max-width: 850px) {
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;
    };

`;

const AppName = styled.p`
    font-family: 'Fredoka One', cursive;
    font-size: 1.3rem;
    color: #fffde6;

    @media (max-width: 850px) {
            font-size: 0.75rem;
    };
`;

const WelcomeMessage = styled.div`
    text-align: center;
    font-family: var(--body-font);
    font-size: 1.2rem;
    color: #fffde6;
`;

const LogOutSection = styled.div`
    display: flex;
    justify-content: flex-end;
    margin-right: 15px;
`;