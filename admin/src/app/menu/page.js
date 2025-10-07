"use client";
import React, { useState } from "react";

export default function page() {
  const [menu, setMenu] = useState([]);
  return (
    <div>
      {menu.length > 0 ? (
        <div>
          {menu.map((m, i) => {
            <div key={i}>
              <h1>{m.name}</h1>
            </div>;
          })}
        </div>
      ) : (
        "Nothing can be found"
      )}
    </div>
  );
}
