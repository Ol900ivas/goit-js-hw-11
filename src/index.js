import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import ImgApiService from './ImgApiService.js';
import LoadMoreBtn from './LoadMoreBtn.js';

const formEl = document.getElementById('search-form');
const galleryEl = document.querySelector('.gallery');

const lightboxGallery = new SimpleLightbox('.gallery a');

const imgApiService = new ImgApiService();
const loadMoreBtn = new LoadMoreBtn({
  selector: '.load-more',
  isHidden: true,
});

formEl.addEventListener('submit', onSearch);
loadMoreBtn.button.addEventListener('click', fetchImg);

function onSearch(evt) {
  evt.preventDefault();
  imgApiService.searchQuery =
    evt.currentTarget.elements.searchQuery.value.trim();
  if (imgApiService.searchQuery === '') {
    Notify.warning('Please enter a request.', {
      timeout: 3000,
    });
    clearGallery();
    return;
  }
  imgApiService.resetPage();
  clearGallery();
  fetchImg();
  loadMoreBtn.show();
}

async function fetchImg() {
  loadMoreBtn.disable();
  try {
    const data = await imgApiService.searchImages();
    const images = data.hits;

    if (images.length === 0) {
      loadMoreBtn.hide();
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }

    if (images.length !== 0 && imgApiService.page === 2) {
      Notify.success(`Hooray! We found ${data.totalHits} images.`);
    }

    if (images.length < 40) {
      loadMoreBtn.hide();
      Notify.warning(
        "We're sorry, but you've reached the end of search results."
      );
    }
    createGalleryMarkup(images);

    lightboxGallery.refresh();
  } catch (error) {
    console.log(error);
  }
}

function createImgCardMarkup({
  webformatURL,
  largeImageURL,
  tags,
  likes,
  views,
  comments,
  downloads,
}) {
  return `<div class="photo-card">
  <a href="${largeImageURL}">
    <div class="thumb">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" />
  </div>
    </a>
  <div class="info">
    <p class="info-item">
      <b>Likes</b><span>${likes}</span>
    </p>
    <p class="info-item">
      <b>Views</b><span>${views}</span>
    </p>
    <p class="info-item">
      <b>Comments</b><span>${comments}</span>
    </p>
    <p class="info-item">
      <b>Downloads</b><span>${downloads}</span>
    </p>
  </div>
</div>`;
}

// Робимо розмітку для всіх карток зображень групи
function createGalleryMarkup(img) {
  const totalMarkup = img.reduce(
    (markup, data) => markup + createImgCardMarkup(data),
    ''
  );
  appendImgToGallery(totalMarkup);
  loadMoreBtn.enable();
}

// Розміщення карток зображень в галереї
function appendImgToGallery(totalMarkup) {
  galleryEl.insertAdjacentHTML('beforeend', totalMarkup);
}

// Очищуємо галерею
function clearGallery() {
  galleryEl.innerHTML = '';
}

//Розрахунок групп зображень
function lastPageNotification() {
  const totalPages = data.totalHits / 40;
  if (ImgApiService.page === totalPages) {
    Notify.warning(
      "We're sorry, but you've reached the end of search results."
    );
    loadMoreBtn.hide();
    return;
  }
}

// ============================Previous variant===================
// function fetchImg() {
//   loadMoreBtn.disable();
//   return imgApiService
//     .searchImages()
//     .then(({ hits, totalHits }) => {
//       if (hits.length === 0) {
//         loadMoreBtn.hide();
//         Notify.failure(
//           'Sorry, there are no images matching your search query. Please try again.'
//         ); return
//       }
//       createGalleryMarkup(hits);
//       console.log(hits);
//     })
//     .catch(onError);
// }
// // На випадок помилки
// function onError(error) {
//   loadMoreBtn.hide();
//   console.log(error);
// }
