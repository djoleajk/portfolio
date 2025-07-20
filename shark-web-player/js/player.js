document.addEventListener('DOMContentLoaded', function() {
    // Core elements
    const progress = document.querySelector('.progress');
    const progressBar = document.querySelector('.progress-bar');
    const timer = document.querySelector('.timer');
    const playlist = document.getElementById('playlist');
    
    // Create single audio instance
    const audioPlayer = new Audio();
    
    // Add volume control elements
    const volumeSlider = document.getElementById('volume');
    const volumeIcon = document.querySelector('.volume-icon');
    let lastVolume = 1;

    // Add volume control functionality
    volumeSlider.addEventListener('input', (e) => {
        const value = e.target.value / 100;
        audioPlayer.volume = value;
        updateVolumeIcon(value);
    });

    volumeIcon.addEventListener('click', () => {
        if (audioPlayer.volume > 0) {
            lastVolume = audioPlayer.volume;
            audioPlayer.volume = 0;
            volumeSlider.value = 0;
            volumeIcon.textContent = '🔇';
        } else {
            audioPlayer.volume = lastVolume;
            volumeSlider.value = lastVolume * 100;
            updateVolumeIcon(lastVolume);
        }
    });

    function updateVolumeIcon(value) {
        if (value === 0) volumeIcon.textContent = '🔇';
        else if (value < 0.5) volumeIcon.textContent = '🔉';
        else volumeIcon.textContent = '🔊';
    }
    
    // Control buttons
    const prevBtn = document.getElementById('prev');
    const playPauseBtn = document.getElementById('play-pause');
    const stopBtn = document.getElementById('stop');
    const nextBtn = document.getElementById('next');
    
    // Footer buttons
    const footerBtns = document.querySelectorAll('.footer-btn');
    const [addBtn, delBtn, miscBtn, sortBtn, infoBtn] = footerBtns;

    // Playlist management
    let tracks = [];
    let currentTrackIndex = 0;

    // Default radio stations
    const defaultStations = [
        { name: "AS FM", url: "https://asfmonair-masterasfm.radioca.st/stream" },
        { name: "NAXI RADIO", url: "https://naxi128.streaming.rs:9152/;*.mp3" },
        { name: "NOVA S Radio", url: "http://radio.novas.tv/novas.mp3" },
        { name: "PLAY", url: "https://stream.playradio.rs:8443/play.mp3" },
        { name: "HIT FM", url: "https://streaming.hitfm.rs/hit.mp3" },
        { name: "Radio Pingvin", url: "https://uzivo.radiopingvin.com/domaci1" },
        { name: "TDI Radio", url: "https://streaming.tdiradio.com/tdiradio.mp3" },
        { name: "Radio S Cafe", url: "https://stream.radios.rs:9012/;*.mp3" },
        { name: "Radio S XTRA", url: "https://stream.radios.rs:9026/;*.mp3" },
        { name: "NAXI ROCK", url: "https://stream.radios.rs:9032/;*.mp3" },
        { name: "RADIO IN", url: "https://radio3-64ssl.streaming.rs:9212/;*.mp3" },
        { name: "ROCK RADIO", url: "https://mastermedia.shoutca.st/proxy/rockradio?mp=/stream" },
        { name: "SUPER FM", url: "https://onair.superfm.rs/superfm.mp3" },
        { name: "NAXI 80s", url: "https://naxidigital-80s128ssl.streaming.rs:8042/;*.mp3" },
        { name: "PRVI Radio", url: "https://mastermedia.shoutca.st/proxy/prviradions?mp=/stream" },
        { name: "NAXI HOUSE", url: "https://naxidigital-house128ssl.streaming.rs:8002/;*.mp3" },
        { name: "TDI Domacica", url: "https://streaming.tdiradio.com/domacica.mp3" },
        { name: "NAXI CAFE", url: "https://naxidigital-cafe128ssl.streaming.rs:8022/;*.mp3" },
        { name: "TDI HOUSE", url: "https://streaming.tdiradio.com/houseclassics.mp3" },
        { name: "RED", url: "https://stream.redradio.rs/sid=1" }
    ];

    // Function to load default stations
    function loadDefaultStations() {
        defaultStations.forEach(station => {
            addStreamToPlaylist(station.name, station.url);
        });
    }

    // Load default stations when player starts
    loadDefaultStations();

    // Play/Pause functionality
    playPauseBtn.addEventListener('click', () => {
        const audio = getCurrentAudio();
        if (!audio) return;
        
        if (audio.paused) {
            audio.play();
            playPauseBtn.textContent = '⏸';
        } else {
            audio.pause();
            playPauseBtn.textContent = '▶';
        }
    });

    // Previous track
    prevBtn.addEventListener('click', () => {
        if (currentTrackIndex > 0) {
            currentTrackIndex--;
            playTrack(currentTrackIndex);
        }
    });

    // Next track
    nextBtn.addEventListener('click', () => {
        currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
        playTrack(currentTrackIndex);
    });

    // Stop
    stopBtn.addEventListener('click', () => {
        const audio = getCurrentAudio();
        if (!audio) return;
        audio.pause();
        audio.currentTime = 0;
        playPauseBtn.textContent = '▶';
        
        // Reset display
        const trackInfo = document.querySelector('.track-info');
        trackInfo.textContent = 'No track playing';
    });

    // Stream Dialog Elements
    const streamDialog = document.getElementById('streamDialog');
    const streamName = document.getElementById('streamName');
    const streamUrl = document.getElementById('streamUrl');
    const addStreamBtn = document.getElementById('addStreamBtn');
    const cancelStreamBtn = document.getElementById('cancelStreamBtn');

    // Modified ADD button functionality
    addBtn.addEventListener('click', () => {
        // Check if options already exist and remove them first
        const existingOptions = document.querySelector('.add-options');
        if (existingOptions) {
            existingOptions.remove();
            return;
        }

        const options = document.createElement('div');
        options.className = 'add-options';
        options.innerHTML = `
            <button id="addFile">Add Audio File</button>
            <button id="addStream">Add Radio Stream</button>
        `;
        
        document.body.appendChild(options);
        
        // Close options when clicking outside
        document.addEventListener('click', (e) => {
            if (!options.contains(e.target) && e.target !== addBtn) {
                options.remove();
            }
        });
        
        options.querySelector('#addFile').onclick = () => {
            options.remove();
            addAudioFile();
        };
        
        options.querySelector('#addStream').onclick = () => {
            options.remove();
            showStreamDialog();
        };
    });

    function addAudioFile() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'audio/*';
        input.multiple = true;
        input.onchange = (e) => {
            Array.from(e.target.files).forEach(file => addTrackToPlaylist(file));
        };
        input.click();
    }

    // Modify stream dialog functions
    function showStreamDialog() {
        streamDialog.style.display = 'block';
        // Close dialog when clicking outside
        document.addEventListener('click', closeStreamDialogOutside);
    }

    function closeStreamDialogOutside(e) {
        if (!streamDialog.querySelector('.dialog-content').contains(e.target) && 
            !e.target.matches('#addStream')) {
            streamDialog.style.display = 'none';
            document.removeEventListener('click', closeStreamDialogOutside);
        }
    }

    // Modified stream dialog button handlers
    addStreamBtn.addEventListener('click', () => {
        const name = streamName.value.trim();
        const url = streamUrl.value.trim();
        
        if (name && url) {
            addStreamToPlaylist(name, url);
            streamDialog.style.display = 'none';
            streamName.value = '';
            streamUrl.value = '';
            document.removeEventListener('click', closeStreamDialogOutside);
        }
    });

    cancelStreamBtn.addEventListener('click', () => {
        streamDialog.style.display = 'none';
        streamName.value = '';
        streamUrl.value = '';
        document.removeEventListener('click', closeStreamDialogOutside);
    });

    function makeItemSelectable(element) {
        let mouseDownTime = 0;
        
        element.addEventListener('mousedown', () => {
            mouseDownTime = Date.now();
        });

        element.addEventListener('mouseup', (e) => {
            const clickDuration = Date.now() - mouseDownTime;
            
            // If click was held for less than 200ms, consider it a click
            if (clickDuration < 200) {
                const index = Array.from(playlist.children).indexOf(element) - 1;
                currentTrackIndex = index;
                playTrack(index);
            }

            // Remove selection from other items
            playlist.querySelectorAll('.playlist-item').forEach(item => {
                item.classList.remove('selected');
            });
            element.classList.add('selected');
        });

        // Keep the context menu functionality
        element.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            
            // Remove any existing context menus
            const existingMenu = document.querySelector('.context-menu');
            if (existingMenu) existingMenu.remove();

            // Create context menu
            const contextMenu = document.createElement('div');
            contextMenu.className = 'context-menu';
            contextMenu.innerHTML = `
                <div class="menu-item" data-action="play">Play</div>
                <div class="menu-item" data-action="stop">Stop</div>
                <div class="menu-item" data-action="delete">Delete</div>
            `;

            // Position the menu
            contextMenu.style.position = 'fixed';
            contextMenu.style.left = `${e.clientX}px`;
            contextMenu.style.top = `${e.clientY}px`;
            document.body.appendChild(contextMenu);

            // Handle menu item clicks
            contextMenu.addEventListener('click', (event) => {
                const action = event.target.dataset.action;
                const index = Array.from(playlist.children).indexOf(element) - 1; // Adjust for header

                switch(action) {
                    case 'play':
                        currentTrackIndex = index;
                        playTrack(index);
                        break;
                    case 'stop':
                        if (currentTrackIndex === index) {
                            const audio = getCurrentAudio();
                            if (audio) {
                                audio.pause();
                                audio.currentTime = 0;
                                playPauseBtn.textContent = '▶';
                            }
                        }
                        break;
                    case 'delete':
                        tracks.splice(index, 1);
                        element.remove();
                        break;
                }
                contextMenu.remove();
            });

            // Close menu when clicking outside
            document.addEventListener('click', () => {
                contextMenu.remove();
            }, { once: true });
        });
    }

    // Modify addStreamToPlaylist function
    function addStreamToPlaylist(name, url) {
        const stream = {
            name: name,
            url: url,
            isStream: true
        };
        
        tracks.push(stream);
        
        const streamElement = document.createElement('div');
        streamElement.className = 'playlist-item';
        streamElement.innerHTML = `
            <span class="stream-icon">📻</span>
            <span>${name}</span>
        `;
        makeItemSelectable(streamElement);
        streamElement.addEventListener('dblclick', () => {
            currentTrackIndex = tracks.length - 1;
            playTrack(currentTrackIndex);
        });
        
        playlist.appendChild(streamElement);
    }

    // Modify addTrackToPlaylist function
    function addTrackToPlaylist(file) {
        const track = {
            name: file.name,
            url: URL.createObjectURL(file)
        };
        
        tracks.push(track);
        
        const trackElement = document.createElement('div');
        trackElement.className = 'playlist-item';
        trackElement.textContent = track.name;
        makeItemSelectable(trackElement);
        trackElement.addEventListener('dblclick', () => {
            currentTrackIndex = tracks.length - 1;
            playTrack(currentTrackIndex);
            if (currentTrackIndex === tracks.length - 1) {
                currentTrackIndex = 0;
                playTrack(currentTrackIndex);
            }
        });
        
        playlist.appendChild(trackElement);
    }

    // Modify playTrack function
    function playTrack(index) {
        const track = tracks[index];
        if (!track) return;

        audioPlayer.src = track.url;
        
        // Update track display
        const trackInfo = document.querySelector('.track-info');
        trackInfo.textContent = track.name;
        
        if (track.isStream) {
            document.querySelector('.bitrate').textContent = 'LIVE';
        }
        
        audioPlayer.addEventListener('timeupdate', updateProgress);
        audioPlayer.play();
        playPauseBtn.textContent = '⏸';
        
        // Clear all highlights first
        playlist.querySelectorAll('.playlist-item').forEach(item => {
            item.classList.remove('active');
            item.classList.remove('selected');
        });
        
        // Add active class to currently playing track
        const playlistItems = Array.from(playlist.children);
        if (playlistItems[index + 1]) { // +1 to account for header
            playlistItems[index + 1].classList.add('active');
        }
    }

    // Update footer button event listeners
    delBtn.addEventListener('click', () => {
        const selected = playlist.querySelector('.playlist-item.selected');
        if (selected) {
            const deleteWarning = document.createElement('div');
            deleteWarning.className = 'delete-warning';
            deleteWarning.innerHTML = `
                <div class="warning-content">
                    <div class="warning-header">⚠️ Upozorenje</div>
                    <div class="warning-message">
                        Da li ste sigurni da želite da obrišete:
                        <div class="warning-item">${selected.textContent}</div>
                    </div>
                    <div class="warning-buttons">
                        <button class="warning-btn confirm">Obriši</button>
                        <button class="warning-btn cancel">Odustani</button>
                    </div>
                </div>
            `;
            
            document.body.appendChild(deleteWarning);

            // Handle confirm delete
            deleteWarning.querySelector('.confirm').addEventListener('click', () => {
                const index = Array.from(playlist.children).indexOf(selected);
                if (index !== -1) {
                    tracks.splice(index - 1, 1); // Adjust for playlist header
                    selected.remove();
                }
                deleteWarning.remove();
            });

            // Handle cancel
            deleteWarning.querySelector('.cancel').addEventListener('click', () => {
                deleteWarning.remove();
            });

            // Close on click outside
            document.addEventListener('click', (e) => {
                if (!deleteWarning.querySelector('.warning-content').contains(e.target) && 
                    e.target !== delBtn) {
                    deleteWarning.remove();
                }
            });
        }
    });

    sortBtn.addEventListener('click', () => {
        const existingSortMenu = document.querySelector('.sort-menu');
        if (existingSortMenu) {
            existingSortMenu.remove();
            return;
        }

        const sortMenu = document.createElement('div');
        sortMenu.className = 'sort-menu';
        sortMenu.innerHTML = `
            <div class="sort-option" data-sort="az">A-Z ↓</div>
            <div class="sort-option" data-sort="za">Z-A ↑</div>
            <div class="sort-option" data-sort="recent">Najnovije prvo</div>
            <div class="sort-option" data-sort="shuffle">Izmešaj</div>
        `;

        const buttonRect = sortBtn.getBoundingClientRect();
        sortMenu.style.position = 'absolute';
        sortMenu.style.left = `${buttonRect.left}px`;
        sortMenu.style.top = `${buttonRect.top - sortMenu.scrollHeight - 5}px`;
        document.body.appendChild(sortMenu);

        sortMenu.addEventListener('click', (e) => {
            const option = e.target.dataset.sort;
            if (!option) return;

            const items = Array.from(playlist.querySelectorAll('.playlist-item'));
            let sortedTracks = [...tracks];
            
            switch(option) {
                case 'az':
                    sortedTracks.sort((a, b) => a.name.localeCompare(b.name));
                    break;
                case 'za':
                    sortedTracks.sort((a, b) => b.name.localeCompare(a.name));
                    break;
                case 'recent':
                    sortedTracks.reverse();
                    break;
                case 'shuffle':
                    for (let i = sortedTracks.length - 1; i > 0; i--) {
                        const j = Math.floor(Math.random() * (i + 1));
                        [sortedTracks[i], sortedTracks[j]] = [sortedTracks[j], sortedTracks[i]];
                    }
                    break;
            }

            // Update tracks array
            tracks = sortedTracks;
            
            // Rebuild playlist
            refreshPlaylist();
            
            sortMenu.remove();
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!sortMenu.contains(e.target) && e.target !== sortBtn) {
                sortMenu.remove();
            }
        });
    });

    miscBtn.addEventListener('click', () => {
        const selected = playlist.querySelector('.playlist-item.selected');
        if (selected) {
            const track = tracks[Array.from(playlist.children).indexOf(selected) - 1];
            const details = document.createElement('div');
            details.className = 'track-details';
            details.innerHTML = `
                <div class="details-header">
                    ${track.isStream ? '📻 Stream Info' : '🎵 Track Info'}
                </div>
                <div class="details-content">
                    <div class="detail-row">
                        <span class="detail-label">Name:</span>
                        <span class="detail-value">${track.name}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Type:</span>
                        <span class="detail-value">${track.isStream ? 'Radio Stream' : 'Audio File'}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Status:</span>
                        <span class="detail-value ${currentTrackIndex === (Array.from(playlist.children).indexOf(selected) - 1) ? 'status-active' : 'status-inactive'}">
                            ${currentTrackIndex === (Array.from(playlist.children).indexOf(selected) - 1) ? 'Now Playing' : 'Not Playing'}
                        </span>
                    </div>
                    ${track.isStream ? `
                        <div class="detail-row">
                            <span class="detail-label">URL:</span>
                            <span class="detail-value url-value">${track.url}</span>
                        </div>
                    ` : ''}
                </div>
                <div class="details-footer">
                    <button class="play-btn" onclick="this.parentElement.parentElement.remove();">Close</button>
                </div>
            `;
            document.body.appendChild(details);

            // Close on click outside
            document.addEventListener('click', (e) => {
                if (!details.contains(e.target) && e.target !== miscBtn) {
                    details.remove();
                }
            });
        }
    });

    infoBtn.addEventListener('click', () => {
        const infoModal = document.createElement('div');
        infoModal.className = 'info-modal';
        infoModal.innerHTML = `
            <div class="info-content">
                <h3>O aplikaciji Shark Web Player</h3>
                <p>Shark Web Player je jednostavan i besplatan online plejer koji vam omogućava da brzo i lako reprodukujete audio sadržaje direktno iz svog internet pregledača.</p>
                <p>Aplikacija je napravljena s ciljem da bude lako dostupna svima.</p>
                <p>
                    🔹 Podrška za više formata<br>
                    🔹 Besplatna i otvorena za korišćenje<br>
                    🔹 Razvijena kao doprinos digitalnoj dostupnosti i zajednici
                </p>
                <p>Shark Web Player je deo šire inicijative za razvoj korisnih, javno dostupnih digitalnih alata.</p>
                <button class="close-info">Zatvori</button>
            </div>
        `;
        document.body.appendChild(infoModal);
        
        // Zatvaranje info modala
        const closeBtn = infoModal.querySelector('.close-info');
        closeBtn.addEventListener('click', () => infoModal.remove());
        
        // Zatvaranje na klik van modala
        infoModal.addEventListener('click', (e) => {
            if (e.target === infoModal) {
                infoModal.remove();
            }
        });
    });

    // Helper functions
    function updateProgress(e) {
        const audio = e.target;
        const percent = (audio.currentTime / audio.duration) * 100;
        progress.style.width = percent + '%';
        
        // Update timer
        const time = formatTime(audio.currentTime);
        timer.textContent = time;
    }

    function formatTime(seconds) {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);
        return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
    }

    function pad(num) {
        return num.toString().padStart(2, '0');
    }

    function getCurrentAudio() {
        return audioPlayer;
    }

    function refreshPlaylist() {
        playlist.innerHTML = '<div class="playlist-header">Radio stanice</div>';
        tracks.forEach((track, index) => {
            const trackElement = document.createElement('div');
            trackElement.className = 'playlist-item';
            if (track.isStream) {
                trackElement.innerHTML = `
                    <span class="stream-icon">📻</span>
                    <span>${track.name}</span>
                `;
            } else {
                trackElement.textContent = track.name;
            }
            makeItemSelectable(trackElement);
            if (index === currentTrackIndex) {
                trackElement.classList.add('active');
            }
            playlist.appendChild(trackElement);
        });
    }
});
