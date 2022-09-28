import styled from "styled-components";
import { useState } from "react";

const AddRestaurantPage = () => {
    const [manualForm, setManualForm] = useState(false);
    const [searchForm, setSearchForm] = useState(false);

    return (
        <Wrapper>
            <p>Add a new restaurant.</p>
            {!manualForm && !searchForm ? <div>
                <button onClick={() => setManualForm(true)}>Add Manually</button>
                <button onClick={() => setSearchForm(true)}>Search for restaurant</button>
            </div> : null}
            {searchForm ? (<div>
                <input></input>
                <button>Search</button>
                <button onClick={() => setSearchForm(false)}>Cancel Search</button>
            </div>) : null}
            {manualForm ? (<div>
                <input></input>
                <button>Submit</button>
                <button onClick={() => setManualForm(false)}>Cancel</button>
            </div>) : null}
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
`;