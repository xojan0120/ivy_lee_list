import React, { Component } from 'react';
import {
    Page,
    Navbar,
    NavRight,
    NavTitle,
    Link,
    List,
    ListItem,
    SwipeoutActions,
    SwipeoutButton,
    Swiper,
    ListInput,
    FormInput,
    Input,
    Icon,
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

export default class ILList extends Component {
  componentDidMount = () => {
    $$(taskSelector).on('click', (e) => {
      this.handleClickList(e);
    })
  }

  handleClickList = (e) => {
    console.log("click!");
    const li = $(e.currentTarget);
    const sep = $(`.${separatorClass}`)[0];

    if(li.hasClass(stockClass)) {
      return;
    } else {
      // このshow('fast')がdom7だとできなさそうなので、
      // ここだけjquery使用
      li.insertAfter(sep).hide().show('fast');
      li.addClass(stockClass);
    }
  }

  handleMoveList = (e,indexes) => {
    let stockFlag = false
    $$(taskListSelector).each((i,ele) => {
      if($$(ele).hasClass(separatorClass)) {
        stockFlag = true
      } else {
        if(stockFlag) {
          $$(ele).addClass(stockClass);
        } else {
          $$(ele).removeClass(stockClass);
        }
      }
    })
  }

  handleArchiveList = (e) => {
    console.log("archive!");
    // 親要素へのイベント伝播をキャンセルする
    e.stopPropagation();
  }

  renderListItem = (title) => {
    return(
      <ListItem className={taskClass} title={title} name="demo-checkbox" swipeout>
        <SwipeoutActions left>
          <SwipeoutButton delete onClick={this.handleArchiveList}>Archive</SwipeoutButton>
        </SwipeoutActions>
      </ListItem>
    );
  }

  renderSeparatorItem = () => {
    return(
      <ListItem className={separatorClass} name="demo-checkbox">
        {separator}
      </ListItem>
    );
  }

  render() {
    return(
      <Page>
        <Navbar>
          <NavRight>
            <Link iconIos="f7:menu" iconMd="material:menu" href="/ILArchive"></Link>
          </NavRight>
          <NavTitle>Ivy Lee List</NavTitle>
        </Navbar>

        <List>
          <ListInput type="text" placeholder="タスクを入力..." clearButton />
        </List>

        <List className={taskListClass} sortable sortableEnabled onSortableSort={this.handleMoveList}>
          {this.renderListItem("hoge1")}
          {this.renderListItem("hoge2")}
          {this.renderSeparatorItem()}
        </List>
      </Page>
    );
  }
}
