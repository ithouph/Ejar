import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { Spacing } from "../theme/global";

export function useScreenInsets() {
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();

  return {
    top: insets.top,
    bottom: tabBarHeight,
    left: insets.left,
    right: insets.right,
  };
}
