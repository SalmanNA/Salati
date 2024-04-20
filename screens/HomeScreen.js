import { useNavigation } from "@react-navigation/core";
import React, { useState, useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const HomeScreen = () => {
  const [timeMeth, setTime] = useState(true);
  const [school, setSchool] = useState(false);
  useEffect(() => {
    // Load user preferences when the component mounts
    loadPreferences();
  }, []);
  const convertTo12HourFormat = (time) => {
    if (timeMeth) {
      const [hours, minutes] = time.split(":");
      const parsedHours = parseInt(hours, 10);
      const period = parsedHours >= 12 ? "PM" : "AM";
      const formattedHours = parsedHours % 12 || 12;

      return `${formattedHours}:${minutes} ${period}`;
    }
    return time;
  };

  const loadPreferences = async () => {
    try {
      // Retrieve the 'Time' preference from AsyncStorage
      const storedValueTime = await AsyncStorage.getItem("Time");
      // If a value is found, update the state
      setTime(storedValueTime === "true");
    } catch (error) {
      console.error("Error loading Time preference", error);
    }
    try {
      const storedValueSchool = await AsyncStorage.getItem("School");
      // If a value is found, update the state
      setSchool(storedValueSchool === "true");
    } catch (error) {
      console.error("Error loading School preference", error);
    }
  };

  const navigation = useNavigation();
  const route = useRoute();
  var { data, data2 } = route.params;
  if (school) {
    data = data2;
  }

  if (!data) {
    navigation.navigate("Loc", {});
  }
  loadPreferences();
  return (
    <View style={styles.container}>
      <View style={styles.listContainer}>
        {data &&
          Object.entries(data)
            .slice(0, 7)
            .map(([name, time]) => (
              <View key={name} style={styles.row}>
                <View style={styles.cell}>
                  <Text style={styles.cellText}>{name}</Text>
                </View>
                <View style={styles.cell}>
                  <Text style={styles.cellText}>
                    {timeMeth ? convertTo12HourFormat(time) : time}
                  </Text>
                </View>
              </View>
            ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0abab5",
  },
  listContainer: {
    width: "90%",
    bottom: "30%",
    position: "absolute",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderRadius: 15,
    elevation: 10,
    padding: 15,
    marginTop: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingVertical: 15,
  },
  cell: {
    flex: 1,
    alignItems: "center",
  },
  cellText: {
    fontSize: 18,
    color: "#333",
    fontWeight: "500",
  },
  button: {
    backgroundColor: "#0782F9",
    width: 150,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
  },
});

export default HomeScreen;
