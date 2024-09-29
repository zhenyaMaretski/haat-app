import * as React from "react";
import { Ionicons } from "@expo/vector-icons";

interface TabBarIconProps {
  name: string;
  color: string;
  size: number;
}

const TabBarIcon = ({ name, color, size }: TabBarIconProps): JSX.Element => {
  return <Ionicons name={name as any} color={color} size={size} />;
};

export default TabBarIcon;
