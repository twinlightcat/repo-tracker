import React from "react";
import Profile from "./components/content/profile";

function Layout(props) {
  return (
    <div id="layout" className="bg-gray-50 p-10 min-h-screen">
      <div className="flex justify-end">
        <Profile />
      </div>
      {props.children}
    </div>
  );
}

export default Layout;
