// ----------------------------------------------------------------------------------------
// * Import Modules(Standard)
// ----------------------------------------------------------------------------------------
import React, { Component } from 'react';

// ----------------------------------------------------------------------------------------
// * Import Modules(Framework7)
// ----------------------------------------------------------------------------------------
import {
  Icon,
  Link,
  List,
  ListInput,
  ListItem,
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
  cmnPreloaderSize,
  cmnSeparatorId,
  cmnSetGtag,
} from './Common';
import ILApi from './ILApi';

// ----------------------------------------------------------------------------------------
// * CSS ClassNames
// ----------------------------------------------------------------------------------------
const itemClass      = 'item';
const itemIconClass  = 'item-icon';
const itemInputClass = 'item-input';
const itemsClass     = 'items';
const separatorClass = 'separator';
const stockClass     = 'stock';

// ----------------------------------------------------------------------------------------
// * CSS Selectors
// ----------------------------------------------------------------------------------------
const itemIconSelector  = `.${itemIconClass}`;
const itemInputSelector = `.${itemInputClass} input`;
const itemsSelector     = `.${itemsClass} li`;
const separatorSelector = `.${separatorClass}`;

// ----------------------------------------------------------------------------------------
// * Other Constants
// ----------------------------------------------------------------------------------------
const separatorIdAttr = `${itemClass}${cmnSeparatorId}`;

// ----------------------------------------------------------------------------------------
// * Main Class
// ----------------------------------------------------------------------------------------
export default class ILList extends Component {
  constructor(props) {
    console.log('run constructor!');
    super(props);

    this.state = {
      items: [],
      isLoading: false,
    };

  }

  // --------------------------------------------------------------------------------------
  // * Lifecycle Methods
  // --------------------------------------------------------------------------------------
  componentDidMount = () => {
    console.log('run componentDidMount!');
    this.fetchAllItem();

    $$(itemInputSelector).on('keydown', (e) => {
      this.handleAddItemForm(e);
    });

    cmnSetGtag();
  }

  shouldComponentUpdate = (nextProps, nextState) => {
    console.log('run shouldComponentUpdate!');
    return true;
  }

  componentDidUpdate = (prevProps, prevState) => {
    console.log('run componentDidUpdate!');

    // itemの要素にonClickイベント付与する。
    // [補足1] componentDidMount内で行わない理由
    //  componentDidMount内のfetchAllItemでのitem取得処理は、非同期処理のため、
    //  非同期処理完了→state.items更新→render→componentDidUpdateのタイミングで
    //  イベント付与しないといけないため。
    // [補足2] イベント登録を一旦offする理由
    //  itemの並び順を変えたりしたときにもcomponentDidUpdateが走るので、
    //  イベントの多重登録を防ぐため。別解としては、イベントの多重登録がされない
    //  addEventListenerを使う方法もある。
    //  参考：https://qiita.com/nekoneko-wanwan/items/3d3da95f1127f743397d
    $$(itemIconSelector).forEach((ele, index) => {
      $$(ele).off('click');
      $$(ele).on('click', (e) => { this.handleClickItem(e) });
    });

    // separatorより、前のitemはstockクラス除去、後のitemはstockクラス付与
    // stockクラス有無により、handleClickItem内でクリック処理を実行するか
    // 否かを判断している
    this.changeStockClass();

    // デバッグ用
    //this.show('show items state', this.state.items);
  }

  componentWillUnmount = () => {
    console.log('run componentWillUnmount!');
  }

  // --------------------------------------------------------------------------------------
  // * Event handlers and Related Methods
  // --------------------------------------------------------------------------------------
  // アイテム追加
  handleAddItemForm = (e) => {
    if (e.keyCode === 13 && e.target.value !== '') {
      const title = e.target.value;
      this.handleAddItem(title);
      e.target.value = '';
      e.target.blur();
    };
  }

  handleAddItem = (title) => {
    console.log('run handleAddItem!');

    this.setState({ isLoading: true });
    (new ILApi()).addItem(title)
      .then((result) => {
        const newItem = result.data.data;
        const newItems = this.state.items.slice();
        newItems.unshift(newItem);
        this.setState({ items: newItems });
      })
      .catch  ((error) => { cmnFailureCallBack(error)           })
      .finally(()      => { this.setState({ isLoading: false }) });
  }

  // アイテムストック
  handleClickItem = (e) => {
    console.log('run handleClickItem!');

    const itemD7      = $$(e.currentTarget.parentElement.parentElement.parentElement);
    const separatorD7 = $$(separatorSelector);

    if(!itemD7.hasClass(stockClass)) {
      itemD7.addClass(stockClass);

      const from   = this.getCurrentListIndex(itemD7[0]);
      const to     = this.getCurrentListIndex(separatorD7[0]);
      const itemId = this.getItemId(from);

      this.setState({ isLoading: true });
      this.moveItem(itemId, from, to);
    };
  }

  // アイテム並び替え
  handleMoveItem = (e,indexes) => {
    console.log('run handleMoveItem!');

    const from   = indexes.from;
    const to     = indexes.to;
    const itemId = this.getItemId(to);

    this.setState({ isLoading: true });
    this.moveItem(itemId, from, to);
  }

  moveItem = (itemId, from, to) => {
    this.setState({ isLoading: true });
    (new ILApi()).moveItem(itemId, from, to)
      .then   ((result) => { this.recombinantItems(from, to)     })
      .catch  ((error)  => { cmnFailureCallBack(error)           })
      .finally(()       => { this.setState({ isLoading: false }) });
  }

  // this.state.itemsの順番組み換え
  // 添字fromの要素を、添字toの後ろへ移動する
  recombinantItems = (from, to) => {
    console.log('run recombinantItems!');

    const newItems = this.state.items.slice();
    const val = newItems.splice(from, 1);
    newItems.splice(to, 0, val[0]);
    this.setState({ items: newItems });
  }

  // アイテムアーカイブ
  handleArchiveItem = (item, e) => {
    console.log('run handleArchiveItem!');

    // Archiveボタンを押したときに、親要素の
    // onClick属性も実行されてしまうのを止める
    e.stopPropagation();

    this.setState({ isLoading: true });
    (new ILApi()).archiveItem(item.id)
      .then((result) => {
        const newItems = this.state.items.filter( curItem => curItem.id !== item.id ); 
        this.setState({ items: newItems });
      })
      .catch  ((error) => { cmnFailureCallBack(error)           })
      .finally(()      => { this.setState({ isLoading: false }) });
  }

  // アイテム内容変更
  handleChangeItemForm = (item, e) => {
    const newItem = { id: item.id, title: e.target.value };
    this.handleChangeItem(newItem);
  }

  handleChangeItem = (newItem) => {
    console.log('run handleChangeItem!');

    this.setState({ isLoading: true });
    (new ILApi()).changeItem(newItem)
      .then((result) => {
        const itemLiElement = $$(`#${itemClass}${newItem.id}`)[0];
        const index = this.getCurrentListIndex(itemLiElement);

        const newItems = this.state.items.slice();
        newItems[index] = newItem;
        this.setState({ items: newItems });
      })
      .catch  ((error) => { cmnFailureCallBack(error)           })
      .finally(()      => { this.setState({ isLoading: false }) });
  }

  // --------------------------------------------------------------------------------------
  // Other Methods
  // --------------------------------------------------------------------------------------
  // 全アイテム取得
  fetchAllItem = () => {
    console.log('run fetchAllItem!');

    this.setState({ isLoading: true });
    (new ILApi()).fetchAllItem()
      .then((result) => {
        const items = result.data.data;
        this.setState({ items: items });
      })
      .catch  ((error) => { cmnFailureCallBack(error)           })
      .finally(()      => { this.setState({ isLoading: false }) });
  }

  // itemLiElementがitemリスト要素の何番目にあるかをID属性を基に算出
  getCurrentListIndex = (itemLiElement) => {
    const itemIdAttr = `#${itemLiElement.id}`;
    return $$(itemsSelector).indexOf($$(itemIdAttr)[0]);
  }

  // 区切りより下のアイテムはstockクラス付与
  changeStockClass = () => {
    console.log('run changeStockClass!');

    let stockFlag = false;
    $$(itemsSelector).each((index,ele) => {
      if($$(ele).hasClass(separatorClass)) {
        stockFlag = true;
      } else {
        if(stockFlag) {
          $$(ele).addClass(stockClass);
        } else {
          $$(ele).removeClass(stockClass);
        };
      };
    });
  }

  // リストの順番からitemのidを取得
  getItemId = (listIndex) => {
    return $$(itemsSelector)[listIndex].id.replace(itemClass,'');
  }

  // 区切り用アイテム判定
  isSeparator = (item) => {
    if (item.id === cmnSeparatorId) {
      return true;
    } else {
      return false;
    }
  }

  // --------------------------------------------------------------------------------------
  // Other Methods for debug
  // --------------------------------------------------------------------------------------
  show = (title,state) => {
    console.log(title);
    state.forEach((item, index) => { console.log(item) });
  }

  // --------------------------------------------------------------------------------------
  // Render Methods
  // --------------------------------------------------------------------------------------
  renderItem = (item) => {
    if (this.isSeparator(item)) {
      return (
        <ListItem
          key={item.id}
          id={separatorIdAttr}
          className={separatorClass}
          title={item.title}
        />
      );
    } else {
      const itemIdAttr = `${itemClass}${item.id}`;
      return (
        <ListItem
          key={item.id}
          id={itemIdAttr}
          className={itemClass}
          swipeout
        >
          <Icon f7="tag" slot="content-start" className={itemIconClass} />
          <input 
            type="text"
            slot="inner"
            defaultValue={item.title}
            onKeyUp={this.handleChangeItemForm.bind(this, item)}
          />
          <SwipeoutActions left>
            <SwipeoutButton 
              color="green"
              onClick={this.handleArchiveItem.bind(this, item)}
            >
              Archive
            </SwipeoutButton>
          </SwipeoutActions>
        </ListItem>
      );
    }
  }

  render() {
    console.log('run render!');
    return(
      <Page>
        <Navbar>
          <NavTitle>
            Ivy Lee List
          </NavTitle>
          <Preloader
            size={cmnPreloaderSize}
            style={{visibility: this.state.isLoading ? "visible" : "hidden"}}
          >
          </Preloader>
          <NavRight>
            <Link iconF7="check_round" href="/ILArchive"></Link>
          </NavRight>
        </Navbar>


        <List>
          <ListInput 
            className={itemInputClass}
            type="text" 
            placeholder="タスクを入力..." 
            clearButton
          />
        </List>

        <List 
          className={itemsClass} 
          sortable 
          sortableEnabled 
          onSortableSort={this.handleMoveItem}
        >
          {/*
              下記の書き方について https://qiita.com/konojunya/items/cb026a2aa3df1837d587
          */}
          {
            this.state.items.map((item) => {
              return this.renderItem(item)
            })
          }
        </List>
      </Page>
    );
  }
}
