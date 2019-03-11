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
    ListInput,
} from 'framework7-react';
import $ from 'jquery';
import $$ from 'dom7';
import ILApi from './ILApi'

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
  constructor(props) {
    console.log("constructor!");
    super(props);
    this.state = {
      list: []
    }
  }

  componentDidMount = () => {
    console.log("componentDidMount!");
    this.updateList();
  }
  componentDidUpdate = () => {
    console.log("componentDidUpdate!");
    $$(taskSelector).on('click', (e) => {
      this.handleClickList(e);
    })
  }

  handleClickList = (e) => {
    console.log("handleClickList!");
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
    console.log("handleArchiveList!");
    // 親要素へのイベント伝播をキャンセルする
    e.stopPropagation();
  }

  renderItem = (item) => {
    if (item.id === 0 ) {
      return (
        <ListItem key={item.id} className={separatorClass} title={item.task} />
      );
    } else {
      return (
        <ListItem key={item.id} className={taskClass} title={item.task} swipeout>
          <SwipeoutActions left>
            <SwipeoutButton delete onClick={this.handleArchiveList}>Archive</SwipeoutButton>
          </SwipeoutActions>
        </ListItem>
      );
    }
  }

  renderSeparatorItem = () => {
    return(
      <ListItem className={separatorClass} name="demo-checkbox">
        {separator}
      </ListItem>
    );
  }

  async updateList() {
    try {
      const list = await (new ILApi()).fetchList();
      this.setState({
        list: list
      })
    } catch(err) {
      console.log(err);
    }
  }

  render() {
    return(
      <Page>
        <Navbar>
          <NavRight>
            <Link iconF7="check_round" href="/ILArchive"></Link>
          </NavRight>
          <NavTitle>Ivy Lee List</NavTitle>
        </Navbar>

        <List>
          <ListInput type="text" placeholder="タスクを入力..." clearButton />
        </List>

        <List className={taskListClass} sortable sortableEnabled onSortableSort={this.handleMoveList}>
          {
            this.state.list.map((item)=>{
              return this.renderItem(item);
            })
          }
        </List>
      </Page>
    );
  }
}
