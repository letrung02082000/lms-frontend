export const darkTheme = {
  name: 'dark',
  variables: {
    '--bs-primary': '#ff6600',
    '--bs-body-bg': '#121212',
    '--bs-body-color': '#000000',
  },
};

export const defaultTheme = {
  name: 'light',
  variables: {
    '--bs-primary': '#0d6efd',
    '--bs-body-bg': '#ffffff',
    '--bs-body-color': '#121212',
    '--bs-card-bg': '#ffffff',
  },
};

export function setThemeColors(colors = {}) {
  const root = document.documentElement;

  const colorToRGB = (hex) => {
    const shorthand = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthand, (_, r, g, b) =>
      r + r + g + g + b + b
    );

    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
      : '0, 0, 0';
  };

  Object.entries(colors).forEach(([key, value]) => {
    if (!value) return;

    root.style.setProperty(`--bs-${key}`, value);

    if (key === 'primary') {
      root.style.setProperty(`--bs-primary-rgb`, colorToRGB(value));
      root.style.setProperty(`--bs-primary`, value);
      
    }

    if (key === 'progress-bar-bg') {
      root.style.setProperty(`--bs-progress-bar-bg`, value);
    }
  });
}
