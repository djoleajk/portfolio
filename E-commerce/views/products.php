<!DOCTYPE html>
<html>
<head>
    <title>E-commerce - Products</title>
</head>
<body>
    <main class="container my-5">
        <h1>Our Products</h1>
        <div class="products-grid">
            <?php
            $query = "SELECT * FROM products ORDER BY name";
            $result = $conn->query($query);
            
            while ($product = $result->fetch_assoc()) {
                echo "<div class='product-card'>";
                echo "<img src='assets/images/{$product['image']}' alt='{$product['name']}'>";
                echo "<h3>{$product['name']}</h3>";
                echo "<p class='price'>$" . number_format($product['price'], 2) . "</p>";
                echo "<a href='index.php?action=add&id={$product['id']}' class='btn btn-primary'>Add to Cart</a>";
                echo "</div>";
            }
            ?>
        </div>
    </main>
</body>
</html>
