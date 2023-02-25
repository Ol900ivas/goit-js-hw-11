import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const KEY = '33761900-0017c9dc68bb6d4e3ac4c8f50';
const searchParams = new URLSearchParams({
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: true,
  per_page: 40,
});

export default class ImgApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }

  async searchImages() {
    const url = `${BASE_URL}?key=${KEY}&q=${this.searchQuery}&${searchParams}&page=${this.page}`;
    const response = await axios.get(url);
    this.nextPage();
    return response.data;
  }

  nextPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }
}

// ============================Previous variant===================
// Запит на за допомогою fetch
// searchImages() {
//   const url = `${BASE_URL}?key=${KEY}&q=${this.searchQuery}&${searchParams}&page=${this.page}`;
//   return fetch(url).then((res) => res.json()).then((images) => {
//     // console.log(images);
//     this.nextPage();
//     return images;
//   });
// }

// Запит за допомогою axios
// searchImages() {
//     const url = `${BASE_URL}?key=${KEY}&q=${this.searchQuery}&${searchParams}&page=${this.page}`;
//     return axios.get(url).then(({ data }) => {
//       console.log(data);
//       this.nextPage();
//       return data;
//     });
//   }
