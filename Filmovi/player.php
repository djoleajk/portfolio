<?php
require_once 'config/database.php';

// Check if ID is provided
if (!isset($_GET['id']) || !is_numeric($_GET['id'])) {
    header("Location: index.php");
    exit();
}

// Get movie data
$stmt = $pdo->prepare("SELECT * FROM movies WHERE id = ?");
$stmt->execute([$_GET['id']]);
$movie = $stmt->fetch(PDO::FETCH_ASSOC);

// Redirect if movie not found
if (!$movie || !isset($movie['magnet_link'])) {
    header("Location: index.php");
    exit();
}

// Set default values if data is missing
$movie['title'] = $movie['title'] ?? 'Nepoznat naslov';
$videoUrl = $movie['magnet_link'] ?? ''; // We'll keep using magnet_link field but for video URLs
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo htmlspecialchars($movie['title']); ?> - Player</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="css/style.css">
    <style>
        .player-container {
            max-width: 1200px;
            margin: 20px auto;
            padding: 0 15px;
        }
        .video-wrapper {
            position: relative;
            padding-bottom: 56.25%;
            height: 0;
            background: #000;
        }
        .video-wrapper iframe {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            border: 0;
        }
        #status {
            padding: 10px;
            background: #f8f9fa;
            margin: 10px 0;
            border-radius: 4px;
        }
        
        .movie-header {
            margin-bottom: 20px;
        }
        /* Remove any nav-related styles as they're now handled by Bootstrap */
    </style>
</head>
<body>
    <?php include 'includes/nav.php'; ?>
    
    <div class="player-container">
        <div class="movie-header">
            <h2><?php echo htmlspecialchars($movie['title']); ?></h2>
        </div>
        <div class="video-wrapper">
            <div id="player"></div>
        </div>
        <div id="status">Učitavanje videa...</div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"></script>
    <script>
        const videoUrl = <?php echo json_encode($videoUrl); ?>;
        const statusElement = document.getElementById('status');
        const playerElement = document.getElementById('player');

        const videoServices = {
            youtube: {
                match: url => url.includes('youtube.com') || url.includes('youtu.be'),
                getVideoId: url => {
                    const patterns = [
                        /(?:youtube\.com\/watch\?v=)([^&]+)/,
                        /(?:youtu\.be\/)([^?]+)/,
                        /(?:youtube\.com\/embed\/)([^?]+)/
                    ];
                    for (const pattern of patterns) {
                        const match = url.match(pattern);
                        if (match && match[1]) return match[1];
                    }
                    return null;
                },
                getEmbed: id => `https://www.youtube.com/embed/${id}?autoplay=1&rel=0&controls=1&modestbranding=1&showinfo=1`
            },
            vimeo: {
                match: url => url.includes('vimeo.com'),
                getVideoId: url => {
                    const match = url.match(/(?:vimeo\.com(?:\/video)?\/)([\d]+)/);
                    return match ? match[1] : null;
                },
                getEmbed: id => `https://player.vimeo.com/video/${id}?autoplay=1&controls=1`
            },
            dailymotion: {
                match: url => url.includes('dailymotion.com') || url.includes('dai.ly'),
                getVideoId: url => {
                    const match = url.match(/(?:dailymotion\.com(?:\/video|\/embed\/video)|dai\.ly)\/([a-zA-Z0-9]+)(?:_[\w-]+)?/);
                    return match ? match[1] : null;
                },
                getEmbed: id => `https://www.dailymotion.com/embed/video/${id}?autoplay=1&controls=1`
            },
            streamtape: {
                match: url => url.includes('streamtape.com'),
                getVideoId: url => {
                    const match = url.match(/streamtape\.com\/(?:v|e)\/([a-zA-Z0-9]+)/);
                    return match ? match[1] : null;
                },
                getEmbed: id => `https://streamtape.com/e/${id}`
            },
            mixdrop: {
                match: url => url.includes('mixdrop.co'),
                getVideoId: url => {
                    const match = url.match(/mixdrop\.co\/(?:f|e)\/([a-zA-Z0-9]+)/);
                    return match ? match[1] : null;
                },
                getEmbed: id => `https://mixdrop.co/e/${id}`
            },
            vidlox: {
                match: url => url.includes('vidlox.me'),
                getVideoId: url => {
                    const match = url.match(/vidlox\.me\/(?:embed-)?([a-zA-Z0-9]+)/);
                    return match ? match[1] : null;
                },
                getEmbed: id => `https://vidlox.me/embed-${id}`
            },
            upstream: {
                match: url => url.includes('upstream.to'),
                getVideoId: url => {
                    const match = url.match(/upstream\.to\/(?:embed-)?([a-zA-Z0-9]+)/);
                    return match ? match[1] : null;
                },
                getEmbed: id => `https://upstream.to/embed-${id}`
            }
        };

        function prikaziVideo() {
            try {
                if (!videoUrl) {
                    throw new Error('Video link nije dostupan');
                }

                // Proveri sve video servise
                for (const [name, service] of Object.entries(videoServices)) {
                    if (service.match(videoUrl)) {
                        const videoId = service.getVideoId(videoUrl);
                        if (videoId) {
                            const embedUrl = service.getEmbed(videoId);
                            playerElement.innerHTML = `
                                <iframe 
                                    src="${embedUrl}"
                                    allowfullscreen
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    frameborder="0"
                                    webkitallowfullscreen
                                    mozallowfullscreen
                                ></iframe>`;
                            statusElement.style.display = 'none';
                            return;
                        }
                    }
                }

                // Direktan embed kod
                if (videoUrl.includes('<iframe') || videoUrl.includes('<embed')) {
                    playerElement.innerHTML = videoUrl;
                    statusElement.style.display = 'none';
                    return;
                }

                throw new Error('Video link nije podržan. Koristite YouTube, Vimeo, Dailymotion, Streamtape, Mixdrop, Vidlox, Upstream ili direktan embed kod.');

            } catch (error) {
                console.error('Player error:', error);
                statusElement.textContent = error.message || 'Greška pri učitavanju videa';
            }
        }

        // Pokreni video kad se stranica učita
        window.addEventListener('load', prikaziVideo);
    </script>
</body>
</html>
