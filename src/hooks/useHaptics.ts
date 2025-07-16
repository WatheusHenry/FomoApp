import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

export const useHaptics = () => {
  const triggerHaptic = (type: 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error') => {
    try {
      switch (type) {
        case 'light':
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          break;
        case 'medium':
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          break;
        case 'heavy':
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          break;
        case 'success':
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          break;
        case 'warning':
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          break;
        case 'error':
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          break;
      }
    } catch (error) {
      console.warn('❌ Erro ao executar haptic feedback:', error);
    }
  };

  const triggerMarkerPress = () => {
    triggerHaptic('medium');
  };

  const triggerButtonPress = () => {
    triggerHaptic('light');
  };

  const triggerSuccess = () => {
    triggerHaptic('success');
  };

  const triggerError = () => {
    triggerHaptic('error');
  };

  const triggerWarning = () => {
    triggerHaptic('warning');
  };

  return {
    triggerHaptic,
    triggerMarkerPress,
    triggerButtonPress,
    triggerSuccess,
    triggerError,
    triggerWarning,
  };
}; 