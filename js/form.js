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

// Helper function to sanitize input
function sanitizeInput(input) {
    // Remove potentially dangerous HTML tags and content
    let sanitized = input.replace(/<script.*?>.*?<\/script>/gi, '')
                         .replace(/<iframe.*?>.*?<\/iframe>/gi, '')
                         .replace(/<object.*?>.*?<\/object>/gi, '')
                         .replace(/<embed.*?>.*?<\/embed>/gi, '')
                         .replace(/<applet.*?>.*?<\/applet>/gi, '')
                         .replace(/<\/?(?:form|input|button|textarea|select|style)[^>]*>/gi, '')
                         .replace(/<\/?[^>]+>/gi, ''); // Remove remaining HTML tags
    
    // Encode special characters to prevent XSS
    sanitized = sanitized.replace(/&/g, '&amp;')
                         .replace(/</g, '&lt;')
                         .replace(/>/g, '&gt;')
                         .replace(/"/g, '&quot;')
                         .replace(/'/g, '&#39;');
    
    return sanitized;
}

// Handle form submission
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form-aspirasi');
    const submitButton = document.getElementById('submit-aspirasi');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Get form values
        let prodi = document.getElementById('Prodi').value;
        let aspirasi = document.getElementById('aspirasi').value;

        // Sanitize input
        prodi = sanitizeInput(prodi);
        aspirasi = sanitizeInput(aspirasi);

        // Validate input
        if (!prodi || !aspirasi) {
            Swal.fire({
                icon: 'error',
                title: 'Your submit is blocked',
                text: 'Anda terdeteksi memaksukkan inputan berbahaya! harap masukkan inputan yg sesuai',
                showConfirmButton: false
            });
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
