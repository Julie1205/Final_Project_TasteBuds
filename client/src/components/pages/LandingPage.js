import styled from "styled-components";

import LoginButton from "../LoginButton";

const LandingPage = () => {
    return (
        <Wrapper>
            <p>Logo</p>
            <p>TasteBuds</p>
            <LoginButton/>
        </Wrapper>
    )
};

export default LandingPage;

const Wrapper = styled.div`
    height: 100vh;
    font-size: var(--body-font);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;