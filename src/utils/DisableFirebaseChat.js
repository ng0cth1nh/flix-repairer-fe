import firestore from '@react-native-firebase/firestore';

const disableFirebaseChat = (firstId, secondId, enabled) => {
  const memberOne = firstId < secondId ? firstId : secondId;
  const memberTwo = firstId > secondId ? firstId : secondId;
  firestore()
    .collection('conversations')
    .where('memberOne', '==', memberOne)
    .where('memberTwo', '==', memberTwo)
    .where('enabled', '==', !enabled)
    .get()
    .then(querySnapshot => {
      console.log('query snapshiot: ', querySnapshot);
      // if (querySnapshot.size > 0) {
      querySnapshot.forEach(documentSnapshot => {
        console.log('User ID: ', documentSnapshot.id, documentSnapshot.data());
        firestore()
          .collection('conversations')
          .doc(documentSnapshot.id)
          .update({
            enabled,
          })
          .then(() => {
            console.log('Conversations enabled updated!');
          })
          .catch(error => {
            console.log('set enabled fail: ' + error);
          });
      });
      //    const conversationId = querySnapshot[0].id;

      // } else {
      //   console.log('cant get conver in canceled request');
      // }
    });
};

export default disableFirebaseChat;
