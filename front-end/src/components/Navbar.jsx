import React from "react";
import { useAuthStore } from "../store/useAuthStore.js";
import { LogOut, MessageSquare, Settings, User, Plus ,MailOpen,ChartPie,Users} from "lucide-react";
import { Link, useLocation } from "react-router-dom";


const Navbar = () => {
  const { logout, authUser } = useAuthStore();
  const location = useLocation();


  const isActive = (path) => location.pathname === path;

  return (
    <header className="bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 backdrop-blur-lg bg-base-100/80">
      <div className="container mx-auto px-4 h-16">
        <div className="flex gap-2 justify-between h-full">
          {/* Left: Logo */}
         
            <Link
              to="/"
              className="flex items-center gap-2.5 hover:opacity-80 transition-all"
            >
              <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-primary" />
              </div>
              <h1 className="text-lg font-bold">Chatty</h1>
            </Link>
            
       



          {/* Right: Nav buttons */}
          <div className="flex items-center gap-2">
            {authUser?(<div>
               <button className="btn  btn-ghost">
                <MailOpen className="w-4 h-4"/>
              <Link to="/">
                Chats
              </Link>
            </button>
<button className="btn  btn-ghost">
  <ChartPie className="w-4 h-4"/>
              <Link to="/status">
                Statuses
              </Link>
            </button>
            <button className="btn  btn-ghost">
              <Users className="w-4 h-4"/>
              <Link to="/groups">
                Groups
              </Link>
            </button>
            </div>):(<div></div>)}
           
            <Link
              to="/settings"
              className={`btn btn-sm gap-2 transition-colors ${isActive("/settings") ? "btn-primary" : "btn-ghost"
                }`}
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Settings</span>
            </Link>

            {authUser ? (
              <div className="dropdown dropdown-end">
                <label tabIndex={0} className="btn btn-sm btn-ghost avatar gap-2">
                  <div className="w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold uppercase">

                    <img
  src={authUser.profilePic?.trim() || "/avatar1.png"}
  alt={authUser.name}
  className="size-12 object-cover rounded-full"
/>

                  </div>
                  <span className="hidden sm:inline">{authUser.username}</span>
                </label>
                <ul
                  tabIndex={0}
                  className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-48 mt-2"
                >
                  <li>
                    <Link to="/profile">
                      <User className="w-4 h-4" /> Profile
                    </Link>
                  </li>
                  <li>
                    <button onClick={logout}>
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </li>

                </ul>
              </div>
            ) : (
              <Link to="/login" className="btn btn-sm btn-primary">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
