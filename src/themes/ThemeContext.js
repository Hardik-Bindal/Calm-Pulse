import React, { createContext, useContext, useMemo, useState } from "react";
import dark from "./dark";
import light from "./light";

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(false);

  const theme = useMemo(() => (isDark ? dark : light), [isDark]);
  const toggleTheme = () => setIsDark((prev) => !prev);

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}