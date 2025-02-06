"use client"
import { createContext, useContext, useState } from "react";

const ClubContext = createContext();

export function ClubProvider({ children }) {
  const [clubName, setClubName] = useState(null);

  return (
    <ClubContext.Provider value={[clubName, setClubName]}>
      {children}
    </ClubContext.Provider>
  );
}

export function useClub() {
  const context = useContext(ClubContext);
  if (!context) {
    throw new Error("useClub must be used within a ClubProvider");
  }
  return context;
}

