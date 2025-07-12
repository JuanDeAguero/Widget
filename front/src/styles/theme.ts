export const theme = {
  colors: {
    primary: '#1e1e1e',
    secondary: '#2d2d30',
    tertiary: '#3c3c3c',
    accent: '#007acc',
    accentOrange: '#ff6600',
    text: '#cccccc',
    textSecondary: '#8d8d8d',
    border: '#3e3e42',
    hover: '#404040',
    success: '#00d4aa',
    warning: '#ffcc00',
    error: '#f44747',
    background: '#1e1e1e',
    panel: '#252526',
    header: '#2d2d30',
  },
  sizes: {
    headerHeight: '40px',
    toolbarHeight: '60px',
    panelWidth: '300px',
    contentBrowserHeight: '200px',
  },
  zIndexes: {
    toolbar: 1000,
    modal: 2000,
    tooltip: 3000,
  },
  fonts: {
    primary: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
    monospace: '"Consolas", "Monaco", "Courier New", monospace',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
  },
};

export type Theme = typeof theme;