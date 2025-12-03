import React, { useEffect, useState } from "react";
import "../style/userProfile.css";
import userPlaceholder from "../assets/images/user.png";

type User = {
  firstname: string;
  lastname: string;
  avatar?: string;
  email: string;
  password: string;
  description?: string;
};

const UserProfile = () => {
  const [data, setData] = useState<User | null>(null);

  async function fetchData() {
    const res = await fetch(`/api/users/profile`);
    const data = await res.json();
    setData(data);
  }
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="user-profile">
      <div className="avatar">
        {data?.avatar ? (
          <img src={data.avatar} alt="Avatar" className="img-responsive" />
        ) : (
          <img
            src={userPlaceholder}
            alt="Avatar par défaut"
            className="img-responsive"
          />
        )}
        <p className="role">User</p>
      </div>
      <div className="user-details">
        <div className="user-name">
          <p>{data?.firstname}</p>
          <p>{data?.lastname}</p>
        </div>
        <p>About me</p> <hr className="separator" />{" "}
        <p className="user-description">{data?.description}</p>
        <p>Email</p> <hr className="separator-2" />{" "}
        <p className="user-email">{data?.email}</p>
        <p>CV</p>
        <hr className="separator-3" />
        <label className="cv-label" htmlFor="cv-upload">
          Importer un CV
        </label>
        <input id="cv-upload" type="file" />
      </div>
    </div>
  );
};

export default UserProfile;
