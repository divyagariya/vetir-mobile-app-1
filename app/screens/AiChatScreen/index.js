import React, {useState, useRef} from 'react';
import {GiftedChat} from 'react-native-gifted-chat';
import {View, ActivityIndicator, Text} from 'react-native';
import uuid from 'react-native-uuid';
import {Styles} from './styles';
import {useSelector} from 'react-redux';
import {Image} from 'react-native';
import {useChat} from '../../hooks/useChat';
import ChatBotPNG from '../../assets/aiBot.png';

const AiChatScreen = props => {
  const giftedChatRef = useRef(null);
  const {sendMessage} = useChat();

  const {receiverDetails} = props?.route?.params || {};
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const userEmail = useSelector(
    state => state.ProfileReducer?.userProfileResponse?.emailId,
  );
  const userName = useSelector(
    state => state.ProfileReducer?.userProfileResponse?.name,
  );
  const profilePic = useSelector(
    state => state.ProfileReducer?.userProfileResponse?.profilePicUrl,
  );
  const clientUserId = useSelector(
    state => state.ProfileReducer?.userProfileResponse?.userId,
  );
  const personalStylistId = useSelector(
    state => state.ProfileReducer?.userProfileResponse?.personalStylistId,
  );
  const isStylistUser = useSelector(state => state.AuthReducer.isStylistUser);

  const onSend = async (messages = []) => {
    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, messages),
    );
    let messageText = messages[0]?.text;
    setIsTyping(true);
    try {
      let aiResponse = await sendMessage(messageText);
      let aiResponseFormatted = [
        {
          _id: uuid.v4(),
          createdAt: new Date(),
          text: aiResponse.message,
          user: {
            _id: 2,
            name: 'Vetir bot',
            avatar: ChatBotPNG,
          },
        },
      ];
      setMessages(previousMessages =>
        GiftedChat.append(previousMessages, aiResponseFormatted),
      );
    } catch (error) {
    } finally {
      setIsTyping(false);
    }

    // let res = await sendMessage(message)
  };

  return (
    <View style={Styles.container}>
      <View style={Styles.headerContainer}>
        <Text style={Styles.headerText}>AI Stylist</Text>
      </View>
      {loadingMessages ? (
        <View style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
          <ActivityIndicator size="large" color="grey" />
        </View>
      ) : (
        // Display a loader while messages are being fetched
        <GiftedChat
          {...props}
          textInputRef={giftedChatRef}
          // shouldUpdateMessage={() => {
          //   return true;
          // }}
          messages={messages}
          // renderActions={ref => renderActions(ref)}
          alwaysShowSend
          isTyping={isTyping}
          onSend={newMessages => onSend(newMessages)}
          // renderInputToolbar={props => <CustomInputToolbar {...props} />}
          // renderInputToolbar={props => <CustomInputToolbar {...props} />}
          textInputStyle={Styles.textInputStyle}
          minInputToolbarHeight={50}
          renderUsernameOnMessage
          // renderChatEmpty={renderChatEmpty}
          // renderActions={renderActions}
          // textInputProps={{
          //   height: 40,
          //   width: 208,
          // }}
          // renderSend={props => (
          //   <Send {...props}>
          //     <Image
          //       source={require('../../assets/chatSend.webp')}
          //       style={{
          //         width: 40,
          //         height: 40,
          //       }}
          //     />
          //   </Send>
          // )}
          user={{
            _id: isStylistUser ? personalStylistId : clientUserId,
            email: userEmail,
            name: userName,
            avatar: profilePic || '',
          }}
        />
      )}
    </View>
  );
};

export default AiChatScreen;
