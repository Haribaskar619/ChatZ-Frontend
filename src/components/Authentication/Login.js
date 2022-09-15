import { React, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const nvg = () => {
    navigate("/chats");
  };

  const submitHandler = async () => {
    setLoading(true);
    if (!email || !password) {
      toast.error("Please fill all the fields and try again");
      setLoading(false);
      return;
    }
    // console.log(email, password);
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.post(
        "https://hidden-inlet-68415.herokuapp.com/api/user/login",
        { email, password },
        config
      );
      console.log(data);
      toast.success("Login Succesful");
      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      nvg();
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong , Please try again");
      setLoading(false);
    }
  };

  return (
    <>
      <div className="row mb-3">
        <label className="form-label mt-4">Email</label>
        <input
          type="email"
          className="form-control"
          placeholder="Enter Your Email Address"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
        <label className="form-label mt-4">Password</label>
        <input
          type="password"
          className="form-control"
          placeholder="Enter Your Password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />
        <div className="col-12 mt-4  d-flex justify-content-center">
          <button
            type="button"
            className="btn btn-primary btn-lg btn-block w-100"
            onClick={() => submitHandler()}
          >
            {loading ? (
              <div className="spinner-border" role="status">
                <span className="sr-only"></span>
              </div>
            ) : (
              "Login"
            )}
          </button>
          <ToastContainer />
        </div>
      </div>
    </>
  );
}

export default Login;
