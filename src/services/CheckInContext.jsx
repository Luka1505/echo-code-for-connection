import { createContext, useContext, useState } from 'react';

const CheckInContext = createContext(null);

export function CheckInProvider({ children }) {
  const [entry, setEntry] = useState(null);

  return (
    <CheckInContext.Provider value={{ entry, setEntry }}>
      {children}
    </CheckInContext.Provider>
  );
}

export function useCheckIn() {
  const ctx = useContext(CheckInContext);
  if (!ctx) {
    throw new Error('useCheckIn must be used within a CheckInProvider');
  }
  return ctx;
}

