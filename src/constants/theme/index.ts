import { SemanticTheme } from 'models/semantic-theme/theme'

import { ThemeOption } from 'constants/theme/theme-option'

import { candyThemeColors } from './colors'
import { candyRadii } from './radius'

export const candyTheme = (themeOption: ThemeOption): SemanticTheme => ({
  colors: candyThemeColors(themeOption),
  radii: candyRadii,
})
