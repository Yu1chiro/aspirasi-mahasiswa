import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";
import { getDatabase, ref, onValue, get } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyDaOtiESsSL_uU8fayZWRfWhdSXghSrCE8",
    authDomain: "portal-aspirasi.firebaseapp.com",
    projectId: "portal-aspirasi",
    storageBucket: "portal-aspirasi.appspot.com",
    messagingSenderId: "302052118377",
    appId: "1:302052118377:web:e24e63611072c43c92f7f8",
    measurementId: "G-ZKJ9KETMSG"
  };
  // Inisialisasi Firebase
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const database = getDatabase(app);

  const checkUserExists = (user) => {
      if (user) {
          const uid = user.uid;
          const usersRef = ref(database, `admin/${uid}`);
          return get(usersRef).then(snapshot => snapshot.exists());
      }
      return Promise.resolve(false);
  };

  const isAdminPage = window.location.href.includes("portal-admin.html");
  const isLoginPage = window.location.href.includes("Login.html");

  const loadingElement = document.getElementById('loading');
  const contentElement = document.getElementById('content');

  loadingElement.style.display = 'block';

  onAuthStateChanged(auth, (user) => {
      if (user) {
          checkUserExists(user).then(isAdmin => {
              if (isAdmin && isAdminPage) {
                  loadingElement.style.display = 'none';
                  contentElement.style.display = 'block';
              } else if (!isAdmin && isAdminPage) {
                  window.location.href = "https://aspirasi-mahasiswa.vercel.app/page-admin/Login.html";
                //   window.location.href = "http://127.0.0.1:5500/page-admin/Login.html";
              } else if (isAdmin && !isAdminPage) {
                // window.location.href = "http://127.0.0.1:5500/page-admin/portal-admin.html";
                  window.location.href = "https://aspirasi-mahasiswa.vercel.app/page-admin/portal-admin.html";
              } else {
                  loadingElement.style.display = 'none';
                  contentElement.style.display = 'block';
              }
          });
      } else {
          if (!isLoginPage) {
            // window.location.href = "http://127.0.0.1:5500/page-admin/Login.html";
              window.location.href = "https://aspirasi-mahasiswa.vercel.app/page-admin/Login.html";
          } else {
              loadingElement.style.display = 'none';
              contentElement.style.display = 'block';
          }
      }
  });
  // Logout
const logoutButton = document.getElementById("logout-button");
if (logoutButton) {
    logoutButton.addEventListener("click", () => {
        signOut(auth).then(() => {
            Swal.fire({
                title: 'Logout successful',
                icon: 'success',
                timer: 5000,
                showConfirmButton: false
            }).then(() => {
                location.href = "https://aspirasi-mahasiswa.vercel.app/page-admin/Login.html";
                // location.href = "http://127.0.0.1:5500/page-admin/Login.html";

            });
        }).catch(error => {
            console.error('Sign out error', error);
        });
    });
};