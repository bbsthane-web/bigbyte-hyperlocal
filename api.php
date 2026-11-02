<?php
/**
 * Turnkey cPanel PHP Backend Proxy for Big Byte Social Studio
 * Allows 100% static/PHP hosting on standard cPanel without requiring Node.js.
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

$dataDir = __DIR__ . '/data';
if (!is_dir($dataDir)) {
    mkdir($dataDir, 0755, true);
}

$clientsFile = $dataDir . '/clients.json';
$postsFile = $dataDir . '/posts.json';
$configFile = $dataDir . '/config.json';

function readJsonFile($file, $fallback = []) {
    if (!file_exists($file)) return $fallback;
    $raw = file_get_contents($file);
    // Strip BOM
    if (substr($raw, 0, 3) === "\xEF\xBB\xBF") {
        $raw = substr($raw, 3);
    }
    $decoded = json_decode($raw, true);
    return is_array($decoded) ? $decoded : $fallback;
}

function writeJsonFile($file, $data) {
    file_put_contents($file, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
}

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$method = $_SERVER['REQUEST_METHOD'];

// Health check
if (strpos($uri, '/api/status') !== false) {
    $clients = readJsonFile($clientsFile, []);
    $posts = readJsonFile($postsFile, []);
    echo json_encode([
        'status' => 'online',
        'hosting' => 'cPanel PHP LAMP',
        'activeClient' => $clients[0]['name'] ?? 'Big Byte Systems',
        'totalClients' => count($clients),
        'totalPosts' => count($posts)
    ]);
    exit;
}

// GET /api/clients
if (strpos($uri, '/api/clients') !== false && $method === 'GET') {
    echo json_encode(readJsonFile($clientsFile, []));
    exit;
}

// POST /api/clients
if (strpos($uri, '/api/clients') !== false && $method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    if (!$input) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid JSON']);
        exit;
    }
    $all = readJsonFile($clientsFile, []);
    $id = $input['id'] ?? ('client_' . time());
    $input['id'] = $id;
    $found = false;
    foreach ($all as $k => $c) {
        if ($c['id'] === $id) {
            $all[$k] = array_merge($c, $input);
            $found = true;
            break;
        }
    }
    if (!$found) $all[] = $input;
    writeJsonFile($clientsFile, $all);
    echo json_encode(['success' => true, 'client' => $input]);
    exit;
}

// GET /api/posts
if (strpos($uri, '/api/posts') !== false && $method === 'GET') {
    $posts = readJsonFile($postsFile, []);
    if (!empty($_GET['clientId'])) {
        $cid = $_GET['clientId'];
        $posts = array_values(array_filter($posts, function($p) use ($cid) {
            return ($p['clientId'] ?? '') === $cid;
        }));
    }
    echo json_encode($posts);
    exit;
}

// POST /api/posts
if (strpos($uri, '/api/posts') !== false && $method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    if (!$input) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid JSON']);
        exit;
    }
    $all = readJsonFile($postsFile, []);
    $input['id'] = $input['id'] ?? ('post_' . time());
    $input['status'] = $input['status'] ?? 'Scheduled';
    $input['createdAt'] = date('c');
    array_unshift($all, $input);
    writeJsonFile($postsFile, $all);
    echo json_encode(['success' => true, 'post' => $input]);
    exit;
}

// POST /api/publish-now
if (strpos($uri, '/api/publish-now') !== false && $method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true) ?? [];
    $clients = readJsonFile($clientsFile, []);
    $config = readJsonFile($configFile, ['webhookUrl' => 'https://hook.eu1.make.com/3j97xsx8t9cd9xcjpnypqhjw9i1mumwo']);
    
    $targetUrl = $config['webhookUrl'];
    foreach ($clients as $c) {
        if ($c['id'] === ($input['clientId'] ?? '')) {
            if (!empty($c['webhookUrl'])) $targetUrl = $c['webhookUrl'];
            break;
        }
    }

    // Format full caption for Facebook / Instagram / Socials
    $title = trim($input['title'] ?? '');
    $content = trim($input['content'] ?? '');
    $fullCaption = ($title && strpos($content, $title) !== 0) ? ($title . "\n\n" . $content) : $content;
    $img = $input['image'] ?? ($input['mediaUrl'] ?? '/assets/blog_macbook_repair.jpg');
    if (strpos($img, '/') === 0) {
        $img = 'https://bigbytesystems.co.in' . $img;
    }

    // Unconditional GMB Sanitization
    $gmbSummary = $content;
    $gmbSummary = preg_replace('/\b0?9\d{9}\b/', '', $gmbSummary);
    $gmbSummary = preg_replace('/\b\d{5}\s*\d{5}\b/', '', $gmbSummary);
    $gmbSummary = preg_replace('/090547\s*90592/', '', $gmbSummary);
    $gmbSummary = preg_replace('/📞[^\n]+/', '', $gmbSummary);
    $gmbSummary = preg_replace('/https?:\/\/[^\s]+/', '', $gmbSummary);
    $gmbSummary = preg_replace('/💬[^\n]+/', '', $gmbSummary);
    $gmbSummary = trim(preg_replace('/\n{3,}/', "\n\n", $gmbSummary));
    if (strpos($gmbSummary, 'Call now') === false) {
        $gmbSummary .= "\n\nTap the 'Call now' button below to consult directly with our senior technicians.";
    }
    $gmbTitle = (strlen($title) > 48) ? (substr($title, 0, 45) . '...') : $title;

    $input['title'] = $title;
    $input['gmbTitle'] = $gmbTitle;
    $input['content'] = $content;
    $input['summary'] = $gmbSummary;
    $input['gmbSummary'] = $gmbSummary;
    $input['description'] = $fullCaption;
    $input['caption'] = $fullCaption;
    $input['message'] = $fullCaption;
    $input['text'] = $fullCaption;
    $input['postText'] = $fullCaption;
    $input['fileName'] = 'reel_' . ($input['id'] ?? 'video') . '.mp4';
    $input['mediaUrl'] = $img;
    $input['photoUrl'] = $img;
    $input['photos'] = [['url' => $img]];

    // Direct Native Meta Graph API Mode (100% Free, Zero Middleware)
    $fbPageId = $config['facebookPageId'] ?? '';
    $fbToken = $config['facebookPageAccessToken'] ?? '';
    if (($input['platform'] ?? '') === 'facebook' && !empty($fbPageId) && !empty($fbToken)) {
        $metaUrl = "https://graph.facebook.com/v19.0/" . rawurlencode($fbPageId) . "/photos";
        $metaPayload = json_encode([
            'url' => $img,
            'caption' => $fullCaption,
            'access_token' => $fbToken
        ]);
        $mch = curl_init($metaUrl);
        curl_setopt($mch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($mch, CURLOPT_POST, true);
        curl_setopt($mch, CURLOPT_POSTFIELDS, $metaPayload);
        curl_setopt($mch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
        $mresp = curl_exec($mch);
        $mcode = curl_getinfo($mch, CURLINFO_HTTP_CODE);
        curl_close($mch);
        if ($mcode >= 200 && $mcode < 300) {
            $mdata = json_decode($mresp, true);
            echo json_encode([
                'success' => true,
                'directApi' => true,
                'postId' => $mdata['post_id'] ?? ($mdata['id'] ?? '')
            ]);
            exit;
        }
    }

    $ch = curl_init($targetUrl);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($input));
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    $resp = curl_exec($ch);
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    $success = ($code >= 200 && $code < 300);
    echo json_encode(['success' => $success, 'statusCode' => $code]);
    exit;
}

// Translate Action (100% Free Multi-Country Zero-API-Key Engine)
if ($action === 'translate' && $method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    $lang = $input['targetLang'] ?? 'hi';
    
    function translatePhpSnippet($str, $tl) {
        if (empty($str) || $tl === 'en') return $str;
        $url = 'https://api.mymemory.translated.net/get?q=' . urlencode(substr($str, 0, 500)) . '&langpair=en|' . $tl;
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0');
        $res = curl_exec($ch);
        curl_close($ch);
        if ($res) {
            $data = json_decode($res, true);
            if (!empty($data['responseData']['translatedText'])) {
                return $data['responseData']['translatedText'];
            }
        }
        return $str;
    }

    $trTitle = translatePhpSnippet($input['title'] ?? '', $lang);
    $trHook = translatePhpSnippet($input['videoHook'] ?? '', $lang);
    $trContent = translatePhpSnippet($input['text'] ?? '', $lang);

    echo json_encode([
        'success' => true,
        'targetLang' => $lang,
        'translatedTitle' => $trTitle,
        'translatedHook' => $trHook,
        'translatedContent' => $trContent
    ]);
    exit;
}

// Fallback
echo json_encode(['error' => 'Route not found']);

