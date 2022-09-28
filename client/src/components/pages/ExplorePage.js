import styled from "styled-components";

const ExplorePage = () => {
    return (
        <Wrapper>
            <p>Explore Your area. Find restaurants near you.</p>
            <div>
                <input></input>
                <button>Search</button>
            </div>
        </Wrapper>
    );
};

export default ExplorePage;

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    width: calc(100vw - 250px);
    justify-content: center;
    align-items: center;
`;