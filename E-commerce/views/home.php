<!DOCTYPE html>
<html>
<head>
    <title>E-commerce - Home</title>
</head>
<body>
    <header>
        <nav>
            <a href="index.php?route=home">Home</a>
            <a href="index.php?route=products">Products</a>
            <a href="index.php?route=categories">Categories</a>
            <a href="index.php?route=cart">Cart</a>
            <?php if (isset($_SESSION['admin'])): ?>
                <a href="index.php?route=admin">Admin Panel</a>
            <?php endif; ?>
        </nav>
    </header>
    <main class="container">
        <div class="hero-section my-4">
            <h1>Welcome to our E-commerce Store</h1>
        </div>
        <div class="featured-products">
            <h2>Featured Products</h2>
            <div class="products-grid">
                <?php
                $query = "SELECT * FROM products LIMIT 4"; // Display 4 featured products
                $result = $conn->query($query);

                if ($result && $result->num_rows > 0) {
                    while ($product = $result->fetch_assoc()) {
                        echo "<div class='product-card'>";
                        echo "<img src='assets/images/{$product['image']}' class='product-image' alt='{$product['name']}'>";
                        echo "<div class='product-info'>";
                        echo "<h3>" . htmlspecialchars($product['name']) . "</h3>";
                        echo "<p class='product-price'>$" . number_format($product['price'], 2) . "</p>";
                        echo "<a href='index.php?route=products' class='btn btn-primary'>View All Products</a>";
                        echo "</div></div>";
                    }
                } else {
                    echo "<p>No featured products available.</p>";
                }
                ?>
            </div>
        </div>
    </main>
</body>
</html>
