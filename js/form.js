import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import { getDatabase, set, ref } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-database.js"; 

const firebaseConfig = {
    apiKey: "AIzaSyDaOtiESsSL_uU8fayZWRfWhdSXghSrCE8",
    authDomain: "portal-aspirasi.firebaseapp.com",
    projectId: "portal-aspirasi",
    storageBucket: "portal-aspirasi.appspot.com",
    messagingSenderId: "302052118377",
    appId: "1:302052118377:web:e24e63611072c43c92f7f8",
    measurementId: "G-ZKJ9KETMSG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Handle form submission
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form-aspirasi');
    const submitButton = document.getElementById('submit-aspirasi');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Get form values
        const prodi = document.getElementById('Prodi').value;
        const aspirasi = document.getElementById('aspirasi').value;

        // Validate input
        if (!prodi || !aspirasi) {
            alert('Harap mengisi semua kolom!');
            return;
        }

        // Add loading animation to submit button
        submitButton.innerHTML = 'Mengirim...';
        submitButton.disabled = true;

        // Send data to Firebase
        try {
            await set(ref(database, 'aspirasi-mahasiswa/' + prodi), {
                prodi: prodi,
                aspirasi: aspirasi
            });
            
            // Stop loading animation and reset form
            submitButton.innerHTML = 'Kirim Aspirasi';
            submitButton.disabled = false;
            form.reset();
            
            // Show success alert
            Swal.fire({
                icon: 'success',
                title: 'Berhasil!',
                text: 'Aspirasi berhasil dikirim!',
                timer: 1000,
                showConfirmButton: false
            });

        } catch (error) {
            console.error('Error writing to Firebase Database', error);
            alert('Gagal mengirim aspirasi. Silakan coba lagi.');
            
            // Stop loading animation in case of error
            submitButton.innerHTML = 'Kirim Aspirasi';
            submitButton.disabled = false;
        }
    });
});