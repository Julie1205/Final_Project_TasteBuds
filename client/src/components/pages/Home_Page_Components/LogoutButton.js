import { useAuth0 } from "@auth0/auth0-react";
import React from "react";
import styled from "styled-components";

const LogoutButton = () => {
    const { logout } = useAuth0();

    return (
        <LogOutBtn onClick={ () => {
            localStorage.removeItem("username");
            logout( { returnTo: "http://localhost:3000" } );
        } }
        >
            Log Out
        </LogOutBtn>
    );
};

export default LogoutButton;

const LogOutBtn = styled.button`
    font-family: var(--body-font);
    font-size: 0.95rem;
    padding: 5px 15px;
    border-radius:  12px;
    border: 1px solid #fffde6;
    background-color: transparent;
    color: #fffde6;

    &:hover {
        cursor: pointer;
        border: 1px solid #fffde6;
        background-color: #fffde6;
        color: #0c5a5a;
    };

    &:active {
        transform: scale(0.85);
    };

    @media (max-width: 850px) {
            font-size: 0.8rem;
    };
`;