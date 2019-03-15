import axios from 'axios';

export default class ILApi {
  constructor() {
    //this.server = 'http://192.168.33.10:3001/api/v1/ill';
    this.server = 'http://192.168.11.7:3001/api/v1/ill';
  }

  // APIから受け取るitems形式
  // [
  //   { id: 100, title: "task1" },
  //   { id: 101, title: "task2" }
  // ]
  fetchAllItem = () => {
    return axios.get(`${this.server}/items`);
  }

  addItem = (title) => {
    const data = { title: title }
    return axios.post(`${this.server}/items`, data);
  }

  archiveItem = (itemId) => {
    return axios.put(`${this.server}/items/${itemId}/archive`);
  }

  moveItem = (itemId, from, to) => {
    const data = { from: from, to: to }
    return axios.patch(`${this.server}/items/${itemId}/update_order`, data);
  }

  fetchAllArchivedItem = () => {
    return axios.get(`${this.server}/archived_items`);
  }

  restoreItem = (itemId) => {
    return axios.put(`${this.server}/archived_items/${itemId}/restore`);
  }

  deleteItem = (itemId) => {
    return axios.delete(`${this.server}/archived_items/${itemId}`);
  }

  deleteAllArchivedItem = () => {
    return axios.delete(`${this.server}/archived_items`);
  }
}
