
// No Firebase imports needed for this method

document.addEventListener('DOMContentLoaded', async () => {
    // -----------------------------------------------------
    // Simulated User Data Storage (using localStorage)
    // This is for demonstration purposes ONLY. Not secure for production.
    // -----------------------------------------------------
    let users = JSON.parse(localStorage.getItem('registeredUsers')) || [];
    let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

    // -----------------------------------------------------
    // Property Data (Loaded from localStorage or default)
    // -----------------------------------------------------
    let properties = JSON.parse(localStorage.getItem('properties')) || [
        {
            id: 1,
            title: 'Spacious Family Home',
            description: 'Beautiful 3-bedroom home with a large backyard, perfect for families. Recently renovated kitchen and bathrooms.',
            address: '123 Main St',
            city: 'Anytown',
            state: 'USA',
            zip: '12345',
            price: 550000,
            type: 'residential',
            bedrooms: 3,
            bathrooms: 2,
            squareFootage: 1800,
            amenities: ['Garage', 'Large Yard', 'New Appliances'],
            images: ['img/property1.jpg', 'img/property1_kitchen.jpg', 'img/property1_bedroom.jpg']
        },
        {
            id: 2,
            title: 'Modern Downtown Apartment',
            description: 'Luxury 2-bedroom apartment in the heart of the city with stunning views and access to public transport.',
            address: '456 Oak Ave',
            city: 'Big City',
            state: 'USA',
            zip: '67890',
            price: 3200, // Monthly rent example
            isRental: true,
            type: 'residential',
            bedrooms: 2,
            bathrooms: 2,
            squareFootage: 1200,
            amenities: ['Balcony', 'Gym Access', 'Concierge'],
            images: ['img/property2.jpg', 'img/property2_livingroom.jpg']
        },
        {
            id: 3,
            title: 'Commercial Office Space',
            description: 'Prime commercial space ideal for small businesses or startups. High foot traffic area.',
            address: '789 Business Rd',
            city: 'Metro City',
            state: 'USA',
            zip: '11223',
            price: 800000,
            type: 'commercial',
            bedrooms: 0,
            bathrooms: 1,
            squareFootage: 2500,
            amenities: ['Parking', 'High-Speed Internet', 'Conference Room'],
            images: ['img/property3.jpg']
        }
    ];

    // Variable to temporarily hold the selected image Data URL for new property
    let selectedImageDataURL = null;

    // -----------------------------------------------------
    // DOM Elements - Get references to all necessary elements
    // -----------------------------------------------------
    const propertyGrid = document.getElementById('property-grid');
    const filterForm = document.getElementById('filter-form');
    const addPropertyForm = document.getElementById('add-property-form');
    const contactForm = document.getElementById('contact-form');
    const searchLocationInput = document.getElementById('search-location');
    const searchButton = document.getElementById('search-button');

    // Navigation Links
    const navBuyRentSell = document.getElementById('nav-buy-rent-sell');
    const addPropertyNavLink = document.getElementById('add-property-nav-link');
    const contactNavLink = document.getElementById('contact-nav-link');
    const loginNavLink = document.getElementById('login-nav-link');
    const createAccountNavLink = document.getElementById('create-account-nav-link');
    const userDisplayArea = document.getElementById('user-display-area');
    const userEmailSpan = document.getElementById('user-email');
    const logoutButton = document.getElementById('logout-button');

    // Section Elements (Main content areas)
    const heroSection = document.querySelector('.hero-section');
    const loginSection = document.getElementById('login-section');
    const createAccountSection = document.getElementById('create-account-section');
    const propertyListingsMainSection = document.getElementById('property-listings-main-section');
    const addPropertySection = document.getElementById('add-property-section');
    const contactSection = document.getElementById('contact-section');
    const propertyDetailsSection = document.getElementById('property-details-section');

    // Form Elements for Login/Create Account
    const loginForm = document.getElementById('login-form');
    const loginEmailInput = document.getElementById('login-email');
    const loginPasswordInput = document.getElementById('login-password');
    const loginErrorMessage = document.getElementById('login-error-message');

    const createAccountForm = document.getElementById('create-account-form');
    const createEmailInput = document.getElementById('create-email');
    const createPasswordInput = document.getElementById('create-password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    const createErrorMessage = document.getElementById('create-error-message');

    const switchToCreateLink = document.getElementById('switch-to-create');
    const switchToLoginLink = document.getElementById('switch-to-login');

    // Add Property form specific elements for image preview
    const propertyImagesInput = document.getElementById('property-images');
    const propertyImagePreview = document.getElementById('property-image-preview');
    const noImageSelectedText = document.getElementById('no-image-selected-text');

    // Custom Confirmation Modal Elements
    const customConfirmModal = document.getElementById('custom-confirm-modal');
    const modalMessage = document.getElementById('modal-message');
    const modalConfirmBtn = document.getElementById('modal-confirm-btn');
    const modalCancelBtn = document.getElementById('modal-cancel-btn');

    // Property Details Elements
    const detailsTitle = document.getElementById('details-title');
    const detailsPrice = document.getElementById('details-price');
    const detailsAddress = document.getElementById('details-address');
    const detailsBedBathSqft = document.getElementById('details-bed-bath-sqft');
    const detailsDescription = document.getElementById('details-description');
    const detailsAmenities = document.getElementById('details-amenities');
    const detailsImageGallery = document.getElementById('details-image-gallery');
    const backToListingsBtn = document.getElementById('back-to-listings-btn');


    // -----------------------------------------------------
    // UI Visibility Helper Functions
    // -----------------------------------------------------
    /**
     * Hides all major content sections by adding the 'hidden' class.
     * The hero section remains visible as it's a static part of the layout.
     */
    function hideAllSections() {
        console.log("Hiding all sections...");
        propertyListingsMainSection.classList.add('hidden');
        addPropertySection.classList.add('hidden');
        contactSection.classList.add('hidden');
        loginSection.classList.add('hidden');
        createAccountSection.classList.add('hidden');
        propertyDetailsSection.classList.add('hidden');
        // Log current hidden state for debugging
        console.log("Property Listings hidden (after hideAllSections):", propertyListingsMainSection.classList.contains('hidden'));
        console.log("Add Property hidden (after hideAllSections):", addPropertySection.classList.contains('hidden'));
        console.log("Contact hidden (after hideAllSections):", contactSection.classList.contains('hidden'));
        console.log("Login hidden (after hideAllSections):", loginSection.classList.contains('hidden'));
        console.log("Create Account hidden (after hideAllSections):", createAccountSection.classList.contains('hidden'));
        console.log("Property Details hidden (after hideAllSections):", propertyDetailsSection.classList.contains('hidden'));
    }

    /**
     * Shows a specific section by removing the 'hidden' class.
     * @param {HTMLElement} sectionElement - The DOM element of the section to show.
     */
    function showSection(sectionElement) {
        console.log("Showing section:", sectionElement.id);
        sectionElement.classList.remove('hidden');
        console.log(`${sectionElement.id} hidden (after showSection):`, sectionElement.classList.contains('hidden'));
    }

    /**
     * Hides an error message element and clears its text content.
     * @param {HTMLElement} errorElement - The DOM element of the error message.
     */
    function hideErrorMessage(errorElement) {
        errorElement.classList.add('hidden');
        errorElement.textContent = '';
    }

    /**
     * Displays an error message element with specific text.
     * @param {HTMLElement} errorElement - The DOM element of the error message.
     * @param {string} message - The error message to display.
     */
    function showErrorMessage(errorElement, message) {
        errorElement.textContent = message;
        errorElement.classList.remove('hidden');
    }

    /**
     * Updates navigation and content visibility for a logged-in user.
     * @param {object} user - The current user object (from localStorage).
     */
    function updateUIForAuthenticatedUser(user) {
        console.log("--- Executing updateUIForAuthenticatedUser for:", user.email, "---");
        loginNavLink.classList.add('hidden');
        createAccountNavLink.classList.add('hidden');
        userDisplayArea.classList.remove('hidden');
        userEmailSpan.textContent = user.email;
        addPropertyNavLink.classList.remove('hidden');
        navBuyRentSell.textContent = 'View Properties';
        hideErrorMessage(loginErrorMessage);
        hideErrorMessage(createErrorMessage);

        // Show main content after login
        hideAllSections(); // Hide all first
        showSection(propertyListingsMainSection); // Then show listings
        showSection(contactSection); // And contact
        renderProperties(properties); // Render properties after login
        console.log("--- Finished updateUIForAuthenticatedUser ---");
    }

    /**
     * Updates navigation and content visibility for a logged-out user.
     */
    function updateUIForLoggedOutUser() {
        console.log("--- Executing updateUIForLoggedOutUser ---");

        // Update navigation links visibility
        loginNavLink.classList.remove('hidden');
        console.log("loginNavLink hidden (after removing):", loginNavLink.classList.contains('hidden'));
        createAccountNavLink.classList.remove('hidden');
        console.log("createAccountNavLink hidden (after removing):", createAccountNavLink.classList.contains('hidden'));
        userDisplayArea.classList.add('hidden');
        console.log("userDisplayArea hidden (after adding):", userDisplayArea.classList.contains('hidden'));
        userEmailSpan.textContent = '';
        addPropertyNavLink.classList.add('hidden');
        console.log("addPropertyNavLink hidden (after adding):", addPropertyNavLink.classList.contains('hidden'));
        navBuyRentSell.textContent = 'Buy/Rent/Sell';

        // Explicitly hide ALL content sections first
        // Note: We are no longer calling hideAllSections() here for main content sections
        // to directly control their visibility.
        propertyListingsMainSection.classList.add('hidden');
        addPropertySection.classList.add('hidden');
        contactSection.classList.add('hidden');
        createAccountSection.classList.add('hidden'); // Ensure create account is hidden
        propertyDetailsSection.classList.add('hidden'); // Ensure property details is hidden

        console.log("All main content sections explicitly hidden.");
        console.log("propertyListingsMainSection hidden (after explicit hide):", propertyListingsMainSection.classList.contains('hidden'));
        console.log("addPropertySection hidden (after explicit hide):", addPropertySection.classList.contains('hidden'));
        console.log("contactSection hidden (after explicit hide):", contactSection.classList.contains('hidden'));
        console.log("createAccountSection hidden (after explicit hide):", createAccountSection.classList.contains('hidden'));
        console.log("propertyDetailsSection hidden (after explicit hide):", propertyDetailsSection.classList.contains('hidden'));

        // Then, explicitly show ONLY the login section
        loginSection.classList.remove('hidden');
        console.log("loginSection hidden (after showing):", loginSection.classList.contains('hidden'));

        // Explicitly clear property grid content on logout to prevent stale data display
        propertyGrid.innerHTML = '';
        console.log("Property grid content cleared.");
        console.log("--- Finished updateUIForLoggedOutUser ---");
    }

    // -----------------------------------------------------
    // Custom Confirmation Modal Functions
    // -----------------------------------------------------
    let confirmCallback = null; // Stores the function to call if user confirms

    /**
     * Displays the custom confirmation modal.
     * @param {string} message - The message to display in the modal.
     * @param {function} onConfirm - The callback function to execute if the user confirms.
     */
    function showCustomConfirmModal(message, onConfirm) {
        modalMessage.textContent = message;
        confirmCallback = onConfirm; // Store the callback
        customConfirmModal.classList.remove('hidden');
    }

    /**
     * Hides the custom confirmation modal.
     */
    function hideCustomConfirmModal() {
        customConfirmModal.classList.add('hidden');
        confirmCallback = null; // Clear the callback
    }

    // Event listeners for the modal buttons
    modalConfirmBtn.addEventListener('click', () => {
        if (confirmCallback) {
            confirmCallback(); // Execute the stored callback
        }
        hideCustomConfirmModal();
    });

    modalCancelBtn.addEventListener('click', () => {
        hideCustomConfirmModal();
    });


    // -----------------------------------------------------
    // Initial UI Setup based on localStorage
    // This function will run once the DOM is loaded to set the initial state.
    // -----------------------------------------------------
    if (currentUser) {
        console.log("Initial setup: User found in localStorage. Updating UI for authenticated user.");
        updateUIForAuthenticatedUser(currentUser);
    } else {
        console.log("Initial setup: No user found in localStorage. Updating UI for logged out user.");
        updateUIForLoggedOutUser();
    }

    // -----------------------------------------------------
    // Navigation and Form Switching Event Listeners
    // -----------------------------------------------------

    // Navigation link for Buy/Rent/Sell (main property listings)
    navBuyRentSell.addEventListener('click', (e) => {
        e.preventDefault();
        hideAllSections();
        if (currentUser) {
            showSection(propertyListingsMainSection);
        } else {
            showSection(loginSection); // Redirect to login if not authenticated
        }
    });

    // Navigation link for Add Property
    addPropertyNavLink.addEventListener('click', (e) => {
        e.preventDefault();
        hideAllSections();
        showSection(addPropertySection);
        // Reset image preview and file input when navigating to Add Property form
        propertyImagePreview.classList.add('hidden');
        noImageSelectedText.classList.remove('hidden');
        propertyImagePreview.src = "https://placehold.co/150x100/e0e0e0/ffffff?text=Image+Preview"; // Reset to default placeholder
        propertyImagesInput.value = ''; // Clear file input
        selectedImageDataURL = null; // Clear stored image data URL
    });

    // Navigation link for Contact
    contactNavLink.addEventListener('click', (e) => {
        e.preventDefault();
        hideAllSections();
        showSection(contactSection);
    });

    // Navigation link for Login
    loginNavLink.addEventListener('click', (e) => {
        e.preventDefault();
        console.log("Login nav link clicked.");
        hideAllSections();
        showSection(loginSection);
        hideErrorMessage(loginErrorMessage); // Clear any previous errors
    });

    // Navigation link for Create Account
    createAccountNavLink.addEventListener('click', (e) => {
        e.preventDefault();
        console.log("Create Account nav link clicked.");
        hideAllSections();
        showSection(createAccountSection);
        hideErrorMessage(createErrorMessage); // Clear any previous errors
    });

    // Link to switch from Login form to Create Account form
    switchToCreateLink.addEventListener('click', (e) => {
        e.preventDefault();
        console.log("Switch to Create Account link clicked.");
        hideAllSections();
        showSection(createAccountSection);
        hideErrorMessage(createErrorMessage);
        hideErrorMessage(loginErrorMessage); // Also clear login form error
    });

    // Link to switch from Create Account form to Login form
    switchToLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        console.log("Switch to Login link clicked.");
        hideAllSections();
        showSection(loginSection);
        hideErrorMessage(loginErrorMessage);
        hideErrorMessage(createErrorMessage); // Also clear create form error
    });

    // Logout button
    logoutButton.addEventListener('click', () => {
        console.log("Logout button clicked. Initiating logout process.");
        currentUser = null;
        localStorage.removeItem('currentUser'); // Clear current user from localStorage
        // Using a custom alert for consistency, though native alert was used before.
        // For debugging, we'll keep the native alert for now as it's less prone to UI issues.
        alert("You have been logged out.");
        updateUIForLoggedOutUser(); // Update UI after logout
        console.log("Logout process completed.");
    });

    // -----------------------------------------------------
    // LocalStorage-based Authentication Form Submissions
    // -----------------------------------------------------

    // Handle Login Form Submission
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        hideErrorMessage(loginErrorMessage); // Clear previous error

        const email = loginEmailInput.value;
        const password = loginPasswordInput.value;

        const userFound = users.find(user => user.email === email && user.password === password);

        if (userFound) {
            currentUser = userFound;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            alert("Successfully logged in!");
            updateUIForAuthenticatedUser(currentUser); // Update UI after login
        } else {
            showErrorMessage(loginErrorMessage, "Invalid email or password.");
        }
    });

    // Handle Create Account Form Submission
    createAccountForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        hideErrorMessage(createErrorMessage); // Clear previous error

        const email = createEmailInput.value;
        const password = createPasswordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        if (password !== confirmPassword) {
            showErrorMessage(createErrorMessage, "Passwords do not match!");
            return;
        }
        if (password.length < 6) {
            showErrorMessage(createErrorMessage, "Password must be at least 6 characters long.");
            return;
        }

        // Check if email already exists
        if (users.some(user => user.email === email)) {
            showErrorMessage(createErrorMessage, "This email is already registered. Please login or use a different email.");
            return;
        }

        const newUser = { email, password }; // In a real app, password would be hashed
        users.push(newUser);
        localStorage.setItem('registeredUsers', JSON.stringify(users)); // Save updated users list
        currentUser = newUser; // Log in the new user automatically
        localStorage.setItem('currentUser', JSON.stringify(currentUser));

        alert("Account created successfully! You are now logged in.");
        updateUIForAuthenticatedUser(currentUser); // Update UI after account creation
    });

    // -----------------------------------------------------
    // Image Preview Functionality for Add Property Form
    // -----------------------------------------------------
    propertyImagesInput.addEventListener('change', (event) => {
        const files = event.target.files;
        if (files.length > 0) {
            const file = files[0]; // Just preview the first selected image
            const reader = new FileReader();

            reader.onload = function(e) {
                propertyImagePreview.src = e.target.result;
                propertyImagePreview.classList.remove('hidden');
                noImageSelectedText.classList.add('hidden');
                selectedImageDataURL = e.target.result; // Store the Data URL
            };

            reader.onerror = function() {
                propertyImagePreview.src = "https://placehold.co/150x100/e0e0e0/ffffff?text=Error+Loading";
                propertyImagePreview.classList.remove('hidden');
                noImageSelectedText.classList.add('hidden');
                selectedImageDataURL = null; // Clear on error
            };

            reader.readAsDataURL(file);
        } else {
            propertyImagePreview.classList.add('hidden');
            noImageSelectedText.classList.remove('hidden');
            propertyImagePreview.src = "https://placehold.co/150x100/e0e0e0/ffffff?text=Image+Preview"; // Reset to placeholder
            selectedImageDataURL = null; // Clear if no file selected
        }
    });


    // -----------------------------------------------------
    // Property Data Rendering, Filtering, and Deletion
    // -----------------------------------------------------
    /**
     * Renders properties into the property grid.
     * @param {Array} filteredProperties - An array of property objects to render.
     */
    function renderProperties(filteredProperties) {
        propertyGrid.innerHTML = ''; // Clear existing properties
        if (filteredProperties.length === 0) {
            propertyGrid.innerHTML = '<p>No properties found matching your criteria.</p>';
            return;
        }

        filteredProperties.forEach(property => {
            const propertyCard = document.createElement('div');
            propertyCard.classList.add('property-card');
            // Use the stored image data URL if available, otherwise fallback to a default image
            const imageUrl = property.images && property.images.length > 0 ? property.images[0] : 'img/image_not_found.jpg';
            propertyCard.innerHTML = `
                <img src="${imageUrl}" alt="${property.title}" onerror="this.onerror=null;this.src='img/image_not_found.jpg';">
                <div class="card-details">
                    <h3>${property.isRental ? '$' + property.price.toLocaleString() + '/month' : '$' + property.price.toLocaleString()} | ${property.bedrooms} Bed | ${property.bathrooms} Bath</h3>
                    <p>${property.address}, ${property.city}, ${property.state}</p>
                    <p>${property.type.charAt(0).toUpperCase() + property.type.slice(1)} | ${property.squareFootage} sqft</p>
                    <button class="view-details-btn" data-property-id="${property.id}">View Details</button>
                    <button class="delete-property-btn" data-property-id="${property.id}"><i class="fas fa-times"></i></button>
                </div>
            `;
            propertyGrid.appendChild(propertyCard);
        });

        // Add event listeners to "View Details" buttons
        document.querySelectorAll('.view-details-btn').forEach(button => {
            button.addEventListener('click', (event) => {
                const propertyId = parseInt(event.target.dataset.propertyId);
                showPropertyDetails(propertyId);
            });
        });

        // Add event listeners to "Delete" buttons
        document.querySelectorAll('.delete-property-btn').forEach(button => {
            button.addEventListener('click', (event) => {
                const propertyId = parseInt(event.target.dataset.propertyId || event.target.closest('button').dataset.propertyId); // Handle icon click
                showCustomConfirmModal(`Are you sure you want to delete this property (ID: ${propertyId})?`, () => {
                    deleteProperty(propertyId);
                });
            });
        });
    }

    /**
     * Displays detailed information for a specific property.
     * @param {number} propertyId - The ID of the property to display.
     */
    function showPropertyDetails(propertyId) {
        const property = properties.find(p => p.id === propertyId);
        if (!property) {
            alert('Property not found.');
            return;
        }

        hideAllSections(); // Hide all other sections
        showSection(propertyDetailsSection); // Show the details section

        // Populate details
        detailsTitle.textContent = property.title;
        detailsPrice.textContent = property.isRental ? `$${property.price.toLocaleString()}/month` : `$${property.price.toLocaleString()}`;
        detailsAddress.textContent = `${property.address}, ${property.city}, ${property.state}, ${property.zip}`;
        detailsBedBathSqft.textContent = `${property.bedrooms} Bed | ${property.bathrooms} Bath | ${property.squareFootage} sqft`;
        detailsDescription.textContent = property.description;
        detailsAmenities.textContent = property.amenities.length > 0 ? `Amenities: ${property.amenities.join(', ')}` : 'No specific amenities listed.';

        // Populate image gallery
        detailsImageGallery.innerHTML = ''; // Clear previous images
        if (property.images && property.images.length > 0) {
            property.images.forEach(imageSrc => {
                const imgElement = document.createElement('img');
                imgElement.src = imageSrc;
                imgElement.alt = property.title;
                imgElement.onerror = function() { this.onerror=null; this.src='img/image_not_found.jpg'; };
                detailsImageGallery.appendChild(imgElement);
            });
        } else {
            detailsImageGallery.innerHTML = '<p>No images available for this property.</p>';
        }
    }

    // Event listener for "Back to Listings" button in details view
    backToListingsBtn.addEventListener('click', () => {
        hideAllSections();
        showSection(propertyListingsMainSection);
        renderProperties(properties); // Re-render to ensure current state
    });


    /**
     * Deletes a property from the array and updates localStorage.
     * @param {number} idToDelete - The ID of the property to delete.
     */
    function deleteProperty(idToDelete) {
        const initialLength = properties.length;
        properties = properties.filter(property => property.id !== idToDelete);
        if (properties.length < initialLength) {
            localStorage.setItem('properties', JSON.stringify(properties)); // Save updated properties
            renderProperties(properties); // Re-render the grid
            alert(`Property ID ${idToDelete} deleted successfully.`);
        } else {
            alert(`Property ID ${idToDelete} not found.`);
        }
    }


    /**
     * Applies filters to the properties array and re-renders the grid.
     */
    function applyFilters() {
        const locationFilter = document.getElementById('location-filter').value.toLowerCase();
        const minPrice = parseFloat(document.getElementById('min-price').value) || 0;
        const maxPrice = parseFloat(document.getElementById('max-price').value) || Infinity;
        const propertyType = document.getElementById('property-type').value;
        const bedrooms = parseInt(document.getElementById('bedrooms').value) || 0;
        const bathrooms = parseFloat(document.getElementById('bathrooms').value) || 0;
        const minSqft = parseFloat(document.getElementById('min-sqft').value) || 0;
        const maxSqft = parseFloat(document.getElementById('max-sqft').value) || Infinity;

        const filtered = properties.filter(property => {
            const matchesLocation = locationFilter === '' ||
                                    property.address.toLowerCase().includes(locationFilter) ||
                                    property.city.toLowerCase().includes(locationFilter) ||
                                    property.state.toLowerCase().includes(locationFilter) ||
                                    property.zip.toLowerCase().includes(locationFilter);

            const matchesPrice = property.price >= minPrice && property.price <= maxPrice;
            const matchesType = propertyType === '' || property.type === propertyType;
            const matchesBedrooms = property.bedrooms >= bedrooms;
            const matchesBathrooms = property.bathrooms >= bathrooms;
            const matchesSqft = property.squareFootage >= minSqft && property.squareFootage <= maxSqft;

            return matchesLocation && matchesPrice && matchesType && matchesBedrooms && matchesBathrooms && matchesSqft;
        });

        renderProperties(filtered);
    }

    // Event listener for filter form submission
    filterForm.addEventListener('submit', (event) => {
        event.preventDefault();
        applyFilters();
    });

    // Event listener for filter form reset
    filterForm.addEventListener('reset', () => {
        // Delay rendering slightly to allow form to clear
        setTimeout(() => renderProperties(properties), 50);
    });

    // Event listener for main search button
    searchButton.addEventListener('click', () => {
        document.getElementById('location-filter').value = searchLocationInput.value;
        applyFilters();
    });

    // Event listener for 'Enter' key in search input
    searchLocationInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            searchButton.click();
        }
    });

    // -----------------------------------------------------
    // Add Property Functionality
    // -----------------------------------------------------
    addPropertyForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const newProperty = {
            id: properties.length > 0 ? Math.max(...properties.map(p => p.id)) + 1 : 1, // Generate unique ID
            title: document.getElementById('property-title').value,
            description: document.getElementById('property-description').value,
            address: document.getElementById('property-address').value,
            city: document.getElementById('property-city').value,
            state: document.getElementById('property-state').value,
            zip: document.getElementById('property-zip').value,
            price: parseFloat(document.getElementById('property-price').value),
            type: document.getElementById('property-type-add').value,
            bedrooms: parseInt(document.getElementById('num-bedrooms').value) || 0,
            bathrooms: parseFloat(document.getElementById('num-bathrooms').value) || 0,
            squareFootage: parseFloat(document.getElementById('square-footage-add').value) || 0,
            amenities: document.getElementById('property-amenities').value.split(',').map(item => item.trim()),
            images: [] // Initialize as empty array for images
        };

        // Use the selectedImageDataURL if an image was chosen, otherwise use fallback
        if (selectedImageDataURL) {
            newProperty.images.push(selectedImageDataURL);
        } else {
            newProperty.images.push('img/image_not_found.jpg');
        }

        properties.push(newProperty); // Add new property to the array
        localStorage.setItem('properties', JSON.stringify(properties)); // Save updated properties to localStorage
        renderProperties(properties); // Re-render the property grid to show the new property
        addPropertyForm.reset(); // Clear the form

        // Reset image preview after form submission
        propertyImagePreview.classList.add('hidden');
        noImageSelectedText.classList.remove('hidden');
        propertyImagePreview.src = "https://placehold.co/150x100/e0e0e0/ffffff?text=Image+Preview";
        propertyImagesInput.value = ''; // Clear file input
        selectedImageDataURL = null; // Clear stored image data URL

        alert('Property added successfully! Note: Images are stored locally in your browser and may not persist across sessions or devices due to size limitations.');
    });

    // -----------------------------------------------------
    // Contact Form Functionality
    // -----------------------------------------------------
    contactForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const formData = {
            name: document.getElementById('contact-name').value,
            phone: document.getElementById('contact-phone').value,
            subject: document.getElementById('contact-subject').value,
            message: document.getElementById('contact-message').value
        };

        console.log('Contact Form Data:', formData);
        alert('Thank you for your inquiry! We will get back to you soon. (Data logged to console)');
        contactForm.reset();
    });

    // -----------------------------------------------------
    // Smooth Scrolling for Navigation Links
    // -----------------------------------------------------
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            // Get the target element using the href attribute
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});
