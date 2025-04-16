let familyMembers = [];

function showAddForm() {
    document.getElementById('add-member-form').classList.remove('hidden');
}

function hideAddForm() {
    document.getElementById('add-member-form').classList.add('hidden');
}



function populateDropdowns() {
    const spouseDropdown = document.getElementById('spouse');
    const fatherDropdown = document.getElementById('father');
    const motherDropdown = document.getElementById('mother');
    
    // Kosongkan dropdown sebelum mengisi ulang
    spouseDropdown.innerHTML = '<option value="">-- Pilih Nama Pasangan --</option>';
    fatherDropdown.innerHTML = '<option value="">-- Pilih Nama Ayah --</option>';
    motherDropdown.innerHTML = '<option value="">-- Pilih Nama Ibu --</option>';
    
    // Isi dropdown dengan data anggota keluarga yang ada
    familyMembers.forEach(member => {
        const option = document.createElement('option');
        option.value = member.name;
        option.textContent = member.name;
        
        // Tambahkan ke semua dropdown
        spouseDropdown.appendChild(option.cloneNode(true));
        fatherDropdown.appendChild(option.cloneNode(true));
        motherDropdown.appendChild(option.cloneNode(true));
    });
}

function resetForm() {
    // Reset semua input pada formulir tambah anggota
    document.getElementById('name').value = '';
    document.getElementById('gender').value = 'Laki-laki'; // Set default ke Laki-laki
    document.getElementById('birth-date').value = '';
    document.getElementById('spouse').value = '';
    document.getElementById('father').value = '';
    document.getElementById('mother').value = '';
    
    // Reset input foto
    const photoInput = document.getElementById('photo');
    photoInput.value = ''; // Kosongkan file input

    // Sembunyikan preview foto
    const photoPreview = document.getElementById('photo-preview');
    photoPreview.style.display = 'none';
    photoPreview.src = '';
}

function calculateAge(birthDate) {
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
    }
    return age;
}



function updateFamilyTable() {
    const tableBody = document.getElementById('family-table');
    tableBody.innerHTML = '';
    familyMembers.forEach((member, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${member.name}</td>
            <td>${member.gender}</td>
            <td>${member.birthDate}</td>
            <td>${member.age}</td>
            <td>${member.spouse}</td>
            <td>${member.father} / ${member.mother}</td>
            <td>
                <img src="${member.photo}" alt="Foto ${member.name}" width="50" height="50" style="border-radius: 50%;">
            </td>
            <td>
                <button onclick="editMember(${index})">Edit</button>
                <button onclick="deleteMember(${index})">Hapus</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Panggil populateDropdowns saat aplikasi dimuat
document.addEventListener('DOMContentLoaded', populateDropdowns);

function calculateAge(birthDate) {
    const birth = new Date(birthDate);
    const today = new Date();

    let years = today.getFullYear() - birth.getFullYear();
    let months = today.getMonth() - birth.getMonth();

    // Jika bulan saat ini kurang dari bulan lahir, kurangi 1 tahun dan tambahkan 12 bulan
    if (months < 0) {
        years--;
        months += 12;
    }

    // Jika tanggal saat ini kurang dari tanggal lahir, kurangi 1 bulan
    if (today.getDate() < birth.getDate()) {
        months--;
        if (months < 0) {
            years--;
            months += 12;
        }
    }

    // Format hasil
    let ageString = "";
    if (years > 0) {
        ageString += `${years} Tahun`;
    }
    if (months > 0) {
        ageString += years > 0 ? `, ${months} Bulan` : `${months} Bulan`;
    }

    return ageString || "Kurang dari 1 Bulan"; // Jika usia kurang dari 1 bulan
}

function updateStatistics() {
    document.getElementById('total-members').innerText = familyMembers.length;
    document.getElementById('total-males').innerText = familyMembers.filter(m => m.gender === 'Laki-laki').length;
    document.getElementById('total-females').innerText = familyMembers.filter(m => m.gender === 'Perempuan').length;
}

document.getElementById('addForm').addEventListener('submit', addMember);

// Fungsi untuk menampilkan preview foto
function previewPhoto(event) {
    const photoInput = event.target;
    const photoPreview = document.getElementById('photo-preview');

    // Jika ada file yang dipilih
    if (photoInput.files && photoInput.files[0]) {
        const reader = new FileReader();

        // Ketika file selesai dibaca
        reader.onload = function(e) {
            photoPreview.src = e.target.result; // Set URL gambar ke src
            photoPreview.style.display = 'block'; // Tampilkan elemen gambar
        };

        // Baca file sebagai URL data
        reader.readAsDataURL(photoInput.files[0]);
    } else {
        // Jika tidak ada file, sembunyikan preview
        photoPreview.style.display = 'none';
        photoPreview.src = '';
    }
}

let editIndex = null; // Indeks anggota yang sedang diedit

// Fungsi untuk membuka formulir tambah/edit dengan data anggota
function editMember(index) {
    const member = familyMembers[index];
    editIndex = index; // Simpan indeks anggota yang sedang diedit

    // Isi formulir dengan data anggota
    document.getElementById('name').value = member.name;
    document.getElementById('gender').value = member.gender;
    document.getElementById('birth-date').value = member.birthDate;
    document.getElementById('spouse').value = member.spouse;
    document.getElementById('father').value = member.father;
    document.getElementById('mother').value = member.mother;

    // Tampilkan preview foto jika ada
    const photoPreview = document.getElementById('photo-preview');
    if (member.photo) {
        photoPreview.src = member.photo;
        photoPreview.style.display = 'block';
    } else {
        photoPreview.style.display = 'none';
    }

    // Tampilkan formulir
    document.getElementById('add-member-form').classList.remove('hidden');
}




// Fungsi untuk memperbarui tabel keluarga
function updateFamilyTable() {
    const tableBody = document.getElementById('family-table');
    tableBody.innerHTML = '';
    familyMembers.forEach((member, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${member.name}</td>
            <td>${member.gender}</td>
            <td>${member.birthDate}</td>
            <td>${calculateAge(member.birthDate)}</td>
            <td>${member.spouse}</td>
            <td>${member.father} / ${member.mother}</td>
            <td>
                <img src="${member.photo}" alt="Foto ${member.name}" width="50" height="50" style="border-radius: 50%;">
            </td>
            <td>
                <button onclick="editMember(${index})">Edit</button>
                <button onclick="deleteMember(${index})">Hapus</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Fungsi untuk menyimpan data ke LocalStorage
function saveToLocalStorage() {
    localStorage.setItem('familyMembers', JSON.stringify(familyMembers));
}

// Fungsi untuk mengambil data dari LocalStorage
function loadFromLocalStorage() {
    const storedData = localStorage.getItem('familyMembers');
    if (storedData) {
        familyMembers = JSON.parse(storedData);
    } else {
        familyMembers = []; // Jika tidak ada data, inisialisasi sebagai array kosong
    }
}

// Panggil fungsi untuk memuat data dari LocalStorage saat aplikasi dimuat
document.addEventListener('DOMContentLoaded', () => {
    loadFromLocalStorage();
    updateFamilyTable(); // Perbarui tabel dengan data dari LocalStorage
    updateStatistics(); // Perbarui statistik dengan data dari LocalStorage
    populateDropdowns(); // Perbarui dropdown dengan data dari LocalStorage
});

// Perbarui fungsi `addMember` untuk menyimpan data ke LocalStorage setelah menambah atau mengedit anggota
function addMember(event) {
    event.preventDefault();

    // Ambil data dari input
    const name = document.getElementById('name').value;
    const gender = document.getElementById('gender').value;
    const birthDate = document.getElementById('birth-date').value;
    const spouse = document.getElementById('spouse').value;
    const father = document.getElementById('father').value;
    const mother = document.getElementById('mother').value;
    const photoFile = document.getElementById('photo').files[0];

    // Fungsi untuk menyimpan anggota setelah foto diubah menjadi Base64
    function saveMember(photoBase64) {
        const age = calculateAge(birthDate);
        const newMember = {
            name,
            gender,
            birthDate,
            age,
            spouse,
            father,
            mother,
            photo: photoBase64 // Simpan foto dalam format Base64
        };

        if (editIndex !== null) {
            // Update anggota yang sedang diedit
            familyMembers[editIndex] = newMember;
            editIndex = null; // Reset editIndex
        } else {
            // Tambahkan anggota baru
            familyMembers.push(newMember);
        }

        // Simpan ke LocalStorage
        saveToLocalStorage();

        // Update tabel keluarga dan statistik
        updateFamilyTable();
        updateStatistics();
        populateDropdowns();

        // Reset formulir
        resetForm();

        // Sembunyikan formulir
        hideAddForm();
    }

    if (photoFile) {
        // Jika ada file foto, ubah menjadi Base64
        const reader = new FileReader();
        reader.onload = function(e) {
            saveMember(e.target.result); // Simpan data setelah foto diubah menjadi Base64
        };
        reader.readAsDataURL(photoFile);
    } else {
        // Jika tidak ada foto, simpan data tanpa foto
        saveMember('');
    }
}

// Perbarui fungsi `deleteMember` untuk menyimpan data ke LocalStorage setelah menghapus anggota
function deleteMember(index) {
    if (confirm("Apakah Anda yakin ingin menghapus anggota ini?")) {
        familyMembers.splice(index, 1); // Hapus anggota dari array
        saveToLocalStorage(); // Simpan data yang diperbarui ke LocalStorage
        updateFamilyTable(); // Perbarui tabel
        updateStatistics(); // Perbarui statistik
        populateDropdowns(); // Perbarui dropdown
    }
}

function searchFamilyMembers() {
    const searchInput = document.getElementById('search').value.toLowerCase(); // Ambil nilai input pencarian
    const tableBody = document.getElementById('family-table'); // Ambil elemen tabel
    tableBody.innerHTML = ''; // Kosongkan tabel sebelum ditampilkan ulang

    // Filter anggota keluarga berdasarkan nama
    const filteredMembers = familyMembers.filter(member => 
        member.name.toLowerCase().includes(searchInput)
    );

    // Tampilkan data yang sudah difilter
    filteredMembers.forEach((member, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${member.name}</td>
            <td>${member.gender}</td>
            <td>${member.birthDate}</td>
            <td>${calculateAge(member.birthDate)}</td>
            <td>${member.spouse}</td>
            <td>${member.father} / ${member.mother}</td>
            <td>
                <img src="${member.photo}" alt="Foto ${member.name}" width="50" height="50" style="border-radius: 50%;">
            </td>
            <td>
                <button onclick="editMember(${index})">Edit</button>
                <button onclick="deleteMember(${index})">Hapus</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

