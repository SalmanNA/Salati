import React, { useState, useEffect, useRef } from "react";
import { Text, View, Animated, StyleSheet, Image } from "react-native";
import { Magnetometer } from "expo-sensors";
import { useRoute } from "@react-navigation/native";
const FULL_ROTATION_DEGREES = 360;

const Compass = () => {
  const route = useRoute();
  const { location } = route.params;
  const [compassHeading, setCompassHeading] = useState(0);
  const [totalRotation, setTotalRotation] = useState(0);
  const rotationsRef = useRef(0);

  const φ1 = location.coords.latitude * (Math.PI / 180);
  const φ2 = 21.422487 * (Math.PI / 180);
  const λ1 = location.coords.longitude * (Math.PI / 180);
  const λ2 = 39.826206 * (Math.PI / 180);

  const animatedCompassRotation = useRef(new Animated.Value(0)).current;
  const animatedQiblaRotation = useRef(new Animated.Value(0)).current;

  const setupRotationAnimation = (animatedValue, toValue) => {
    Animated.spring(animatedValue, {
      toValue,
      useNativeDriver: true,
      speed: 50,
    }).start();
  };

  useEffect(() => {
    const subscription = Magnetometer.addListener(({ x, y }) => {
      setTotalRotation(
        rotationsRef.current * FULL_ROTATION_DEGREES + compassHeading
      );

      const heading = (Math.atan2(y, x) * 180) / Math.PI - 90;
      const adjustedHeading =
        heading < 0 ? heading + FULL_ROTATION_DEGREES : heading;

      const y2 = Math.sin(λ2 - λ1) * Math.cos(φ2);
      const x2 =
        Math.cos(φ1) * Math.sin(φ2) -
        Math.sin(φ1) * Math.cos(φ2) * Math.cos(λ2 - λ1);
      const θ = Math.atan2(y2, x2);
      const brng =
        ((θ * 180) / Math.PI + FULL_ROTATION_DEGREES) % FULL_ROTATION_DEGREES;

      const rotationChange = adjustedHeading - compassHeading;
      if (Math.abs(rotationChange) > 180) {
        rotationsRef.current += rotationChange > 0 ? -1 : 1;
      }

      setupRotationAnimation(animatedCompassRotation, -totalRotation);
      setupRotationAnimation(animatedQiblaRotation, brng + -totalRotation);

      setCompassHeading(adjustedHeading);
    });

    return () => {
      subscription.remove();
    };
  }, [compassHeading]);
  return (
    <View style={styles.container}>
      <Animated.Image
        source={require("../assets/icons/compass.png")}
        style={{
          width: 300,
          height: 300,
          transform: [
            {
              rotateZ: animatedCompassRotation.interpolate({
                inputRange: [0, FULL_ROTATION_DEGREES],
                outputRange: ["0deg", "360deg"],
              }),
            },
          ],
        }}
      />
      <Animated.Image
        source={require("../assets/icons/qibla.png")}
        style={{
          width: 50,
          height: 50,
          transform: [
            { translateX: 0 },
            { translateY: -180 },
            {
              rotateZ: animatedQiblaRotation.interpolate({
                inputRange: [0, FULL_ROTATION_DEGREES],
                outputRange: ["0deg", "360deg"],
              }),
            },
            { translateY: -155 },
          ],
        }}
      />
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
});

export default Compass;
