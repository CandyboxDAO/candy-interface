import { ThemeContext } from 'contexts/themeContext'
import { useCandyTheme } from 'hooks/CandyTheme'
import { ChildElems } from 'models/child-elems'

export default function ThemeProvider({ children }: { children: ChildElems }) {
  const candyTheme = useCandyTheme()

  return (
    <ThemeContext.Provider value={candyTheme}>{children}</ThemeContext.Provider>
  )
}
