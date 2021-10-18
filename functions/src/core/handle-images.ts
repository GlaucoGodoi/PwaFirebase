import * as functions from 'firebase-functions';
import * as sharp from 'sharp';
import * as admin from 'firebase-admin';

export const HandleImages = functions.region('europe-west1').https.onCall(async (data) => {

    data = data as { readingPath: string, image: string };
    const ret = { success: false } as { success: boolean };
    try {
        functions.logger.info(`HandleImages: ${JSON.stringify(data)}`);

        const rawImage = data.image.split(';base64,').pop()

        const resizedBuffer = await sharp(Buffer.from(rawImage, 'base64')).resize(100, 200).toBuffer();
        const resizedImage = resizedBuffer.toString('base64');

        functions.logger.info(`Resized image: ${resizedImage.length}, original image: ${data.image.length}`);

        const afs = admin.firestore();
        const readingRef = afs.doc(data.readingPath);
        readingRef.set({ image: resizedImage }, { merge: true });

        functions.logger.info(`HandleImages: originalSize:${rawImage.length}, newSize: ${resizedImage.length}`);


        ret.success = true;

    } catch (error) {
        functions.logger.error(`HandleImages: ${error}`);
        ret.success = false;
    } finally {
        return ret;
    }
});
