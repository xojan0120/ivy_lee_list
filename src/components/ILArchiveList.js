import React, { Component } from 'react';
import {
    Page,
    Navbar,
    NavLeft,
    NavRight,
    NavTitle,
    Link,
    List,
    ListItem,
    SwipeoutActions,
    SwipeoutButton,
} from 'framework7-react';
import ILApi from './ILApi'

// --------------------------------------------------------------------------------------
// ClassName
// --------------------------------------------------------------------------------------
const itemsClass  = 'items';
const itemClass   = 'item';

// --------------------------------------------------------------------------------------
// Selector
// --------------------------------------------------------------------------------------

// --------------------------------------------------------------------------------------
// Other
// --------------------------------------------------------------------------------------

export default class ILArchiveList extends Component {
  constructor(props) {
    console.log("run constructor!");
    super(props);

    this.state = {
      items: [],
    }
  }

  componentDidMount = () => {
    console.log("componentDidMount!");
    this.fetchAllArchivedItem();
  }

  fetchAllArchivedItem = () => {
    console.log('run fetchAllArchivedItem!');

    let promise = (new ILApi()).fetchAllArchivedItem();
    promise.then((result) => {
      // -----------------------------------
      // TODO:resultからのitems取得処理を入れる
      // -----------------------------------

      // mock data
      const items = [
        {id:1, title: "item1" },
        {id:2, title: "item2" },
      ]
      this.setState({
        items: items
      })
    })
  }

  handleRestoreItem = (item, e) => {
    console.log('run handleRestoreItem!');

    let promise = (new ILApi()).restoreItem(item);
    promise.then((result) => {
      let newItems = [];
      this.state.items.map((value,index) => {
        if (value.id != item.id) {
          newItems.push(value);
        }
      })
      this.setState({
        items: newItems
      })
    })
  }

  handleDeleteItem = (item, e) => {
    console.log('run handleDeleteItem!');


    let promise = (new ILApi()).deleteItem(item);
    promise.then((result) => {
      let newItems = [];
      this.state.items.map((value,index) => {
        if (value.id != item.id) {
          newItems.push(value);
        }
      })
      this.setState({
        items: newItems
      })
    })
  }

  handleDeleteAllItem = (e) => {
    console.log('run handleDeleteAllItem!');
    const answer = window.confirm('All delete?');

    if (answer) {
      let promise = (new ILApi()).deleteAllItem();
      promise.then((result) => {
        this.setState({
          items: []
        })
      })
    }
  }

  renderItem = (item) => {
    return(
      <ListItem key={item.id} className={itemClass} title={item.title} name="demo-checkbox" swipeout>
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
            <Link iconF7="trash" onClick={this.handleDeleteAllItem}></Link>
          </NavRight>
        </Navbar>
        <List className={itemsClass}>
          {
            this.state.items.map((item, index)=>{
              return this.renderItem(item);
            })
          }
        </List>
      </Page>
    );
  }
}
