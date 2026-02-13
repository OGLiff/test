// Play & Learn Kids - Theme Configuration
// Soft, child-friendly color palette with large typography

export const COLORS = {
  // Primary palette
  primary: '#FF6B6B',       // Coral Red
  primaryLight: '#FFE0E0',
  secondary: '#4ECDC4',     // Teal
  secondaryLight: '#D4F5F2',
  accent: '#FFE66D',        // Sunny Yellow
  accentLight: '#FFF9DB',

  // Module colors
  alphabet: '#FF8A65',      // Warm Orange
  numbers: '#7C4DFF',       // Purple
  colors: '#FF4081',        // Pink
  animals: '#66BB6A',       // Green
  games: '#42A5F5',         // Blue

  // UI colors
  background: '#FFF8F0',    // Warm White
  surface: '#FFFFFF',
  card: '#FFFFFF',
  text: '#2D3436',
  textLight: '#636E72',
  textOnPrimary: '#FFFFFF',

  // Status
  success: '#00C853',
  warning: '#FFB300',
  star: '#FFD700',
  coin: '#FFC107',

  // Neutrals
  border: '#E0E0E0',
  disabled: '#BDBDBD',
  overlay: 'rgba(0,0,0,0.5)',
  white: '#FFFFFF',
  black: '#000000',
};

export const FONTS = {
  // Large, readable sizes for young children
  title: {
    fontSize: 32,
    fontWeight: 'bold' as const,
    color: COLORS.text,
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold' as const,
    color: COLORS.text,
  },
  subheading: {
    fontSize: 22,
    fontWeight: '600' as const,
    color: COLORS.text,
  },
  body: {
    fontSize: 18,
    fontWeight: 'normal' as const,
    color: COLORS.text,
  },
  large: {
    fontSize: 48,
    fontWeight: 'bold' as const,
    color: COLORS.text,
  },
  huge: {
    fontSize: 72,
    fontWeight: 'bold' as const,
    color: COLORS.text,
  },
  button: {
    fontSize: 20,
    fontWeight: 'bold' as const,
    color: COLORS.textOnPrimary,
  },
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BORDER_RADIUS = {
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  round: 100,
};

export const SHADOWS = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
};
