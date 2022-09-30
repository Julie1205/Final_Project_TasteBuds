import styled from "styled-components";

const AddRestaurantPage = () => {

    return (
        <Wrapper>
            <div>
                <input></input>
                <button>Submit</button>
                <button>Cancel</button>
            </div>
        </Wrapper>
    );
};

export default AddRestaurantPage;

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    width: calc(100vw - 250px);
    justify-content: center;
    align-items: center;
    font-size: var(--body-font);
    margin-top: var(--offset-top);
`;