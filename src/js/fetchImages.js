import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '36222156-a0a786a0445a35f0e3f8fc28d';
const pageCount = 40;

export async function fetchImages(query, page) {
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
