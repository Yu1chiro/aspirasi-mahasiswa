import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import { getDatabase, get, ref, onValue, remove } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-database.js";
        const firebaseConfig = {
            apiKey: "AIzaSyDaOtiESsSL_uU8fayZWRfWhdSXghSrCE8",
            authDomain: "portal-aspirasi.firebaseapp.com",
            projectId: "portal-aspirasi",
            storageBucket: "portal-aspirasi.appspot.com",
            messagingSenderId: "302052118377",
            appId: "1:302052118377:web:e24e63611072c43c92f7f8",
            measurementId: "G-ZKJ9KETMSG"
        };

        const app = initializeApp(firebaseConfig);
        const database = getDatabase(app);
        
        const tableBody = document.getElementById('aspirasi-table-body');
        const exportBtn = document.getElementById('export-btn');

        // Fetch data from Firebase and populate table
        const aspirasiRef = ref(database, 'aspirasi-mahasiswa');
        onValue(aspirasiRef, (snapshot) => {
            tableBody.innerHTML = ''; // Clear the table body
            const data = snapshot.val();
            if (data) {
                Object.keys(data).forEach((key) => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td class="py-2 px-4 border-b border-gray-200 text-black">${data[key].prodi}</td>
                        <td class="py-2 px-4 border-b border-gray-200 text-black text-start">${data[key].aspirasi}</td>
                        <td class="py-2 px-4 border-b border-gray-200">
                        <h3 class=" text-red-500 text-center font-bold cursor-pointer rounded delete-btn" data-id="${key}">Hapus</h3>
                        </td>
                    `;
                    tableBody.appendChild(row);
                });
            }

            // Add event listeners to delete buttons
            document.querySelectorAll('.delete-btn').forEach((button) => {
                button.addEventListener('click', async () => {
                    const prodi = button.getAttribute('data-id');
                    await remove(ref(database, 'aspirasi-mahasiswa/' + prodi));
                    Swal.fire('Deleted!', 'Data telah dihapus.', 'success');
                });
            });
        });

        // Function to extract data from Firebase and download as Excel
        const extractData = async () => {
            const dataRef = ref(database, 'aspirasi-mahasiswa');
            try {
                const snapshot = await get(dataRef);
                if (snapshot.exists()) {
                    const data = snapshot.val();
                    const extractedData = [];

                    Object.keys(data).forEach(key => {
                        const item = data[key];
                        extractedData.push({
                            PRODI: item.prodi,
                            ASPIRASI: item.aspirasi
                        });
                    });

                    const worksheet = XLSX.utils.json_to_sheet(extractedData);
                    const workbook = XLSX.utils.book_new();
                    XLSX.utils.book_append_sheet(workbook, worksheet, "AspirasiMahasiswa");

                    XLSX.writeFile(workbook, "Aspirasi-Mahasiswa.xlsx");
                    Swal.fire('Success!', 'Data berhasil diekstrak dan diunduh.', 'success');
                } else {
                    Swal.fire('No Data', 'Tidak ada data aspirasi yang tersedia untuk diekstrak.', 'info');
                }
            } catch (error) {
                console.error("Error extracting data from database", error);
                Swal.fire('Error', 'Terjadi kesalahan saat mengekstrak data.', 'error');
            }
        };

        // Add event listener to export button
        exportBtn.addEventListener('click', extractData);