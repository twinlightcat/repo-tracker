import React from "react";

interface CardProps {
  children: React.ReactNode;
}

export default function Card(props: CardProps) {
  return (
    <div className="p-5 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
      {props.children}
    </div>
  );
}
