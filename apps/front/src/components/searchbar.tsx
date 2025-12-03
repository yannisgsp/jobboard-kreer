import React from "react";
import "../style/searchbar.css";

interface SearchBarProps {
  requete: string;
  setRequete: (value: string) => void;
}

const Searchbar: React.FC<SearchBarProps> = ({ requete, setRequete }) => {
  return (
    <div>
      <input
        type="text"
        placeholder="  Find your dream job or your goal company"
        value={requete}
        onChange={(e) => setRequete(e.target.value)}
        className="searchbar-div"
      />
    </div>
  );
};

export default Searchbar;
