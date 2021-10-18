// import * as functions from 'firebase-functions';
import * as admin from "firebase-admin";

import {DispatchMessages} from "./core/dispatch-messages";
import {HandleImages} from "./core/handle-images";

admin.initializeApp();

export {DispatchMessages};
export {HandleImages};
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
