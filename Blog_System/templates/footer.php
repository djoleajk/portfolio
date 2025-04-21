</div><!-- /.container -->

    <footer class="footer">
        <div class="container">
            <div class="text-center">
                <p>&copy; <?php echo date('Y'); ?> Simple PHP CMS. All rights reserved - Agencija Sprint</p>
            </div>
        </div>
    </footer>

    <!-- Bootstrap Bundle with Popper -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
    
    <!-- jQuery -->
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    
    <!-- Custom Scripts -->
    <script>
        // Enable Bootstrap tooltips
        var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
        var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl)
        })

        // Enable Bootstrap popovers
        var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
        var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
            return new bootstrap.Popover(popoverTriggerEl)
        })

        // Auto-hide alerts after 5 seconds
        window.setTimeout(function() {
            document.querySelectorAll(".alert").forEach(function(alert) {
                if (alert.classList.contains("alert-dismissible")) {
                    new bootstrap.Alert(alert).close()
                }
            })
        }, 5000)

        // Handle edit post button click
        $('.edit-post').click(function() {
            var postId = $(this).data('id');
            // TODO: Implement edit post functionality
            alert('Edit post ' + postId);
        });

        // Handle edit category button click
        $('.edit-category').click(function() {
            var categoryId = $(this).data('id');
            // TODO: Implement edit category functionality
            alert('Edit category ' + categoryId);
        });

        // Handle edit tag button click
        $('.edit-tag').click(function() {
            var tagId = $(this).data('id');
            // TODO: Implement edit tag functionality
            alert('Edit tag ' + tagId);
        });
    </script>
</body>
</html>