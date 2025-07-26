// API Key for NewsAPI.org
const API_KEY = 'YOUR_API_KEY'; // Replace with your actual API key from newsapi.org

// DOM Elements
const newsContainer = document.getElementById('news-container');
const searchInput = document.getElementById('search-input');
const searchBtn = document.getElementById('search-btn');
const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('nav ul');
const categoryLinks = document.querySelectorAll('nav ul li a');

// Default settings
let currentCategory = 'general';
let currentPage = 1;
let totalResults = 0;
let isLoading = false;
let lastQuery = '';

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    // Setup event listeners
    setupEventListeners();
    
    // Setup network status handler
    handleNetworkStatus();
    
    // Load default news (general category) if online and API key is valid
    if (navigator.onLine && checkApiKey()) {
        fetchNews(currentCategory);
    }
});

// Setup all event listeners
function setupEventListeners() {
    // Category selection
    categoryLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Update active class
            categoryLinks.forEach(item => item.classList.remove('active'));
            link.classList.add('active');
            
            // Get category and fetch news
            currentCategory = link.getAttribute('data-category');
            currentPage = 1;
            lastQuery = '';
            fetchNews(currentCategory);
            
            // Close mobile menu if open
            navMenu.classList.remove('show');
        });
    });
    
    // Search functionality
    searchBtn.addEventListener('click', handleSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });
    
    // Mobile menu toggle
    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('show');
    });
    
    // Infinite scroll
    window.addEventListener('scroll', () => {
        if (isLoading) return;
        
        // Check if we're near the bottom of the page
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500) {
            if (currentPage * 20 < totalResults) {
                currentPage++;
                if (lastQuery) {
                    searchNews(lastQuery, true);
                } else {
                    fetchNews(currentCategory, true);
                }
            }
        }
    });
}

// Handle search functionality
function handleSearch() {
    const query = searchInput.value.trim();
    if (query.length > 0) {
        currentPage = 1;
        lastQuery = query;
        searchNews(query);
        
        // Update UI to show we're in search mode
        categoryLinks.forEach(item => item.classList.remove('active'));
    }
}

// Fetch news by category
async function fetchNews(category, append = false) {
    if (isLoading) return;
    
    isLoading = true;
    showLoading(append);
    
    try {
        // For demo purposes, we'll use a free alternative to NewsAPI since NewsAPI only works on localhost for free accounts
        // In a real application, you would use the NewsAPI endpoint: 
        // `https://newsapi.org/v2/top-headlines?country=us&category=${category}&page=${currentPage}&apiKey=${API_KEY}`
        
        // For this demo, we'll use the Gnews API which has a free tier that works in production
        const response = await fetch(`https://gnews.io/api/v4/top-headlines?category=${category}&lang=en&country=us&max=10&page=${currentPage}&apikey=${API_KEY}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Update total results
        totalResults = data.totalArticles || 0;
        
        // Display the news
        displayNews(data.articles, append);
    } catch (error) {
        console.error('Error fetching news:', error);
        showError('Failed to load news. Please try again later.');
    } finally {
        isLoading = false;
        hideLoading();
    }
}

// Search news by query
async function searchNews(query, append = false) {
    if (isLoading) return;
    
    isLoading = true;
    showLoading(append);
    
    try {
        // For demo purposes, using Gnews API instead of NewsAPI
        const response = await fetch(`https://gnews.io/api/v4/search?q=${encodeURIComponent(query)}&lang=en&country=us&max=10&page=${currentPage}&apikey=${API_KEY}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Update total results
        totalResults = data.totalArticles || 0;
        
        // Display the news
        displayNews(data.articles, append);
    } catch (error) {
        console.error('Error searching news:', error);
        showError('Failed to search news. Please try again later.');
    } finally {
        isLoading = false;
        hideLoading();
    }
}

// Display news in the container
function displayNews(articles, append = false) {
    // If no articles found
    if (!articles || articles.length === 0) {
        if (!append) {
            newsContainer.innerHTML = '<div class="no-results">No news articles found. Try a different search or category.</div>';
        }
        return;
    }
    
    // Clear container if not appending
    if (!append) {
        newsContainer.innerHTML = '';
    }
    
    // Create and append news cards
    articles.forEach(article => {
        const newsCard = createNewsCard(article);
        newsContainer.appendChild(newsCard);
    });
}

// Create a news card element
function createNewsCard(article) {
    const card = document.createElement('div');
    card.className = 'news-card';
    
    // Format the publication date
    const pubDate = new Date(article.publishedAt);
    const formattedDate = pubDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    // Create card content
    card.innerHTML = `
        <div class="news-image">
            <img src="${article.image || 'https://via.placeholder.com/300x200?text=No+Image+Available'}" alt="${article.title}">
        </div>
        <div class="news-content">
            <span class="news-category">${currentCategory.charAt(0).toUpperCase() + currentCategory.slice(1)}</span>
            <h3 class="news-title">${article.title}</h3>
            <p class="news-description">${article.description || 'No description available'}</p>
            <div class="news-source">
                <span>${article.source.name || 'Unknown Source'}</span>
                <span>${formattedDate}</span>
            </div>
            <a href="${article.url}" class="news-read-more" target="_blank">Read More</a>
        </div>
    `;
    
    return card;
}

// Show loading spinner
function showLoading(append) {
    if (!append) {
        newsContainer.innerHTML = `
            <div class="loading">
                <div class="spinner"></div>
                <p>Loading news...</p>
            </div>
        `;
    } else {
        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'loading';
        loadingDiv.innerHTML = `
            <div class="spinner"></div>
            <p>Loading more news...</p>
        `;
        newsContainer.appendChild(loadingDiv);
    }
}

// Hide loading spinner
function hideLoading() {
    const loadingElements = document.querySelectorAll('.loading');
    loadingElements.forEach(el => el.remove());
}

// Show error message
function showError(message) {
    // For critical errors, redirect to error page
    if (message.includes('API key') || message.includes('Failed to load')) {
        window.location.href = `error.html?message=${encodeURIComponent(message)}`;
        return;
    }
    
    // For non-critical errors, show in-page message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    
    // Clear container and show error
    newsContainer.innerHTML = '';
    newsContainer.appendChild(errorDiv);
}

// Add this function to handle the case when API key is not set
function checkApiKey() {
    if (API_KEY === 'YOUR_API_KEY') {
        showError('Please set your API key in the script.js file. You can get a free API key from newsapi.org or gnews.io');
        return false;
    }
    return true;
}

// Function to handle network status
function handleNetworkStatus() {
    window.addEventListener('online', () => {
        // Reload current category when connection is restored
        if (lastQuery) {
            searchNews(lastQuery);
        } else {
            fetchNews(currentCategory);
        }
    });
    
    window.addEventListener('offline', () => {
        showError('You are currently offline. Please check your internet connection and try again.');
    });
    
    // Check initial status
    if (!navigator.onLine) {
        showError('You are currently offline. Please check your internet connection and try again.');
    }
}

// Check API key on load
if (!checkApiKey()) {
    console.error('API key not set. Please update the API_KEY constant in script.js');
}