import React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  ViewStyle,
  KeyboardTypeOptions,
} from "react-native";
import { Theme } from "../../theme/colors";
import { radius, spacing, family } from "../../theme/tokens";

interface AmountInputProps {
  label?: string;
  prefix?: string;
  value: string;
  onChangeText: (value: string) => void;
  onEndEditing?: () => void;
  placeholder?: string;
  keyboardType?: KeyboardTypeOptions;
  autoFocus?: boolean;
  editable?: boolean;
  maxLength?: number;
  rightSlot?: React.ReactNode;
  theme: Theme;
  style?: ViewStyle;
  inputHeight?: number;
}

export default function AmountInput({
  label,
  prefix,
  value,
  onChangeText,
  onEndEditing,
  placeholder = "0.00",
  keyboardType = "numeric",
  autoFocus = false,
  editable = true,
  maxLength,
  rightSlot,
  theme,
  style,
  inputHeight = 56,
}: AmountInputProps) {
  return (
    <View style={styles.container}>
      <View style={[styles.group, style]}>
        {label ? (
          <Text style={[styles.label, { color: theme.textSecondary }]}>
            {label}
          </Text>
        ) : null}
        <View
          style={[
            styles.wrapper,
            {
              borderColor: theme.border,
              backgroundColor: theme.inputBackground,
              borderRadius: radius.sm,
              height: inputHeight,
            },
          ]}
        >
          {prefix ? (
            <Text style={[styles.prefix, { color: theme.textMuted }]}>
              {prefix}
            </Text>
          ) : null}
          <TextInput
            style={[styles.input, { color: theme.textPrimary }]}
            keyboardType={keyboardType}
            value={value}
            onChangeText={onChangeText}
            onEndEditing={onEndEditing}
            placeholder={placeholder}
            placeholderTextColor={theme.textMuted}
            autoFocus={autoFocus}
            editable={editable}
            maxLength={maxLength}
            accessibilityLabel={label}
          />
          {rightSlot}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  group: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: 13,
    fontFamily: family.semibold,
    marginBottom: spacing.sm,
    marginLeft: 2,
  },
  wrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.lg,
  },
  prefix: {
    fontSize: 15,
    fontFamily: family.bold,
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: "100%",
    fontSize: 18,
    fontFamily: family.semibold,
    fontVariant: ["tabular-nums"],
  },
});
