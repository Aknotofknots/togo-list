import React from "react";

const ListItem = ({ travelDestinations }) =>
  travelDestinations.map((travel, index) => {
    return <li key={index}> {travel.destination}</li>;
  });

export default ListItem;
