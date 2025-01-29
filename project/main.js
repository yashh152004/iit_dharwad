document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const loginContainer = document.querySelector('.login-container');
    const mainWebsite = document.querySelector('.main-website');
    const contentArea = document.querySelector('.content');
    const navLinks = document.querySelectorAll('.nav-links a');
    let sosActivated = false;
    let currentPage = 'home';

    // Store registered users
    let registeredUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];

    // Toggle password visibility with icon change
    document.querySelectorAll('.toggle-password').forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            const input = e.target.previousElementSibling;
            const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
            input.setAttribute('type', type);
            e.target.classList.toggle('fa-eye');
            e.target.classList.toggle('fa-eye-slash');
        });
    });

    // Show registration form
    document.querySelector('.signup-link').addEventListener('click', (e) => {
        e.preventDefault();
        loginContainer.innerHTML = `
            <h1>AASHRAY</h1>
            <p class="tagline">She remembered who she was and the game changed!!</p>
            <form id="registrationForm">
                <div class="form-group">
                    <label for="regFullName">Full Name</label>
                    <input type="text" id="regFullName" required placeholder="Enter your full name">
                </div>
                <div class="form-group">
                    <label for="regEmail">Email</label>
                    <input type="email" id="regEmail" required placeholder="Enter your email">
                </div>
                <div class="form-group">
                    <label for="regPhone">Phone Number</label>
                    <input type="tel" id="regPhone" pattern="[0-9]{10}" required placeholder="Enter your phone number">
                </div>
                <div class="form-group">
                    <label for="regParentPhone">Emergency Contact Number</label>
                    <input type="tel" id="regParentPhone" pattern="[0-9]{10}" required placeholder="Enter emergency contact number">
                </div>
                <div class="form-group">
                    <label for="regAddress">Address</label>
                    <textarea id="regAddress" rows="3" required placeholder="Enter your address"></textarea>
                </div>
                <div class="form-group">
                    <label for="regPassword">Password</label>
                    <div class="password-input">
                        <input type="password" id="regPassword" required placeholder="Create a password">
                        <i class="toggle-password fas fa-eye"></i>
                    </div>
                </div>
                <div class="form-group">
                    <label for="regConfirmPassword">Confirm Password</label>
                    <div class="password-input">
                        <input type="password" id="regConfirmPassword" required placeholder="Confirm your password">
                        <i class="toggle-password fas fa-eye"></i>
                    </div>
                </div>
                <button type="submit" class="sign-in">Register</button>
            </form>
            <p class="signup-text">Already have an account? <a href="#" class="login-link">Login</a></p>
        `;

        // Reattach event listeners
        const registrationForm = document.getElementById('registrationForm');
        registrationForm.addEventListener('submit', handleRegistration);
        document.querySelector('.login-link').addEventListener('click', showLoginForm);
        attachPasswordToggles();
    });

    function attachPasswordToggles() {
        document.querySelectorAll('.toggle-password').forEach(toggle => {
            toggle.addEventListener('click', (e) => {
                const input = e.target.previousElementSibling;
                const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
                input.setAttribute('type', type);
                e.target.classList.toggle('fa-eye');
                e.target.classList.toggle('fa-eye-slash');
            });
        });
    }

    function handleRegistration(e) {
        e.preventDefault();
        
        const email = document.getElementById('regEmail').value;
        const phone = document.getElementById('regPhone').value;
        const parentPhone = document.getElementById('regParentPhone').value;
        const password = document.getElementById('regPassword').value;
        const confirmPassword = document.getElementById('regConfirmPassword').value;

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showNotification('Please enter a valid email address!', 'error');
            return;
        }

        // Phone number validation
        const phoneRegex = /^[6-9]\d{9}$/;
        if (!phoneRegex.test(phone)) {
            showNotification('Please enter a valid 10-digit phone number starting with 6-9!', 'error');
            return;
        }

        if (!phoneRegex.test(parentPhone)) {
            showNotification('Please enter a valid emergency contact number!', 'error');
            return;
        }

        if (password !== confirmPassword) {
            showNotification('Passwords do not match!', 'error');
            return;
        }

        const newUser = {
            fullName: document.getElementById('regFullName').value,
            email: email,
            phone: phone,
            parentPhone: parentPhone,
            address: document.getElementById('regAddress').value,
            password: password
        };

        if (registeredUsers.some(user => user.email === newUser.email)) {
            showNotification('This email is already registered!', 'error');
            return;
        }

        registeredUsers.push(newUser);
        localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
        showNotification('Registration successful! Please login.', 'success');
        setTimeout(showLoginForm, 1500);
    }

    function showLoginForm(e) {
        e?.preventDefault();
        loginContainer.innerHTML = `
            <h1>AASHRAY</h1>
            <p class="tagline">She remembered who she was and the game changed!!</p>
            <form id="loginForm">
                <div class="form-group">
                    <label for="email">Email</label>
                    <input type="email" id="email" required placeholder="Enter your email">
                </div>
                <div class="form-group">
                    <label for="password">Password</label>
                    <div class="password-input">
                        <input type="password" id="password" required placeholder="Enter your password">
                        <i class="toggle-password fas fa-eye"></i>
                    </div>
                </div>
                <button type="submit" class="sign-in">Sign In</button>
            </form>
            <p class="signup-text">Don't have an account? <a href="#" class="signup-link">Sign up</a></p>
        `;

        // Reattach event listeners
        document.querySelector('.signup-link').addEventListener('click', document.querySelector('.signup-link').onclick);
        document.getElementById('loginForm').addEventListener('submit', handleLogin);
        attachPasswordToggles();
    }

    function handleLogin(e) {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        const user = registeredUsers.find(u => u.email === email && u.password === password);

        if (user) {
            showNotification('Login successful!', 'success');
            setTimeout(() => {
                loginContainer.style.display = 'none';
                mainWebsite.style.display = 'block';
                loadPage('home');
            }, 1000);
        } else {
            showNotification('Invalid email or password!', 'error');
        }
    }

    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // Navigation and page loading
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            currentPage = e.target.textContent.toLowerCase();
            loadPage(currentPage);
            
            navLinks.forEach(l => l.classList.remove('active'));
            e.target.classList.add('active');

            // Initialize features for the new page
            initializePageFeatures();
        });
    });

    function loadPage(page) {
        let content = '';
        
        switch(page) {
            case 'home':
                content = `
                    <div class="home-container">
                        <div class="main-section">
                            <p class="tagline-main">She remembered who she was and the game changed!!</p>
                            
                            <div class="alert-section">
                                <div class="sos-button">
                                    <button>${sosActivated ? 'ACTIVATED' : 'SOS'}</button>
                                </div>
                                <h2>Alert Zone</h2>
                                <p class="emergency-text">For Emergency Call: 100</p>
                            </div>

                            <div class="location-section">
                                <h3>Your Current Location</h3>
                                <div class="location-info">
                                    <div id="current-location">Fetching your location...</div>
                                    <div id="map" style="height: 300px; margin-top: 1rem; border-radius: 8px;"></div>
                                </div>
                            </div>
                        </div>

                        <div class="side-panel">
                            <div class="station-info">
                                <h3>Nearby Station</h3>
                                <div class="info-box">
                                    <div class="station-details">
                                        <p><strong>Nearest Police Station:</strong> Central Police Station</p>
                                        <p><strong>Distance:</strong> <span id="station-distance">Calculating...</span></p>
                                        <p><strong>Contact:</strong> 044-28447777</p>
                                        <p><strong>Address:</strong> 123 Main Street</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="cases">
                                <h3>Cases till now</h3>
                                <div class="info-box">
                                    <div class="case-stats">
                                        <p><strong>Total Cases:</strong> 1,234</p>
                                        <p><strong>Resolved:</strong> 1,180</p>
                                        <p><strong>Response Rate:</strong> 98%</p>
                                        <p><strong>Average Response Time:</strong> 5 mins</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                break;
            case 'about':
                content = `
                    <div class="page-content">
                        <h1>About AASHRAY</h1>
                        <div class="about-section">
                            <div class="mission-section">
                                <h2>Our Mission</h2>
                                <p>AASHRAY is dedicated to providing immediate assistance and support to women in distress. Our platform connects users with emergency services, nearby police stations, and support centers.</p>
                            </div>
                            
                            <div class="features-grid">
                                <div class="feature-card">
                                    <i class="fas fa-bell"></i>
                                    <h3>SOS Alert</h3>
                                    <p>One-click emergency alert system that notifies authorities and emergency contacts with your precise location.</p>
                                </div>
                                <div class="feature-card">
                                    <i class="fas fa-location-dot"></i>
                                    <h3>Location Tracking</h3>
                                    <p>Real-time location sharing with emergency services for quick response and assistance.</p>
                                </div>
                                <div class="feature-card">
                                    <i class="fas fa-headset"></i>
                                    <h3>24/7 Support</h3>
                                    <p>Round-the-clock helpline and support system with trained professionals.</p>
                                </div>
                                <div class="feature-card">
                                    <i class="fas fa-shield"></i>
                                    <h3>Safe Zones</h3>
                                    <p>Information about nearby safe zones and police stations for immediate refuge.</p>
                                </div>
                            </div>

                            <div class="safety-tips">
                                <h2>Safety Tips</h2>
                                <div class="tips-carousel">
                                    <div class="tip active">
                                        <h3>Stay Alert</h3>
                                        <p>Always be aware of your surroundings and trust your instincts.</p>
                                    </div>
                                    <div class="tip">
                                        <h3>Share Location</h3>
                                        <p>Keep your trusted contacts informed about your whereabouts.</p>
                                    </div>
                                    <div class="tip">
                                        <h3>Emergency Contacts</h3>
                                        <p>Save important emergency numbers for quick access.</p>
                                    </div>
                                    <div class="carousel-controls">
                                        <button class="prev-tip"><i class="fas fa-chevron-left"></i></button>
                                        <button class="next-tip"><i class="fas fa-chevron-right"></i></button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                break;
            case 'records':
                content = `
                    <div class="page-content">
                        <h1>Safety Records</h1>
                        <div class="records-section">
                            <div class="statistics-overview">
                                <div class="stat-card">
                                    <div class="stat-icon"><i class="fas fa-clock"></i></div>
                                    <h3>Response Time</h3>
                                    <div class="stat-value">5 min</div>
                                    <p>Average response time</p>
                                </div>
                                <div class="stat-card">
                                    <div class="stat-icon"><i class="fas fa-check-circle"></i></div>
                                    <h3>Success Rate</h3>
                                    <div class="stat-value">98%</div>
                                    <p>Cases resolved</p>
                                </div>
                                <div class="stat-card">
                                    <div class="stat-icon"><i class="fas fa-users"></i></div>
                                    <h3>Active Users</h3>
                                    <div class="stat-value">10K+</div>
                                    <p>Registered users</p>
                                </div>
                            </div>

                            <div class="data-visualization">
                                <h2>Monthly Statistics</h2>
                                <div class="chart-container">
                                    <canvas id="monthlyStats"></canvas>
                                </div>
                            </div>

                            <div class="recent-alerts">
                                <h2>Recent Alerts</h2>
                                <div class="alerts-table">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Date</th>
                                                <th>Location</th>
                                                <th>Response Time</th>
                                                <th>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>2024-02-20</td>
                                                <td>Central District</td>
                                                <td>4 mins</td>
                                                <td><span class="status resolved">Resolved</span></td>
                                            </tr>
                                            <tr>
                                                <td>2024-02-19</td>
                                                <td>North Zone</td>
                                                <td>3 mins</td>
                                                <td><span class="status resolved">Resolved</span></td>
                                            </tr>
                                            <tr>
                                                <td>2024-02-19</td>
                                                <td>South Area</td>
                                                <td>6 mins</td>
                                                <td><span class="status resolved">Resolved</span></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                break;
            case 'helpdesk':
                content = `
                    <div class="page-content">
                        <h1>24/7 Helpdesk</h1>
                        <div class="helpdesk-section">
                            <div class="emergency-contacts">
                                <h2>Emergency Numbers</h2>
                                <div class="contacts-grid">
                                    <div class="contact-card emergency">
                                        <i class="fas fa-phone-volume"></i>
                                        <h3>Police Helpline</h3>
                                        <p class="phone">100</p>
                                        <button class="call-btn" onclick="window.location.href='tel:100'">
                                            Call Now
                                        </button>
                                    </div>
                                    <div class="contact-card">
                                        <i class="fas fa-venus"></i>
                                        <h3>Women's Helpline</h3>
                                        <p class="phone">1091</p>
                                        <button class="call-btn" onclick="window.location.href='tel:1091'">
                                            Call Now
                                        </button>
                                    </div>
                                    <div class="contact-card">
                                        <i class="fas fa-ambulance"></i>
                                        <h3>Ambulance</h3>
                                        <p class="phone">102</p>
                                        <button class="call-btn" onclick="window.location.href='tel:102'">
                                            Call Now
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div class="support-channels">
                                <h2>Support Channels</h2>
                                <div class="channels-grid">
                                    <div class="channel-card">
                                        <i class="fas fa-comments"></i>
                                        <h3>Live Chat</h3>
                                        <p>Chat with our support team</p>
                                        <button class="chat-btn" onclick="initializeChat()">Start Chat</button>
                                    </div>
                                    <div class="channel-card">
                                        <i class="fas fa-envelope"></i>
                                        <h3>Email Support</h3>
                                        <p>support@aashray.com</p>
                                        <button class="email-btn" onclick="window.location.href='mailto:support@aashray.com'">
                                            Send Email
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div class="help-form">
                                <h2>Contact Support</h2>
                                <form id="supportForm" onsubmit="handleSupportForm(event)">
                                    <div class="form-group">
                                        <label for="subject">Subject</label>
                                        <input type="text" id="subject" required placeholder="Enter subject">
                                    </div>
                                    <div class="form-group">
                                        <label for="message">Message</label>
                                        <textarea id="message" rows="4" required placeholder="Describe your concern"></textarea>
                                    </div>
                                    <div class="form-group">
                                        <label for="priority">Priority</label>
                                        <select id="priority" required>
                                            <option value="low">Low</option>
                                            <option value="medium">Medium</option>
                                            <option value="high">High</option>
                                            <option value="emergency">Emergency</option>
                                        </select>
                                    </div>
                                    <button type="submit" class="submit-btn">Send Message</button>
                                </form>
                            </div>
                        </div>
                    </div>
                `;
                break;
        }
        
        contentArea.innerHTML = content;
        
        // Initialize location and map if on home page
        if (page === 'home') {
            initializeLocationFeatures();
            initializeSosButton();
        }
    }

    function initializeLocationFeatures() {
        if (navigator.geolocation) {
            navigator.geolocation.watchPosition(
                position => {
                    const { latitude, longitude } = position.coords;
                    updateLocationInfo(latitude, longitude);
                    updateMap(latitude, longitude);
                },
                error => {
                    document.getElementById('current-location').innerHTML = 
                        'Unable to access location. Please enable location services.';
                },
                { enableHighAccuracy: true }
            );
        } else {
            document.getElementById('current-location').innerHTML = 
                'Location services are not supported by your browser.';
        }
    }

    function updateLocationInfo(latitude, longitude) {
        // Reverse geocoding to get address
        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`)
            .then(response => response.json())
            .then(data => {
                document.getElementById('current-location').innerHTML = `
                    <p><strong>Address:</strong> ${data.display_name}</p>
                    <p><strong>Coordinates:</strong> ${latitude.toFixed(6)}, ${longitude.toFixed(6)}</p>
                `;
            })
            .catch(error => {
                console.error('Error fetching address:', error);
            });
    }

    function updateMap(latitude, longitude) {
        const mapElement = document.getElementById('map');
        if (mapElement) {
            // Using OpenStreetMap
            const map = L.map('map').setView([latitude, longitude], 15);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors'
            }).addTo(map);

            // Add marker for user's location
            L.marker([latitude, longitude])
                .addTo(map)
                .bindPopup('Your current location')
                .openPopup();
        }
    }

    function initializeSosButton() {
        const sosButton = document.querySelector('.sos-button button');
        if (sosButton) {
            sosButton.addEventListener('click', () => {
                sosActivated = !sosActivated;
                sosButton.textContent = sosActivated ? 'ACTIVATED' : 'SOS';
                sosButton.classList.toggle('activated');
                
                if (sosActivated) {
                    showNotification('Emergency services have been notified! Help is on the way.', 'error');
                    // Share location with emergency services
                    navigator.geolocation?.getCurrentPosition(
                        position => {
                            const { latitude, longitude } = position.coords;
                            console.log('Location shared with emergency services:', { latitude, longitude });
                            // Here you would typically send this to your emergency service endpoint
                        },
                        error => {
                            showNotification('Unable to share location with emergency services', 'error');
                        }
                    );
                }
            });
        }
    }

    function initializeChat() {
        showNotification('Connecting to support chat...', 'info');
        // Here you would typically initialize your chat widget
    }

    function handleSupportForm(event) {
        event.preventDefault();
        const subject = document.getElementById('subject').value;
        const message = document.getElementById('message').value;
        const priority = document.getElementById('priority').value;

        // Here you would typically send this to your backend
        console.log('Support request:', { subject, message, priority });
        showNotification('Your message has been sent. We will respond shortly.', 'success');
        event.target.reset();
    }

    // Initialize the tips carousel
    function initTipsCarousel() {
        const tips = document.querySelectorAll('.tip');
        let currentTip = 0;

        document.querySelector('.next-tip')?.addEventListener('click', () => {
            tips[currentTip].classList.remove('active');
            currentTip = (currentTip + 1) % tips.length;
            tips[currentTip].classList.add('active');
        });

        document.querySelector('.prev-tip')?.addEventListener('click', () => {
            tips[currentTip].classList.remove('active');
            currentTip = (currentTip - 1 + tips.length) % tips.length;
            tips[currentTip].classList.add('active');
        });
    }

    // Initialize charts for the Records page
    function initializeCharts() {
        const ctx = document.getElementById('monthlyStats')?.getContext('2d');
        if (ctx) {
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                    datasets: [{
                        label: 'Alerts',
                        data: [145, 132, 156, 142, 138, 148],
                        borderColor: '#3498DB',
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false
                }
            });
        }
    }

    // Add event listeners after page load based on current page
    function initializePageFeatures() {
        if (currentPage === 'about') {
            initTipsCarousel();
        } else if (currentPage === 'records') {
            initializeCharts();
        }
    }

    // Call initialize features when page loads
    initializePageFeatures();

    // Initial setup
    loginForm.addEventListener('submit', handleLogin);
});