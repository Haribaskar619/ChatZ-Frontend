import { React, useState } from "react";
import SideDrawer from "../components/miscellaneous/SideDrawer";
import MyChats from "../components/MyChats";
import Chatbox from "../components/Chatbox";
import { ChatState } from "../Context/ChatProvider";

function Chatpage() {
  const [fetchAgain, setFetchAgain] = useState(false);
  const { user } = ChatState();

  return (
    <>
        <SideDrawer />
        <div className="row bg-light">
          
          <div style={{height:"87vh"}} className="col-12  col-lg-3 ms-5  mt-3 shadow  mb-5 bg-body rounded ">
            {user && <MyChats   fetchAgain={fetchAgain} />}
          </div>
          
          <div style={{height:"87vh"}} className="col-12  col-lg-8 ms-4  mt-3 shadow mb-5 bg-body rounded ">
            {user && (
              <Chatbox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
            )}
          </div>
        </div>
    </>
  );
}
export default Chatpage;
