import { useColorScheme } from 'react-native';
import theme from '@/theme';

export const useTheme = () => {
  const colorScheme = useColorScheme();
  
  return {
    ...theme,
    colorScheme,
    isDark: colorScheme === 'dark',
    isLight: colorScheme === 'light',
  };
}; 