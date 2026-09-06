import React from 'react';
import Svg, { Path, Circle, Rect, Defs, ClipPath, G } from 'react-native-svg';

interface IconProps {
  size?: number;
  color?: string;
}

// Fluent-style Icons usando react-native-svg
export const HomeIcon: React.FC<IconProps> = ({
  size = 28,
  color = '#FFFFFF',
}) => (
  <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
    <Path
      d="M4 11.5L14 3L24 11.5V23C24 24.1046 23.1046 25 22 25H6C4.89543 25 4 24.1046 4 23V11.5Z"
      fill={color}
      fillOpacity="0.2"
    />
    <Path
      d="M4 11.5L14 3L24 11.5V23C24 24.1046 23.1046 25 22 25H6C4.89543 25 4 24.1046 4 23V11.5Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M10 25V15H18V25"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const HomeFilledIcon: React.FC<IconProps> = ({
  size = 28,
  color = '#FFFFFF',
}) => (
  <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
    <Path
      d="M4 11.5L14 3L24 11.5V23C24 24.1046 23.1046 25 22 25H6C4.89543 25 4 24.1046 4 23V11.5Z M11 25V16H17V25Z"
      fill={color}
      fillRule="evenodd"
    />
  </Svg>
);

export const ExchangeIcon: React.FC<IconProps> = ({
  size = 28,
  color = '#FFFFFF',
}) => (
  <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
    <Path
      d="M7 18V6M7 6L3 10M7 6L11 10M21 10V22M21 22L25 18M21 22L17 18"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const ExchangeFilledIcon: React.FC<IconProps> = ({
  size = 28,
  color = '#FFFFFF',
}) => (
  <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
    <Path
      d="M7 18V6M7 6L3 10M7 6L11 10M21 10V22M21 22L25 18M21 22L17 18"
      stroke={color}
      strokeWidth="3.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const ScaleIcon: React.FC<IconProps> = ({
  size = 28,
  color = '#FFFFFF',
}) => (
  <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
    <Path
      d="M14 3V25M14 3L10 7M14 3L18 7M7 11H21M7 11V17C7 18.6569 8.34315 20 10 20H18C19.6569 20 21 18.6569 21 17V11M7 11L4 14M21 11L24 14"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const ScaleFilledIcon: React.FC<IconProps> = ({
  size = 28,
  color = '#FFFFFF',
}) => (
  <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
    <Path
      d="M14 3V25M14 3L10 7M14 3L18 7M7 11H21M7 11V17C7 18.6569 8.34315 20 10 20H18C19.6569 20 21 18.6569 21 17V11M7 11L4 14M21 11L24 14"
      stroke={color}
      strokeWidth="3.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const MenuIcon: React.FC<IconProps> = ({
  size = 28,
  color = '#FFFFFF',
}) => (
  <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
    <Path
      d="M4 8H24M4 14H24M4 20H24"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const HistoryIcon: React.FC<IconProps> = ({
  size = 28,
  color = '#FFFFFF',
}) => (
  <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
    <Path
      d="M14 6V14L19 19M14 25C9.58172 25 6 21.4183 6 17C6 12.5817 9.58172 9 14 9C18.4183 9 22 12.5817 22 17C22 21.4183 18.4183 25 14 25Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const TrendIcon: React.FC<IconProps> = ({
  size = 28,
  color = '#FFFFFF',
}) => (
  <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
    <Path
      d="M3 20L10 13L15 18L25 8"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M19 8H25V14"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const AlertIcon: React.FC<IconProps> = ({
  size = 28,
  color = '#FFFFFF',
}) => (
  <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
    <Path
      d="M14 12V16M14 20H14.01M12 4H16L25.5 22C26.3 23.7 25.1 25 23.5 25H4.5C2.9 25 1.7 23.7 2.5 22L12 4Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const SettingsIcon: React.FC<IconProps> = ({
  size = 28,
  color = '#FFFFFF',
}) => (
  <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
    <Path
      d="M14 16C15.1046 16 16 15.1046 16 14C16 12.8954 15.1046 12 14 12C12.8954 12 12 12.8954 12 14C12 15.1046 12.8954 16 14 16Z"
      fill={color}
      fillOpacity="0.2"
    />
    <Path
      d="M14 16C15.1046 16 16 15.1046 16 14C16 12.8954 15.1046 12 14 12C12.8954 12 12 12.8954 12 14C12 15.1046 12.8954 16 14 16Z"
      stroke={color}
      strokeWidth="2"
    />
    <Path
      d="M19.4 15.4C19.8 14.8 20 14 20 13C20 12 19.8 11.2 19.4 10.6L21.2 8.8C21.6 8.4 21.6 7.8 21.2 7.4L20.6 6.8C20.2 6.4 19.6 6.4 19.2 6.8L17.4 8.6C16.8 8.2 16 8 15 8C14 8 13.2 8.2 12.6 8.6L10.8 6.8C10.4 6.4 9.8 6.4 9.4 6.8L8.8 7.4C8.4 7.8 8.4 8.4 8.8 8.8L10.6 10.6C10.2 11.2 10 12 10 13C10 14 10.2 14.8 10.6 15.4L8.8 17.2C8.4 17.6 8.4 18.2 8.8 18.6L9.4 19.2C9.8 19.6 10.4 19.6 10.8 19.2L12.6 17.4C13.2 17.8 14 18 15 18C16 18 16.8 17.8 17.4 17.4L19.2 19.2C19.6 19.6 20.2 19.6 20.6 19.2L21.2 18.6C21.6 18.2 21.6 17.6 21.2 17.2L19.4 15.4Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const ClockIcon: React.FC<IconProps> = ({
  size = 28,
  color = '#FFFFFF',
}) => (
  <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
    <Path
      d="M14 25C19.5228 25 24 20.5228 24 15C24 9.47715 19.5228 5 14 5C8.47715 5 4 9.47715 4 15C4 20.5228 8.47715 25 14 25Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M14 9V15L18 17"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const BookIcon: React.FC<IconProps> = ({
  size = 28,
  color = '#FFFFFF',
}) => (
  <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
    <Path
      d="M4 6V22C4 23.1046 4.89543 24 6 24H22C23.1046 24 24 23.1046 24 22V6C24 4.89543 23.1046 4 22 4H6C4.89543 4 4 4.89543 4 6Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M4 10H24M4 16H24"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const LightbulbIcon: React.FC<IconProps> = ({
  size = 28,
  color = '#FFFFFF',
}) => (
  <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
    <Path
      d="M9 18C9 14 11 12 12 10C13 8 14 7 14 7C14 7 15 8 16 10C17 12 19 14 19 18C19 20.7614 16.7614 23 14 23C11.2386 23 9 20.7614 9 18Z"
      fill={color}
      fillOpacity="0.2"
    />
    <Path
      d="M9 18C9 14 11 12 12 10C13 8 14 7 14 7C14 7 15 8 16 10C17 12 19 14 19 18C19 20.7614 16.7614 23 14 23C11.2386 23 9 20.7614 9 18Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M11 25H17"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const FireIcon: React.FC<IconProps> = ({
  size = 28,
  color = '#FFFFFF',
}) => (
  <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
    <Path
      d="M8 20C8 16 10 14 12 12C14 10 15 8 15 8C15 8 16 10 17 12C18 14 20 16 20 20C20 23.3137 17.3137 26 14 26C10.6863 26 8 23.3137 8 20Z"
      fill={color}
      fillOpacity="0.2"
    />
    <Path
      d="M8 20C8 16 10 14 12 12C14 10 15 8 15 8C15 8 16 10 17 12C18 14 20 16 20 20C20 23.3137 17.3137 26 14 26C10.6863 26 8 23.3137 8 20Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const TrophyIcon: React.FC<IconProps> = ({
  size = 28,
  color = '#FFFFFF',
}) => (
  <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
    <Path
      d="M7 8C7 5.79086 8.79086 4 11 4H17C19.2091 4 21 5.79086 21 8V10C21 12.2091 19.2091 14 17 14H11C8.79086 14 7 12.2091 7 10V8Z"
      fill={color}
      fillOpacity="0.2"
    />
    <Path
      d="M7 8C7 5.79086 8.79086 4 11 4H17C19.2091 4 21 5.79086 21 8V10C21 12.2091 19.2091 14 17 14H11C8.79086 14 7 12.2091 7 10V8Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M14 14V20M10 20H18"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M4 8H7M21 8H24"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const SwapIcon: React.FC<IconProps> = ({
  size = 28,
  color = '#FFFFFF',
}) => (
  <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
    <Path
      d="M7 18V6M7 6L3 10M7 6L11 10M21 10V22M21 22L25 18M21 22L17 18"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const TrashIcon: React.FC<IconProps> = ({
  size = 28,
  color = '#FFFFFF',
}) => (
  <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
    <Path
      d="M3 6H25M10 6V4C10 3.44772 10.4477 3 11 3H17C17.5523 3 18 3.44772 18 4V6M10 10V22M18 10V22M6 6V23C6 24.1046 6.89543 25 8 25H20C21.1046 25 22 24.1046 22 23V6"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const MoonIcon: React.FC<IconProps> = ({
  size = 28,
  color = '#FFFFFF',
}) => (
  <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
    <Path
      d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const SunIcon: React.FC<IconProps> = ({
  size = 28,
  color = '#FFFFFF',
}) => (
  <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
    <Path
      d="M14 5V3M14 25V23M5 14H3M25 14H23M7.05 7.05L5.64 5.64M22.36 22.36L20.95 20.95M7.05 20.95L5.64 22.36M22.36 5.64L20.95 7.05M14 18C16.2091 18 18 16.2091 18 14C18 11.7909 16.2091 10 14 10C11.7909 10 10 11.7909 10 14C10 16.2091 11.7909 18 14 18Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const BeachIcon: React.FC<IconProps> = ({
  size = 28,
  color = '#FFFFFF',
}) => (
  <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
    <Path
      d="M4 24H24M4 20C4 16 8 12 14 12C20 12 24 16 24 20"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M14 12V4"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M10 8L14 4L18 8"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const PartyIcon: React.FC<IconProps> = ({
  size = 28,
  color = '#FFFFFF',
}) => (
  <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
    <Path
      d="M14 4L16 10L22 12L16 14L14 20L12 14L6 12L12 10L14 4Z"
      fill={color}
      fillOpacity="0.2"
    />
    <Path
      d="M14 4L16 10L22 12L16 14L14 20L12 14L6 12L12 10L14 4Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const MoneyIcon: React.FC<IconProps> = ({
  size = 28,
  color = '#FFFFFF',
}) => (
  <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
    <Path
      d="M4 8C4 6.89543 4.89543 6 6 6H22C23.1046 6 24 6.89543 24 8V20C24 21.1046 23.1046 22 22 22H6C4.89543 22 4 21.1046 4 20V8Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M14 17C15.6569 17 17 15.6569 17 14C17 12.3431 15.6569 11 14 11C12.3431 11 11 12.3431 11 14C11 15.6569 12.3431 17 14 17Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M4 14H8M20 14H24"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const CalculatorIcon: React.FC<IconProps> = ({
  size = 28,
  color = '#FFFFFF',
}) => (
  <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
    <Path
      d="M6 4H22C23.1046 4 24 4.89543 24 6V22C24 23.1046 23.1046 24 22 24H6C4.89543 24 4 23.1046 4 22V6C4 4.89543 4.89543 4 6 4Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M8 8H20M8 14H12M16 14H20M8 20H12M16 20H20"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const GlobeIcon: React.FC<IconProps> = ({
  size = 28,
  color = '#FFFFFF',
}) => (
  <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
    <Path
      d="M14 25C19.5228 25 24 20.5228 24 15C24 9.47715 19.5228 5 14 5C8.47715 5 4 9.47715 4 15C4 20.5228 8.47715 25 14 25Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M4 15H24M14 5V25M7 10C7 10 9 12 14 12C19 12 21 10 21 10M7 20C7 20 9 18 14 18C19 18 21 20 21 20"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const BellIcon: React.FC<IconProps> = ({
  size = 28,
  color = '#FFFFFF',
}) => (
  <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
    <Path
      d="M14 4C10.6863 4 8 6.68629 8 10V16L6 18V20H22V18L20 16V10C20 6.68629 17.3137 4 14 4Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M12 20C12 21.1046 12.8954 22 14 22C15.1046 22 16 21.1046 16 20"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const UserIcon: React.FC<IconProps> = ({
  size = 28,
  color = '#FFFFFF',
}) => (
  <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
    <Path
      d="M14 14C17.3137 14 20 11.3137 20 8C20 4.68629 17.3137 2 14 2C10.6863 2 8 4.68629 8 8C8 11.3137 10.6863 14 14 14Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M4 26C4 21.5817 7.58172 18 12 18H16C20.4183 18 24 21.5817 24 26"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const StarIcon: React.FC<IconProps> = ({
  size = 28,
  color = '#FFFFFF',
}) => (
  <Svg width={size} height={size} viewBox="0 0 28 28" fill="none">
    <Path
      d="M14 2L17.09 9.26L25 10.27L19 15.14L20.82 23L14 18.77L7.18 23L9 15.14L3 10.27L10.91 9.26L14 2Z"
      fill={color}
      fillOpacity="0.2"
    />
    <Path
      d="M14 2L17.09 9.26L25 10.27L19 15.14L20.82 23L14 18.77L7.18 23L9 15.14L3 10.27L10.91 9.26L14 2Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// Circle Flags - Banderas de países con react-native-svg
interface FlagProps extends IconProps {
  bg: string;
  children?: React.ReactNode;
}

const FlagBase: React.FC<FlagProps> = ({ size = 24, color, bg, children }) => {
  const clipId = React.useId().replace(/[^a-zA-Z0-9]/g, '');
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Defs>
        <ClipPath id={clipId}>
          <Circle cx="12" cy="12" r="11.5" />
        </ClipPath>
      </Defs>
      <Circle cx="12" cy="12" r="11.5" fill={bg} />
      <G clipPath={`url(#${clipId})`}>{children}</G>
      <Circle
        cx="12"
        cy="12"
        r="11.5"
        stroke={color || "rgba(255,255,255,0.3)"}
        strokeWidth="1"
      />
    </Svg>
  );
};

export const FlagVE: React.FC<IconProps> = ({ size = 24, color }) => (
  <FlagBase size={size} color={color} bg="#FFCC00">
    <Rect x="0" y="9" width="24" height="4.5" fill="#003DA5" />
    <Rect x="0" y="13.5" width="24" height="10.5" fill="#CF142B" />
    <Circle cx="9" cy="11.2" r="0.8" fill="#FFFFFF" />
    <Circle cx="12" cy="11.2" r="0.8" fill="#FFFFFF" />
    <Circle cx="15" cy="11.2" r="0.8" fill="#FFFFFF" />
  </FlagBase>
);

export const FlagUS: React.FC<IconProps> = ({ size = 24, color }) => (
  <FlagBase size={size} color={color} bg="#FFFFFF">
    <Rect x="0" y="7" width="24" height="2.4" fill="#B22234" />
    <Rect x="0" y="12" width="24" height="2.4" fill="#B22234" />
    <Rect x="0" y="17" width="24" height="2.4" fill="#B22234" />
    <Rect x="0" y="22" width="24" height="2" fill="#B22234" />
    <Rect x="0" y="0" width="11.5" height="7" fill="#3C3B6E" />
    <Circle cx="3" cy="3.5" r="0.7" fill="#FFFFFF" />
    <Circle cx="6" cy="3.5" r="0.7" fill="#FFFFFF" />
    <Circle cx="9" cy="3.5" r="0.7" fill="#FFFFFF" />
  </FlagBase>
);

export const FlagEU: React.FC<IconProps> = ({ size = 24, color }) => (
  <FlagBase size={size} color={color} bg="#003399">
    <Circle cx="16.5" cy="12" r="1" fill="#FFCC00" />
    <Circle cx="14.25" cy="15.9" r="1" fill="#FFCC00" />
    <Circle cx="9.75" cy="15.9" r="1" fill="#FFCC00" />
    <Circle cx="7.5" cy="12" r="1" fill="#FFCC00" />
    <Circle cx="9.75" cy="8.1" r="1" fill="#FFCC00" />
    <Circle cx="14.25" cy="8.1" r="1" fill="#FFCC00" />
  </FlagBase>
);

export const FlagCO: React.FC<IconProps> = ({ size = 24, color }) => (
  <FlagBase size={size} color={color} bg="#FCD116">
    <Rect x="0" y="12" width="24" height="4.5" fill="#003893" />
    <Rect x="0" y="16.5" width="24" height="7.5" fill="#CE1126" />
  </FlagBase>
);

export const FlagPE: React.FC<IconProps> = ({ size = 24, color }) => (
  <FlagBase size={size} color={color} bg="#D91023">
    <Rect x="8" y="0" width="8" height="24" fill="#FFFFFF" />
  </FlagBase>
);

export const FlagBR: React.FC<IconProps> = ({ size = 24, color }) => (
  <FlagBase size={size} color={color} bg="#009739">
    <Path
      d="M12 4L20.5 12L12 20L3.5 12L12 4Z"
      fill="#FEDD00"
    />
    <Circle cx="12" cy="12" r="4.5" fill="#002776" />
    <Rect x="9" y="11.2" width="6" height="1.6" fill="#FFFFFF" />
  </FlagBase>
);

export const FlagMX: React.FC<IconProps> = ({ size = 24, color }) => (
  <FlagBase size={size} color={color} bg="#006847">
    <Rect x="8" y="0" width="8" height="24" fill="#FFFFFF" />
    <Rect x="16" y="0" width="8" height="24" fill="#CE1126" />
  </FlagBase>
);

export const FlagCR: React.FC<IconProps> = ({ size = 24, color }) => (
  <FlagBase size={size} color={color} bg="#002B7F">
    <Rect x="0" y="6" width="24" height="3" fill="#FFFFFF" />
    <Rect x="0" y="9" width="24" height="6" fill="#CE1126" />
    <Rect x="0" y="15" width="24" height="3" fill="#FFFFFF" />
  </FlagBase>
);

export const FlagCA: React.FC<IconProps> = ({ size = 24, color }) => (
  <FlagBase size={size} color={color} bg="#FFFFFF">
    <Rect x="0" y="0" width="5" height="24" fill="#D80621" />
    <Rect x="19" y="0" width="5" height="24" fill="#D80621" />
    <Path
      d="M12 6L13.2 9.2L16.4 9.4L14 11.4L15 14.6L12 12.8L9 14.6L10 11.4L7.6 9.4L10.8 9.2L12 6Z"
      fill="#D80621"
    />
  </FlagBase>
);

export const FlagAU: React.FC<IconProps> = ({ size = 24, color }) => (
  <FlagBase size={size} color={color} bg="#012169">
    <Rect x="10.8" y="2" width="2.4" height="20" fill="#FFFFFF" />
    <Rect x="2" y="10.8" width="20" height="2.4" fill="#FFFFFF" />
    <Rect x="10.8" y="2" width="2.4" height="20" fill="#E4002B" />
    <Rect x="2" y="10.8" width="20" height="2.4" fill="#E4002B" />
    <Circle cx="4.5" cy="4.5" r="1.1" fill="#FFFFFF" />
    <Circle cx="19" cy="4.5" r="1.1" fill="#FFFFFF" />
    <Circle cx="19" cy="19.5" r="1.1" fill="#FFFFFF" />
    <Circle cx="4.5" cy="19.5" r="1.1" fill="#FFFFFF" />
  </FlagBase>
);

// Helper function to get flag component by code
export const getFlagIcon = (flagCode: string, size: number = 24) => {
  const flagMap: { [key: string]: React.FC<IconProps> } = {
    ve: FlagVE,
    us: FlagUS,
    eu: FlagEU,
    co: FlagCO,
    pe: FlagPE,
    br: FlagBR,
    mx: FlagMX,
    cr: FlagCR,
    ca: FlagCA,
    au: FlagAU,
    usdt: CryptoUSDT,
  };

  const FlagComponent = flagMap[flagCode] || FlagUS;
  return <FlagComponent size={size} />;
};

// Cryptocurrency - Criptomonedas con react-native-svg
export const CryptoUSDT: React.FC<IconProps> = ({ size = 24, color }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="11.5" fill="#26A17B" />
    <Circle
      cx="12"
      cy="12"
      r="11.5"
      stroke={color || "rgba(255,255,255,0.3)"}
      strokeWidth="1"
    />
    <Rect x="7" y="4.8" width="10" height="2.8" fill="#FFFFFF" />
    <Rect x="10.4" y="7.6" width="3.2" height="11.6" fill="#FFFFFF" />
  </Svg>
);

export const CryptoBTC: React.FC<IconProps> = ({ size = 24, color }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="11.5" fill="#F7931A" />
    <Circle
      cx="12"
      cy="12"
      r="11.5"
      stroke={color || "rgba(255,255,255,0.3)"}
      strokeWidth="1"
    />
    <Rect x="10.6" y="3.8" width="2.9" height="16.4" fill="#FFFFFF" />
    <Rect x="6.8" y="5.6" width="8.6" height="3.1" fill="#FFFFFF" />
    <Rect x="6.8" y="15.3" width="8.6" height="3.1" fill="#FFFFFF" />
    <Rect x="8.8" y="9.6" width="3.4" height="2.4" fill="#FFFFFF" />
    <Rect x="8.8" y="12" width="3.4" height="2.4" fill="#FFFFFF" />
  </Svg>
);

export const CryptoETH: React.FC<IconProps> = ({ size = 24, color }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="11.5" fill="#627EEA" />
    <Circle
      cx="12"
      cy="12"
      r="11.5"
      stroke={color || "rgba(255,255,255,0.3)"}
      strokeWidth="1"
    />
    <Path d="M12 4L17.5 12L12 20L6.5 12L12 4Z" fill="#FFFFFF" />
    <Path
      d="M12 7.5L10 11L14 11L12 7.5ZM10 12.6L12 16.5L14 12.6L10 12.6Z"
      fill="#627EEA"
    />
  </Svg>
);

export const ChevronDownIcon: React.FC<IconProps> = ({
  size = 20,
  color = '#FFFFFF',
}) => (
  <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
    <Path
      d="M5 8L10 13L15 8"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const ChevronRightIcon: React.FC<IconProps> = ({
  size = 20,
  color = '#FFFFFF',
}) => (
  <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
    <Path
      d="M8 5L13 10L8 15"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const SystemIcon: React.FC<IconProps> = ({
  size = 20,
  color = '#FFFFFF',
}) => (
  <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
    <Path
      d="M2 4C2 2.89543 2.89543 2 4 2H16C17.1046 2 18 2.89543 18 4V12C18 13.1046 17.1046 14 16 14H4C2.89543 14 2 13.1046 2 12V4Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M6 14V16C6 17.1046 6.89543 18 8 18H12C13.1046 18 14 17.1046 14 16V14"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M10 6V10M8 8H12"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const CopyIcon: React.FC<IconProps> = ({
  size = 18,
  color = '#FFFFFF',
}) => (
  <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
    <Path
      d="M7 4.5H15C16.1046 4.5 17 5.39543 17 6.5V14C17 15.1046 16.1046 16 15 16H7C5.89543 16 5 15.1046 5 14V6.5C5 5.39543 5.89543 4.5 7 4.5Z"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M11 16.5V17C11 18.1046 11.8954 19 13 19H17C18.1046 19 19 18.1046 19 17V10.5C19 9.39543 18.1046 8.5 17 8.5H16"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const WifiOffIcon: React.FC<IconProps> = ({  size = 20,
  color = '#FFFFFF',
}) => (
  <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
    <Path
      d="M2.5 2.5L17.5 17.5"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <Path
      d="M5.5 8.5C6.5 7.5 7.7 6.8 9 6.4M14.5 8.5C13.8 7.8 13 7.3 12.1 6.9"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <Path
      d="M10 12.5C10.4 12.5 10.7 12.6 11 12.8M13.7 10.7C13.1 10.2 12.6 9.9 12 9.7"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <Path
      d="M3.5 12C4.7 10.8 6.1 10 7.6 9.5M15.5 10.8C14.9 11.3 14.2 11.7 13.4 12"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <Path
      d="M7.8 15.2L10 17L12.2 15.2"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const CloseIcon: React.FC<IconProps> = ({
  size = 20,
  color = '#FFFFFF',
}) => (
  <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
    <Path
      d="M5 5L15 15M15 5L5 15"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const PlusIcon: React.FC<IconProps> = ({
  size = 20,
  color = '#FFFFFF',
}) => (
  <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
    <Path
      d="M10 4V16M4 10H16"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const ShareIcon: React.FC<IconProps> = ({
  size = 20,
  color = '#FFFFFF',
}) => (
  <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
    <Path
      d="M11 5L10.5 4.5C9.8 3.9 8.7 4.4 8.7 5.3V6.6M11 5L12.5 6.5C13.2 7.2 14.4 7.2 15.1 6.5C15.8 5.8 15.8 4.6 15.1 3.9C14.4 3.2 13.2 3.2 12.5 3.9M11 5V8M8.7 6.6C6.8 7 5.5 8.5 5.5 10.5V12.5C5.5 13.6 6.4 14.5 7.5 14.5H8M8.7 6.6C8.4 7.2 8.2 7.8 8.1 8.5C7.9 9.5 8.6 10.5 9.6 10.6C10.3 10.7 11 10.4 11.5 9.8C11.9 9.3 12.2 8.8 12.3 8.2M15 12C15 13.1 14.1 14 13 14H11.5C10.9 14 10.3 14.3 10 14.8L9.5 15.5"
      stroke={color}
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const GridIcon: React.FC<IconProps> = ({
  size = 20,
  color = '#FFFFFF',
}) => (
  <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
    <Path
      d="M4 4H8V8H4V4ZM4 12H8V16H4V12ZM12 4H16V8H12V4ZM12 12H16V16H12V12Z"
      stroke={color}
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const GridFilledIcon: React.FC<IconProps> = ({
  size = 20,
  color = '#FFFFFF',
}) => (
  <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
    <Rect x="4" y="4" width="4" height="4" rx="1.2" fill={color} />
    <Rect x="12" y="4" width="4" height="4" rx="1.2" fill={color} />
    <Rect x="4" y="12" width="4" height="4" rx="1.2" fill={color} />
    <Rect x="12" y="12" width="4" height="4" rx="1.2" fill={color} />
  </Svg>
);

export const ArrowUpIcon: React.FC<IconProps> = ({
  size = 20,
  color = '#FFFFFF',
}) => (
  <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
    <Path
      d="M5 13L10 8L15 13"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const ArrowDownIcon: React.FC<IconProps> = ({
  size = 20,
  color = '#FFFFFF',
}) => (
  <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
    <Path
      d="M5 7L10 12L15 7"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const ArrowRightIcon: React.FC<IconProps> = ({
  size = 20,
  color = '#FFFFFF',
}) => (
  <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
    <Path
      d="M4 10H16M16 10L11 5M16 10L11 15"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const CheckIcon: React.FC<IconProps> = ({
  size = 20,
  color = '#FFFFFF',
}) => (
  <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
    <Path
      d="M4 10.5L8 14.5L16 5.5"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const RefreshIcon: React.FC<IconProps> = ({
  size = 20,
  color = '#FFFFFF',
}) => (
  <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
    <Path
      d="M17 5V9H13M3 15V11H7M16.5 9C16 6.5 14.1 4.5 11.6 3.9C10.9 3.8 10.2 3.8 9.5 3.9M3.5 11C4 13.5 5.9 15.5 8.4 16.1C9.1 16.2 9.8 16.2 10.5 16.1"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const WalletIcon: React.FC<IconProps> = ({
  size = 20,
  color = '#FFFFFF',
}) => (
  <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
    <Path
      d="M3 6C3 4.89543 3.89543 4 5 4H15C16.1046 4 17 4.89543 17 6V15C17 16.1046 16.1046 17 15 17H5C3.89543 17 3 16.1046 3 15V6Z"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M3 8H17M7 12H11"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const BankIcon: React.FC<IconProps> = ({
  size = 20,
  color = '#FFFFFF',
}) => (
  <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
    <Path
      d="M2 18H18M3 9H17M3 14H17M3 9L4 6H16L17 9M3 9V14M17 9V14M10 6V14"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const ZapIcon: React.FC<IconProps> = ({
  size = 20,
  color = '#FFFFFF',
}) => (
  <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
    <Path
      d="M11 2L4 11H9L8 18L16 8H10.5L11 2Z"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const PercentIcon: React.FC<IconProps> = ({
  size = 20,
  color = '#FFFFFF',
}) => (
  <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
    <Path
      d="M5 15L15 5"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <Path
      d="M6.5 7C7.32843 7 8 6.32843 8 5.5C8 4.67157 7.32843 4 6.5 4C5.67157 4 5 4.67157 5 5.5C5 6.32843 5.67157 7 6.5 7Z"
      stroke={color}
      strokeWidth="1.8"
    />
    <Path
      d="M13.5 16C14.3284 16 15 15.3284 15 14.5C15 13.6716 14.3284 13 13.5 13C12.6716 13 12 13.6716 12 14.5C12 15.3284 12.6716 16 13.5 16Z"
      stroke={color}
      strokeWidth="1.8"
    />
  </Svg>
);

export const TrendingUpIcon: React.FC<IconProps> = ({
  size = 20,
  color = '#FFFFFF',
}) => (
  <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
    <Path
      d="M2 14L7 9L10 12L18 4"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M13 4H18V9"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const TrendingDownIcon: React.FC<IconProps> = ({
  size = 20,
  color = '#FFFFFF',
}) => (
  <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
    <Path
      d="M2 6L7 11L10 8L18 16"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M13 16H18V11"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const SwapVerticalIcon: React.FC<IconProps> = ({
  size = 20,
  color = '#FFFFFF',
}) => (
  <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
    <Path
      d="M6 2V16M6 16L3 13M6 16L9 13M14 18V4M14 4L11 7M14 4L17 7"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const TargetIcon: React.FC<IconProps> = ({
  size = 20,
  color = '#FFFFFF',
}) => (
  <Svg width={size} height={size} viewBox="0 0 20 20" fill="none">
    <Path
      d="M10 17C13.866 17 17 13.866 17 10C17 6.13401 13.866 3 10 3C6.13401 3 3 6.13401 3 10C3 13.866 6.13401 17 10 17Z"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M10 13.5C11.933 13.5 13.5 11.933 13.5 10C13.5 8.067 11.933 6.5 10 6.5C8.067 6.5 6.5 8.067 6.5 10C6.5 11.933 8.067 13.5 10 13.5Z"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M10 4V3M10 17V16M4 10H3M17 10H16"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </Svg>
);
