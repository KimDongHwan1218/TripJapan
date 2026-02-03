import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Video, ResizeMode } from "expo-av";
import TabiLogo from "@/assets/images/tabi_logo.svg";
import TicketStrip from "@/assets/images/ticket_bg.png";
import CherryBlossomBg from "@/assets/images/intro_bg.mp4";
import { useAuth } from "@/contexts/AuthContext";
import { ImageBackground } from "react-native";

const { height } = Dimensions.get("window");

export default function IntroScreen() {
  const navigation = useNavigation<any>();
  const { user } = useAuth();


  useEffect(() => {
    const timeout = setTimeout(() => {
      if (user) {
        navigation.replace("MainTabs");
      } 
      else {
        navigation.replace("Login");
      }
    }, 2000);
    return () => clearTimeout(timeout);
  }, [user]);

  return (
    <View style={styles.container}>
      {/* 상단 영역 */}
      <View style={styles.header}>
        <Image source={TabiLogo} style={styles.logo} />

        <Text style={styles.subtitle}>
          여행의 모든 순간을 담다, tabi
        </Text>

        <Image source={TicketStrip} style={styles.ticket} />
      </View>

      {/* 하단 Hero */}
      <TouchableOpacity
        style={styles.hero}
        activeOpacity={0.9}
        onPress={() => navigation.navigate("Login")}
      >
        <Video
          source={CherryBlossomBg}
          style={styles.bg}
          resizeMode={ResizeMode.COVER}
          isLooping
          shouldPlay
          isMuted
        />
        <Text style={styles.heroText}>
          일본 감성여행{"\n"}시작하기 →
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#fff" 
  },

  header: {
    alignItems: "center",
    height: 200,
  },

  logo: {
    width: 80,
    height: 36,
    resizeMode: "contain",
    zIndex: 2,
  },

  subtitle: {
    fontWeight: '600',
    fontSize: 13,
    lineHeight: 13,
    textAlign: 'center',
    color: '#000000',
  },

  ticket: {
    width: "100%",
    resizeMode: "contain",
    zIndex: 1,
  },

  hero: {
    flex: 1,
    justifyContent: "center",
    zIndex: 2,
  },

  bg: {
    position: "absolute",
    width: "100%",
    height,
    opacity: 0.80,
  },

  heroText: {
    fontSize: 32,
    fontWeight: "600",
    marginLeft: 24,
  },
});