// Payment processing functionality for Echo Samples

document.addEventListener('DOMContentLoaded', function() {
    // Initialize payment processing elements
    initializePaymentSystem();
    
    // Set up event listeners for payment forms
    setupPaymentForms();
    
    // Initialize shopping cart functionality
    initializeCart();
});

// Initialize payment processing system
function initializePaymentSystem() {
    // This would normally connect to a payment gateway API
    console.log('Payment system initialized');
    
    // Add payment method selection functionality
    const paymentMethods = document.querySelectorAll('.payment-method');
    if (paymentMethods.length > 0) {
        paymentMethods.forEach(method => {
            method.addEventListener('click', function() {
                // Remove selected class from all methods
                paymentMethods.forEach(m => m.classList.remove('selected'));
                
                // Add selected class to clicked method
                this.classList.add('selected');
                
                // Show/hide card details based on selected method
                const selectedMethod = this.getAttribute('data-method');
                const cardDetails = document.querySelector('.card-details');
                
                if (cardDetails) {
                    if (selectedMethod === 'credit-card') {
                        cardDetails.style.display = 'block';
                    } else {
                        cardDetails.style.display = 'none';
                    }
                }
            });
        });
    }
}

// Set up payment form event listeners
function setupPaymentForms() {
    // Checkout form submission
    const checkoutForm = document.querySelector('.checkout-form');
    const placeOrderButton = document.querySelector('.place-order-button');
    
    if (placeOrderButton) {
        placeOrderButton.addEventListener('click', function(e) {
            e.preventDefault();
            processPayment();
        });
    }
    
    // Subscription form submission
    const subscriptionForms = document.querySelectorAll('.plan-card .btn');
    
    if (subscriptionForms.length > 0) {
        subscriptionForms.forEach(button => {
            button.addEventListener('click', function(e) {
                if (!button.classList.contains('btn-outline')) {
                    e.preventDefault();
                    const planName = this.closest('.plan-card').querySelector('.plan-name').textContent;
                    processSubscription(planName);
                }
            });
        });
    }
}

// Process payment
function processPayment() {
    // This would normally send payment details to a payment processor
    // For demo purposes, we'll just simulate a successful payment
    
    // Validate form fields
    if (validatePaymentForm()) {
        // Show loading state
        showLoadingState();
        
        // Simulate payment processing
        setTimeout(function() {
            // Redirect to confirmation page
            window.location.href = 'order-confirmation.html';
        }, 2000);
    }
}

// Process subscription
function processSubscription(planName) {
    // This would normally send subscription details to a payment processor
    // For demo purposes, we'll just redirect to the signup page
    window.location.href = 'signup.html';
}

// Validate payment form
function validatePaymentForm() {
    // This would normally validate all form fields
    // For demo purposes, we'll just return true
    return true;
}

// Show loading state during payment processing
function showLoadingState() {
    const button = document.querySelector('.place-order-button');
    
    if (button) {
        button.textContent = 'Processing...';
        button.disabled = true;
        button.style.opacity = '0.7';
    }
}

// Initialize shopping cart functionality
function initializeCart() {
    // Add to cart buttons
    const addToCartButtons = document.querySelectorAll('.btn-primary.btn-sm');
    
    if (addToCartButtons.length > 0) {
        addToCartButtons.forEach(button => {
            if (button.textContent === 'Add to Cart') {
                button.addEventListener('click', function(e) {
                    e.preventDefault();
                    
                    // Get product details
                    const card = this.closest('.sample-card');
                    const productName = card.querySelector('h3').textContent;
                    const productPrice = card.querySelector('.price') ? card.querySelector('.price').textContent : '$0.00';
                    
                    // Add to cart
                    addToCart(productName, productPrice);
                });
            }
        });
    }
    
    // Remove from cart buttons
    const removeButtons = document.querySelectorAll('.remove-item');
    
    if (removeButtons.length > 0) {
        removeButtons.forEach(button => {
            button.addEventListener('click', function() {
                const cartItem = this.closest('.cart-item');
                const itemName = cartItem.querySelector('h3').textContent;
                
                if (confirm(`Remove ${itemName} from your cart?`)) {
                    removeFromCart(cartItem);
                }
            });
        });
    }
}

// Add item to cart
function addToCart(productName, productPrice) {
    // In a real implementation, this would update a cart in localStorage or send to a server
    // For demo purposes, we'll just show a success message
    
    // Update cart count
    updateCartCount(1);
    
    // Show success message
    showMessage(`${productName} added to cart!`, 'success');
}

// Remove item from cart
function removeFromCart(cartItem) {
    // Remove the item from the DOM
    cartItem.remove();
    
    // Check if cart is empty
    const cartItems = document.querySelectorAll('.cart-item');
    if (cartItems.length === 0) {
        const emptyCart = document.querySelector('.empty-cart');
        if (emptyCart) {
            emptyCart.style.display = 'block';
        }
        
        const cartSummary = document.querySelector('.cart-summary');
        if (cartSummary) {
            cartSummary.style.display = 'none';
        }
    }
    
    // Update cart count
    updateCartCount(-1);
    
    // Show success message
    showMessage('Item removed from cart!', 'success');
}

// Update cart count
function updateCartCount(change) {
    const cartCount = document.querySelector('.cart-count');
    
    if (cartCount) {
        let count = parseInt(cartCount.textContent);
        count += change;
        
        if (count < 0) count = 0;
        
        cartCount.textContent = count;
        
        // Add animation
        cartCount.classList.add('pulse');
        setTimeout(() => {
            cartCount.classList.remove('pulse');
        }, 500);
    }
}

// Show message
function showMessage(message, type) {
    // Create message element
    const messageElement = document.createElement('div');
    messageElement.className = `message ${type}`;
    messageElement.textContent = message;
    
    // Add to DOM
    document.body.appendChild(messageElement);
    
    // Remove after delay
    setTimeout(() => {
        messageElement.classList.add('fade-out');
        setTimeout(() => {
            document.body.removeChild(messageElement);
        }, 500);
    }, 3000);
}
