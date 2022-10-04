import { BrowserRouter, Routes, Route } from "react-router-dom";

import GlobalStyles from "./components/GlobalStyles";
import LandingPage from "./components/pages/LandingPage";
import HomePage from "./components/pages/HomePage";
import MyRestaurantsPage from "./components/pages/MyRestaurantsPage";
import ExplorePage from "./components/pages/ExplorePage";
import RestaurantsByCategoryPage from "./components/pages/RestaurantsByCategoryPage";
import AddRestaurantPage from "./components/pages/AddRestaurantPage";
import FindARestaurantPage from "./components/pages/FindARestaurantPage";
import RestaurantDetailsPage from "./components/pages/RestaurantDetailsPage"
import EditRestaurantPage from "./components/pages/EditRestaurantPage";

const App = () => {

  return (
    <BrowserRouter>
    <GlobalStyles/>
      <Routes>
        <Route path="/" element={<LandingPage />}/>
        <Route path="/home" element={<HomePage />}>
          <Route path="explore" element={<ExplorePage />} />
          <Route path="myRestaurants" element={<MyRestaurantsPage />} >
            <Route path=":category" element={<RestaurantsByCategoryPage />} />
          </Route>
          <Route path="restaurant/:id" element={<RestaurantDetailsPage/>} />
          <Route path="restaurant/edit/:id" element={<EditRestaurantPage/>} />
          <Route path="addRestaurant" element={<AddRestaurantPage />}/>
          <Route path="findARestaurant" element={<FindARestaurantPage />}/>
          <Route path="*" element={<p>Page not found</p>} />
        </Route> 
        <Route path="*" element={<p>Page not found</p>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
