import { responsiveFontSizes, createTheme } from '@mui/material/styles';
import { RefineThemes } from '@refinedev/mui';

export const theme = responsiveFontSizes(
  createTheme({
    ...RefineThemes.Magenta,
    components: {
      MuiCard: {
        defaultProps: {
          elevation: 0,
          variant: 'outlined',
        },
      },
      MuiButtonBase: {
        defaultProps: {
          disableRipple: true,
          disableTouchRipple: true,
        },
      },
      MuiButton: {
        defaultProps: {
          disableElevation: true,
        },
        styleOverrides: {
          root: {
            textTransform: 'none',
          },
        },
      },
    },
  })
);
