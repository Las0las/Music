// Update catalog.js to use the new superhero/supervillain themed sample pack names
document.addEventListener('DOMContentLoaded', function() {
    // Load sample catalog data
    loadSampleCatalog();
    
    // Initialize catalog filtering
    initializeCatalogFilters();
    
    // Initialize audio players
    initializeAudioPlayers();
    
    // Initialize product sorting
    initializeProductSorting();
    
    // Add animation effects to product cards
    animateProductCards();
});

// Load sample catalog data from JSON file
function loadSampleCatalog() {
    const catalogContainer = document.querySelector('.sample-grid');
    
    if (catalogContainer) {
        fetch('js/sample-catalog.json')
            .then(response => response.json())
            .then(data => {
                // Render sample packs
                renderSamplePacks(data, catalogContainer);
            })
            .catch(error => {
                console.error('Error loading sample catalog:', error);
            });
    }
    
    // Also load featured products on homepage
    const featuredContainer = document.querySelector('.featured-samples .sample-grid');
    
    if (featuredContainer) {
        fetch('js/sample-catalog.json')
            .then(response => response.json())
            .then(data => {
                // Get first 4 items for featured section
                const featuredData = data.slice(0, 4);
                renderSamplePacks(featuredData, featuredContainer);
            })
            .catch(error => {
                console.error('Error loading featured samples:', error);
            });
    }
    
    // Load free samples for free samples page
    const freeSamplesContainer = document.querySelector('.free-samples-section .sample-grid');
    
    if (freeSamplesContainer) {
        fetch('js/sample-catalog.json')
            .then(response => response.json())
            .then(data => {
                // Filter free samples
                const freeSamples = data.filter(item => item.category === 'free');
                renderSamplePacks(freeSamples, freeSamplesContainer);
            })
            .catch(error => {
                console.error('Error loading free samples:', error);
            });
    }
}

// Render sample packs to container
function renderSamplePacks(data, container) {
    // Clear container
    container.innerHTML = '';
    
    // Render each sample pack
    data.forEach(pack => {
        const card = document.createElement('div');
        card.className = `sample-card ${pack.category}`;
        card.setAttribute('data-rating', pack.rating);
        card.setAttribute('data-date', pack.date);
        
        // Add tags as data attributes for filtering
        if (pack.tags) {
            pack.tags.forEach(tag => {
                card.setAttribute(`data-tag-${tag.replace(/\s+/g, '-')}`, 'true');
            });
        }
        
        card.innerHTML = `
            <div class="sample-img">
                <img src="${pack.image}" alt="${pack.name}">
                ${pack.category === 'free' ? '<span class="sample-badge">Free</span>' : ''}
            </div>
            <div class="sample-content">
                <h3>${pack.name}</h3>
                <p>${pack.description}</p>
                <div class="sample-meta">
                    <span class="price">${pack.price === 0 ? 'Free' : '$' + pack.price}</span>
                    <div class="rating">
                        ${getRatingStars(pack.rating)}
                    </div>
                </div>
                <div class="sample-actions">
                    <a href="#" class="btn btn-outline btn-sm">Preview</a>
                    <a href="${pack.category === 'free' ? (pack.downloadPath || '#') : '#'}" class="btn btn-primary btn-sm" ${pack.category === 'free' ? 'download' : ''}>${pack.price === 0 ? 'Download' : 'Add to Cart'}</a>
                </div>
            </div>
        `;
        
        container.appendChild(card);
    });
    
    // Re-initialize audio players for new content
    initializeAudioPreviews();
}

// Initialize catalog filtering functionality
function initializeCatalogFilters() {
    const filterButtons = document.querySelectorAll('.filter-button');
    const sampleCards = document.querySelectorAll('.sample-card');
    
    if (filterButtons.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                this.classList.add('active');
                
                // Get filter value
                const filter = this.getAttribute('data-filter');
                
                // Filter sample cards
                sampleCards.forEach(card => {
                    if (filter === 'all') {
                        card.style.display = 'block';
                    } else {
                        if (card.classList.contains(filter)) {
                            card.style.display = 'block';
                        } else {
                            card.style.display = 'none';
                        }
                    }
                });
            });
        });
    }
    
    // Price range filter
    const priceRange = document.getElementById('price-range');
    const priceOutput = document.getElementById('price-output');
    
    if (priceRange && priceOutput) {
        priceRange.addEventListener('input', function() {
            const value = this.value;
            priceOutput.textContent = `$${value}`;
            
            // Filter sample cards by price
            sampleCards.forEach(card => {
                const priceElement = card.querySelector('.price');
                if (priceElement) {
                    const price = parseFloat(priceElement.textContent.replace('$', ''));
                    
                    if (price <= value) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                }
            });
        });
    }
    
    // Search functionality
    const searchInput = document.getElementById('search-input');
    
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            
            // Filter sample cards by search term
            sampleCards.forEach(card => {
                const title = card.querySelector('h3').textContent.toLowerCase();
                const description = card.querySelector('p').textContent.toLowerCase();
                
                if (title.includes(searchTerm) || description.includes(searchTerm)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }
}

// Initialize audio players
function initializeAudioPlayers() {
    const audioPlayers = document.querySelectorAll('.audio-player');
    
    if (audioPlayers.length > 0) {
        audioPlayers.forEach(player => {
            const audio = player.querySelector('audio');
            const playButton = player.querySelector('.play-button');
            const progress = player.querySelector('.progress');
            const currentTime = player.querySelector('.current-time');
            const duration = player.querySelector('.duration');
            
            if (audio && playButton) {
                // Play/pause functionality
                playButton.addEventListener('click', function() {
                    if (audio.paused) {
                        // Pause all other audio elements
                        document.querySelectorAll('audio').forEach(a => {
                            if (a !== audio) {
                                a.pause();
                                a.currentTime = 0;
                                a.closest('.audio-player').querySelector('.play-button').innerHTML = '<i class="fas fa-play"></i>';
                            }
                        });
                        
                        // Play this audio
                        audio.play();
                        playButton.innerHTML = '<i class="fas fa-pause"></i>';
                    } else {
                        audio.pause();
                        playButton.innerHTML = '<i class="fas fa-play"></i>';
                    }
                });
                
                // Update progress bar
                if (progress) {
                    audio.addEventListener('timeupdate', function() {
                        const progressValue = (audio.currentTime / audio.duration) * 100;
                        progress.style.width = `${progressValue}%`;
                        
                        if (currentTime) {
                            currentTime.textContent = formatTime(audio.currentTime);
                        }
                    });
                }
                
                // Set duration
                if (duration) {
                    audio.addEventListener('loadedmetadata', function() {
                        duration.textContent = formatTime(audio.duration);
                    });
                }
                
                // Reset when ended
                audio.addEventListener('ended', function() {
                    audio.currentTime = 0;
                    playButton.innerHTML = '<i class="fas fa-play"></i>';
                });
            }
        });
    }
}

// Format time in MM:SS format
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}

// Initialize product sorting
function initializeProductSorting() {
    const sortSelect = document.getElementById('sort-select');
    const sampleContainer = document.querySelector('.sample-grid');
    
    if (sortSelect && sampleContainer) {
        sortSelect.addEventListener('change', function() {
            const sortValue = this.value;
            const sampleCards = Array.from(document.querySelectorAll('.sample-card'));
            
            // Sort sample cards
            sampleCards.sort((a, b) => {
                if (sortValue === 'price-low') {
                    const priceA = parseFloat(a.querySelector('.price').textContent.replace('$', ''));
                    const priceB = parseFloat(b.querySelector('.price').textContent.replace('$', ''));
                    return priceA - priceB;
                } else if (sortValue === 'price-high') {
                    const priceA = parseFloat(a.querySelector('.price').textContent.replace('$', ''));
                    const priceB = parseFloat(b.querySelector('.price').textContent.replace('$', ''));
                    return priceB - priceA;
                } else if (sortValue === 'newest') {
                    const dateA = new Date(a.getAttribute('data-date'));
                    const dateB = new Date(b.getAttribute('data-date'));
                    return dateB - dateA;
                } else if (sortValue === 'popular') {
                    const ratingA = parseInt(a.getAttribute('data-rating'));
                    const ratingB = parseInt(b.getAttribute('data-rating'));
                    return ratingB - ratingA;
                }
                
                return 0;
            });
            
            // Reorder sample cards in the DOM
            sampleCards.forEach(card => {
                sampleContainer.appendChild(card);
            });
        });
    }
}

// Add animation effects to product cards
function animateProductCards() {
    const sampleCards = document.querySelectorAll('.sample-card');
    
    if (sampleCards.length > 0) {
        sampleCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.classList.add('hover');
            });
            
            card.addEventListener('mouseleave', function() {
                this.classList.remove('hover');
            });
        });
    }
}

// Initialize audio preview functionality
function initializeAudioPreviews() {
    const previewButtons = document.querySelectorAll('.btn-outline.btn-sm');
    
    if (previewButtons.length > 0) {
        previewButtons.forEach(button => {
            if (button.textContent === 'Preview') {
                button.addEventListener('click', function(e) {
                    e.preventDefault();
                    
                    // Get sample card
                    const card = this.closest('.sample-card');
                    const sampleName = card.querySelector('h3').textContent;
                    
                    // Check if audio player exists
                    let audioPlayer = card.querySelector('.audio-preview');
                    
                    if (!audioPlayer) {
                        // Create audio player
                        audioPlayer = document.createElement('div');
                        audioPlayer.className = 'audio-preview';
                        
                        // Determine audio source based on sample name
                        let audioSrc = '';
                        if (sampleName.includes('Crimson Phoenix')) {
                            audioSrc = 'assets/sample-previews/crimson-phoenix-preview.mp3';
                        } else if (sampleName.includes('Emerald Venom')) {
                            audioSrc = 'assets/sample-previews/emerald-venom-preview.mp3';
                        } else if (sampleName.includes('Cobalt Thanos')) {
                            audioSrc = 'assets/sample-previews/cobalt-thanos-preview.mp3';
                        } else if (sampleName.includes('Azure Panther')) {
                            audioSrc = 'assets/sample-previews/azure-panther-preview.mp3';
                        } else if (sampleName.includes('Scarlet Magneto')) {
                            audioSrc = 'assets/sample-previews/scarlet-magneto-preview.mp3';
                        } else if (sampleName.includes('Violet Hulk')) {
                            audioSrc = 'assets/sample-previews/violet-hulk-preview.mp3';
                        } else if (sampleName.includes('Golden Joker')) {
                            audioSrc = 'assets/sample-previews/golden-joker-preview.mp3';
                        } else if (sampleName.includes('Midnight Batman')) {
                            audioSrc = 'assets/sample-previews/midnight-batman-preview.mp3';
                        } else if (sampleName.includes('Silver Mystique')) {
                            audioSrc = 'assets/sample-previews/silver-mystique-preview.mp3';
                        } else if (sampleName.includes('Neon Deadpool')) {
                            audioSrc = 'assets/sample-previews/neon-deadpool-preview.mp3';
                        } else {
                            audioSrc = 'assets/sample-preview.mp3';
                        }
                        
                        // Create audio element
                        audioPlayer.innerHTML = `
                            <audio src="${audioSrc}"></audio>
                            <div class="audio-controls">
                                <button class="play-pause"><i class="fas fa-play"></i></button>
                                <div class="progress-container">
                                    <div class="progress-bar">
                                        <div class="progress"></div>
                                    </div>
                                    <div class="time">
                                        <span class="current-time">0:00</span>
                                        <span class="duration">0:00</span>
                                    </div>
                                </div>
                            </div>
                        `;
                        
                        // Insert audio player into card
                        card.querySelector('.sample-content').insertBefore(audioPlayer, card.querySelector('.sample-actions'));
                        
                        // Initialize audio player
                        initializeAudioPlayer(audioPlayer);
                    } else {
                        // Toggle audio player visibility
                        audioPlayer.classList.toggle('hidden');
                    }
                });
            }
        });
    }
}

// Initialize individual audio player
function initializeAudioPlayer(audioPlayer) {
    const audio = audioPlayer.querySelector('audio');
    const playPauseButton = audioPlayer.querySelector('.play-pause');
    const progress = audioPlayer.querySelector('.progress');
    const currentTimeDisplay = audioPlayer.querySelector('.current-time');
    const durationDisplay = audioPlayer.querySelector('.duration');
    const progressContainer = audioPlayer.querySelector('.progress-bar');
    
    // Play/pause functionality
    playPauseButton.addEventListener('click', function() {
        if (audio.paused) {
            // Pause all other audio elements
            document.querySelectorAll('audio').forEach(a => {
                if (a !== audio) {
                    a.pause();
                    const button = a.closest('.audio-preview').querySelector('.play-pause');
                    button.innerHTML = '<i class="fas fa-play"></i>';
                }
            });
            
            // Play this audio
            audio.play();
            this.innerHTML = '<i class="fas fa-pause"></i>';
        } else {
            audio.pause();
            this.innerHTML = '<i class="fas fa-play"></i>';
        }
    });
    
    // Update progress bar
    audio.addEventListener('timeupdate', function() {
        const progressPercent = (audio.currentTime / audio.duration) * 100;
        progress.style.width = `${progressPercent}%`;
        
        // Update current time display
        currentTimeDisplay.textContent = formatTime(audio.currentTime);
    });
    
    // Set duration display when metadata is loaded
    audio.addEventListener('loadedmetadata', function() {
        durationDisplay.textContent = formatTime(audio.duration);
    });
    
    // Click on progress bar to seek
    progressContainer.addEventListener('click', function(e) {
        const clickPosition = e.offsetX / this.offsetWidth;
        const seekTime = audio.duration * clickPosition;
        audio.currentTime = seekTime;
    });
    
    // Reset when audio ends
    audio.addEventListener('ended', function() {
        playPauseButton.innerHTML = '<i class="fas fa-play"></i>';
        audio.currentTime = 0;
    });
}

// Generate rating stars HTML
function getRatingStars(rating) {
    let stars = '';
    
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            stars += '<i class="fas fa-star"></i>';
        } else {
            stars += '<i class="far fa-star"></i>';
        }
    }
    
    return stars;
}
