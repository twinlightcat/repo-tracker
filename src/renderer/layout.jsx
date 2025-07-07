import React from "react";

function Layout(props) {
  return (
    <div id="layout" className="bg-gray-50 p-10 min-h-screen">
      {props.children}
    </div>
  );
}

export default Layout;
