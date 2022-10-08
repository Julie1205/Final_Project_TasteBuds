import { useAuth0 } from "@auth0/auth0-react";
import React from "react";
import styled from "styled-components";

const LoginButton = () => {
    const { loginWithRedirect } = useAuth0();

    return <EnterBtn onClick={ () => loginWithRedirect() }>Enter</EnterBtn>;
};

export default LoginButton;

const EnterBtn = styled.button`
    font-family: var(--body-font);
    font-size: 1.3rem;
    font-weight: bold;
    padding: 5px 15px;
    border: none;
    border-radius:  12px;
    border: 1px solid #fffde6;
    background-color: transparent;
    color: #fffde6;

    &:hover {
        cursor: pointer;
        border: 1px solid #fffde6;
        background-color: #fffde6;
        color: #062d2d;
    };

    &:active {
        transform: scale(0.85);
    };
`;