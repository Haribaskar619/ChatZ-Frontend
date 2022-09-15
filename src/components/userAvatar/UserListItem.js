import React from "react";
import { ChatState } from "../../Context/ChatProvider";

function UserListItem({ handleFunction }) {
  const { user } = ChatState();
  console.log(user);
  return (
    <>
      <div>
        <ol class="list-group list-group-numbered">
          <li
            class="list-group-item d-flex justify-content-between align-items-start"
            onClick={handleFunction}
          >
            <div class="ms-2 me-auto">
              <div class="fw-bold">{user.name}</div>
              Email: {user.email}
            </div>
            <span class="badge bg-primary rounded-pill">14</span>
          </li>
        </ol>
      </div>
    </>
  );
}

export default UserListItem;
