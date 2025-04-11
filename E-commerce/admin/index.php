<?php
session_start();
if (!isset($_SESSION['admin'])) {
    header('Location: login.php');
    exit();
}

$action = $_GET['action'] ?? 'dashboard';
?>

<div class="admin-panel">
    <nav>
        <a href="?action=products">Manage Products</a>
        <a href="?action=orders">Manage Orders</a>
        <a href="?action=categories">Manage Categories</a>
    </nav>
    
    <?php
    switch($action) {
        case 'products':
            include 'products_manage.php';
            break;
        case 'orders':
            include 'orders_manage.php';
            break;
        case 'categories':
            include 'categories_manage.php';
            break;
        default:
            include 'dashboard.php';
    }
    ?>
</div>
