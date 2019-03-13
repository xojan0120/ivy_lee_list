// ----------------------------------------------------------------------------------------
// Import(Standard)
// ----------------------------------------------------------------------------------------
import React, { Component } from 'react';

// ----------------------------------------------------------------------------------------
// Import(Framework7)
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
    SwipeoutActions,
    SwipeoutButton,
} from 'framework7-react';
import $$ from 'dom7';

// ----------------------------------------------------------------------------------------
// Import(Self made)
// ----------------------------------------------------------------------------------------
import ILApi from './ILApi'

// ----------------------------------------------------------------------------------------
// CSS ClassName
// ----------------------------------------------------------------------------------------
const itemClass   = 'archive-item';
const itemsClass  = 'archive-items';

// ----------------------------------------------------------------------------------------
// CSS Selector
// ----------------------------------------------------------------------------------------
const itemsSelector = `.${itemsClass} li`;

// ----------------------------------------------------------------------------------------
// Other
// ----------------------------------------------------------------------------------------

// ----------------------------------------------------------------------------------------
// Main Class
// ----------------------------------------------------------------------------------------
export default class ILArchiveList extends Component {
  constructor(props) {
    console.log('run constructor!');
    super(props);

    this.state = {
      items: [],
    }
  }

  componentDidMount = () => {
    console.log('run componentDidMount!');
    this.fetchAllArchivedItem();
  }

  componentWillUnmount = () => {
    console.log('run componentWillUnmount!');
  }

  failureCallBack = (e) => {
    alert(e);
  }

  fetchAllArchivedItem = () => {
    console.log('run fetchAllArchivedItem!');

    let promise = (new ILApi()).fetchAllArchivedItem();
    promise.then(
      (result) => {
        const items = result.data.data;
        this.setState({ items: items })
      },
      this.failureCallBack
    )
  }

  handleRestoreItem = (item, e) => {
    console.log('run handleRestoreItem!');

    let promise = (new ILApi()).restoreItem(item.id);
    promise.then(
      (result) => {
        let newItems = [];
        this.state.items.map((value,index) => {
          if (value.id !== item.id) {
            newItems.push(value);
          }
          return true;
        })
        this.setState({ items: newItems })
      },
      this.failureCallBack
    )
  }

  handleDeleteItem = (item, e) => {
    console.log('run handleDeleteItem!');

    let promise = (new ILApi()).deleteItem(item.id);
    promise.then(
      (result) => {
        let newItems = [];
        this.state.items.map((value,index) => {
          if (value.id !== item.id) {
            newItems.push(value);
          }
          return true;
        })
        this.setState({ items: newItems })
      },
      this.failureCallBack
    )
  }

  handleDeleteAllArchivedItem = (e) => {
    console.log('run handleDeleteAllArchivedItem!');

    if ($$(itemsSelector).length > 0) {
      const answer = window.confirm('Delete all?');
      if (answer) {
        let promise = (new ILApi()).deleteAllArchivedItem();
        promise.then(
          (result) => {
            this.setState({ items: [] })
          },
          this.failureCallBack
        )
      }
    }
  }

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
            onClick={this.handleRestoreItem.bind(this,item)}>
            Restore
          </SwipeoutButton>
          <SwipeoutButton
            color="red"
            onClick={this.handleDeleteItem.bind(this,item)}>
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
          <NavTitle>Archive</NavTitle>
          <NavRight>
            <Link iconF7="trash" onClick={this.handleDeleteAllArchivedItem}></Link>
          </NavRight>
        </Navbar>
        <List className={itemsClass}>
          {
            this.state.items.map(
              (item, index)=>{ return this.renderItem(item) }
            )
          }
        </List>
      </Page>
    );
  }
}
