// ----------------------------------------------------------------------------------------
// * Import Modules(Standard)
// ----------------------------------------------------------------------------------------
import React, { Component } from 'react';

// ----------------------------------------------------------------------------------------
// * Import Modules(Framework7)
// ----------------------------------------------------------------------------------------
import {
  Link,
  List,
  ListItem,
  NavLeft,
  NavRight,
  NavTitle,
  Navbar,
  Page,
  Preloader,
  SwipeoutActions,
  SwipeoutButton,
} from 'framework7-react';
import $$ from 'dom7';

// ----------------------------------------------------------------------------------------
// * Import Modules(Self made)
// ----------------------------------------------------------------------------------------
import { 
  cmnFailureCallBack,
  cmnPreloaderSize
} from './Common';
import ILApi from './ILApi';

// ----------------------------------------------------------------------------------------
// * CSS ClassName
// ----------------------------------------------------------------------------------------
const itemClass  = 'archive-item';
const itemsClass = 'archive-items';

// ----------------------------------------------------------------------------------------
// * CSS Selector
// ----------------------------------------------------------------------------------------
const itemsSelector = `.${itemsClass} li`;

// ----------------------------------------------------------------------------------------
// * Other Constants
// ----------------------------------------------------------------------------------------

// ----------------------------------------------------------------------------------------
// * Main Class
// ----------------------------------------------------------------------------------------
export default class ILArchiveList extends Component {
  constructor(props) {
    console.log('run constructor!');
    super(props);

    this.state = {
      items: [],
      isLoading: false
    };
  }

  // --------------------------------------------------------------------------------------
  // * Lifecycle Methods
  // --------------------------------------------------------------------------------------
  componentDidMount = () => {
    console.log('run componentDidMount!');
    this.fetchAllArchivedItem();
  }

  componentWillUnmount = () => {
    console.log('run componentWillUnmount!');
  }

  // --------------------------------------------------------------------------------------
  // * Event handlers and Related Methods
  // --------------------------------------------------------------------------------------
  // アイテム全削除
  handleDeleteAllArchivedItem = (e) => {
    console.log('run handleDeleteAllArchivedItem!');

    if ($$(itemsSelector).length > 0) {
      const answer = window.confirm('Delete all?');
      if (answer) {
        this.setState({ isLoading: true });
        (new ILApi()).deleteAllArchivedItem()
          .then   ((result) => { this.setState({ items: [] })        })
          .catch  ((error)  => { cmnFailureCallBack(error)           })
          .finally(()       => { this.setState({ isLoading: false }) });
      };
    };
  }

  // アイテム復元
  handleRestoreItem = (item, e) => {
    console.log('run handleRestoreItem!');

    this.setState({ isLoading: true });
    (new ILApi()).restoreItem(item.id)
      .then((result) => {
        const newItems = this.state.items.filter( curItem => curItem.id !== item.id ); 
        this.setState({ items: newItems });
      })
      .catch  ((error) => { cmnFailureCallBack(error)           })
      .finally(()      => { this.setState({ isLoading: false }) });
  }

  // アイテム削除
  handleDeleteItem = (item, e) => {
    console.log('run handleDeleteItem!');

    this.setState({ isLoading: true });
    (new ILApi()).deleteItem(item.id)
      .then((result) => {
        const newItems = this.state.items.filter( curItem => curItem.id !== item.id ); 
        this.setState({ items: newItems });
      })
      .catch  ((error) => { cmnFailureCallBack(error)           })
      .finally(()      => { this.setState({ isLoading: false }) });
  }

  // 全アーカイブアイテム取得
  fetchAllArchivedItem = () => {
    console.log('run fetchAllArchivedItem!');

    this.setState({ isLoading: true });
    (new ILApi()).fetchAllArchivedItem()
      .then((result) => {
        const items = result.data.data;
        this.setState({ items: items });
      })
      .catch  ((error) => { cmnFailureCallBack(error)           })
      .finally(()      => { this.setState({ isLoading: false }) });
  }

  // --------------------------------------------------------------------------------------
  // Render Methods
  // --------------------------------------------------------------------------------------
  renderItem = (item) => {
    return(
      <ListItem
        key={item.id}
        className={itemClass}
        title={item.title}
        swipeout
      >
        <SwipeoutActions left>
          <SwipeoutButton
            color="green"
            onClick={this.handleRestoreItem.bind(this,item)}
          >
            Restore
          </SwipeoutButton>
          <SwipeoutButton
            color="red"
            onClick={this.handleDeleteItem.bind(this,item)}
          >
            Delete
          </SwipeoutButton>
        </SwipeoutActions>
      </ListItem>
    );
  }

  render() {
    return(
      <Page>
        <Navbar>
          <NavLeft>
            <Link iconF7="list" href="/"></Link>
          </NavLeft>
          <NavTitle>
            Archive
          </NavTitle>
          <Preloader
            size={cmnPreloaderSize}
            style={{visibility: this.state.isLoading ? "visible" : "hidden"}}
          >
          </Preloader>
          <NavRight>
            <Link iconF7="trash" onClick={this.handleDeleteAllArchivedItem}></Link>
          </NavRight>
        </Navbar>
        <List className={itemsClass}>
          {
            this.state.items.map((item, index) => {
              return this.renderItem(item)
            })
          }
        </List>
      </Page>
    );
  }
}
