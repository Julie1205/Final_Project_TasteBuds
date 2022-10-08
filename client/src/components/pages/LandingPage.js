import styled from "styled-components";
import Logo from "../../assets/Logo2.png";
import LoginButton from "../LoginButton";

const LandingPage = () => {
    return (
        <Wrapper>
            <img src={ Logo } alt="TasteBud Logo"/>
            <AppName>TasteBuds</AppName>
            <Slogan>Where are we eating?</Slogan>
            <LoginButton/>
        </Wrapper>
    )
};

export default LandingPage;

const Wrapper = styled.div`
    font-family: 'Fredoka One', cursive;
    height: 100vh;
    font-size: var(--body-font);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background-color: #062d2d;
`;

const AppName = styled.p`
    font-size: 2.2rem;
    color: #FFF89A;
    text-shadow: 2px 2px 0px #4f0b0b;
`;

const Slogan = styled.p`
    font-size: 1.2rem;
    margin-bottom: 15px;
    color: #FFF89A;
`;