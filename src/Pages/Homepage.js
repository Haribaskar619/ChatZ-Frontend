import React, { useEffect } from "react";
import Chat from "../chatt.png";
import "./Homepage.css";
import Login from "../components/Authentication/Login";
import Signup from "../components/Authentication/Signup";
import { useNavigate } from "react-router-dom";

function Homepage() {
  const navigate = useNavigate();

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    if (userInfo) navigate("/chats");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  return (
    <>
      <div className="row p-0 bg-light">
        <div className="col-12  col-lg-7 p-0">
          <h1 className="heading">ChatZ</h1>
          <img className="loginimg p-0" alt="chatimg" src={Chat} />
        </div>
        <div className="col-12 col-lg-4 h-100 mt-4">
          <div className="card logincard p-3 mx-4">
            <ul className="nav nav-tabs " id="myTab" role="tablist">
              <li className="nav-item" role="presentation">
                <button
                  className="nav-link active"
                  id="login-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#login"
                  type="button"
                  role="tab"
                  aria-controls="login"
                  aria-selected="true"
                >
                  Login
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className="nav-link"
                  id="signup-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#signup"
                  type="button"
                  role="tab"
                  aria-controls="signup"
                  aria-selected="true"
                >
                  Signup
                </button>
              </li>
            </ul>
            <div className="tab-content" id="myTabContent">
              <div
                className="tab-pane fade show active"
                id="login"
                role="tabpanel"
                aria-labelledby="login-tab"
              >
                <Login />
              </div>
              <div
                className="tab-pane fade"
                id="signup"
                role="tabpanel"
                aria-labelledby="signup-tab"
              >
                <Signup />
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-lg-1"></div>
      </div>
    </>
  );
}

export default Homepage;
