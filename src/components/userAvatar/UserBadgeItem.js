const UserBadgeItem = ({ user, handleFunction, admin }) => {
  return (
    <>
      <div className="d-flex flex-wrap">
        <span className="badge text-bg-primary p-2 mb-2 me-2 " onClick={handleFunction}>
          {" "}
          {user.name} {admin === user._id && <span> (Admin)</span>}
          <b style={{fontSize: "15px"}}>x</b>
        </span>
        
      </div>
    </>
  );
};

export default UserBadgeItem;
