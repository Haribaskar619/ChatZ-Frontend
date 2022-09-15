import { React, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [confirmpassword, setConfirmpassword] = useState("");
  const [password, setPassword] = useState("");
  const [pic, setPic] = useState();
  const [picLoading, setPicLoading] = useState(false);

  const submitHandler = async () => {
    setPicLoading(true);
    if (!name || !email || !password || !confirmpassword) {
      toast.warning("Please fill all the fileds");
      setPicLoading(false);
      return;
    }
    if (password !== confirmpassword) {
      toast.error("Password Doesn't match , Try again");
      return;
    }
    //   console.log(name, email, password, pic);
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.post(
        "http://localhost:5000/api/user",
        {
          name,
          email,
          password,
          pic,
        },
        config
      );
      if (data) {
        setName("");
        setEmail("");
        setPassword("");
        setConfirmpassword("");

        toast.success(
          "User Registration successful , Please Login to continue"
        );
        localStorage.setItem("userInfo", JSON.stringify(data));
        navigate("/chats");
      } else {
        setPicLoading(false);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error Occured");
      setPicLoading(false);
    }
  };

  const postDetails = (pics) => {
    setPicLoading(true);
    if (pics === undefined) {
      toast.warning("Please select an image");
      return;
    }
    console.log(pics);
    if (pics.type === "image/jpeg" || pics.type === "image/png") {
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "aeuija1a");
      data.append("cloud_name", "droo5takp");
      fetch("https://api.cloudinary.com/v1_1/droo5takp/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setPic(data.url.toString());
          console.log(data.url.toString());
          setPicLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setPicLoading(false);
        });
    } else {
      toast.error("Please select an image");
      setPicLoading(false);
      return;
    }
  };

  return (
    <>
      <div className="row mb-3">
        <label className="form-label mt-2">Name</label>
        <input
          type="name"
          className="form-control"
          placeholder="Enter Your Name"
          onChange={(e) => setName(e.target.value)}
          value={name}
        />
        <label className="form-label mt-2">Email</label>
        <input
          type="email"
          className="form-control"
          placeholder="Enter Your Email Address"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
        <label className="form-label mt-2">Password</label>
        <input
          type="password"
          className="form-control"
          placeholder="Enter Your Password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />
        <label className="form-label mt-2">Confirm Password</label>
        <input
          type="password"
          className="form-control"
          placeholder="Confirm Password"
          onChange={(e) => setConfirmpassword(e.target.value)}
          value={confirmpassword}
        />
        <div className="mb-3">
          <label className="form-label mt-2">Choose Profile Picture</label>
          <input
            className="form-control"
            type="file"
            id="formFile"
            onChange={(e) => postDetails(e.target.files[0])}
          />
        </div>
        <div className="col-12 mt-4  d-flex justify-content-center">
          <button
            type="submit"
            className="btn btn-primary btn-lg btn-block w-100"
            onClick={() => submitHandler()}
          >
            Signup & Login
          </button>
          <ToastContainer />
        </div>
      </div>
    </>
  );
}

export default Signup;
