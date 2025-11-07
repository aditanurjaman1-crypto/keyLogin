const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.database();

// Fungsi otomatis jalan tiap 1 menit
exports.autoDeleteExpiredKeys = functions.pubsub
  .schedule("every 1 minutes")
  .onRun(async () => {
    const snapshot = await db.ref("keys").once("value");
    const now = new Date();

    snapshot.forEach(child => {
      const data = child.val();
      if (data.created) {
        const created = new Date(data.created);
        const diffMinutes = (now - created) / (1000 * 60);

        // 🧹 Hapus key kalau lebih dari 1 menit
        if (diffMinutes >= 1) {
          db.ref("keys/" + child.key).remove();
          console.log("Key dihapus otomatis:", child.key);
        }
      }
    });
    return null;
  });
