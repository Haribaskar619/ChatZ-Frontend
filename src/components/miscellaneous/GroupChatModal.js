import axios from "axios";
import { useState, React } from "react";
import { ChatState } from "../../Context/ChatProvider";
import UserBadgeItem from "../userAvatar/UserBadgeItem";
// import UserListItem from "../userAvatar/UserListItem";
import { ToastContainer, toast } from "react-toastify";

const GroupChatModal = ({ children }) => {
  const [groupChatName, setGroupChatName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user, chats, setChats } = ChatState();


  const handleGroup = (userToAdd) => {
    console.log(userToAdd);
    console.log(selectedUsers);
    if (selectedUsers.some((u) => u.email === userToAdd.email)) {
      toast.warning("User already added");
      return;
    }
    setSelectedUsers([...selectedUsers, userToAdd]);
    console.log(selectedUsers);
  };

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
        `http://localhost:5000/api/user?search=${search}`,
        config
      );
      console.log(data);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast.error("Error Occured!");
    }
  };


  const handleDelete = (delUser) => {
    setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
  };

  
  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers) {
      toast.warning("Please fill all the feilds");
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(
        `http://localhost:5000/api/chat/group`,
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        config
      );
      setChats([data, ...chats]);
      toast.success("New Group Chat Created!");
    } catch (error) {
      toast.error("Failed to Create the Group!");
    }
  };

  return (
    <>
      <span>{children}</span>
      <ToastContainer />
      <div
        className="modal fade"
        id="gcModal"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalLabel">
                {" "}
                Create Group Chat
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <input
                type="email"
                className="form-control mb-3"
                id="exampleFormControlInput1"
                placeholder="Enter Group Name"
                onChange={(e) => setGroupChatName(e.target.value)}
              />
              <input
                type="email"
                className="form-control mb-3"
                id="exampleFormControlInput1"
                placeholder="Add Users eg: Maddy , Dj"
                onChange={(e) => handleSearch(e.target.value)}
              />
              <div className="d-flex flex-wrap me-2 ">
                {selectedUsers.map((u) => (
                  <UserBadgeItem
                    key={u._id}
                    user={u}
                    handleFunction={() => handleDelete(u)}
                  />
                ))}
              </div>
              {loading ? (
                <div className="spinner-border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              ) : (
                <div>
                  <ol className="list-group list-group">
                    {searchResult?.slice(0, 4).map((user) => (
                      <li
                        className="list-group-item d-flex justify-content-between align-items-start"
                        key={user._id}
                        user={user}
                        onClick={() => handleGroup(user)}
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
                className="btn btn-primary"
                data-bs-dismiss="modal"
                onClick={handleSubmit}
              >
                Create Group
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default GroupChatModal;
