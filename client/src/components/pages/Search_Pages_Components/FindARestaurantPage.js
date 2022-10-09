import styled from "styled-components";
import { useState } from "react";
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import SearchResults from "./SearchResults";
import Map from "../../Map_Components/Map";

const FindARestaurantPage = () => {
    const [restaurantName, setRestaurantName] = useState("");
    const [city, setCity] = useState("");
    const [street, setStreet] = useState("");
    const [searchResults, setSearchResults] = useState(null);
    const [searchState, setSearchState] = useState(false);
    const [errorStatus, setErrorStatus] = useState(false);
    const [mapStatus, setMapStatus] = useState(false);
    const [geoCoordinates, setGeoCoortinates] = useState([]);

    const handleAddressInputChange = (e) => {
        if(errorStatus) {
            setErrorStatus(false);
        }
        setStreet(e.target.value);
    };
    
    const handleRestaurantNameInputChange = (e) => {
        if(errorStatus) {
            setErrorStatus(false);
        }
        setRestaurantName(e.target.value);
    };

    const handleCityInputChange = (e) => {
        if(errorStatus) {
            setErrorStatus(false);
        }
        setCity(e.target.value);
    };

    const handleSearch = () => {
        setSearchState(true);
        const restaurantNameParam = `${ restaurantName.trim().toLowerCase() }`;
        const cityParam = `${ city.trim().toLowerCase() }`;
        const streetParam = `${ street.trim().toLowerCase() }`;

        const uri = encodeURI(`/get-find-restaurant/${ restaurantNameParam }/${ cityParam }?street=${ streetParam }`);
        fetch(uri)
        .then(res => res.json())
        .then(results => {
            if(results.status === 200) {
                setRestaurantName("");
                setCity("");
                setStreet("");
                setGeoCoortinates( [results.data[0].location.lat, results.data[0].location.lng] )
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
        setGeoCoortinates([]);
        setMapStatus(false);
        setSearchResults(null);
        setRestaurantName("");
        setCity("");
        setStreet("");
        setSearchState(false);
    };

    return (
        <Wrapper>
            <PageTitle>Find a Restaurant</PageTitle>
            <SecondTextLine>Search for a restaurant by name and city</SecondTextLine>
            { !searchResults && !searchState ?    
                (<div>
                    <InputSection>
                        <TextField 
                            id="restaurantName" 
                            label="Restaurant Name" 
                            variant="standard" 
                            value={ restaurantName }
                            onChange={ handleRestaurantNameInputChange }
                        />
                        <TextField 
                            id="city" 
                            label="City" 
                            variant="standard" 
                            value={ city }
                            onChange={ handleCityInputChange }
                        />
                            <TextField 
                            id="streetName" 
                            label="Street Name (optional)" 
                            variant="standard" 
                            value={ street }
                            onChange={ handleAddressInputChange }
                        />
                    </InputSection>

                    { errorStatus 
                    ? <ErrorMessage>Could not find restaurant.</ErrorMessage> 
                    : null
                    }

                    <SearchBtn 
                        disabled={ !restaurantName || !city }
                        onClick={ handleSearch }
                    >
                        Search
                    </SearchBtn>
                </div>)
            : searchResults && searchState
            ? (
                <div>
                    <MakeNewSearchBtn onClick={ handleMakeNewSearch }>Make another search</MakeNewSearchBtn>
                    { mapStatus 
                        ? <>
                            <ListViewBtn onClick={ () => setMapStatus(false) }>View List</ListViewBtn>
                            <Map restaurants={searchResults} geoCoordinates={geoCoordinates}/>
                        </>
                        : <>
                            <MapViewBtn onClick={ () => setMapStatus(true) }>View Map</MapViewBtn>
                            {
                                searchResults.map((restaurant) => {
                                    return <SearchResults key={ `search${ restaurant.id }` } restaurant={ restaurant } />
                                })
                            }
                        </>
                    }
                </div>
            )
            : (
                <LoadingSection>
                    <CircularProgress />
                </LoadingSection>
            )}
        </Wrapper>
    )
};

export default FindARestaurantPage;

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

    @media (max-width: 850px) {
        width: 75%;
    };
`;

const PageTitle = styled.p`
    font-size: 2rem;
`;

const LoadingSection = styled.div`
    display: flex;
    justify-content: center;
    margin-top: 15%;
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

const MakeNewSearchBtn = styled(SearchBtn)`
    margin-top: 5px;
`;

const ErrorMessage = styled.p`
    margin: 15px 0;
    color: red;
`;

const SecondTextLine = styled.p`
    font-size: 1.1rem;
`;

const MapViewBtn = styled(SearchBtn)`
    margin-left: 10px;
`;

const ListViewBtn = styled(SearchBtn)`
    margin: 0 0 10px 10px;
`;