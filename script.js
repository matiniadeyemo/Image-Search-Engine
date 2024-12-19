const UNSPLASH_ACCESS_KEY = 'PCQIvScQPKYe4K3lXteORvwPi01A-cSg9jyZWdSM0-c';
const showMoreButton = document.getElementById('show-more');
const searchInput = document.getElementById('search-input');
let currentQuery = '';
let currentPage = 1;

document.getElementById('search-input').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        startSearch();
    }
});

document.getElementById('back-arrow').addEventListener('click', function() {
    resetSearch();
});

document.getElementById('show-more').addEventListener('click', function() {
    loadMoreImages();
});
document.getElementById('close-modal').addEventListener('click', function() {
    closeModal();
});
document.getElementById('image-modal').addEventListener('click', function(event) {
    if (event.target === document.getElementById('image-modal')) {
        closeModal();
    }
});
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function startSearch() {
    currentQuery = document.getElementById('search-input').value.trim();
    if (!currentQuery) {
        document.getElementById('search-container').style.display = 'none';
        document.getElementById('search-info').style.display = 'flex';
        document.getElementById('back-arrow').style.display = 'flex';
        document.getElementById('search-message').innerHTML = `
        <div class='not-found'>
        <img src='image/face-frown-solid.svg' width='40px'>
        <p>Sorry, but nothing matched your search terms. Please try again with different keywords.</p>
        </div>
        `;
        return;
    }
    currentPage = 1; 
    displaySearchInfo(currentQuery);
    await searchImages(); 
}

async function searchImages() {
    const loadingIndicator = document.getElementById('loading');
    const imageResults = document.getElementById('image-results');
    
   
    loadingIndicator.classList.remove('hidden');
    imageResults.innerHTML = ''; 
    document.getElementById('back-arrow').style.display = 'flex';
    
    await delay(3000);

    await fetchImages(currentPage);
    
    loadingIndicator.classList.add('hidden'); 
}

async function loadMoreImages() {
    currentPage++; 
    await fetchImages(currentPage);
}

async function fetchImages(page) {
    const url = `https://api.unsplash.com/search/photos?query=${currentQuery}&page=${page}&per_page=10&client_id=${UNSPLASH_ACCESS_KEY}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        displayImages(data.results);
    } catch (error) {
        console.error("Error fetching images:", error);
    }
}


function displayImages(images) {
const imageResults = document.getElementById('image-results');
const showMoreButton = document.getElementById('show-more');
if (currentPage === 1) {
imageResults.innerHTML = '';
}


if (images.length === 0 && currentPage === 1) {

const noResultsMessage = document.createElement('p');
noResultsMessage.textContent = "No results found.";
imageResults.appendChild(noResultsMessage);

showMoreButton.style.display = 'none';
} else if (images.length === 0) {
showMoreButton.style.display = 'none';
}
else {
images.forEach(image => {
    const imageContainer = document.createElement('div');
    imageContainer.classList.add('image-container');

    const img = document.createElement('img');
    img.src = image.urls.small;
    img.alt = image.alt_description || "Image";

    img.addEventListener('click', () => {
        openModal(image.urls.small, image.user.name, image.user.location);

     });

    const overlay = document.createElement('div');
    overlay.classList.add('image-overlay');

    const name = document.createElement('p');
    name.classList.add('image-name');
    name.textContent = image.user.name || "Untitled";

    const location = document.createElement('p');
    location.classList.add('image-location');
    location.textContent = image.user.location || "Location not available";

    overlay.appendChild(name);
    overlay.appendChild(location);

    imageContainer.appendChild(img);
    imageContainer.appendChild(overlay);

    imageResults.appendChild(imageContainer);
});

showMoreButton.style.display = 'block';
}
}



function displaySearchInfo(query) {
    document.getElementById('search-container').style.display = 'none';
    document.getElementById('search-info').style.display = 'flex';
    document.getElementById('back-arrow').style.display = 'flex';
    document.getElementById('search-message').innerHTML = `<h1>You searched for: <strong>${query}</strong></h1>`;
}

function resetSearch() {
    document.getElementById('search-container').style.display = 'flex';
    document.getElementById('search-info').style.display = 'none';
    document.getElementById('image-results').innerHTML = ''; 
    document.getElementById('show-more').style.display = 'none'; 
    document.getElementById('back-arrow').style.display = 'none';
}
function openModal(imageUrl, imageName, imageLocation) {
    document.getElementById('modal-image').src = imageUrl;
    document.getElementById('modal-image-name').textContent = imageName || "Untitled";
    document.getElementById('modal-image-location').textContent = imageLocation || "Location not available";
    document.getElementById('image-modal').style.display = 'flex';
}

function closeModal() {
document.getElementById('image-modal').style.display = 'none';
}