import { createTheme } from '@mantine/core';

export const theme = createTheme({
  fontFamily: 'Poppins, sans-serif',
  
  // We'll keep our custom primary color
  primaryColor: 'blue',
  colors: {
    blue: [
      "#e7f5ff", "#d0ebff", "#a5d8ff", "#74c0fc",
      "#4dabf7", "#339af0", "#228be6", "#1c7ed6",
      "#1971c2", "#1864ab"
    ],
  },

  // This is the key change for a better light mode
  // We'll set a default background color for the entire app
  // and add shadows to our Paper/Card components.
  other: {
    appBodyBg: (theme) => theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
  },
  
  components: {
    Paper: {
      defaultProps: {
        shadow: 'sm',
        withBorder: true,
      },
    },
    Card: {
      defaultProps: {
        shadow: 'sm',
        withBorder: true,
      },
    },
  },
});