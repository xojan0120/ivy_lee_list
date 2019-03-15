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
  Preloader,
  SwipeoutActions,
  SwipeoutButton,
} from 'framework7-react';
import $$ from 'dom7';

// ----------------------------------------------------------------------------------------
// Import(Self made)
// ----------------------------------------------------------------------------------------
import { failureCallBack } from './Common'
import ILApi               from './ILApi'

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
      isLoading: false
    }
  }

  componentDidMount = () => {
    console.log('run componentDidMount!');
    this.fetchAllArchivedItem();
  }

  componentWillUnmount = () => {
    console.log('run componentWillUnmount!');
  }

  fetchAllArchivedItem = () => {
    console.log('run fetchAllArchivedItem!');

    this.setState({ isLoading: true });
    (new ILApi()).fetchAllArchivedItem()
      .then((result) => {
        const items = result.data.data;
        this.setState({ items: items })
      })
      .catch((error) => {
        failureCallBack(error)
      })
      .finally(() => {
        this.setState({ isLoading: false })
      });
  }

  handleRestoreItem = (item, e) => {
    console.log('run handleRestoreItem!');

    this.setState({ isLoading: true });
    (new ILApi()).restoreItem(item.id)
      .then((result) => {
        let newItems = [];
        this.state.items.map((value,index) => {
          if (value.id !== item.id) {
            newItems.push(value);
          }
          return true;
        })
        this.setState({ items: newItems })
      })
      .catch((error) => {
        failureCallBack(error)
      })
      .finally(() => {
        this.setState({ isLoading: false })
      });
  }

  handleDeleteItem = (item, e) => {
    console.log('run handleDeleteItem!');

    this.setState({ isLoading: true });
    (new ILApi()).deleteItem(item.id)
      .then((result) => {
        let newItems = [];
        this.state.items.map((value,index) => {
          if (value.id !== item.id) {
            newItems.push(value);
          }
          return true;
        })
        this.setState({ items: newItems })
      })
      .catch((error) => {
        failureCallBack(error)
      })
      .finally(() => {
        this.setState({ isLoading: false })
      });
  }

  handleDeleteAllArchivedItem = (e) => {
    console.log('run handleDeleteAllArchivedItem!');

    if ($$(itemsSelector).length > 0) {
      const answer = window.confirm('Delete all?');
      if (answer) {
        this.setState({ isLoading: true });
        (new ILApi()).deleteAllArchivedItem()
          .then((result) => {
            this.setState({ items: [] })
          })
          .catch((error) => {
            failureCallBack(error)
          })
          .finally(() => {
            this.setState({ isLoading: false })
          });
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
          <NavTitle>
            Archive
            <Preloader
              size={21}
              style={{visibility: this.state.isLoading ? "visible" : "hidden"}}>
            </Preloader>
          </NavTitle>
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
