import { StyleSheet, Image, Platform, View, Text } from 'react-native';


export default function MapScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.bottomContainer}>
        <Text style={styles.text}>이곳은 다른 콘텐츠를 배치할 수 있습니다.</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  webview: {
    height: '75%',
  },
  bottomContainer: {
    height: '25%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  text: {
    fontSize: 18,
    color: '#333',
  },
});
