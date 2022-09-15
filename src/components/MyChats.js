import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { useEffect, useState } from "react";
import { getSender } from "../config/ChatLogics";
// import ChatLoading from "./ChatLoading";
// import GroupChatModal from "./miscellaneous/GroupChatModal";

import { ChatState } from "../Context/ChatProvider";
import GroupChatModal from "./miscellaneous/GroupChatModal";

const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();

  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();

  const fetchChats = async () => {
    setTimeout(async () => {
      console.log(user);
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        };

        const { data } = await axios.get(
        "https://hidden-inlet-68415.herokuapp.com/api/chat",
          config
        );
        setChats(data);
      } catch (error) {
        toast.error("Error Occured!");
      }
    }, 1000);
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
    // eslint-disable-next-line
  }, [fetchAgain]);

  return (
    <>
      <div className="row p-3 " >
        <div className="col-12 d-flex">
          <div className="col-6">
            <h2>My Chats</h2>
          </div>
          <div className="col-6">
            <button
              type="button"
              className="btn btn-primary "
              data-bs-toggle="modal"
              data-bs-target="#gcModal"
            >
              Group Chat
    
              <i className="bi bi-plus-lg ms-2"></i>
            </button>
            <GroupChatModal />
          </div>
        </div>
      </div>
      <div style={{height: "85%" , overflow:"auto"}} className="row">
      <div className="col">

        {chats ? (
          <ol className="list-group list-group p-3">
            {chats.map((chat) => (
              <li
                className="bg-light list-group-item d-flex justify-content-between align-items-start shadow-sm p-2 mb-3  rounded "
                key={chat._id}
                onClick={() => setSelectedChat(chat)}
              >
                <div className="row">
                  <div className="col-12">
                    {" "}
                    <h4>
                      {!chat.isGroupChat
                        ? getSender(loggedUser, chat.users)
                        : chat.chatName}
                    </h4>
                  </div>
                  <div className="col-12">
                    {" "}
                    {chat.latestMessage && (
                      <b>
                        <b>{chat.latestMessage.sender.name} : </b>
                        
                        {chat.latestMessage.content.length > 50
                          ? chat.latestMessage.content.substring(0, 51) + "..."
                          : chat.latestMessage.content }   
                      </b>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ol>
        ) : (
          "loading"
        )}
      </div>
      </div>
    </>
  );
};

export default MyChats;
