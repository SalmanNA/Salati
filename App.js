import React, { useCallback, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import * as SplashScreen from "expo-splash-screen";
import * as Location from "expo-location";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import NavBar from "./screens/NavBar";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Stack = createNativeStackNavigator();
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);
  const [response2, setResponse2] = useState(null);
  const [location, setLocation] = useState(null);
  const [school, setSchool] = useState(false);

  const loadPreferences = useCallback(async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    try {
      if (status !== "granted") {
        setError("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      // Retrieve the 'School' preference from AsyncStorage
      const storedValueSchool = await AsyncStorage.getItem("School");
      // If a value is found, update the state
      if (storedValueSchool) {
        setSchool(true);
      }

      // Continue with the API call after setting the school

      const apiResponse = await fetch(
        `https://api.aladhan.com/v1/timings?latitude=${location.coords.latitude}&longitude=${location.coords.longitude}&method=2&school=0`
      );
      const apiResponse2 = await fetch(
        `https://api.aladhan.com/v1/timings?latitude=${location.coords.latitude}&longitude=${location.coords.longitude}&method=2&school=1`
      );

      if (!apiResponse.ok) {
        throw new Error("Failed to fetch data from the API");
      }
      if (!apiResponse2.ok) {
        throw new Error("Failed to fetch data from the API");
      }
      var result = await apiResponse2.json();
      var result2 = await apiResponse.json();
      setResponse(result.data.timings);
      setResponse2(result2.data.timings);
    } catch (error) {
      console.error("Error loading School preference or fetching data:", error);
      setError("An error occurred while fetching data");
    } finally {
      setAppIsReady(true);
      await SplashScreen.hideAsync();
    }
  }, [school]);

  useEffect(() => {
    loadPreferences();
  }, [loadPreferences]);

  if (!appIsReady) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Initial" headerMode="none">
        <Stack.Screen
          name="Nav"
          component={NavBar}
          initialParams={{
            response: response,
            response2: response2,
            location: location,
          }}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({});
