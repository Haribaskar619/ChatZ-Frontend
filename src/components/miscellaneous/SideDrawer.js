import React from "react";
import { useState } from "react";
import axios from "axios";
// import ChatLoading from "../ChatLoading";
// import ProfileModal from "./ProfileModal";
import NotificationBadge from "react-notification-badge";
import { Effect } from "react-notification-badge";
import { getSender } from "../../config/ChatLogics";
// import UserListItem from "../userAvatar/UserListItem";
import { ChatState } from "../../Context/ChatProvider";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
// import UserListItem from "../userAvatar/UserListItem";

function SideDrawer() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);

  const {
    setSelectedChat,
    user,
    notification,
    setNotification,
    chats,
    setChats,
  } = ChatState();

  //   const toast = useToast();
  //   const { isOpen, onOpen, onClose } = useDisclosure();
  //   const history = useHistory();

  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    navigate("/");
  };

  const handleSearch = async () => {
    if (!search) {
      toast.warning("Please Enter something in search");
      return;
    }

    try {
      setLoading(true);
      console.log("before req", loading);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(
        process.env.REACT_APP_BASE_URL+`/api/user?search=${search}`,
        config
      );
      console.log("after req", loading);
      setLoading(false);
      console.log("after setting to false", loading);
      setSearchResult(data);
      console.log(data);
    } catch (error) {
      console.log(error);
      toast.error("Error Occured!");
    }
  };

  const accessChat = async (userId) => {
    console.log(userId);

    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(
        process.env.REACT_APP_BASE_URL+`/api/chat`,
        { userId },
        config
      );
      console.log(data, chats);
      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      setSelectedChat(data);
      setLoadingChat(false);
      //   onClose();
     
    } catch (error) {
      toast.error("Error fetching the chat");
    }
  };
  return (
    <>
      <div className="row bg-primary">
        <div className="col">
          <button
            className="btn btn-primary fs-5 ms-2"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasLeft"
            aria-controls="offcanvasLeft"
            title="Search user to chat"
          >
            Search Users <i className="bi bi-search"></i>
            {/* <img className="profileimg" src="https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg" /> */}
          </button>
          <div
            className="offcanvas offcanvas-start"
            id="offcanvasLeft"
            aria-labelledby="offcanvasLeftLabel"
          >
            <div className="offcanvas-header">
              <h5 className="offcanvas-title" id="offcanvasLeftLabel">
                <div className="input-group flex-nowrap">
                  <span className="input-group-text" id="addon-wrapping">
                    <i className="bi bi-search"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search"
                    aria-label="Search"
                    aria-describedby="addon-wrapping"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    id="button-addon2"
                    onClick={handleSearch}
                  >
                    Go
                  </button>
                  <ToastContainer />
                </div>
              </h5>

              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="offcanvas"
                aria-label="Close"
              ></button>
            </div>
            <div className="offcanvas-body">
              {loading ? (
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              ) : (
                <div>
                  <ol className="list-group list-group">
                    {searchResult?.map((user) => (
                      <li
                        className="list-group-item d-flex justify-content-between align-items-start shadow-sm p-3 mb-2 bg-body rounded li-hover"
                        key={user._id}
                        user={user}
                        onClick={() => accessChat(user._id)}
                      >
                        <span><img
                  className="bg-info rounded-circle userImgSearch"
                  src={user.pic}
                /></span>
                        <div className="ms-2 me-auto">
                          <div className="fw-bold">{user.name}</div>
                          Email: {user.email}
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>
              )}
              {loadingChat && (
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="col text-center text-white mt-2">
          <h2>ChatZ</h2>
        </div>
        <div className="col d-flex justify-content-end">
          <div
            className="btn-group"
            role="group"
            aria-label="Button group with nested dropdown"
          >
            <button
              type="button"
              className="btn btn-primary"
              data-bs-container="body"
              data-bs-toggle="popover"
              data-bs-placement="bottom"
              data-bs-content="Bottom popover"
            >
              <div class="dropdown">
                <NotificationBadge
                  count={notification.length}
                  frameLength="15.0"
                  style={{ right: "-10px" }}
                />
                <i
                  style={{ fontSize: "22px" }}
                  className="bi bi-bell-fill h-75 "
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                ></i>{" "}
                <ul class="dropdown-menu">
                  {!notification.length && "No New Messages"}
                  {notification.map((notif) => (
                    <li>
                      <a
                        class="dropdown-item"
                        key={notif._id}
                        onClick={() => {
                          setSelectedChat(notif.chat);
                          setNotification(
                            notification.filter((n) => n !== notif)
                          );
                        }}
                      >
                        {notif.chat.isGroupChat
                          ? `New Message in ${notif.chat.chatName}`
                          : `New Message from ${getSender(
                              user,
                              notif.chat.users
                            )}`}
                      </a>{" "}
                    </li>
                  ))}
                </ul>
              </div>
            </button>
            <div className="dropdown ">
              <button
                className="btn btn-primary dropdown-toggle fs-4"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <img
                  className="bg-info rounded-circle userImg"
                  src={user.pic}
                />
                {user.name}
              </button>
              <ul className="dropdown-menu">
                <li>
                  <a
                    className="dropdown-item"
                    data-bs-toggle="modal"
                    data-bs-target="#exampleModal"
                  >
                    My Profile
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" onClick={() => logoutHandler()}>
                    Logout
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div
        className="modal fade"
        id="exampleModal"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header ">
              <h4 className="modal-title " id="exampleModalLabel">
                <div className="text-center">{user.name}</div>
              </h4>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body text-center">
              <div className="row">
                <div className="col-12">
                  <img
                    className="bg-info rounded-circle userImgModal"
                    src={user.pic}
                  />
                </div>
                <div className="col-12">Email : {user.email}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SideDrawer;
