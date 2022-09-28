import { useAuth0 } from "@auth0/auth0-react";
import React from "react";
import styled from "styled-components";

const ProfilePage = () => {
    const { user, isAuthenticated, isLoading } = useAuth0();

    if (isLoading) {
    return <div>Loading ...</div>;
    }

    return (
    isAuthenticated && (
        <Wrapper>
            <img src={user.picture} alt={user.name} />
            <h2>{user.name}</h2>
            <p>{user.email}</p>
        </Wrapper>
    )
    );
};

export default ProfilePage;

const Wrapper = styled.div`
    margin-top: var(--offset-top);
    font-size: var(--body-font);
`;