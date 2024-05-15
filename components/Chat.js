import { KeyboardAvoidingView, View, Platform, StyleSheet } from 'react-native';
import { useEffect, useState } from 'react';
import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat';
import { collection, onSnapshot, query, orderBy, addDoc } from "firebase/firestore";

import AsyncStorage from "@react-native-async-storage/async-storage";

const Chat = ({ route, navigation, db, isConnected }) => {
  const { name, background, userID } = route.params;

  const [messages, setMessages] = useState([]);

  const onSend = (newMessages) => {
    addDoc(collection(db, "messages"), newMessages[0])
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

  useEffect(() => {

    var unsubChat = null;
    if (isConnected === true) {

      navigation.setOptions({ title: name });

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
      return cachedChats != null ? JSON.parse(cachedChats) : [];
    } catch (error) {
      Alert.alert("Unable to load cached messages");
      return [];
    }
  }

  const renderInputToolbar = (props) => {
    if (isConnected) return <InputToolbar {...props} />;
    else return null
  }
  
  return (
    <View style={[styles.container, { backgroundColor: background }]}>
      <GiftedChat
        messages={messages}
        renderBubble={renderBubble}
        renderInputToolbar={renderInputToolbar}
        onSend={messages => onSend(messages)}
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