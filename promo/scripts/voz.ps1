# =========================================================
# Locución con las voces neuronales de Windows (sin servicios externos)
# ---------------------------------------------------------
# Lee un JSON [{ "id": "01", "text": "…" }] y escribe un WAV por frase
# en promo/public/voz/<prefijo>-<id>.wav, más <prefijo>.json con la
# duración de cada uno (la composición de Remotion la usa para el ritmo).
# Uso:  powershell -File promo/scripts/voz.ps1 -Lines <json> -Prefix 190e [-Voice Pablo] [-Rate 1.08]
# Los números conviene escribirlos con palabras en el texto que se lee.
# =========================================================
param(
  [Parameter(Mandatory = $true)][string]$Lines,
  [Parameter(Mandatory = $true)][string]$Prefix,
  [string]$Voice = "Pablo",
  [double]$Rate = 1.08
)
$ErrorActionPreference = "Stop"
Add-Type -AssemblyName System.Runtime.WindowsRuntime
$null = [Windows.Media.SpeechSynthesis.SpeechSynthesizer, Windows.Media.SpeechSynthesis, ContentType = WindowsRuntime]
$null = [Windows.Storage.Streams.DataReader, Windows.Storage.Streams, ContentType = WindowsRuntime]

# Espera a una operación asíncrona de WinRT desde PowerShell 5.1
$asTask = [System.WindowsRuntimeSystemExtensions].GetMethods() | Where-Object { $_.Name -eq "AsTask" -and $_.GetParameters().Count -eq 1 -and $_.GetParameters()[0].ParameterType.Name -eq "IAsyncOperation``1" } | Select-Object -First 1
function Await($op, [Type]$type) { $t = $asTask.MakeGenericMethod($type).Invoke($null, @($op)); $t.Wait(-1) | Out-Null; $t.Result }

$synth = New-Object Windows.Media.SpeechSynthesis.SpeechSynthesizer
$v = [Windows.Media.SpeechSynthesis.SpeechSynthesizer]::AllVoices | Where-Object { $_.DisplayName -like "*$Voice*" -and $_.Language -like "es-*" } | Select-Object -First 1
if (-not $v) { throw "No encuentro la voz $Voice en español" }
$synth.Voice = $v
$synth.Options.SpeakingRate = $Rate

$out = Join-Path $PSScriptRoot "..\public\voz"
New-Item -ItemType Directory -Force $out | Out-Null
$items = Get-Content $Lines -Raw -Encoding UTF8 | ConvertFrom-Json
$manifest = @()
foreach ($it in $items) {
  $stream = Await ($synth.SynthesizeTextToStreamAsync($it.text)) ([Windows.Media.SpeechSynthesis.SpeechSynthesisStream])
  $reader = New-Object Windows.Storage.Streams.DataReader($stream.GetInputStreamAt(0))
  $size = [uint32]$stream.Size
  $null = Await ($reader.LoadAsync($size)) ([uint32])
  $bytes = New-Object byte[] $size
  $reader.ReadBytes($bytes)
  $file = Join-Path $out "$Prefix-$($it.id).wav"
  [IO.File]::WriteAllBytes($file, $bytes)
  # Duración desde la cabecera WAV: bytes de datos / bytes por segundo
  $byteRate = [BitConverter]::ToUInt32($bytes, 28)
  $seconds = [math]::Round(($bytes.Length - 44) / $byteRate, 2)
  $manifest += [pscustomobject]@{ id = $it.id; file = "voz/$Prefix-$($it.id).wav"; seconds = $seconds }
  Write-Output ("✔ {0}-{1}.wav · {2} s" -f $Prefix, $it.id, $seconds)
}
$manifest | ConvertTo-Json | Out-File (Join-Path $out "$Prefix.json") -Encoding utf8
Write-Output "Voz: $($v.DisplayName) · velocidad $Rate"
