import { Dimensions, Platform } from "react-native";

export function isIphoneX() {
  const dimension = Dimensions.get("window");

  console.log("dimension.height:"+dimension.height);

  return (
    Platform.OS === "ios" &&
    !Platform.isPad &&
    !Platform.isTVOS &&
    ((dimension.height === 812 || dimension.width === 812) ||
    (dimension.height === 896 || dimension.width === 896))
  );
}
