import axios from "axios";
import { useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import UserBadgeItem from "../userAvatar/UserBadgeItem";
// import UserListItem from "../userAvatar/UserListItem";
import { ToastContainer, toast } from "react-toastify";

const UpdateGroupChatModal = ({ fetchMessages, fetchAgain, setFetchAgain }) => {
  const [groupChatName, setGroupChatName] = useState("");
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameloading, setRenameLoading] = useState(false);

  const { selectedChat, setSelectedChat, user } = ChatState();

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(
        process.env.REACT_APP_BASE_URL+`/api/user?search=${search}`,
        config
      );
      console.log(data);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast.error("Error Occured!");
      setLoading(false);
    }
  };

  const handleRename = async () => {
    if (!groupChatName) return;

    try {
      setRenameLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        process.env.REACT_APP_BASE_URL+`/api/chat/rename`,
        {
          chatId: selectedChat._id,
          chatName: groupChatName,
        },
        config
      );

      console.log(data._id);
      // setSelectedChat("");
      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);
    } catch (error) {
      toast.error("Error Occured!");
      setRenameLoading(false);
    }
    setGroupChatName("");
  };

  const handleAddUser = async (user1) => {
    if (selectedChat.users.find((u) => u._id === user1._id)) {
      toast.error("User Already in group!");
      return;
    }

    if (selectedChat.groupAdmin._id !== user._id) {
      toast.error("Only admins can add someone!");
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        process.env.REACT_APP_BASE_URL+`/api/chat/groupadd`,
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        config
      );

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (error) {
      toast.error("Error Occured!");
      setLoading(false);
    }
    setGroupChatName("");
  };

  const handleRemove = async (user1) => {
    if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
      toast.error("Only admins can add someone!");
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.put(
        process.env.REACT_APP_BASE_URL+`/api/chat/groupremove`,
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        config
      );

      user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      fetchMessages();
      setLoading(false);
    } catch (error) {
      toast.error("Error Occured!");
      setLoading(false);
    }
    setGroupChatName("");
  };

  return (
    <>
      <i
        className="bi bi-gear-fill float-end me-4"
        data-bs-toggle="modal"
        data-bs-target="#editgcModal"
      ></i>
      <div
        className="modal fade"
        id="editgcModal"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                {selectedChat.chatName}
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body ">
              <div className="d-flex flex-wrap">
                {/* <div className="col-2"> */}
                {selectedChat.users.map((u) => (
                  <UserBadgeItem
                    key={u._id}
                    user={u}
                    admin={selectedChat.groupAdmin}
                    handleFunction={() => handleRemove(u)}
                  />
                ))}
                {/* </div> */}
                <ToastContainer />
              </div>
              <div className="input-group mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Group Name"
                  aria-describedby="basic-addon2"
                  value={groupChatName}
                  onChange={(e) => setGroupChatName(e.target.value)}
                />
                <span
                  className="input-group-text bg-success text-white"
                  id="basic-addon2"
                  onClick={() => handleRename()}
                >
                  Update
                </span>
                <ToastContainer />
              </div>
              <input
                type="text"
                className="form-control"
                placeholder="Add User to Group"
                onChange={(e) => handleSearch(e.target.value)}
              />
              <ToastContainer />
              {loading ? (
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              ) : (
                <div>
                  <ol className="list-group list-group">
                    {searchResult?.map((user) => (
                      <li
                        className="list-group-item d-flex justify-content-between align-items-start"
                        key={user._id}
                        user={user}
                        onClick={() => handleAddUser(user)}
                      >
                        <ToastContainer />
                        <span><img
                  className="bg-info rounded-circle userImgSearch"
                  src={user.pic}
                /></span>
                        <div className="ms-2 me-auto fs-5">
                          <div className="fw-bold">{user.name}</div>
                          Email: {user.email}
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => handleRemove(user)}
              >
                Leave Group
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UpdateGroupChatModal;
