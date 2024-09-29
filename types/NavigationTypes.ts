import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";

export type BottomTabParamList = {
  Restaurants: undefined;
  Market: undefined;
  Cart: undefined;
  Orders: undefined;
  Profile: undefined;
};

export type ScreenProps<T extends keyof BottomTabParamList> =
  BottomTabScreenProps<BottomTabParamList, T>;

export type RootStackParamList = {
  Restaurants: undefined;
  MarketDetails: { storeId: number };
};

export type MarketDetailsNavigationProp = StackNavigationProp<
  RootStackParamList,
  "MarketDetails"
>;

export type MarketDetailsRouteProp = RouteProp<
  RootStackParamList,
  "MarketDetails"
>;
