param()

# stdin에서 JSON 읽기
$input_json = [Console]::In.ReadToEnd()

# 빈 입력 방어
if (-not $input_json) {
  exit 0
}

# JSON 파싱 시도
$data = $null
try {
  $data = $input_json | ConvertFrom-Json -ErrorAction Stop
} catch {
  exit 0
}

$file = $data.tool_input.file_path

# 파일 경로 검증
if (-not $file) {
  exit 0
}

# 경로 정규화 (백슬래시로 통일)
$file_normalized = $file -replace '/', '\'

# 경로 필터링: src 폴더 포함 확인
if ($file_normalized -notmatch '\\src\\') {
  exit 0
}

# 확장자 확인
if ($file -notmatch '\.(ts|tsx)$') {
  exit 0
}

# 테스트 파일 자체는 제외
if ($file -match '\.test\.(ts|tsx)$') {
  exit 0
}

# 테스트 파일 경로 계산
$base_path = $file -replace '\.(ts|tsx)$', ''
$test_file_ts = "$base_path.test.ts"
$test_file_tsx = "$base_path.test.tsx"

# 테스트 파일 존재 여부 확인
$test_exists = (Test-Path $test_file_ts) -or (Test-Path $test_file_tsx)

# 테스트 파일이 없으면 경고 출력
if (-not $test_exists) {
  [Console]::Error.WriteLine("⚠ 테스트 파일 없음: $file")
}

exit 0
