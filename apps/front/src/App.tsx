import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Searchbar from "./components/searchbar";
import Navbar from "./components/navbar";
import Jobs_index from "./components/jobs_index";
import Companies_index from "./components/companies_index";
import List from "./components/Dashboard";
import "./style/App.css";
import UserProfile from "./components/userProfile";
import { useState } from "react";

import { useAuth } from "./components/AuthContext";
import CompanyProfile from "./components/CompanyProfile";

function App() {
  const [requete, setRequete] = useState<string>("");
  const { user } = useAuth();

  return (
    <Router>
      <Navbar />
      <Searchbar requete={requete} setRequete={setRequete} />

      <Routes>
        <Route path="/" element={<Jobs_index requete={requete} />} />
        <Route
          path="/companies"
          element={<Companies_index requete={requete} />}
        />
        <Route path="/admin" element={<List />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/company/profile" element={<CompanyProfile />} />
      </Routes>
    </Router>
  );
}

export default App;
