<?php

// Database configuration
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'simple_cms');

// Create database connection
try {
    $db = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
    
    // Check connection
    if ($db->connect_error) {
        throw new Exception("Connection failed: " . $db->connect_error);
    }
    
    // Set charset to utf8mb4
    if (!$db->set_charset("utf8mb4")) {
        throw new Exception("Error setting charset utf8mb4: " . $db->error);
    }

    // Add connection error handling
    $db->options(MYSQLI_OPT_INT_AND_FLOAT_NATIVE, 1);
    $db->set_charset("utf8mb4");

    // Disable strict mode for better compatibility
    $db->query("SET SESSION sql_mode = ''");

    // Enable error reporting
    mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
} catch (Exception $e) {
    die("Database connection failed: " . $e->getMessage());
}

// Function to escape strings
function escape($string) {
    global $db;
    return $db->real_escape_string($string);
}

// Function to get last inserted ID
function lastInsertId() {
    global $db;
    return $db->insert_id;
}

// Function to get number of affected rows
function affectedRows() {
    global $db;
    return $db->affected_rows;
}

// Function to close database connection
function closeConnection() {
    global $db;
    $db->close();
}

// Add prepared statement helper
function prepareAndExecute($sql, $types, $params) {
    global $db;
    $stmt = $db->prepare($sql);
    if ($stmt === false) {
        throw new Exception("Prepare failed: " . $db->error);
    }
    if (!empty($params)) {
        $stmt->bind_param($types, ...$params);
    }
    if (!$stmt->execute()) {
        throw new Exception("Execute failed: " . $stmt->error);
    }
    return $stmt;
}

// Register shutdown function to close connection
register_shutdown_function('closeConnection');
?>