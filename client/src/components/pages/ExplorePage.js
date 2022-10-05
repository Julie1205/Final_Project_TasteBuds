import styled from "styled-components";
import { useState } from "react";
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import SearchResults from "../SearchResults";

const ExplorePage = () => {
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [searchResults, setSearchResults] = useState(null);
    const [searchState, setSearchState] = useState(false);
    const [errorStatus, setErrorStatus] = useState(false);

    const handleAddressInputChange = (e) => {
        if(errorStatus) {
            setErrorStatus(false);
        }
        setAddress(e.target.value);
    };

    const handleCityInputChange = (e) => {
        if(errorStatus) {
            setErrorStatus(false);
        }
        setCity(e.target.value);
    };

    const handleSearch = () => {
        setSearchState(true);
        const addressParam = `${address.trim().toLowerCase()} ${city.trim().toLowerCase()}`;
        const uri = encodeURI(`/get-restaurants-near-me/${addressParam}`);

        fetch(uri)
        .then(res => res.json())
        .then(results => {
            if(results.status === 200) {
                setAddress("");
                setCity("");
                setSearchResults(results.data);
            }
            else {
                setSearchState(false);
                return Promise.reject(results);
            }
        })
        .catch(err => {
            setErrorStatus(true);
            console.log(err)
        })
    };

    const handleMakeNewSearch = () => {
        setSearchResults(null);
        setAddress("");
        setCity("");
        setSearchState(false);
    };

    return (
        <Wrapper>
            {!searchResults && !searchState ?    
                (<div>
                    <div>
                        <PageTitle>Explore Your area</PageTitle> 
                        <p>Enter a street address and city to find restaurants near you</p>
                    </div>
                    <InputSection>
                        <TextField 
                            id="standard-basic" 
                            label="Street Address" 
                            variant="standard" 
                            value={address}
                            onChange={handleAddressInputChange}
                        />
                        <TextField 
                            id="standard-basic" 
                            label="City" 
                            variant="standard" 
                            value={city}
                            onChange={handleCityInputChange}
                        />
                    </InputSection>

                    {
                        errorStatus
                        ? <ErrorMessage>Address not found. Please try a different address</ErrorMessage> 
                        : null
                    }

                    <SearchBtn 
                        disabled={!address || !city}
                        onClick={handleSearch}
                    >
                        Search
                    </SearchBtn>
                </div>)
            : searchResults && searchState
            ? (
                <div>
                    <SearchTitle>Restaurants Near You</SearchTitle>
                    <div>
                        {searchResults.length > 0 ?
                        <>
                            <MakeNewSearchBtn onClick={handleMakeNewSearch}>Make another search</MakeNewSearchBtn>
                            {
                                searchResults.map((restaurant) => {
                                    return <SearchResults key={`search${restaurant.id}`} restaurant={restaurant} />
                                })
                            }
                        </>
                        : <div>
                            <NoRestaurant>No Restaurants Found</NoRestaurant>
                            <NewSearchBtn onClick={handleMakeNewSearch}>Make another search</NewSearchBtn>
                        </div>}
                    </div>
                </div>
            )
            : (
                <LoadingSection>
                    <CircularProgress />
                </LoadingSection>
            )}
        </Wrapper>
    );
};

export default ExplorePage;

const Wrapper = styled.div`
    font-size: var(--body-font);
    display: flex;
    flex-direction: column;
    margin: var(--offset-top) 20px;
`;

const InputSection = styled.div`
    display: flex;
    flex-direction: column;
    margin: 20px 0;
    padding: 20px 30px 40px 30px;
    width: 50%;
    max-width: 500px;
    border: 1px solid #f0f0f0;
    border-radius: 15px;
    box-shadow: 0 2px 5px #e8e8e8;
    background-color: white;

    @media (max-width: 850px){
            width: 75%;
    }
`;

const PageTitle = styled.p`
    font-size: 2rem;
`;

const SearchBtn = styled.button`
    font-family: var(--body-font);
    font-size: 0.95rem;
    padding: 5px 10px;
    border: 1px solid #0c5a4a;
    border-radius: 10px;
    background-color: #0c5a4a;
    color: white;

    &:hover {
        cursor: pointer;
        border: 1px solid #0c5a4a;
        background-color: transparent;
        color: #0c5a4a;
    };

    &:active {
        transform: scale(0.85);
    }

    &:disabled {
        cursor: not-allowed;
    }
`;

const SearchTitle = styled(PageTitle)`
`;

const LoadingSection = styled.div`
    position: absolute;
    left: 50%;
    top: 25%;
`;

const ErrorMessage = styled.p`
    margin: 15px 0;
    color: red;
`;

const NoRestaurant = styled.p`
    margin: 20px 0;
`;

const NewSearchBtn = styled(SearchBtn)`
`;

const MakeNewSearchBtn = styled(SearchBtn)`
    margin-top: 5px;
`;
