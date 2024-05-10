import { KeyboardAvoidingView, View, Platform, StyleSheet } from 'react-native';
import { useEffect, useState } from 'react';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import { collection, onSnapshot, query, orderBy, addDoc } from "firebase/firestore";

const Chat = ({ route, navigation, db }) => {
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
    navigation.setOptions({ title: name });

    const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
    const unsubChat = onSnapshot(q, (chatData) => {
      let newMessages = [];
      chatData.forEach(message => {
        let newChat = {
          ...message.data(),
          createdAt: new Date(message.data().createdAt.seconds * 1000)
        };
        newMessages.push(newChat);
      })
      setMessages(newMessages);
    })
    // Clean up returned function
    return () => {
      if (unsubChat) unsubChat();
    }
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: background }]}>
      <GiftedChat
        messages={messages}
        renderBubble={renderBubble}
        onSend={messages => onSend(messages)}
        user={{
          _id: 1,
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