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

// --------------------------------------------------------------------------------------
// ClassName
// --------------------------------------------------------------------------------------
const taskListClass  = 'task-list';
const taskClass      = 'task';

// --------------------------------------------------------------------------------------
// Selector
// --------------------------------------------------------------------------------------

// --------------------------------------------------------------------------------------
// Other
// --------------------------------------------------------------------------------------

export default class ILArchiveList extends Component {
  componentDidMount = () => {
  }

  handleRestoreList = (e) => {
    console.log("restore!");
    // 親要素へのイベント伝播をキャンセルする
    e.stopPropagation();
  }

  handleDeleteList = (e) => {
    console.log("delete!");
    // 親要素へのイベント伝播をキャンセルする
    e.stopPropagation();
  }

  renderListItem = (title) => {
    return(
      <ListItem className={taskClass} title={title} name="demo-checkbox" swipeout>
        <SwipeoutActions left>
          <SwipeoutButton delete onClick={this.handleRestoreList}>Restore</SwipeoutButton>
          <SwipeoutButton delete onClick={this.handleDeleteList}>Delete</SwipeoutButton>
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
            <Link iconF7="trash"></Link>
          </NavRight>
        </Navbar>
        <List className={taskListClass}>
          {this.renderListItem("archive1")}
          {this.renderListItem("archive2")}
        </List>
      </Page>
    );
  }
}
