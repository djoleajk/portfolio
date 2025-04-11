<?php
session_start();
require_once 'config/database.php';
require_once 'includes/auth.php';

// Odredi stranicu za učitavanje
$stranica = isset($_GET['page']) ? $_GET['page'] : 'home';

// Obradi akciju "rezervacija"
if ($stranica === 'book' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $ime = $_POST['name'];
    $email = $_POST['email'];
    $telefon = $_POST['phone'];
    $datum = $_POST['date'];
    $vreme = $_POST['time'];

    // Unesi rezervaciju u bazu podataka
    $stmt = $db->prepare("INSERT INTO reservations (name, email, phone, date, time) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param('sssss', $ime, $email, $telefon, $datum, $vreme);

    if ($stmt->execute()) {
        echo "<script>alert('Rezervacija uspešno kreirana!'); window.location.href='index.php?page=reservations';</script>";
    } else {
        echo "<script>alert('Došlo je do greške prilikom kreiranja rezervacije.'); window.location.href='index.php?page=reservations';</script>";
    }
    exit;
}

// Obradi akcije "potvrdi" i "otkaži"
if ($stranica === 'admin' && isset($_GET['action']) && isset($_GET['id'])) {
    $action = $_GET['action'];
    $id = intval($_GET['id']);

    if ($action === 'confirm') {
        $stmt = $db->prepare("UPDATE reservations SET status = 'potvrđeno' WHERE id = ?");
    } elseif ($action === 'cancel') {
        $stmt = $db->prepare("UPDATE reservations SET status = 'otkazano' WHERE id = ?");
    }

    if (isset($stmt)) {
        $stmt->bind_param('i', $id);
        if ($stmt->execute()) {
            echo "<script>alert('Akcija uspešno izvršena!'); window.location.href='index.php?page=admin';</script>";
        } else {
            echo "<script>alert('Došlo je do greške prilikom izvršavanja akcije.'); window.location.href='index.php?page=admin';</script>";
        }
    }
    exit;
}

// Učitaj odgovarajuću stranicu
$fajl_sablona = 'templates/' . $stranica . '.php';
if (file_exists($fajl_sablona)) {
    // Pass the $db variable to the template
    include $fajl_sablona;
} else {
    echo "Stranica nije pronađena.";
}
?>
