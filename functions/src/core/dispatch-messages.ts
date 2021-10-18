
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

export const DispatchMessages =
    functions.region('europe-west1').firestore.document('messages/{text}')
        .onCreate(async (snapshot) => {
            const message = snapshot.data();
            functions.logger.log(`Message: ${message}`);

            const afs = admin.firestore();
            const targetRef = afs.doc('broadcast/1');
            const targetSnapshot = await targetRef.get();

            const payload = {
                notification: {
                    title: 'New Message',
                    body: message.text,
                    icon: 'https://placeimg.com/200/200/any',
                    click_action: 'https://example.com'
                }
            };

            if (!targetSnapshot.exists) {
                return;
            } else {
                const tokens = targetSnapshot.data();

                if (!tokens) {
                    return;
                }
                functions.logger.log(`Tokens: ${tokens}`);
                functions.logger.log(`Payload: ${payload}`);
                const response = await admin.messaging().sendToDevice(tokens.fcmToken, payload);

                functions.logger.log(`Response: ${response.canonicalRegistrationTokenCount}, 
                    ${response.failureCount}, ${response.multicastId}, ${response.results[0].canonicalRegistrationToken}, 
                    ${response.results[0].error}, ${response.results[0].messageId}, ${response.successCount}`);
                return response;
            }

        });
