import { ThemeContext } from 'contexts/themeContext'
import { useContext } from 'react'

import { ThemeOption } from 'constants/theme/theme-option'

export default function Logo({ height }: { height?: number }) {
  const { forThemeOption } = useContext(ThemeContext)

  if (!height) {
    height = 40
  }

  return (
    <img    
      style={{ height, borderRadius:height / 2 }}      
      src={
        forThemeOption &&
        forThemeOption({
          [ThemeOption.light]: '/assets/candy_logo-ol.png',
          [ThemeOption.dark]: '/assets/candy_logo-od.png',
        })
      }
      alt="Candybox logo"
    />
  )
}
