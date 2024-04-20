import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "./HomeScreen";
import TestScreen from "./Qibla";
import SettingsScreen from "./SettingsScreen";
import { useRoute } from "@react-navigation/native";
import { View, Image } from "react-native";

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  const route = useRoute();
  const data = route.params?.response;
  const data2 = route.params?.response2;
  const location = route.params?.location;
  return (
    <Tab.Navigator
      screenOptions={() => ({
        tabBarShowLabel: false,
        tabBarStyle: {
          bottom: 25,
          left: 20,
          right: 20,
          elevation: 10,
          backgroundColor: "#FFFFFF",
          position: "absolute",
          borderTopWidth: 0,
          borderRadius: 15,
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        initialParams={{ data: data, data2: data2 }}
        options={{
          tabBarIcon: ({ focused }) => (
            <View>
              <Image
                source={require("../assets/icons/sujud.png")}
                resizeMode="contain"
                style={{
                  width: 50,
                  height: 50,
                }}
              />
            </View>
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Test"
        component={TestScreen}
        initialParams={{ location: location }}
        options={{
          tabBarIcon: () => (
            <View>
              <Image
                source={require("../assets/icons/qiblaIcon.png")}
                resizeMode="contain"
                style={{
                  width: 44,
                  height: 44,
                }}
              />
            </View>
          ),
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Settinfs"
        component={SettingsScreen}
        options={{
          tabBarIcon: () => (
            <View>
              <Image
                source={require("../assets/icons/setting.png")}
                resizeMode="contain"
                style={{
                  width: 40,
                  height: 40,
                }}
              />
            </View>
          ),
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
