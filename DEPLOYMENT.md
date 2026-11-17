# PANDUAN DEPLOYMENT & ARSITEKTUR SISTEM
# SIM-OPS SMA (Sistem Informasi Manajemen Operasional Sekolah)

Dokumen ini berisi panduan komprehensif implementasi dan deployment SIM-OPS SMA pada lingkungan **Local Development**, **Linux VPS (Production)**, dan **Web Hosting Sekolah (cPanel)**.

---

## 🏗️ 1. Spesifikasi Sistem & Lingkungan

- **Backend Framework**: Laravel 11.x (PHP 8.2 / 8.3)
- **Frontend Framework**: React 18 + Inertia.js + Tailwind CSS (TypeScript)
- **Database**: MySQL 8.0+ / MariaDB 10.6+ (mendukung SQLite untuk local test)
- **Queue & Scheduler**: Laravel Database Queue & Cron Scheduler
- **Storage**: Private Local Storage (dengan adapter Cloudflare R2 / Google Drive)

---

## 💻 2. Setup Local Development

### Langkah 1: Clone & Konfigurasi Lingkungan
```bash
# Masuk ke direktori proyek
cd "d:\FILE SMA\FILE WEB SEKOLAH\OPS SMA"

# Salin konfigurasi environment
cp .env.example .env

# Generate Application Key
php artisan key:generate
```

### Langkah 2: Konfigurasi Database `.env`
Buka file `.env` dan atur koneksi database:
```ini
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=sim_ops_sma
DB_USERNAME=root
DB_PASSWORD=
```
*(Atau gunakan `DB_CONNECTION=sqlite` dengan membuat file `database/database.sqlite`)*

### Langkah 3: Install Dependensi & Migrasi Database
```bash
# Install PHP dependencies
composer install

# Jalankan migrasi dan isi data percontohan resmi (Seeder)
php artisan migrate:fresh --seed

# Buat symbolic link storage privat
php artisan storage:link

# Install dependensi frontend dan build
npm install
npm run build
```

### Langkah 4: Menjalankan Server Lokal
```bash
# Terminal 1: Backend API & Web Server
php artisan serve --port=8000

# Terminal 2: Frontend Vite Development (HMR)
npm run dev

# Terminal 3: Queue Worker (opsional untuk notifikasi background)
php artisan queue:work
```
Akses sistem di browser: **`http://localhost:8000`**
Akun Default:
- **Operator (Super Admin)**: `operator@smaciptabangsa.sch.id` | Kata Sandi: `password123`
- **Waka Kurikulum**: `kurikulum@smaciptabangsa.sch.id` | Kata Sandi: `password123`
- **Kepala Sekolah**: `kepsek@smaciptabangsa.sch.id` | Kata Sandi: `password123`

---

## 🐧 3. Deployment Production (Linux VPS Ubuntu 22.04/24.04)

### A. Persiapan Server & Paket Pendukung
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y nginx mysql-server php8.2-fpm php8.2-mysql php8.2-mbstring \
php8.2-xml php8.2-bcmath php8.2-curl php8.2-zip php8.2-gd supervisor certbot python3-certbot-nginx
```

### B. Konfigurasi Nginx (`/etc/nginx/sites-available/sim-ops-sma`)
```nginx
server {
    listen 80;
    server_name sim-ops.sma-ciptabangsa.sch.id;
    root /var/www/sim-ops-sma/public;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";
    add_header X-XSS-Protection "1; mode=block";

    index index.php;
    charset utf-8;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    # Proteksi berkas privat agar tidak dapat diakses langsung via URL
    location ~ ^/storage/app/private/ {
        deny all;
        return 404;
    }

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

### C. Izin Berkas (File Permissions)
```bash
sudo chown -R www-data:www-data /var/www/sim-ops-sma
sudo chmod -R 775 /var/www/sim-ops-sma/storage /var/www/sim-ops-sma/bootstrap/cache
```

### D. Konfigurasi Supervisor untuk Queue Worker
Buat file `/etc/supervisor/conf.d/sim-ops-worker.conf`:
```ini
[program:sim-ops-worker]
process_name=%(program_name)s_%(process_num)02d
command=php /var/www/sim-ops-sma/artisan queue:work database --sleep=3 --tries=3 --max-time=3600
autostart=true
autorestart=true
user=www-data
numprocs=2
redirect_stderr=true
stdout_logfile=/var/www/sim-ops-sma/storage/logs/worker.log
stopwaitsecs=3600
```
Jalankan:
```bash
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start sim-ops-worker:*
```

### E. Laravel Scheduler (Cron Job)
Tambahkan ke crontab server (`crontab -e -u www-data`):
```cron
* * * * * cd /var/www/sim-ops-sma && php artisan schedule:run >> /dev/null 2>&1
```

---

## 🔒 4. Keamanan & Backup Otomatis

1. **Enkripsi Data Sensitif**: Kolom rekening siswa pada modul PIP dienkripsi menggunakan OpenSSL cipher AES-256-CBC (`'account_number_encrypted' => 'encrypted'`).
2. **Signed Download Route**: Seluruh dokumen arsip ijazah, akta, dan KK hanya dapat diunduh melalui temporary URL bertandatangan kriptografis dengan masa berlaku 15 menit.
3. **Audit Trail**: Seluruh tindakan login, modifikasi data, impor Dapodik, persetujuan SK, dan review jurnal dicatat pada tabel `activity_logs` tanpa mencatat data rahasia/password.
4. **Prosedur Backup Database Harian**:
```bash
# Backup otomatis setiap jam 02:00 WIB
0 2 * * * mysqldump -u root -p'PASSWORD' sim_ops_sma | gzip > /var/backups/sim_ops_sma_$(date +\%F).sql.gz
```

