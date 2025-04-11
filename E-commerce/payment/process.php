<?php
session_start();

if (!isset($_SESSION['cart']) || empty($_SESSION['cart'])) {
    echo "<p>Your cart is empty. <a href='index.php?route=products'>Go back to products</a></p>";
    exit;
}

function processPayment($amount, $cardNumber, $expiry, $cvv) {
    // Mock payment processing
    $success = rand(0, 10) > 1; // 90% success rate simulation
    
    if ($success) {
        return [
            'status' => 'success',
            'message' => 'Payment processed successfully',
            'transaction_id' => uniqid('TRX')
        ];
    }
    
    return [
        'status' => 'error',
        'message' => 'Payment failed'
    ];
}

// Simulate payment success
$_SESSION['cart'] = [];
echo "<p>Payment successful! Thank you for your purchase. <a href='index.php?route=home'>Return to Home</a></p>";
?>
