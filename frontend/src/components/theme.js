import { createTheme, responsiveFontSizes } from '@mui/material/styles';

// Base font sizes for different settings
const fontSizes = {
  small: {
    h1: '2.5rem',
    h2: '2rem',
    h3: '1.75rem',
    h4: '1.5rem',
    h5: '1.25rem',
    h6: '1rem',
    body1: '0.875rem',
    body2: '0.8rem',
    button: '0.875rem',
  },
  medium: {
    h1: '2.75rem',
    h2: '2.25rem',
    h3: '1.875rem',
    h4: '1.625rem',
    h5: '1.375rem',
    h6: '1.125rem',
    body1: '1rem',
    body2: '0.875rem',
    button: '1rem',
  },
  large: {
    h1: '3rem',
    h2: '2.5rem',
    h3: '2.125rem',
    h4: '1.75rem',
    h5: '1.5rem',
    h6: '1.25rem',
    body1: '1.125rem',
    body2: '1rem',
    button: '1.125rem',
  },
};

// Color palettes for different modes
const lightPalette = {
  primary: {
    main: '#2196F3',
    light: '#64B5F6',
    dark: '#1976D2',
    contrastText: '#FFFFFF',
  },
  secondary: {
    main: '#F50057',
    light: '#FF4081',
    dark: '#C51162',
    contrastText: '#FFFFFF',
  },
  background: {
    default: '#F5F5F5',
    paper: '#FFFFFF',
  },
  text: {
    primary: '#212121',
    secondary: '#757575',
    disabled: '#9E9E9E',
  },
};

const darkPalette = {
  primary: {
    main: '#90CAF9',
    light: '#BBDEFB',
    dark: '#42A5F5',
    contrastText: '#000000',
  },
  secondary: {
    main: '#FF80AB',
    light: '#FF99BC',
    dark: '#F06292',
    contrastText: '#000000',
  },
  background: {
    default: '#121212',
    paper: '#1E1E1E',
  },
  text: {
    primary: '#FFFFFF',
    secondary: '#B0B0B0',
    disabled: '#707070',
  },
};

const highContrastPalette = {
  primary: {
    main: '#FFFFFF',
    light: '#FFFFFF',
    dark: '#FFFFFF',
    contrastText: '#000000',
  },
  secondary: {
    main: '#FFFF00',
    light: '#FFFF33',
    dark: '#CCCC00',
    contrastText: '#000000',
  },
  background: {
    default: '#000000',
    paper: '#000000',
  },
  text: {
    primary: '#FFFFFF',
    secondary: '#FFFFFF',
    disabled: '#CCCCCC',
  },
  error: {
    main: '#FF6666',
    light: '#FF9999',
    dark: '#FF0000',
    contrastText: '#000000',
  },
  warning: {
    main: '#FFCC00',
    light: '#FFDD33',
    dark: '#CC9900',
    contrastText: '#000000',
  },
  info: {
    main: '#66CCFF',
    light: '#99DDFF',
    dark: '#0099FF',
    contrastText: '#000000',
  },
  success: {
    main: '#66FF66',
    light: '#99FF99',
    dark: '#00CC00',
    contrastText: '#000000',
  },
};

// Function to get theme options based on mode, contrast, and font size
const getThemeOptions = (mode = 'light', highContrast = false, fontSize = 'medium') => {
  // Determine which palette to use
  let palette;
  if (highContrast) {
    palette = highContrastPalette;
  } else if (mode === 'dark') {
    palette = darkPalette;
  } else {
    palette = lightPalette;
  }

  // Get font sizes based on setting
  const selectedFontSizes = fontSizes[fontSize] || fontSizes.medium;

  return {
    palette: {
      mode: highContrast ? 'dark' : mode,
      ...palette,
      error: palette.error || {
        main: mode === 'light' ? '#F44336' : '#FF6666',
      },
      warning: palette.warning || {
        main: mode === 'light' ? '#FF9800' : '#FFCC00',
      },
      info: palette.info || {
        main: mode === 'light' ? '#2196F3' : '#66CCFF',
      },
      success: palette.success || {
        main: mode === 'light' ? '#4CAF50' : '#66FF66',
      },
    },
    typography: {
      fontFamily: [
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
      ].join(','),
      h1: {
        fontSize: selectedFontSizes.h1,
        fontWeight: 700,
        lineHeight: 1.2,
      },
      h2: {
        fontSize: selectedFontSizes.h2,
        fontWeight: 600,
        lineHeight: 1.3,
      },
      h3: {
        fontSize: selectedFontSizes.h3,
        fontWeight: 600,
        lineHeight: 1.3,
      },
      h4: {
        fontSize: selectedFontSizes.h4,
        fontWeight: 600,
        lineHeight: 1.4,
      },
      h5: {
        fontSize: selectedFontSizes.h5,
        fontWeight: 500,
        lineHeight: 1.4,
      },
      h6: {
        fontSize: selectedFontSizes.h6,
        fontWeight: 500,
        lineHeight: 1.5,
      },
      body1: {
        fontSize: selectedFontSizes.body1,
        lineHeight: 1.5,
      },
      body2: {
        fontSize: selectedFontSizes.body2,
        lineHeight: 1.5,
      },
      button: {
        fontSize: selectedFontSizes.button,
        textTransform: 'none',
        fontWeight: 500,
      },
    },
    shape: {
      borderRadius: 8,
    },
    spacing: 8,
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 4,
            textTransform: 'none',
            padding: '8px 16px',
            '&:focus': {
              outline: '3px solid yellow',
              outlineOffset: '2px',
            },
          },
          contained: {
            boxShadow: 'none',
            '&:hover': {
              boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
            },
          },
        },
        defaultProps: {
          disableElevation: true,
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              '&.Mui-focused fieldset': {
                borderColor: mode === 'light' ? '#2196F3' : '#90CAF9',
                borderWidth: 2,
              },
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
            borderRadius: 8,
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1)',
          },
        },
      },
      MuiLink: {
        styleOverrides: {
          root: {
            textDecoration: 'underline',
            '&:focus': {
              outline: '3px solid yellow',
              outlineOffset: '2px',
            },
          },
        },
      },
      MuiInputBase: {
        styleOverrides: {
          root: {
            '&.Mui-focused': {
              outline: '3px solid yellow',
              outlineOffset: '2px',
            },
          },
        },
      },
    },
  };
};

// Create a default theme
const defaultThemeOptions = getThemeOptions('light', false, 'medium');
const theme = createTheme(defaultThemeOptions);
const responsiveTheme = responsiveFontSizes(theme);

// Export the theme
export { responsiveTheme as theme };
export { getThemeOptions };
