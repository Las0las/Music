// Main JavaScript functionality for Echo Samples

document.addEventListener('DOMContentLoaded', function() {
    // Initialize mobile menu
    initializeMobileMenu();
    
    // Initialize newsletter form
    initializeNewsletterForm();
    
    // Initialize animations
    initializeAnimations();
    
    // Initialize audio preview functionality
    initializeAudioPreviews();
});

// Initialize mobile menu
function initializeMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav');
    
    if (menuToggle && nav) {
        menuToggle.addEventListener('click', function() {
            nav.classList.toggle('active');
            this.classList.toggle('active');
        });
    }
}

// Initialize newsletter form
function initializeNewsletterForm() {
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            
            if (email === '') {
                showMessage('Please enter your email address', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showMessage('Please enter a valid email address', 'error');
                return;
            }
            
            // In a real implementation, this would send the email to a server
            // For demo purposes, we'll just show a success message
            showMessage('Thank you for subscribing to our newsletter!', 'success');
            emailInput.value = '';
        });
    }
}

// Validate email format
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Show message
function showMessage(message, type) {
    // Create message element if it doesn't exist
    let messageElement = document.querySelector('.message-popup');
    
    if (!messageElement) {
        messageElement = document.createElement('div');
        messageElement.className = 'message-popup';
        document.body.appendChild(messageElement);
    }
    
    // Set message content and type
    messageElement.textContent = message;
    messageElement.className = `message-popup ${type}`;
    
    // Show message
    messageElement.classList.add('show');
    
    // Hide message after delay
    setTimeout(() => {
        messageElement.classList.remove('show');
    }, 3000);
}

// Initialize animations
function initializeAnimations() {
    // Animate elements when they come into view
    const animatedElements = document.querySelectorAll('.fade-in, .fade-in-up, .fade-in-left, .fade-in-right');
    
    if (animatedElements.length > 0) {
        // Create intersection observer
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1
        });
        
        // Observe each element
        animatedElements.forEach(element => {
            observer.observe(element);
        });
    }
    
    // Add hover animations to buttons
    const buttons = document.querySelectorAll('.btn');
    
    if (buttons.length > 0) {
        buttons.forEach(button => {
            button.addEventListener('mouseenter', function() {
                this.classList.add('hover');
            });
            
            button.addEventListener('mouseleave', function() {
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
                        if (sampleName === 'Eternal Echo') {
                            audioSrc = 'assets/eternal-echo-preview.mp3';
                        } else if (sampleName === 'Super Trap Loop Kit') {
                            audioSrc = 'assets/trap-melody-preview.mp3';
                        } else if (sampleName === 'Urban Beats Collection') {
                            audioSrc = 'assets/urban-beats-preview.mp3';
                        } else if (sampleName === 'Ambient Textures') {
                            audioSrc = 'assets/ambient-textures-preview.mp3';
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

// Format time in MM:SS format
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}
