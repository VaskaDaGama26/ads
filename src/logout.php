<?php
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/db.php';

logout();

echo json_encode([
    'success' => true,
    'message' => 'Вы вышли из системы'
]);
?>