<?php
// Economic calendar proxy for Trading Dashboard Pro.
// Downloads the ForexFactory weekly feed at most every 30 minutes (5 with ?fresh=1) and serves a cached copy.
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
$cache  = __DIR__ . '/ff-cache.json';
$maxAge = isset($_GET['fresh']) ? 300 : 1800;
if (is_file($cache) && time() - filemtime($cache) < $maxAge) { readfile($cache); exit; }

$url  = 'https://nfs.faireconomy.media/ff_calendar_thisweek.json';
$data = false;
if (function_exists('curl_init')) {
  $ch = curl_init($url);
  curl_setopt_array($ch, [CURLOPT_RETURNTRANSFER => true, CURLOPT_TIMEOUT => 10, CURLOPT_FOLLOWLOCATION => true, CURLOPT_USERAGENT => 'Mozilla/5.0 TradingDashboard']);
  $data = curl_exec($ch);
  curl_close($ch);
}
if ($data === false || $data === '') {
  $ctx  = stream_context_create(['http' => ['timeout' => 10, 'header' => "User-Agent: Mozilla/5.0 TradingDashboard\r\n"]]);
  $data = @file_get_contents($url, false, $ctx);
}
if ($data !== false && strlen(ltrim($data)) > 1 && ltrim($data)[0] === '[') {
  @file_put_contents($cache, $data, LOCK_EX);
  echo $data; exit;
}
if (is_file($cache)) { readfile($cache); exit; }   // feed blocked or down: serve the last good copy
http_response_code(502);
echo '[]';
