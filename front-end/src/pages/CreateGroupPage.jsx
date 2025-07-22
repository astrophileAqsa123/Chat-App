import { useState, useEffect } from "react";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

function CreateGroup() {
    const [groupName, setGroupName] = useState("");
    const [users, setUsers] = useState([]);
    const [selectedMembers, setSelectedMembers] = useState([]);
const {authUser}=useAuthStore();
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchUsers() {
            try {
                const res = await axiosInstance.get("/messages/users");
                setUsers(res.data);
            } catch (error) {
                toast.error("Failed to fetch users");
            }
        }
        fetchUsers();
    }, []);

    const handleToggleMember = (userId) => {
        if (selectedMembers.includes(userId)) {
            setSelectedMembers(selectedMembers.filter(id => id !== userId));
        } else {
            setSelectedMembers([...selectedMembers, userId]);
        }
    };

const handleSubmit = async (e) => {
    e.preventDefault();

    if (!authUser || !authUser._id) {
        toast.error("User not authenticated");
        return;
    }

    if (!groupName || selectedMembers.length === 0) {
        toast.error("Please enter group name and select members");
        return;
    }

    // Add yourself if not already included
    const updatedMembers = [...new Set([...selectedMembers, authUser._id])];

    if (updatedMembers.length < 2) {
        toast.error("Please select at least 2 members");
        return;
    }

    if (updatedMembers.length > 30) {
        toast.error("You can't add more than 30 members");
        return;
    }

    try {
        await axiosInstance.post("/groups/create", {
            name: groupName,
            members: updatedMembers
        });

        toast.success("Group created successfully!");
        navigate("/");
    } catch (err) {
        toast.error("Failed to create group");
    }
};



    return (
        <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh"
        }}>
            <div style={{
                backgroundColor: "#2b2b2b",
                padding: "30px",
                borderRadius: "10px",
                boxShadow: "0 0 10px rgba(0,0,0,0.5)",
                color: "#fff",
                width: "400px"
            }}>
                <h2>Create New Group</h2>
                <form onSubmit={handleSubmit} style={{ marginTop: "20px" }}>
                    <div style={{ marginBottom: "20px" }}>
                        <label>Group Name:</label>
                        <input
                            type="text"
                            value={groupName}
                            onChange={(e) => setGroupName(e.target.value)}
                            placeholder="Enter group name"
                            required
                            style={{
                                width: "100%",
                                padding: "10px",
                                marginTop: "5px",
                                backgroundColor: "#444",
                                color: "#fff",
                                border: "1px solid #555",
                                borderRadius: "5px"
                            }}
                        />
                    </div>
<h1 style={{color:"white"}}>You can add 30 members in Group</h1>
                    <div>
                        <h3>Select Members:</h3>
                        {users.map(user => (
                            <div key={user._id} style={{ marginTop: "10px" }}>
                                <label style={{ display: "flex", alignItems: "center",color:"#fff" }}>
                                    <input
                                        type="checkbox"
                                        checked={selectedMembers.includes(user._id)}
                                        onChange={() => handleToggleMember(user._id)}
                                        style={{ marginRight: "10px",
                                            
                                         }}
                                    />
                                    {user.email}
                                </label>
                            </div>
                        ))}
                    </div>

                    <button type="submit" style={{
                        marginTop: "20px",
                        padding: "10px 20px",
                        backgroundColor: "#FFA500",
                        color: "#000",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer"
                    }}>
                        Create Group
                    </button>
                </form>
            </div>
        </div>
    );
}

export default CreateGroup;
