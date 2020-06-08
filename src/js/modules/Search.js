import axios from 'axios';
import { apiKey } from '../config';
export default class Search {
  constructor(query) {
    this.query = query;
  }
  async getResults() {
    try {
      const res = await axios(
        `https://api.spoonacular.com/recipes/search?apiKey=${apiKey}&query=${this.query}&number=30`
      );
      this.result = res.data.results;
      // console.log(this.result);
    } catch (error) {
      console.log(error);
    }
  }
}
