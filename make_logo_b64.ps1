$b64 = [Convert]::ToBase64String([IO.File]::ReadAllBytes('public\parul-university-logo.png'))
$content = "export const PARUL_LOGO_BASE64 = 'data:image/png;base64," + $b64 + "'"
[IO.File]::WriteAllText((Join-Path (Get-Location) 'src\lib\logoBase64.ts'), $content, [Text.Encoding]::UTF8)
Write-Output "Done, file size: $($content.Length) chars"
