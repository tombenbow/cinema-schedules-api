import * as admin from "firebase-admin";
import serviceAccount from "../../cinema-viewer1-firebase-adminsdk-lf2hl-78a09ce780.json";

class FBprovider {
  app: admin.app.App;
  admin: typeof admin;
  config: admin.remoteConfig.RemoteConfig;
  db: admin.firestore.Firestore;

  async initialise() {
    (this.app = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount)
    })),
      (this.admin = admin),
      (this.config = admin.remoteConfig());
    this.db = this.admin.firestore();
  }
}

export default new FBprovider()