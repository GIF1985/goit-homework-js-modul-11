import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const loadMoreBtn = document.querySelector('.load-more');
const form = document.querySelector('#search-form');
const gallery = document.querySelector('.gallery');
const searchInput = document.querySelector('#search-input');

let page = 1;
let isLoading = false;
let lightbox;

import { fetchImages } from './js/fetchImages.js';

let totalImagesLoaded = 0;

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

  totalImagesLoaded += images.length;

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

    if (images.length === 0) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }

    displayImages(images);
    page++;
    const totalHits = images.totalHits;

    if (page === 2) {
      totalImagesLoaded = images.length;
    }

    if (totalImagesLoaded < totalHits) {
      loadMoreBtn.style.display = 'block';
    } else {
      loadMoreBtn.style.display = 'none';
      Notiflix.Notify.info(`Loaded ${totalImagesLoaded} images in total`);
    }
  } catch (error) {
    console.error(error);
  }

  isLoading = false;
}

form.addEventListener('submit', event => {
  event.preventDefault();
  gallery.innerHTML = '';
  page = 1;
  totalImagesLoaded = 0;
  loadNextImages();
});

window.addEventListener('scroll', () => {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

  if (scrollTop + clientHeight >= scrollHeight - 10) {
    loadNextImages();
  }
});
