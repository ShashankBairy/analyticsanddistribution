import React, { createContext, useContext, useState } from "react";

const SelectedEntityContext = createContext();

export const SelectedEntityProvider = ({ children }) => {
  const [selectedEntity, setSelectedEntity] = useState({
    id: null,
    name: null,
    type: null, // 'zone', 'dgm', or 'campus'
  });
 
  const [selectedAmount, setSelectedAmount] = useState(null); // Amount filter for graphs

  const selectEntity = (id, name, type) => {
    console.log("=== CONTEXT: selectEntity called ===");
    console.log("ID:", id, "Name:", name, "Type:", type);
    setSelectedEntity({ id, name, type });
  };

  const clearSelection = () => {
    console.log("=== CONTEXT: clearSelection called ===");
    setSelectedEntity({ id: null, name: null, type: null });
  };
 
  const setAmount = (amount) => {
    console.log("=== CONTEXT: setAmount called ===");
    console.log("Amount:", amount);
    setSelectedAmount(amount);
  };
 
  const clearAmount = () => {
    console.log("=== CONTEXT: clearAmount called ===");
    setSelectedAmount(null);
  };

  return (
    <SelectedEntityContext.Provider
      value={{
        selectedEntity,
        selectEntity,
        clearSelection,
        selectedAmount,
        setAmount,
        clearAmount
      }}
    >
      {children}
    </SelectedEntityContext.Provider>
  );
};

export const useSelectedEntity = () => {
  const context = useContext(SelectedEntityContext);
  if (!context) {
    throw new Error(
      "useSelectedEntity must be used within a SelectedEntityProvider"
    );
  }
  return context;
};