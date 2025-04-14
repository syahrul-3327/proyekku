
function showAddFamilyForm() {
  const parentOptions = familyMembers.map(member => `<option value="${member.id}">${member.name}</option>`).join('');
  const spouseOptions = familyMembers.map(member => `<option value="${member.id}">${member.name}</option>`).join('');

  const formHTML = `
    <div class="card">
      <div class="card-body">
        <h5 class="card-title">Tambah Anggota Keluarga</h5>
        <form id="addFamilyForm">
          <div class="mb-3">
            <label for="name" class="form-label">Nama</label>
            <input type="text" class="form-control" id="name" required>
          </div>
          <div class="mb-3">
            <label for="gender" class="form-label">Gender</label>
            <select class="form-control" id="gender" required>
              <option value="male">Laki-laki</option>
              <option value="female">Perempuan</option>
            </select>
          </div>
          <div class="mb-3">
            <label for="dob" class="form-label">Tanggal Lahir</label>
            <input type="date" class="form-control" id="dob" required>
          </div>
          <div class="mb-3">
            <label for="parents" class="form-label">Orang Tua</label>
            <select class="form-control" id="parents">
              <option value="">-- Pilih Orang Tua --</option>
              ${parentOptions}
            </select>
          </div>
          <div class="mb-3">
            <label for="spouse" class="form-label">Pasangan</label>
            <select class="form-control" id="spouse">
              <option value="">-- Pilih Pasangan --</option>
              ${spouseOptions}
            </select>
          </div>
          <div class="mb-3">
            <label for="photo" class="form-label">Unggah Foto</label>
            <input type="file" class="form-control" id="photo" accept="image/*" onchange="previewImage(event)">
            <img id="photoPreview" class="preview-image" src="default-avatar.png" alt="Preview Foto">
          </div>
          <div class="d-flex justify-content-between">
            <button type="submit" class="btn btn-primary">Simpan</button>
            <button type="button" class="btn btn-secondary" onclick="showFamilyList()">Batal</button>
          </div>
        </form>
      </div>
    </div>
  `;
  document.getElementById('main-content').innerHTML = formHTML;

  document.getElementById('addFamilyForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const gender = document.getElementById('gender').value;
    const dob = document.getElementById('dob').value;
    const parents = document.getElementById('parents').value;
    const spouse = document.getElementById('spouse').value;
    const photo = document.getElementById('photoPreview').src;

    addFamilyMember(name, gender, dob, parents, spouse, photo);
  });
}

function previewImage(event) {
  const reader = new FileReader();
  reader.onload = function () {
    const output = document.getElementById('photoPreview');
    output.src = reader.result;
  };
  reader.readAsDataURL(event.target.files[0]);
}

function addFamilyMember(name, gender, dob, parents, spouse, photo) {
  const newMember = {
    id: Date.now(),
    name,
    gender,
    dob,
    age: calculateAge(dob),
    parents: parents || null,
    spouse: spouse || null,
    photo: photo || 'default-avatar.png',
  };
  familyMembers.push(newMember);
  localStorage.setItem('familyMembers', JSON.stringify(familyMembers));
  alert('Anggota keluarga berhasil ditambahkan!');
  showFamilyList();
}

function calculateAge(dob) {
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

function showFamilyList() {
  let listHTML = `
    <table class="table">
      <thead>
        <tr>
          <th>Foto</th>
          <th>Nama</th>
          <th>Gender</th>
          <th>Tanggal Lahir</th>
          <th>Usia</th>
          <th>Pasangan</th>
          <th>Orang Tua</th>
          <th>Aksi</th>
        </tr>
      </thead>
      <tbody>
  `;
  if (familyMembers.length === 0) {
    listHTML += `
      <tr>
        <td colspan="8" class="text-center">Belum ada anggota keluarga yang terdaftar</td>
      </tr>
    `;
  } else {
    familyMembers.forEach(member => {
      const spouse = familyMembers.find(m => m.id === member.spouse)?.name || 'Tidak Ada';
      const parents = familyMembers.find(m => m.id === member.parents)?.name || 'Tidak Ada';

      listHTML += `
        <tr>
          <td><img src="${member.photo || 'default-avatar.png'}" alt="${member.name}" class="img-thumbnail" style="max-width: 50px;"></td>
          <td>${member.name}</td>
          <td>${member.gender === 'male' ? 'Laki-laki' : 'Perempuan'}</td>
          <td>${member.dob}</td>
          <td>${member.age}</td>
          <td>${spouse}</td>
          <td>${parents}</td>
          <td>
            <button class="btn btn-warning btn-sm" onclick="editFamilyMember(${member.id})">Edit</button>
            <button class="btn btn-danger btn-sm" onclick="deleteFamilyMember(${member.id})">Hapus</button>
          </td>
        </tr>
      `;
    });
  }
  listHTML += '</tbody></table>';
  document.getElementById('main-content').innerHTML = listHTML;
}
// File script untuk logika aplikasi
let familyMembers = JSON.parse(localStorage.getItem('familyMembers')) || [];

// Tampilkan daftar anggota keluarga di halaman utama saat aplikasi dimuat
document.addEventListener('DOMContentLoaded', () => {
  showFamilyList();
});



function deleteFamilyMember(id) {
  const member = familyMembers.find(member => member.id === id);
  const confirmation = confirm(`Apakah Anda yakin ingin menghapus anggota keluarga bernama "${member.name}"?`);

  if (confirmation) {
    familyMembers = familyMembers.filter(member => member.id !== id);
    localStorage.setItem('familyMembers', JSON.stringify(familyMembers));
    alert(`Anggota keluarga "${member.name}" berhasil dihapus.`);
    showFamilyList();
  } else {
    alert(`Penghapusan anggota keluarga "${member.name}" dibatalkan.`);
  }
}

// Fungsi untuk menampilkan formulir edit anggota keluarga
function editFamilyMember(id) {
  const member = familyMembers.find(member => member.id === id);
  if (!member) {
    alert('Anggota keluarga tidak ditemukan!');
    return;
  }

  const parentOptions = familyMembers.map(m => `<option value="${m.id}" ${m.id === member.parents ? 'selected' : ''}>${m.name}</option>`).join('');
  const spouseOptions = familyMembers.map(m => `<option value="${m.id}" ${m.id === member.spouse ? 'selected' : ''}>${m.name}</option>`).join('');

  const formHTML = `
    <div class="card">
      <div class="card-body">
        <h5 class="card-title">Edit Anggota Keluarga</h5>
        <form id="editFamilyForm">
          <div class="mb-3">
            <label for="editName" class="form-label">Nama</label>
            <input type="text" class="form-control" id="editName" value="${member.name}" required>
          </div>
          <div class="mb-3">
            <label for="editGender" class="form-label">Gender</label>
            <select class="form-control" id="editGender" required>
              <option value="male" ${member.gender === 'male' ? 'selected' : ''}>Laki-laki</option>
              <option value="female" ${member.gender === 'female' ? 'selected' : ''}>Perempuan</option>
            </select>
          </div>
          <div class="mb-3">
            <label for="editDob" class="form-label">Tanggal Lahir</label>
            <input type="date" class="form-control" id="editDob" value="${member.dob}" required>
          </div>
          <div class="mb-3">
            <label for="editParents" class="form-label">Orang Tua</label>
            <select class="form-control" id="editParents">
              <option value="">-- Pilih Orang Tua --</option>
              ${parentOptions}
            </select>
          </div>
          <div class="mb-3">
            <label for="editSpouse" class="form-label">Pasangan</label>
            <select class="form-control" id="editSpouse">
              <option value="">-- Pilih Pasangan --</option>
              ${spouseOptions}
            </select>
          </div>
          <div class="mb-3">
            <label for="editPhoto" class="form-label">Unggah Foto</label>
            <input type="file" class="form-control" id="editPhoto" accept="image/*" onchange="previewEditImage(event)">
            <img id="editPhotoPreview" class="preview-image" src="${member.photo || 'default-avatar.png'}" alt="Preview Foto">
          </div>
          <button type="submit" class="btn btn-primary">Simpan Perubahan</button>
          <button type="button" class="btn btn-secondary" onclick="showFamilyList()">Batal</button>
        </form>
      </div>
    </div>
  `;
  document.getElementById('main-content').innerHTML = formHTML;

  document.getElementById('editFamilyForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('editName').value;
    const gender = document.getElementById('editGender').value;
    const dob = document.getElementById('editDob').value;
    const parents = document.getElementById('editParents').value;
    const spouse = document.getElementById('editSpouse').value;
    const photo = document.getElementById('editPhotoPreview').src;

    saveEditedFamilyMember(id, name, gender, dob, parents, spouse, photo);
  });
}

function previewEditImage(event) {
  const reader = new FileReader();
  reader.onload = function () {
    const output = document.getElementById('editPhotoPreview');
    output.src = reader.result;
  };
  reader.readAsDataURL(event.target.files[0]);
}

function saveEditedFamilyMember(id, name, gender, dob, parents, spouse, photo) {
  const memberIndex = familyMembers.findIndex(member => member.id === id);
  if (memberIndex === -1) {
    alert('Anggota keluarga tidak ditemukan!');
    return;
  }

  // Memperbarui data anggota keluarga
  familyMembers[memberIndex] = {
    ...familyMembers[memberIndex],
    name,
    gender,
    dob,
    age: calculateAge(dob),
    parents: parents !== "" ? parseInt(parents, 10) : null, // Pastikan tipe data parents adalah integer atau null
    spouse: spouse !== "" ? parseInt(spouse, 10) : null,   // Pastikan tipe data spouse adalah integer atau null
    photo: photo || familyMembers[memberIndex].photo,     // Retain old photo if no new photo is provided
  };

  // Simpan ke localStorage
  localStorage.setItem('familyMembers', JSON.stringify(familyMembers));
  alert('Perubahan berhasil disimpan!');
  showFamilyList();
}

// Fungsi untuk menampilkan form pencarian dan hasil pencarian
function showSearchForm() {
  const searchHTML = `
    <div class="card">
      <div class="card-body">
        <h5 class="card-title">Pencarian Anggota Keluarga</h5>
        <form id="searchForm">
          <div class="mb-3">
            <label for="searchQuery" class="form-label">Cari berdasarkan nama</label>
            <input type="text" class="form-control" id="searchQuery" placeholder="Masukkan nama anggota keluarga" required>
          </div>
          <div class="d-flex justify-content-between">
            <button type="submit" class="btn btn-primary">Cari</button>
            <button type="button" class="btn btn-secondary" onclick="showHomePage()">Batal</button>
          </div>
        </form>
        <div id="searchResults" class="mt-3"></div>
      </div>
    </div>
  `;
  document.getElementById('main-content').innerHTML = searchHTML;

  document.getElementById('searchForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const query = document.getElementById('searchQuery').value.toLowerCase();
    searchFamilyMember(query);
  });
}

// Fungsi untuk mencari anggota keluarga berdasarkan nama
function searchFamilyMember(query) {
  const results = familyMembers.filter(member => member.name.toLowerCase().includes(query));

  let resultsHTML = '<h5>Hasil Pencarian:</h5>';
  if (results.length === 0) {
    resultsHTML += '<p>Tidak ada anggota keluarga yang ditemukan.</p>';
  } else {
    resultsHTML += `
      <table class="table">
        <thead>
          <tr>
            <th>Foto</th>
            <th>Nama</th>
            <th>Gender</th>
            <th>Tanggal Lahir</th>
            <th>Usia</th>
            <th>Pasangan</th>
            <th>Orang Tua</th>
          </tr>
        </thead>
        <tbody>
    `;
    results.forEach(member => {
      const spouse = familyMembers.find(m => m.id === member.spouse)?.name || 'Tidak Ada';
      const parents = familyMembers.find(m => m.id === member.parents)?.name || 'Tidak Ada';
      resultsHTML += `
        <tr>
          <td><img src="${member.photo || 'default-avatar.png'}" alt="${member.name}" class="img-thumbnail" style="max-width: 50px;"></td>
          <td>${member.name}</td>
          <td>${member.gender === 'male' ? 'Laki-laki' : 'Perempuan'}</td>
          <td>${member.dob}</td>
          <td>${member.age}</td>
          <td>${spouse}</td>
          <td>${parents}</td>
        </tr>
      `;
    });
    resultsHTML += '</tbody></table>';
  }

  document.getElementById('searchResults').innerHTML = resultsHTML;
}

function showHomePage() {
  const homePageHTML = `
    <div class="card">
      <div class="card-body">
        <h5 class="card-title">Selamat Datang di Aplikasi Keluarga</h5>
        <p class="card-text">Pilih salah satu opsi di bawah ini untuk melanjutkan.</p>
        <button class="btn btn-primary" onclick="showFamilyList()">Lihat Daftar Keluarga</button>
        <button class="btn btn-secondary" onclick="showSearchForm()">Cari Anggota Keluarga</button>
        <button class="btn btn-success" onclick="openFamilyTree()">Lihat Pohon Keluarga</button>
      </div>
    </div>
  `;
  document.getElementById('main-content').innerHTML = homePageHTML;
}

// Fungsi untuk membuka halaman family-tree-enhanced.html
function openFamilyTree() {
  window.open('family-tree-enhanced.html', '_blank'); // Membuka file di tab baru
}
// Tambahan fungsi lainnya seperti showAddFamilyForm, addFamilyMember, dll.