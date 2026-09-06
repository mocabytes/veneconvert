import React, { memo } from "react";
import AmountText from "./AmountText";
import { useCountUp } from "../../hooks/useCountUp";

interface AnimatedRateNumberProps {
  value: number;
  prefix?: string;
  size?: "xl" | "lg" | "md";
  color?: string;
  duration?: number;
}

function AnimatedRateNumber({
  value,
  prefix,
  size = "xl",
  color,
  duration,
}: AnimatedRateNumberProps) {
  const text = useCountUp(value, duration);
  return <AmountText value={text} prefix={prefix} size={size} color={color} />;
}

export default memo(AnimatedRateNumber);
