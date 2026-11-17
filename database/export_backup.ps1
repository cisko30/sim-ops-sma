# ==============================================================================
# SCRIPT BACKUP LENGKAP DATABASE SIM-OPS SMA NU KAPLONGAN (SUPABASE CLOUD)
# ==============================================================================

$endpoint = "https://qyiurmxyoqbyfounrttq.supabase.co/rest/v1"
$headers = @{
    "apikey" = "sb_publishable_742ol4uuTvugt8sBBNmwGQ_DC-GC-Em"
    "Authorization" = "Bearer sb_publishable_742ol4uuTvugt8sBBNmwGQ_DC-GC-Em"
}

$tables = @(
    "sekolah",
    "gtk",
    "rombel",
    "mapel",
    "siswa",
    "jurnal_harian",
    "jurnal_aktivitas",
    "aktivitas_timeline",
    "simops_sync_state"
)

$backupDir = Join-Path $PSScriptRoot "backups"
if (-not (Test-Path $backupDir)) {
    New-Item -ItemType Directory -Path $backupDir -Force | Out-Null
}

$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$dateReadable = Get-Date -Format "dd MMMM yyyy, HH:mm:ss 'WIB'"
$jsonFile = Join-Path $backupDir "backup_simops_smanukaplongan_$timestamp.json"
$sqlFile = Join-Path $backupDir "backup_simops_smanukaplongan_$timestamp.sql"
$latestJson = Join-Path $backupDir "latest_backup.json"
$latestSql = Join-Path $backupDir "latest_backup.sql"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "MEMULAI PROSES BACKUP DATABASE SIM-OPS SMA NU KAPLONGAN" -ForegroundColor Cyan
Write-Host "Waktu Backup : $dateReadable" -ForegroundColor Yellow
Write-Host "==========================================================" -ForegroundColor Cyan

$backupData = [ordered]@{}
$counts = [ordered]@{}

foreach ($t in $tables) {
    try {
        $url = "$endpoint/$($t)?select=*"
        $res = Invoke-RestMethod -Uri $url -Headers $headers -Method Get
        $arr = @()
        if ($res -is [array]) {
            $arr = $res
        } elseif ($res -ne $null) {
            $arr = @($res)
        }
        $backupData[$t] = $arr
        $counts[$t] = $arr.Count
        Write-Host ("  -> Berhasil mengunduh tabel {0,-20} : {1,3} baris" -f $t, $arr.Count) -ForegroundColor Green
    } catch {
        Write-Host ("  -> GAGAL mengunduh tabel {0,-20} : {1}" -f $t, $_.Exception.Message) -ForegroundColor Red
        $backupData[$t] = @()
        $counts[$t] = 0
    }
}

# 1. Simpan ke format JSON
$meta = [ordered]@{
    school_name = "SMA NU Kaplongan"
    npsn = "20216007"
    akreditasi = "A"
    headmaster = "Drs. H. Toufik Zaenal Mustofa, M.Pd.I"
    operator_coordinator = "Bagas Pratama, S.Kom (NIP: 199104152020121008)"
    project_id = "qyiurmxyoqbyfounrttq"
    backup_created_at = (Get-Date).ToString("o")
    backup_readable_date = $dateReadable
    tables_summary = $counts
}

$finalJson = [ordered]@{
    metadata = $meta
    database = $backupData
}

$jsonContent = $finalJson | ConvertTo-Json -Depth 10
Set-Content -Path $jsonFile -Value $jsonContent -Encoding UTF8
Set-Content -Path $latestJson -Value $jsonContent -Encoding UTF8
Write-Host "`n[OK] File JSON Backup tersimpan:" -ForegroundColor Yellow
Write-Host "     $jsonFile" -ForegroundColor Gray

# 2. Simpan ke format SQL Dump (PostgreSQL compatible)
function Escape-SqlValue($val) {
    if ($null -eq $val) { return "NULL" }
    if ($val -is [bool]) { return $(if ($val) { "TRUE" } else { "FALSE" }) }
    if ($val -is [int] -or $val -is [long] -or $val -is [double] -or $val -is [decimal]) { return $val.ToString() }
    if ($val -is [PSCustomObject] -or $val -is [hashtable] -or $val -is [array]) {
        $jsonStr = ($val | ConvertTo-Json -Compress -Depth 10) -replace "'", "''"
        return "'$jsonStr'::jsonb"
    }
    $str = $val.ToString() -replace "'", "''"
    return "'$str'"
}

$sb = [System.Text.StringBuilder]::new()
[void]$sb.AppendLine("-- ============================================================================")
[void]$sb.AppendLine("-- BACKUP RESMI DATABASE POSTGRESQL SIM-OPS SMA NU KAPLONGAN")
[void]$sb.AppendLine("-- Sekolah   : SMA NU Kaplongan (NPSN: 20216007, Akreditasi: A)")
[void]$sb.AppendLine("-- Kepsek    : Drs. H. Toufik Zaenal Mustofa, M.Pd.I")
[void]$sb.AppendLine("-- Operator  : Bagas Pratama, S.Kom (NIP/NUPTK: 199104152020121008)")
[void]$sb.AppendLine("-- Waktu     : $dateReadable")
[void]$sb.AppendLine("-- Engine    : Supabase Cloud PostgreSQL (Project: qyiurmxyoqbyfounrttq)")
[void]$sb.AppendLine("-- ============================================================================")
[void]$sb.AppendLine("")
[void]$sb.AppendLine("BEGIN;")
[void]$sb.AppendLine("")

foreach ($t in $tables) {
    $rows = $backupData[$t]
    if ($null -ne $rows -and $rows.Count -gt 0) {
        [void]$sb.AppendLine("-- ----------------------------------------------------------------------------")
        [void]$sb.AppendLine("-- Data Tabel: $t ($($rows.Count) baris)")
        [void]$sb.AppendLine("-- ----------------------------------------------------------------------------")

        foreach ($row in $rows) {
            $cols = @()
            $vals = @()
            $propNames = $row.PSObject.Properties.Name
            foreach ($col in $propNames) {
                $cols += "`"$col`""
                $vals += Escape-SqlValue $row.$col
            }
            $colStr = $cols -join ", "
            $valStr = $vals -join ", "
            [void]$sb.AppendLine("INSERT INTO public.$t ($colStr) VALUES ($valStr) ON CONFLICT DO NOTHING;")
        }
        [void]$sb.AppendLine("")
    }
}

[void]$sb.AppendLine("COMMIT;")
[void]$sb.AppendLine("-- SELESAI RESTORE BACKUP SIM-OPS SMA NU KAPLONGAN")

Set-Content -Path $sqlFile -Value $sb.ToString() -Encoding UTF8
Set-Content -Path $latestSql -Value $sb.ToString() -Encoding UTF8
Write-Host "`n[OK] File SQL Dump Backup tersimpan:" -ForegroundColor Yellow
Write-Host "     $sqlFile" -ForegroundColor Gray

Write-Host "`n==========================================================" -ForegroundColor Green
Write-Host "SUKSES! BACKUP LENGKAP TELAH DIBUAT." -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Green
