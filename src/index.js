import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import axios from 'axios';

const loadMoreBtn = document.querySelector('.load-more');
const form = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const searchInput = document.querySelector('#search-input');

let page = 1;
let isLoading = false;
let lightbox;

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '36222156-a0a786a0445a35f0e3f8fc28d';
const pageCount = 40;

async function fetchImages(query, page) {
  const response = await axios.get(BASE_URL, {
    params: {
      key: API_KEY,
      q: query,
      page: page,
      per_page: pageCount,
    },
  });
  const data = response.data;
  return data.hits;
}

function showErrorMessage() {
  Notiflix.Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.'
  );
}

function displayImages(images) {
  const cards = images.map(image => {
    const { webformatURL, likes, views, comments, downloads, largeImageURL } =
      image;
    return `
  <a href="${largeImageURL}" class="card">
    <img src="${webformatURL}" alt="" />
    <div class="card-info">
      <ul>
        <li> <p>likes</p>${likes}</li>
        <li> <p>views</p>${views}</li>
        <li> <p>comments</p>${comments}</li>
        <li> <p>downloads</p>${downloads}</li>
      </ul>
    </div>
  </a>
`;
  });

  gallery.insertAdjacentHTML('beforeend', cards.join(''));

  if (lightbox) {
    lightbox.refresh();
  } else {
    lightbox = new SimpleLightbox('.gallery a');
  }

  loadMoreBtn.style.display = 'block';
}

function showErrorMessage() {
  Notiflix.Notify.failure('Failed to load images');
}

async function loadNextImages() {
  if (isLoading) {
    return;
  }

  isLoading = true;

  try {
    const query = searchInput.value;
    const images = await fetchImages(query, page);
    displayImages(images);
    page++;
    const totalHits = images.totalHits;
    if (page * pageCount < totalHits) {
      loadMoreBtn.style.display = 'block';
    } else {
      loadMoreBtn.style.display = 'none';
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
    }
  } catch (error) {
    console.error(error);
    showErrorMessage();
  }

  isLoading = false;
}

form.addEventListener('submit', event => {
  event.preventDefault();
  gallery.innerHTML = '';
  page = 1;
  loadNextImages();
});

window.addEventListener('scroll', () => {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

  if (scrollTop + clientHeight >= scrollHeight - 10) {
    loadNextImages();
  }
});
