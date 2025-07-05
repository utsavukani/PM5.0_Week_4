// App State Management
let currentScreen = 'welcome-screen';
let selectedMatchIndex = 0;
let messages = [];

// Sample data from JSON
const appData = {
    matches: [
        {
            name: "Sarah Chen",
            age: 18,
            major: "Engineering",
            university: "Boston University",
            compatibility: 92,
            traits: ["Early riser", "Clean", "Quiet study"],
            bio: "Engineering student who loves problem-solving and staying organized. Looking for a responsible roommate who respects study time and keeps shared spaces clean. Enjoy morning workouts and quiet evenings."
        },
        {
            name: "Marcus Johnson",
            age: 19,
            major: "Business",
            university: "Northeastern University",
            compatibility: 78,
            traits: ["Social", "Night owl", "Group study"],
            bio: "Business major with a passion for networking and group projects. I'm social and love having friends over, but I also respect personal space. Looking for someone who enjoys a lively atmosphere."
        },
        {
            name: "Emma Rodriguez",
            age: 20,
            major: "Psychology",
            university: "Harvard University",
            compatibility: 95,
            traits: ["Organized", "Balanced", "Respectful"],
            bio: "Psychology student with a balanced approach to college life. I value organization and respect, but also know how to have fun. Looking for a mature roommate who shares similar values."
        }
    ],
    conversationStarters: [
        "Hi! I saw we have a high compatibility score. Would love to chat about potentially being roommates!",
        "Hey! I noticed we both prefer similar study environments. Want to learn more about each other?",
        "Hi there! Our lifestyle preferences seem really compatible. Would you like to chat?",
        "Hello! I'm impressed by our compatibility score. Want to discuss roommate expectations?"
    ]
};

// Screen Navigation
function navigateToScreen(screenId) {
    const currentScreenElement = document.getElementById(currentScreen);
    const newScreenElement = document.getElementById(screenId);
    
    if (currentScreenElement) {
        currentScreenElement.classList.remove('active');
    }
    
    if (newScreenElement) {
        newScreenElement.classList.add('active');
        currentScreen = screenId;
        
        // Handle screen-specific initialization
        if (screenId === 'profile-view-screen') {
            updateProfileView();
        } else if (screenId === 'messaging-screen') {
            updateMessagingScreen();
        } else if (screenId === 'match-confirmation-screen') {
            updateMatchConfirmation();
        }
    }
}

// Profile photo upload handler
function handlePhotoUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const photoCircle = document.querySelector('.photo-upload-circle');
            photoCircle.innerHTML = `<img src="${e.target.result}" alt="Profile photo" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">`;
        };
        reader.readAsDataURL(file);
    }
}

// Toggle button functionality
function initializeToggleButtons() {
    document.querySelectorAll('.toggle-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from siblings
            this.parentElement.querySelectorAll('.toggle-btn').forEach(sibling => {
                sibling.classList.remove('active');
            });
            // Add active class to clicked button
            this.classList.add('active');
        });
    });
}

// Slider functionality
function initializeSliders() {
    document.querySelectorAll('.lifestyle-slider').forEach(slider => {
        slider.addEventListener('input', function() {
            // Update slider appearance (handled by CSS)
            const value = this.value;
            const parent = this.closest('.slider-group');
            const labels = parent.querySelectorAll('.slider-labels span');
            
            // Optional: Add visual feedback for slider values
            if (labels.length === 2) {
                labels[0].style.fontWeight = value < 50 ? 'bold' : 'normal';
                labels[1].style.fontWeight = value >= 50 ? 'bold' : 'normal';
            }
        });
    });
}

// Match selection
function setSelectedMatch(index) {
    selectedMatchIndex = index;
}

function getCurrentMatch() {
    return selectedMatchIndex;
}

// Update profile view with selected match data
function updateProfileView() {
    const match = appData.matches[selectedMatchIndex];
    if (!match) return;
    
    document.getElementById('profile-name').textContent = match.name;
    document.getElementById('profile-info').textContent = `${match.age} • ${match.major} • ${match.university}`;
    document.getElementById('profile-bio').textContent = match.bio;
    
    // Update compatibility bars with realistic values
    const compatibilityItems = document.querySelectorAll('.compatibility-item');
    const compatibilityValues = [
        Math.max(85, match.compatibility - 5),
        Math.max(80, match.compatibility - 10),
        Math.max(88, match.compatibility - 4),
        Math.max(90, match.compatibility - 2)
    ];
    
    compatibilityItems.forEach((item, index) => {
        if (index < compatibilityValues.length) {
            const fill = item.querySelector('.compatibility-fill');
            const scoreSpan = item.querySelector('span:last-child');
            if (fill && scoreSpan) {
                fill.style.width = compatibilityValues[index] + '%';
                scoreSpan.textContent = compatibilityValues[index] + '%';
            }
        }
    });
}

// Update messaging screen
function updateMessagingScreen() {
    const match = appData.matches[selectedMatchIndex];
    if (!match) return;
    
    document.getElementById('chat-partner-name').textContent = match.name;
    document.getElementById('chat-compatibility').textContent = `${match.compatibility}% compatible`;
    
    // Clear previous messages
    messages = [];
    updateMessageThread();
}

// Update match confirmation
function updateMatchConfirmation() {
    const match = appData.matches[selectedMatchIndex];
    if (!match) return;
    
    document.getElementById('matched-partner-name').textContent = match.name;
}

// Message functionality
function sendMessage(messageText) {
    const message = {
        text: messageText,
        timestamp: new Date(),
        sender: 'user'
    };
    
    messages.push(message);
    updateMessageThread();
    
    // Simulate response after delay
    setTimeout(() => {
        const responses = [
            "Hi! Thanks for reaching out. I'd love to learn more about you too!",
            "That's great! I'm really excited about the possibility of being roommates.",
            "I agree! Our compatibility looks really promising. What are your thoughts on room arrangements?",
            "Thanks for the message! I'm looking forward to chatting more about this."
        ];
        
        const response = {
            text: responses[Math.floor(Math.random() * responses.length)],
            timestamp: new Date(),
            sender: 'match'
        };
        
        messages.push(response);
        updateMessageThread();
    }, 1500);
}

function sendUserMessage() {
    const input = document.getElementById('message-input');
    const messageText = input.value.trim();
    
    if (messageText) {
        sendMessage(messageText);
        input.value = '';
    }
}

function updateMessageThread() {
    const thread = document.getElementById('message-thread');
    const existingMessages = thread.querySelectorAll('.message');
    
    // Clear existing messages except date
    existingMessages.forEach(msg => msg.remove());
    
    messages.forEach(message => {
        const messageElement = document.createElement('div');
        messageElement.className = `message ${message.sender === 'user' ? 'sent' : 'received'}`;
        
        const bubbleElement = document.createElement('div');
        bubbleElement.className = 'message-bubble';
        bubbleElement.textContent = message.text;
        
        const timeElement = document.createElement('div');
        timeElement.className = 'message-time';
        timeElement.textContent = formatTime(message.timestamp);
        
        messageElement.appendChild(bubbleElement);
        messageElement.appendChild(timeElement);
        thread.appendChild(messageElement);
    });
    
    // Scroll to bottom
    thread.scrollTop = thread.scrollHeight;
}

function formatTime(date) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Form validation helpers
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validateForm(formElement) {
    const requiredFields = formElement.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            isValid = false;
            field.classList.add('error');
        } else {
            field.classList.remove('error');
        }
    });
    
    return isValid;
}

// Button interaction handlers
function handleButtonClick(event) {
    const button = event.target;
    if (button.classList.contains('btn') && !button.disabled) {
        button.classList.add('loading');
        
        setTimeout(() => {
            button.classList.remove('loading');
        }, 1000);
    }
}

// Initialize conversation starters
function initializeConversationStarters() {
    const starterButtons = document.querySelectorAll('.starter-btn');
    starterButtons.forEach((btn, index) => {
        btn.addEventListener('click', function() {
            const messageText = this.textContent.replace(/"/g, '');
            sendMessage(appData.conversationStarters[index] || messageText);
            
            // Hide conversation starters after first use
            const startersContainer = document.querySelector('.conversation-starters');
            if (startersContainer) {
                startersContainer.style.display = 'none';
            }
        });
    });
}

// Progress bar animation
function animateProgressBar(targetWidth, duration = 500) {
    const progressFill = document.querySelector('.progress-fill');
    if (!progressFill) return;
    
    let startWidth = 0;
    const startTime = Date.now();
    
    function animate() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const currentWidth = startWidth + (targetWidth - startWidth) * progress;
        
        progressFill.style.width = currentWidth + '%';
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        }
    }
    
    animate();
}

// Handle match card interactions
function initializeMatchCards() {
    document.querySelectorAll('.match-card').forEach((card, index) => {
        card.addEventListener('click', function(e) {
            if (!e.target.classList.contains('btn')) {
                setSelectedMatch(index);
                navigateToScreen('profile-view-screen');
            }
        });
    });
}

// Initialize keyboard navigation
function initializeKeyboardNavigation() {
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            const activeElement = document.activeElement;
            if (activeElement.classList.contains('btn')) {
                activeElement.click();
            } else if (activeElement.id === 'message-input') {
                sendUserMessage();
            }
        } else if (e.key === 'Escape') {
            // Handle escape key for closing screens
            if (currentScreen !== 'welcome-screen') {
                const backBtn = document.querySelector('.back-btn');
                if (backBtn) {
                    backBtn.click();
                }
            }
        }
    });
}

// Handle input field interactions
function initializeInputHandlers() {
    // Message input enter key
    const messageInput = document.getElementById('message-input');
    if (messageInput) {
        messageInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendUserMessage();
            }
        });
    }
    
    // Photo upload handler
    const photoInput = document.getElementById('profile-photo');
    if (photoInput) {
        photoInput.addEventListener('change', handlePhotoUpload);
    }
}

// Form submission handlers
function initializeFormHandlers() {
    // Signup form
    const signupForm = document.querySelector('.signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            if (validateForm(this)) {
                navigateToScreen('profile-basic-screen');
            }
        });
    }
    
    // Profile forms
    const profileForms = document.querySelectorAll('.profile-form, .lifestyle-form, .preferences-form');
    profileForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
        });
    });
}

// Utility functions
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: var(--color-${type});
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        z-index: 1000;
        animation: slideDown 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideUp 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Touch gestures for mobile
function initializeTouchGestures() {
    let startX = 0;
    let startY = 0;
    
    document.addEventListener('touchstart', function(e) {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
    });
    
    document.addEventListener('touchend', function(e) {
        if (!startX || !startY) return;
        
        const endX = e.changedTouches[0].clientX;
        const endY = e.changedTouches[0].clientY;
        
        const diffX = startX - endX;
        const diffY = startY - endY;
        
        // Horizontal swipe
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
            if (diffX > 0) {
                // Swipe left - could implement next screen
            } else {
                // Swipe right - could implement back
                const backBtn = document.querySelector('.back-btn');
                if (backBtn) {
                    backBtn.click();
                }
            }
        }
        
        startX = 0;
        startY = 0;
    });
}

// App Analytics (for demo purposes)
function trackEvent(eventName, properties = {}) {
    console.log('Analytics Event:', eventName, properties);
    // In a real app, this would send to analytics service
}

// Initialize app
function initializeApp() {
    // Initialize all interactive elements
    initializeToggleButtons();
    initializeSliders();
    initializeConversationStarters();
    initializeMatchCards();
    initializeKeyboardNavigation();
    initializeInputHandlers();
    initializeFormHandlers();
    initializeTouchGestures();
    
    // Add button click handlers
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('btn')) {
            handleButtonClick(e);
        }
    });
    
    // Track app initialization
    trackEvent('app_initialized', {
        timestamp: new Date().toISOString(),
        screen: currentScreen
    });
    
    console.log('RoomieMatch app initialized successfully!');
}

// Custom CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideDown {
        from { transform: translateX(-50%) translateY(-100%); opacity: 0; }
        to { transform: translateX(-50%) translateY(0); opacity: 1; }
    }
    
    @keyframes slideUp {
        from { transform: translateX(-50%) translateY(0); opacity: 1; }
        to { transform: translateX(-50%) translateY(-100%); opacity: 0; }
    }
    
    .error {
        border-color: var(--color-error) !important;
        animation: shake 0.3s ease-in-out;
    }
    
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
`;
document.head.appendChild(style);

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

// Export functions for testing (if needed)
window.RoomieMatchApp = {
    navigateToScreen,
    setSelectedMatch,
    sendMessage,
    trackEvent
};