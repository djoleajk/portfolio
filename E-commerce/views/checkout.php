<main class="container my-5">
    <h1 class="mb-4">Checkout</h1>
    <div class="checkout-summary">
        <?php
        if (!isset($_SESSION['cart']) || empty($_SESSION['cart'])) {
            echo "<p>Your cart is empty.</p>";
        } else {
            $total = 0;
            foreach ($_SESSION['cart'] as $product_id => $quantity) {
                $query = "SELECT * FROM products WHERE id = ?";
                $stmt = $conn->prepare($query);
                $stmt->bind_param("i", $product_id);
                $stmt->execute();
                $result = $stmt->get_result();
                $product = $result->fetch_assoc();

                if ($product) {
                    $subtotal = $product['price'] * $quantity;
                    $total += $subtotal;
                    ?>
                    <div class="checkout-item">
                        <h3><?php echo htmlspecialchars($product['name']); ?></h3>
                        <p>Price: $<?php echo number_format($product['price'], 2); ?></p>
                        <p>Quantity: <?php echo $quantity; ?></p>
                        <p>Subtotal: $<?php echo number_format($subtotal, 2); ?></p>
                    </div>
                    <?php
                }
            }
            ?>
            <div class="checkout-total">
                <h3>Total: $<?php echo number_format($total, 2); ?></h3>
                <form method="post" action="index.php?route=payment">
                    <button type="submit" class="btn btn-success">Confirm and Pay</button>
                </form>
            </div>
            <?php
        }
        ?>
    </div>
</main>
