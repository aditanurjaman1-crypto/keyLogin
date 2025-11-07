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
  // Cek kapan terakhir kali generate key
  const lastGenerated = localStorage.getItem("lastGenerated");
  // cek generate key terakhir
  let savedKey = localStorage.getItem("generatedKey");

  if (lastGenerated) {
    const lastDate = new Date(lastGenerated);
    const now = new Date();

    // Hitung selisih waktu (dalam jam)
    const diffHours = (now - lastDate) / (1000 * 60 * 60);

    if (diffHours <24) {
    // ini listerner jika key sudah dibuat
    document.getElementById("popup").style.display = "block";
    document.getElementById("keyValue").innerText = savedKey;
    document.getElementById("title").innerText = "Kamu sudah membuat key login sebelumnya kembali besok untuk membuat kode baru, ini kode terakhir kamu:";
    return;
    }
  }

  // Generate key baru
  let key = "DX_KEY-" + Math.random().toString(36).substring(2, 10).toUpperCase();

  // simpan key 
  localStorage.setItem("generatedKey", key);

  // Simpan ke Firebase
  db.ref("keys/" + key).set({
    status: "active",
    keyLogin: key,
    created: new Date().toISOString()
  });

  // Tampilan halaman pop up
  document.getElementById("keyValue").innerText = key;
  document.getElementById("popup").style.display = "block";
  document.getElementById("title").innerText = "Ini key login kamu:";

  // Simpan waktu terakhir generate
  localStorage.setItem("lastGenerated", new Date().toISOString());
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