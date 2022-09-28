import { BrowserRouter, Routes, Route } from "react-router-dom";
import GlobalStyles from "./components/GlobalStyles";
import LandingPage from "./components/pages/LandingPage";
import HomePage from "./components/pages/HomePage";
import MyRestaurantsPage from "./components/pages/MyRestaurantsPage";
import ExplorePage from "./components/pages/ExplorePage";
import RestaurantsByCategoryPage from "./components/pages/RestaurantsByCategoryPage";

const App = () => {

  return (
    <BrowserRouter>
    <GlobalStyles/>
      <Routes>
        <Route path="/" element={<LandingPage />}/>
        <Route path="/home" element={<HomePage />}>
          <Route path="explore" element={<ExplorePage />} />
          <Route path="myRestaurants" element={<MyRestaurantsPage />} />
          <Route path="myRestaurants/:category" element={<RestaurantsByCategoryPage />} />
          <Route path="myRestaurants/:id" element={<>Restaurants page</>} />
          <Route path="AddRestaurant" element={<>add a restaurant</>}/>
          <Route path="*" element={<p>Page not found</p>} />
        </Route> 
        <Route path="*" element={<p>Page not found</p>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
