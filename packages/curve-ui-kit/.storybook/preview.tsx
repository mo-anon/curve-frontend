import { Card, Container, CssBaseline, ThemeProvider } from '@mui/material'
import { withThemeFromJSXProvider } from '@storybook/addon-themes'
import type { Decorator, Preview, ReactRenderer } from '@storybook/react'
import { chadTheme, darkTheme, lightTheme } from '../src/themes'
import { monaSans, hubotSans } from '../src/themes/typography/fonts'
import { DocsContainer } from '@storybook/blocks'
import Box from '@mui/material/Box'

const themes = {
  light: lightTheme,
  dark: darkTheme,
  chad: chadTheme,
}

export const decorators: Decorator[] = [
  withThemeFromJSXProvider<ReactRenderer>({
    themes,
    defaultTheme: 'light',
    Provider: ThemeProvider,
    GlobalStyles: CssBaseline,
  }),
  (Story) => (
    <>
      <style>
        {`
        @font-face {
          font-family: ${monaSans.style.fontFamily};
          font-style: normal;
          font-display: swap;
          font-weight: 400;
          src: url('fonts/Mona-Sans.woff2') format('woff2');
          unicodeRange: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF;
        }
        @font-face {
          font-family: ${hubotSans.style.fontFamily};
          font-style: normal;
          font-display: swap;
          font-weight: 400;
          src: url('fonts/Hubot-Sans.woff2') format('woff2');
          unicodeRange: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF;
        }`}
      </style>
      <Story />
    </>
  )
]

const preview: Preview = {
  decorators: decorators,
  parameters: {
    themes,
    controls: {
      expanded: true, // Adds the description and default columns
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    docs: {
      // Implement a custom docs container that applies the theme at the root level.
      // Workaround for: https://github.com/storybookjs/storybook/issues/26242
      container: ({ children, context }) => {
        const theme = context.store.userGlobals.globals.theme
        return (
          <DocsContainer context={context}>
            <ThemeProvider theme={themes[theme]}>
              <Box sx={{ '& .docs-story': { backgroundColor: 'background.paper' } }}>
                {children}
              </Box>
            </ThemeProvider>
          </DocsContainer>
        )
      },
    },
    layout: 'centered',
  },
  tags: ['autodocs'],
}

export default preview
