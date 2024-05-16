import CustomActions from './CustomActions';

import { KeyboardAvoidingView, View, Platform, StyleSheet } from 'react-native';
import { useEffect, useState } from 'react';
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat';
import { collection, onSnapshot, query, orderBy, addDoc } from "firebase/firestore";

import AsyncStorage from "@react-native-async-storage/async-storage";
import MapView from 'react-native-maps';

const Chat = ({ route, navigation, db, isConnected, storage }) => {
  const { name, background, userID } = route.params;
  const [messages, setMessages] = useState([]);

  const onSend = (newMessages) => {
    addDoc(collection(db, "messages"), newMessages[0])
  }

  useEffect(() => {
    navigation.setOptions({ title: name });

    var unsubChat = null;
    if (isConnected === true) {

      const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
      unsubChat = onSnapshot(q, (chatData) => {
        let newMessages = [];
        chatData.forEach(message => {
          let newChat = {
            ...message.data(),
            createdAt: new Date(message.data().createdAt.seconds * 1000)
          };
          newMessages.push(newChat);
        });
        cacheChats(newMessages)
        setMessages(newMessages);
      });
    } else loadCachedChats();

    // Clean up returned function
    return () => {
      if (unsubChat) unsubChat();
    }
  }, [isConnected]);

  const cacheChats = async (chatsToCache) => {
    try {
      await AsyncStorage.setItem('chats', JSON.stringify(chatsToCache));
    } catch (error) {
      console.log(error.message);
    }
  }

  const loadCachedChats = async () => {
    try {
      let cachedChats = await AsyncStorage.getItem("chats");
      setMessages(cachedChats != null ? JSON.parse(cachedChats) : [])
    } catch (error) {
      Alert.alert("Unable to load cached messages");
      return [];
    }
  }

  const renderBubble = (props) => {
    return <Bubble
      {...props}
      wrapperStyle={{
        right: {
          backgroundColor: "#000"
        },
        left: {
          backgroundColor: "#FFF"
        }
      }}
    />
  }

  const renderInputToolbar = (props) => {
    if (isConnected) return <InputToolbar {...props} />;
    else return null
  }

  const renderCustomActions = (props) => {
    return <CustomActions storage={storage} {...props} />;
  };

  const renderCustomView = (props) => {
    const { currentMessage } = props;
    if (currentMessage.location) {
      return (
        <MapView
          style={{
            width: 150,
            height: 100,
            borderRadius: 13,
            margin: 3
          }}
          region={{
            latitude: currentMessage.location.latitude,
            longitude: currentMessage.location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />
      );
    }
    return null;
  }

  return (
    <View style={[styles.container, { backgroundColor: background }]}>
      <GiftedChat
        messages={messages}
        renderBubble={renderBubble}
        renderInputToolbar={renderInputToolbar}
        renderCustomView={renderCustomView}
        onSend={messages => onSend(messages)}
        renderActions={renderCustomActions}
        user={{
          _id: userID,
          name: name
        }}
      />
      {Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Chat;