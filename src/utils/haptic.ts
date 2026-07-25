import { Platform } from "react-native";

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

  try {
    // Use React Native's built-in haptic feedback if available
    if (Platform.OS === "ios" || Platform.OS === "android") {
      // For now, this is a placeholder - actual haptic feedback
      // would require expo-haptics or react-native-haptic-feedback
      // The app will work without haptic feedback
      console.log(
        `Haptic feedback: ${type} (not implemented without expo-haptics)`
      );
    }
  } catch (error) {
    console.log("Haptic feedback not available:", error);
  }
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
