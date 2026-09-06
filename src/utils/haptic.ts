import { Platform } from "react-native";
import * as Haptics from "expo-haptics";

export type HapticType =
  | 'light'
  | 'medium'
  | 'heavy'
  | 'success'
  | 'warning'
  | 'error'
  | "selection";

export function triggerHaptic(type: HapticType = "light") {
  if (Platform.OS === "web") {
    return;
  }

  let action: Promise<void> | undefined;
  switch (type) {
    case "light":
      action = Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      break;
    case "medium":
      action = Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      break;
    case "heavy":
      action = Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      break;
    case "success":
      action = Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      break;
    case "warning":
      action = Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      break;
    case "error":
      action = Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      break;
    case "selection":
      action = Haptics.selectionAsync();
      break;
  }

  action?.catch(() => {});
}

export function triggerHapticForAction(
  action: 'button' | 'input' | 'success' | 'delete' | 'share' | 'tab'
) {
  switch (action) {
    case "button":
      triggerHaptic("light");
      break;
    case "input":
      triggerHaptic("selection");
      break;
    case "success":
      triggerHaptic("success");
      break;
    case "delete":
      triggerHaptic("heavy");
      break;
    case "share":
      triggerHaptic("medium");
      break;
    case "tab":
      triggerHaptic("selection");
      break;
  }
}
