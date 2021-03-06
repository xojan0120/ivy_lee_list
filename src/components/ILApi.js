// ----------------------------------------------------------------------------------------
// * Import Modules(Third party)
// ----------------------------------------------------------------------------------------
import axios from 'axios';

// ----------------------------------------------------------------------------------------
// * Import Modules(Self made)
// ----------------------------------------------------------------------------------------
import {
  cmnApiEndPointUri,
} from './Common';

// ----------------------------------------------------------------------------------------
// * Main Class
// ----------------------------------------------------------------------------------------
export default class ILApi {
  constructor() {
    this.server = cmnApiEndPointUri;
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
    const data = { title: title };
    return axios.post(`${this.server}/items`, data);
  }

  archiveItem = (itemId) => {
    return axios.put(`${this.server}/items/${itemId}/archive`);
  }

  moveItem = (itemId, from, to) => {
    const data = { from: from, to: to };
    return axios.patch(`${this.server}/items/${itemId}/order`, data);
  }

  changeItem = (item) => {
    const data = { title: item.title };
    return axios.patch(`${this.server}/items/${item.id}/title`, data);
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
