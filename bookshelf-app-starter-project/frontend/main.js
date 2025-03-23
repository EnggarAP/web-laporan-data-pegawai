//username:enggar_ardi
// Menjalankan kode setelah konten HTML dimuat sepenuhnya
document.addEventListener('DOMContentLoaded', function () {

  // Memanggil fungsi untuk menampilkan daftar buku saat halaman dimuat
  tampilkanBuku();

  // Menangani penyerahan formulir untuk menambah buku baru
  document.getElementById('bookForm').addEventListener('submit', function (e) {
      e.preventDefault(); // Mencegah halaman untuk refresh

      // Mengambil nilai input dari formulir
      const judul = document.getElementById('bookFormTitle').value;
      const penulis = document.getElementById('bookFormAuthor').value;
      const tahun = parseInt(document.getElementById('bookFormYear').value); // Mengonversi tahun ke number
      const selesaiDibaca = document.getElementById('bookFormIsComplete').checked;

      // Membuat objek untuk buku baru
      const bukuBaru = {
          id: generateID(), // Memanggil fungsi untuk menghasilkan ID unik
          title: judul,
          author: penulis,
          year: tahun,
          isComplete: selesaiDibaca
      };

      // Mengambil data buku dari localStorage, menambahkan buku baru, dan menyimpan kembali
      let buku = ambilDariLocalStorage();
      buku.push(bukuBaru);
      simpanKeLocalStorage(buku);

      // Memanggil fungsi untuk menampilkan kembali daftar buku yang diperbarui
      tampilkanBuku();
      
      // Mengosongkan formulir setelah buku ditambahkan
      document.getElementById('bookForm').reset();
  });

  // Fungsi untuk menampilkan daftar buku dari localStorage
  function tampilkanBuku() {
      const daftarBukuBelumSelesai = document.getElementById('incompleteBookList');
      const daftarBukuSelesai = document.getElementById('completeBookList');

      // Mengambil data buku dari localStorage
      let buku = ambilDariLocalStorage();

      // Mengosongkan daftar buku sebelum menambahkan buku kembali
      daftarBukuBelumSelesai.innerHTML = '';
      daftarBukuSelesai.innerHTML = '';

      // Melooping setiap buku dan menambahkannya ke dalam daftar buku yang sesuai
      buku.forEach((buku) => {
          const bukuElemen = buatElemenBuku(buku); // Memanggil fungsi untuk membuat elemen buku

          if (buku.isComplete) {
              daftarBukuSelesai.appendChild(bukuElemen); // Menambahkan buku ke daftar buku selesai jika sudah dibaca
          } else {
              daftarBukuBelumSelesai.appendChild(bukuElemen); // Menambahkan buku ke daftar buku belum selesai jika belum dibaca
          }
      });
  }

  // Fungsi untuk membuat elemen buku dengan data yang diberikan
// Fungsi untuk membuat elemen buku dengan data yang diberikan
function buatElemenBuku(buku) {
    const bukuElemen = document.createElement('div');
    bukuElemen.setAttribute('data-testid', 'bookItem'); // Tambahkan data-testid untuk item buku
    bukuElemen.setAttribute('data-bookid', buku.id); // Menambahkan atribut data-bookid untuk identifikasi buku

    // Menyusun elemen HTML untuk menampilkan detail buku
    bukuElemen.innerHTML = `
        <p data-testid="bookItemTitle">Judul: ${buku.title}</p>
        <p data-testid="bookItemAuthor">Penulis: ${buku.author}</p>
        <p data-testid="bookItemYear">Tahun: ${buku.year}</p>
        <p>Status: ${buku.isComplete ? 'Selesai dibaca' : 'Belum selesai dibaca'}</p>
        <div>
            <button data-testid="bookItemIsCompleteButton">${buku.isComplete ? 'Belum selesai dibaca' : 'Selesai dibaca'}</button>
            <button class="delete" data-testid="bookItemDeleteButton">Hapus Buku</button>
            <button class="edit">Edit Buku</button>
        </div>
    `;

    // Menangani klik tombol "Selesai/Belum selesai dibaca"
    bukuElemen.querySelector('[data-testid="bookItemIsCompleteButton"]').addEventListener('click', () => {
        toggleStatusBuku(buku.id); // Panggil fungsi untuk mengubah status selesai/belum selesai
    });

    // Menangani klik tombol Edit Buku
    bukuElemen.querySelector('.edit').addEventListener('click', () => {
        editBuku(buku.id); // Memanggil fungsi untuk mengedit buku
    });

    // Menangani klik tombol Hapus Buku
    bukuElemen.querySelector('.delete').addEventListener('click', () => {
        hapusBuku(buku.id); // Memanggil fungsi untuk menghapus buku
    });

    return bukuElemen; // Mengembalikan elemen buku yang sudah dibuat
}

// Fungsi untuk mengubah status selesai/belum selesai buku berdasarkan ID
function toggleStatusBuku(bookId) {
    let buku = ambilDariLocalStorage(); // Ambil data buku dari localStorage
    buku.forEach(item => {
        if (item.id === bookId) {
            item.isComplete = !item.isComplete; // Mengubah status selesai/belum selesai
        }
    });

    simpanKeLocalStorage(buku); // Simpan perubahan ke localStorage
    tampilkanBuku(); // Tampilkan kembali daftar buku yang sudah diperbarui
}



  // Fungsi untuk menyimpan data buku ke dalam localStorage
  function simpanKeLocalStorage(buku) {
      localStorage.setItem('buku', JSON.stringify(buku));
  }

  // Fungsi untuk mengambil data buku dari localStorage
  function ambilDariLocalStorage() {
      return JSON.parse(localStorage.getItem('buku')) || []; // Mengembalikan array kosong jika data belum tersedia
  }

  // Fungsi untuk menghasilkan ID unik untuk buku baru
  function generateID() {
      return Date.now(); // Menggunakan timestamp sebagai ID unik
  }

  // Fungsi untuk menghapus buku berdasarkan ID
  function hapusBuku(bookId) {
      let buku = ambilDariLocalStorage(); // Mengambil data buku dari localStorage
      buku = buku.filter(item => item.id !== parseInt(bookId)); // Menghapus buku yang sesuai dengan ID yang diberikan
      simpanKeLocalStorage(buku); // Menyimpan kembali data buku yang sudah diubah ke dalam localStorage
      tampilkanBuku(); // Memanggil fungsi untuk menampilkan kembali daftar buku yang diperbarui
  }

  // Fungsi untuk mengedit buku berdasarkan ID
  function editBuku(bookId) {
      let buku = ambilDariLocalStorage(); // Mengambil data buku dari localStorage
      const bukuDiedit = buku.find(item => item.id === parseInt(bookId)); // Menemukan buku yang sesuai dengan ID yang diberikan

      // Membuat form edit buku secara dinamis
      const formEdit = document.createElement('div');
      formEdit.innerHTML = `
          <form id="editForm">
              <h2>Edit Buku</h2>
              <div>
                  <label for="editFormTitle">Judul</label>
                  <input id="editFormTitle" type="text" value="${bukuDiedit.title}" required />
              </div>
              <div>
                  <label for="editFormAuthor">Penulis</label>
                  <input id="editFormAuthor" type="text" value="${bukuDiedit.author}" required />
              </div>
              <div>
                  <label for="editFormYear">Tahun</label>
                  <input id="editFormYear" type="number" value="${bukuDiedit.year}" required />
              </div>
              <div>
                  <label for="editFormIsComplete">Selesai dibaca</label>
                  <input id="editFormIsComplete" type="checkbox" ${bukuDiedit.isComplete ? 'checked' : ''} />
              </div>
              <button id="editFormSubmit" type="submit">Simpan Perubahan</button>
          </form>
      `;

      // Menambahkan form edit ke dalam elemen utama (main) di halaman HTML
      const main = document.querySelector('main');
      main.appendChild(formEdit);

      // Menangani penyerahan formulir untuk menyimpan perubahan buku
      document.getElementById('editForm').addEventListener('submit', function (e) {
          e.preventDefault(); // Mencegah halaman untuk refresh

          // Mengambil nilai input dari formulir edit
          const judul = document.getElementById('editFormTitle').value;
          const penulis = document.getElementById('editFormAuthor').value;
          const tahun = parseInt(document.getElementById('editFormYear').value);
          const selesaiDibaca = document.getElementById('editFormIsComplete').checked;

          // Mengubah nilai buku yang sedang diedit
          buku.forEach(item => {
              if (item.id === parseInt(bookId)) {
                  item.title = judul;
                  item.author = penulis;
                  item.year = tahun;
                  item.isComplete = selesaiDibaca;
              }
          });

          simpanKeLocalStorage(buku); // Menyimpan kembali data buku yang sudah diubah ke dalam localStorage
          main.removeChild(formEdit); // Menghapus form edit dari halaman HTML setelah penyimpanan selesai
          tampilkanBuku(); // Memanggil fungsi untuk menampilkan kembali daftar buku yang diperbarui
      });
  }
});
