# newsflash-website

## Overview
NewsFlash is a responsive news website that delivers real-time updates by integrating with public news APIs. The website showcases strong front-end development and API handling skills using HTML, CSS, and JavaScript.

## Features
- Real-time news updates from various categories
- Responsive design that works on all devices
- Search functionality to find specific news
- Category filtering (General, Business, Technology, Sports, etc.)
- Infinite scroll for seamless browsing experience
- Modern and clean user interface

## Technologies Used
- HTML5
- CSS3 (Flexbox and Grid for layouts)
- JavaScript (ES6+)
- Public News API Integration
- Font Awesome for icons

## Setup Instructions

### 1. Get an API Key
This project uses the GNews API for fetching news data. You need to obtain an API key:

1. Visit [GNews API](https://gnews.io/) and sign up for a free account
2. After registration, you'll receive an API key
3. Copy your API key

Alternatively, you can use [NewsAPI](https://newsapi.org/) which also offers a free tier (with some limitations).

### 2. Configure the API Key
Open the `script.js` file and replace the placeholder API key with your actual key:

```javascript
const API_KEY = 'YOUR_API_KEY'; // Replace with your actual API key
```

### 3. Run the Website
You can run the website using any local server. If you have Python installed, you can use:

```
# For Python 3.x
python -m http.server

# For Python 2.x
python -m SimpleHTTPServer
```

Or simply open the `index.html` file in your browser.

## API Usage Notes

- The free tier of GNews API has limitations on the number of requests (typically 100 requests per day)
- If you're using NewsAPI, note that their free tier only works on localhost and not in production

## Project Structure

- `index.html` - Main HTML structure of the website
- `styles.css` - All styling and responsive design rules
- `script.js` - JavaScript code for API integration and interactive features

## Future Enhancements

- User authentication system
- Personalized news feed based on user preferences
- Bookmark/save favorite articles
- Dark mode toggle
- Share articles on social media
- Weather widget integration

## License
This project is open source and available under the [MIT License](LICENSE).
