import styled from "styled-components";
import { ImSad } from "react-icons/im";

const PageNotFound = () => {
    return (
        <Wrapper>
            <p>
                Page Not Found
            </p>
            <Icon>
                <ImSad/>
            </Icon>
        </Wrapper>
    )
};

export default PageNotFound;

const Wrapper = styled.div`
    font-family: var(--body-font);
    font-size: 2rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: #0c5a5a
`;

const Icon = styled.p`
    margin-top: 10px;
`;