<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Modern E-commerce</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap" rel="stylesheet">
    <link href="/Portfolio/E-commerce/assets/css/style.css" rel="stylesheet">
</head>
<body>
    <nav class="navbar navbar-expand-lg navbar-light">
        <div class="container">
            <a class="navbar-brand" href="index.php?route=home">E-Shop</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav ms-auto">
                    <li class="nav-item"><a class="nav-link" href="index.php?route=home">Home</a></li>
                    <li class="nav-item"><a class="nav-link" href="index.php?route=products">Products</a></li>
                    <li class="nav-item"><a class="nav-link" href="index.php?route=categories">Categories</a></li>
                    <li class="nav-item"><a class="nav-link" href="index.php?route=cart">Cart</a></li>
                    <?php if (isset($_SESSION['admin'])): ?>
                        <li class="nav-item"><a class="nav-link" href="index.php?route=admin">Admin Panel</a></li>
                    <?php endif; ?>
                </ul>
            </div>
        </div>
    </nav>
</body>
</html>
