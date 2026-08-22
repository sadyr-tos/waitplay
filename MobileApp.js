import React, { useMemo } from 'react';
import { StyleSheet, View, StatusBar, Platform } from 'react-native';
import { WebView } from 'react-native-webview';

export default function MobileApp() {
  const targetUri = useMemo(() => `https://remarkable-halva-59a8f7.netlify.app/?v=11.2.0`, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#08060d" translucent={false} />
      <WebView 
        source={{ uri: targetUri }}
        style={{ flex: 1 }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        cacheEnabled={false}
        incognito={true}
        allowFileAccess={true}
        scalesPageToFit={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#08060d',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || 25 : 0,
  },
});
