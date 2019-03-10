import React, { Component } from 'react';
import {
    Page,
    Navbar,
    NavLeft,
    NavTitle,
    Link,
    List,
    ListItem,
    SwipeoutActions,
    SwipeoutButton,
} from 'framework7-react';
import $ from 'jquery';
import $$ from 'dom7';

// --------------------------------------------------------------------------------------
// ClassName
// --------------------------------------------------------------------------------------
const stockClass     = 'stock';
const separatorClass = 'separator';
const taskListClass  = 'task-list';
const taskClass      = 'task';

// --------------------------------------------------------------------------------------
// Selector
// --------------------------------------------------------------------------------------
const taskListSelector = `.${taskListClass} li`;
const taskSelector     = `li.${taskClass}`;

// --------------------------------------------------------------------------------------
// Other
// --------------------------------------------------------------------------------------
const separator = '----------';

export default class ILArchiveList extends Component {
  componentDidMount = () => {
    //$$(taskSelector).on('click', (e) => {
    //  this.handleClickList(e);
    //})
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

  // TODO
  // 右上にオール削除ボタン
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
            <Link iconIos="f7:menu" iconMd="material:menu" href="/"></Link>
          </NavLeft>
          <NavTitle>Archive</NavTitle>
        </Navbar>
        <List className={taskListClass}>
          {this.renderListItem("archive1")}
          {this.renderListItem("archive2")}
        </List>
      </Page>
    );
  }
}
