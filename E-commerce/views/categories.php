<!DOCTYPE html>
<html>
<head>
    <title>E-commerce - Categories</title>
</head>
<body>
    <main class="container">
        <h1>Product Categories</h1>
        <div class="categories-grid">
            <?php
            $query = "SELECT * FROM categories";
            $result = $conn->query($query);
            
            if ($result && $result->num_rows > 0) {
                while ($category = $result->fetch_assoc()) {
                    echo "<div class='category-card'>";
                    echo "<h3>" . htmlspecialchars($category['name']) . "</h3>";
                    echo "<p>" . htmlspecialchars($category['description']) . "</p>";
                    echo "<a href='?route=products&category=" . $category['id'] . "' class='btn btn-primary'>View Products</a>";
                    echo "</div>";
                }
            } else {
                echo "<p>No categories found</p>";
            }
            ?>
        </div>
    </main>
</body>
</html>
