

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyB78X7ICt026-btzB1eTtCOR-mH9Y-Q6D0",
  authDomain: "fortest-8d1bc.firebaseapp.com",
  databaseURL: "https://fortest-8d1bc-default-rtdb.firebaseio.com",
  projectId: "fortest-8d1bc",
  storageBucket: "fortest-8d1bc.appspot.com",
  messagingSenderId: "624726931251",
  appId: "1:624726931251:web:test"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

function generateKey() {
  const lastGenerated = localStorage.getItem("lastGenerated");
  let savedKey = localStorage.getItem("generatedKey");

  if (lastGenerated && savedKey) {
    const lastDate = new Date(lastGenerated);
    const now = new Date();
    const diffMinutes = (now - lastDate) / (1000 * 60);

    if (diffMinutes < 1) {
      // Hitung sisa waktu dalam detik
      let remainingSeconds = Math.floor((1 - diffMinutes) * 60);

      // Tampilkan popup & key lama
      document.getElementById("popup").style.display = "block";
      document.getElementById("keyValue").innerText = savedKey;
      const titleElement = document.getElementById("title");

      // Hapus interval lama kalau ada
      if (window.countdownInterval) clearInterval(window.countdownInterval);

      // Jalankan hitung mundur
      window.countdownInterval = setInterval(() => {
        remainingSeconds--;

        if (remainingSeconds <= 0) {
          clearInterval(window.countdownInterval);

          // 🔥 Hapus otomatis dari Firebase dan localStorage
          db.ref("keys/" + savedKey).remove()
            .then(() => console.log("Key lama otomatis dihapus dari Firebase."))
            .catch((err) => console.error("Gagal hapus key:", err));

          localStorage.removeItem("generatedKey");
          localStorage.removeItem("lastGenerated");

          titleElement.innerText = "Key kamu sudah kedaluwarsa dan otomatis dihapus.\nSilakan buat key baru sekarang.";
          document.getElementById("keyValue").innerText = "";
          return;
        }

        const minutes = Math.floor(remainingSeconds / 60);
        const seconds = remainingSeconds % 60;

        titleElement.innerText =
          `Kamu sudah membuat key login kurang dari 1 menit lalu.\n` +
          `Tunggu ${minutes} menit ${seconds} detik lagi, key lama akan terhapus otomatis.\n\n` +
          `Ini key kamu sebelumnya:`;
      }, 1000);

      return;
    } else {
      // Jika sudah lewat tapi belum dihapus (misalnya user baru buka halaman)
      db.ref("keys/" + savedKey).remove()
        .then(() => console.log("Key lama dihapus otomatis (cek awal halaman)."))
        .catch((err) => console.error("Gagal hapus key:", err));
      localStorage.removeItem("generatedKey");
      localStorage.removeItem("lastGenerated");
    }
  }

  // Generate key baru
  let key = "DX_KEY-" + Math.random().toString(36).substring(2, 10).toUpperCase();

  // Simpan key baru
  localStorage.setItem("generatedKey", key);
  localStorage.setItem("lastGenerated", new Date().toISOString());

  // Simpan ke Firebase
  db.ref("keys/" + key).set({
    status: "active",
    keyLogin: key,
    created: new Date().toISOString()
  });

  // Tampilkan popup key baru
  document.getElementById("popup").style.display = "block";
  document.getElementById("keyValue").innerText = key;
  document.getElementById("title").innerText =
    "Ini key login kamu yang baru (berlaku 1 menit).";
}

function closePopup(){
    document.getElementById("popup").style.display = "none";
    document.getElementById("content").classList.remove("blur");
}
function copyButton() {
  // ambil teks dari elemen <p>
  var text = document.getElementById("keyValue").innerText;

  // salin teks ke clipboard
  navigator.clipboard.writeText(text);

  // tampilkan pesan
  alert("Teks berhasil disalin: " + text);
}

function restart() {
    localStorage.removeItem("lastGenerated");

}