// SettingsScreen.js

import React, { useState, useEffect } from "react";
import { View, Text, Switch, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SettingsScreen = () => {
  const [school, setSchool] = useState(true);
  const [time, setTime] = useState(true);

  useEffect(() => {
    // Load user preferences when the component mounts
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const storedValueSchool = await AsyncStorage.getItem("School");
      setSchool(storedValueSchool === "true");
    } catch (error) {
      handlePreferencesError("School", error);
    }

    try {
      const storedValueTime = await AsyncStorage.getItem("Time");
      setTime(storedValueTime === "true");
    } catch (error) {
      handlePreferencesError("Time", error);
    }
  };

  const savePreferences = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, value.toString());
    } catch (error) {
      handlePreferencesError(key, error);
    }
  };

  const handlePreferencesError = (preference, error) => {
    console.error(`Error handling ${preference} preference:`, error);
    // Handle errors (e.g., show a user-friendly message or log to a server)
  };

  const toggleSwitch = () => {
    // Toggle the state first
    setSchool((prevSchool) => !prevSchool);
    // Save the updated state
    savePreferences("School", school);
  };

  const toggleSwitch2 = () => {
    // Toggle the state first
    setTime((prevTime) => !prevTime);
    // Save the updated state
    savePreferences("Time", !time);
  };

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.label}>Shafi</Text>
        <Switch
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={school ? "#f5dd4b" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch}
          value={school}
        />
        <Text style={styles.labelRight}>Hanafi</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>24 hour time</Text>
        <Switch
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={time ? "#f5dd4b" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch2}
          value={time}
        />
        <Text style={styles.labelRight}>12 hour time</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0abab5",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  label: {
    marginRight: 10,
  },
  labelRight: {
    marginLeft: 10,
  },
});

export default SettingsScreen;
