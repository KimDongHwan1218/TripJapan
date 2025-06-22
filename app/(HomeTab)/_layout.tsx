
import { Tabs, TabList, TabTrigger, TabSlot } from "expo-router/ui";
import { Text, StyleSheet } from "react-native";
import React from 'react';
import { Platform } from 'react-native';
import { CustomTabButton } from "@/components/CustomTabButton";
import { ToggleMenuButton } from "@/components/ToggleMenuButton";
import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {

  const [isExpanded, setIsExpanded] = React.useState(false);

	function toggleExpandHandler() {
		setIsExpanded(!isExpanded);
	}

  return (
    <Tabs>
      <TabSlot />
      <TabList style={styles.tabList}>
				<TabTrigger name="home" href="/" asChild>
					<CustomTabButton icon="home" isExpanded={isExpanded} index={0}>홈</CustomTabButton>
				</TabTrigger>
				<TabTrigger name="schedule" href="/SchedulingScreen" asChild>
					<CustomTabButton icon="time" isExpanded={isExpanded} index={1}>일정</CustomTabButton>
				</TabTrigger>
				<TabTrigger name="book" href="/BookingScreen" asChild>
					<CustomTabButton icon="book" isExpanded={isExpanded} index={2}>예약</CustomTabButton>
				</TabTrigger>
				<TabTrigger name="commu" href="/CommunityScreen" asChild>
					<CustomTabButton icon="search" isExpanded={isExpanded} index={3}>커뮤니티</CustomTabButton>
				</TabTrigger>
        		<TabTrigger name="settings" href="/SettingsScreen" asChild>
					<CustomTabButton icon="settings" isExpanded={isExpanded} index={4}>설정</CustomTabButton>
				</TabTrigger>
				<ToggleMenuButton
					onPress={toggleExpandHandler}
					isExpanded={isExpanded}
				/>
			</TabList>
    </Tabs>
  );
}
  const styles = StyleSheet.create({
	tabList: {
		// position: "absolute",
		bottom: 60,
		// right: 32,
		alignItems: "center",
		justifyContent: "center"
	}
});

//https://expo.dev/blog/how-to-build-custom-tabs-with-expo-router-ui