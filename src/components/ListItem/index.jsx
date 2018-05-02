import React from "react";

const ListItem = ({ travelDestinations }) =>
  travelDestinations.map((travel, index) => {
    return (
      <li key={index}>
        <span>{travel.destination}</span>
      </li>
    );
  });

export default ListItem;
