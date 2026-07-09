<?php
$host = '127.0.0.1';
$db = 'rishividya';
$user = 'postgres';
$pass = 'secret';
$port = '5432';

$dsn = "pgsql:host=$host;port=$port;dbname=$db";
$pdo = new PDO($dsn, $user, $pass);
$pdo->exec('DELETE FROM student_fee_period_balances');
echo "Deleted all projected balances.";
