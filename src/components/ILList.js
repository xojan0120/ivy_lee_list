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
//import $ from 'jquery';
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
const itemsSelector     = `.${itemsClass} li`;
const itemSelector      = `li.${itemClass}`;
const itemInputSelector = `.${itemInputClass} input`;
const separatorSelector = `.${separatorClass}`;

// --------------------------------------------------------------------------------------
// Other
// --------------------------------------------------------------------------------------
const separator = '----------';
const separatorIndex = 0;
const separatorIdAttr = `${itemClass}${separatorIndex}`;

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

  // debug用
  show = (title,state) => {
    console.log(title);
    state.map((item,index) => {
      console.log(item);
    })
  }

  componentDidUpdate = () => {
    console.log("componentDidUpdate!");

    $$(itemSelector).on('click', (e) => {
      this.handleClickItem(e);
    })

    this.show('show items state', this.state.items);
  }

  getCurrentListIndex = (itemIdAttr) => {
    return $$(itemsSelector).indexOf($$(`#${itemIdAttr}`)[0])
  }

  // this.state.itemsの順番組み換え
  // 添字fromの要素を、添字toの後ろへ移動する
  recombinantItems = (from, to) => {
    // Array.sliceでディープコピーできる
    let newItems = this.state.items.slice();
    const val = newItems.splice(from, 1);
    newItems.splice(to, 0, val[0]);
    this.setState({
      items: newItems
    });
  }

  handleClickItem = (e) => {
    console.log("handleClickItem!");
    const li = $$(e.currentTarget)[0]; // liのhtml要素
    const target = $$(li) // liのdom7オブジェクト

    if(target.hasClass(stockClass)) {
      return false;
    } else {
      target.addClass(stockClass);

      const targetIdAttr    = li.id;
      const separatorIdAttr = $$(separatorSelector)[0].id;

      const from = this.getCurrentListIndex(targetIdAttr);
      const to   = this.getCurrentListIndex(separatorIdAttr);

      this.recombinantItems(from, to);
    }
  }

  // separatorより前のitemはstockクラス除去
  // separatorより後のitemはstockクラス付与
  changeStockClass = () => {
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

  handleMoveItem = (e,indexes) => {
    console.log('handleMoveItem!');

    const from = indexes.from
    const to   = indexes.to

    let item = null;
    let promise = (new ILApi()).moveItem(item, from, to);
    promise.then((result) => {
      this.recombinantItems(from, to);
      this.changeStockClass();
    })
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
        {id:separatorIndex, title: "-----" },
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
      // mock id
      item.id = this.state.items.length

      let newItems = this.state.items.slice();
      newItems.unshift(item);
      this.setState({
        items: newItems
      })
    })
  }

  handleArchiveItem = (item, e) => {
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
    if (item.id === separatorIndex ) {
      return (
        <ListItem key={item.id} id={separatorIdAttr} className={separatorClass} title={item.title} />
      );
    } else {
      const itemIdAttr = `${itemClass}${item.id}`
      return (
        <ListItem key={item.id} id={itemIdAttr} className={itemClass} title={item.title} swipeout>
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
