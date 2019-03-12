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
const itemsClass     = 'items';
const itemClass      = 'item';
const itemInputClass = 'item-input';

// --------------------------------------------------------------------------------------
// Selector
// --------------------------------------------------------------------------------------
const itemsSelector  = `.${itemsClass} li`;
const itemSelector      = `li.${itemClass}`;
const itemInputSelector = `.${itemInputClass} input`

// --------------------------------------------------------------------------------------
// Other
// --------------------------------------------------------------------------------------
const separator = '----------';

export default class ILList extends Component {
  constructor(props) {
    console.log("run constructor!");
    super(props);

    this.state = {
      items: [],
    }
  }

  componentDidMount = () => {
    console.log("componentDidMount!");
    this.fetchAllItem();

    $$(itemInputSelector).on('keydown', (e) => {
      if (e.keyCode === 13 && e.target.value != '') {
        const item = { id: null, title: e.target.value };
        this.handleAddItem(item);
        e.target.value = '';
        e.target.blur();
      }
    })
  }
  componentDidUpdate = () => {
    console.log("componentDidUpdate!");

    $$(itemSelector).on('click', (e) => {
      this.handleClickItem(e);
    })

    console.log(this.state.items);
  }

  handleClickItem = (e) => {
    console.log("handleClickItem!");
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

  handleMoveItem = (e,indexes) => {
    console.log('handleMoveItem!');

    const from = indexes.from
    const to   = indexes.to

    let item = null;
    let promise = (new ILApi()).moveItem(item, from, to);
    promise.then((result) => {
      // 0:item1
      // 1:item2
      // 2:-----
      // -> from:1 to:0
      // 0:item2
      // 1:item1
      // 2:----

      // Array.sliceでディープコピーできる。
      // let newItems = this.state.itemsでコピーすると、
      // シャローコピーのため、newItems[to] = this.state.items[from]した時点で
      // this.state.items[to]の値が、newItems[to]の値になってしまう。
      let newItems   = this.state.items.slice();
      newItems[to]   = this.state.items[from];
      newItems[from] = this.state.items[to];
      this.setState({
        items: newItems
      })
    })

    let stockFlag = false
    $$(itemsSelector).each((index,ele) => {
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

  fetchAllItem = () => {
    console.log('run fetchAllItem!');

    let promise = (new ILApi()).fetchAllItem();
    promise.then((result) => {
      // -----------------------------------
      // TODO:resultからのitems取得処理を入れる
      // -----------------------------------

      // mock data
      const items = [
        {id:1, title: "item1" },
        {id:2, title: "item2" },
        {id:0, title: "-----" },
      ]
      this.setState({
        items: items
      })
    })
  }

  handleAddItem = (item) => {
    console.log('run handleAddItem!');

    let promise = (new ILApi()).addItem(item);
    promise.then((result) => {
      // mock data
      item.id = 999;
      let newItems = this.state.items.slice();
      newItems.unshift(item);
      this.setState({
        items: newItems
      })
    })
  }

  handleDeleteItem = () => {
    console.log('run handleDeleteItem!');
  }

  handleArchiveItem = (item,e) => {
    console.log('run handleArchiveItem!');

    let promise = (new ILApi()).archiveItem(item);
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

  renderItem = (item) => {
    if (item.id === 0 ) {
      return (
        <ListItem key={item.id} className={separatorClass} title={item.title} />
      );
    } else {
      return (
        <ListItem key={item.id} className={itemClass} title={item.title} swipeout>
          <SwipeoutActions left>
            <SwipeoutButton 
              color="green"
              onClick={this.handleArchiveItem.bind(this,item)}
            >
              Archive
            </SwipeoutButton>
          </SwipeoutActions>
        </ListItem>
      );
    }
  }

  render() {
    console.log("render!");
    return(
      <Page>
        <Navbar>
          <NavRight>
            <Link iconF7="check_round" href="/ILArchive"></Link>
          </NavRight>
          <NavTitle>Ivy Lee List</NavTitle>
        </Navbar>

        <List>
          <ListInput 
            className={itemInputClass}
            type="text" 
            placeholder="タスクを入力..." 
            clearButton />
        </List>

        <List 
          className={itemsClass} 
          sortable 
          sortableEnabled 
          onSortableSort={this.handleMoveItem}
        >
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
