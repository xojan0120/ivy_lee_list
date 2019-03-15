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
// Import(Self made)
// ----------------------------------------------------------------------------------------
import { failureCallBack } from './Common'
import ILApi               from './ILApi'

// ----------------------------------------------------------------------------------------
// CSS ClassName
// ----------------------------------------------------------------------------------------
const itemClass      = 'item';
const itemInputClass = 'item-input';
const itemsClass     = 'items';
const separatorClass = 'separator';
const stockClass     = 'stock';

// ----------------------------------------------------------------------------------------
// CSS Selector
// ----------------------------------------------------------------------------------------
const itemInputSelector = `.${itemInputClass} input`;
const itemSelector      = `li.${itemClass}`;
const itemsSelector     = `.${itemsClass} li`;
const separatorSelector = `.${separatorClass}`;

// ----------------------------------------------------------------------------------------
// Other
// ----------------------------------------------------------------------------------------
const separatorIndex  = 1; // DB上のidと同値にする
const separatorIdAttr = `${itemClass}${separatorIndex}`;

// ----------------------------------------------------------------------------------------
// Main Class
// ----------------------------------------------------------------------------------------
export default class ILList extends Component {
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
    this.fetchAllItem();

    $$(itemInputSelector).on('keydown', (e) => {
      this.handleInputItem(e);
    })
  }

  componentDidUpdate = () => {
    console.log('run componentDidUpdate!');

    $$(itemSelector).on('click', (e) => {
      this.handleClickItem(e);
    })

    this.changeStockClass();

    this.show('show items state', this.state.items);
  }

  componentWillUnmount = () => {
    console.log('run componentWillUnmount!');
  }

  // debug用
  show = (title,state) => {
    console.log(title);
    state.map((item,index) => {
      console.log(item);
      return true;
    })
    return true;
  }

  handleInputItem = (e) => {
    if (e.keyCode === 13 && e.target.value !== '') {
      const title = e.target.value;
      this.handleAddItem(title);
      e.target.value = '';
      e.target.blur();
    }
  }

  // 要素のID属性からリストの何番目にあるか算出
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
    console.log('run handleClickItem!');

    const li = $$(e.currentTarget)[0]; // liのhtml要素
    const target = $$(li) // liのdom7オブジェクト

    if(target.hasClass(stockClass)) {
      console.log('  stock');
      return false;
    } else {
      console.log('  not stock');
      target.addClass(stockClass);

      const targetIdAttr    = li.id;
      const separatorIdAttr = $$(separatorSelector)[0].id;

      const from = this.getCurrentListIndex(targetIdAttr);
      const to   = this.getCurrentListIndex(separatorIdAttr);

      const itemId = this.getItemId(from);

      this.setState({ isLoading: true });
      (new ILApi()).moveItem(itemId, from, to)
        .then((result) => {
          this.recombinantItems(from, to)
        })
        .catch((error) => {
          failureCallBack(error)
        })
        .finally(() => {
          this.setState({ isLoading: false })
        });
    }
  }

  // separatorより前のitemはstockクラス除去
  // separatorより後のitemはstockクラス付与
  changeStockClass = () => {
    console.log('run changeStockClass!');

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

  // リストの順番から、itemのidを取得
  getItemId = (listIndex) => {
    return $$(itemsSelector)[listIndex].id.replace(itemClass,'')
  }

  handleMoveItem = (e,indexes) => {
    console.log('run handleMoveItem!');

    const from = indexes.from;
    const to   = indexes.to;

    const itemId = this.getItemId(to);

    this.setState({ isLoading: true });
    (new ILApi()).moveItem(itemId, from, to)
      .then((result) => {
        this.recombinantItems(from, to)
      })
      .catch((error) => {
        failureCallBack(error)
      })
      .finally(() => {
        this.setState({ isLoading: false })
      });
  }

  fetchAllItem = () => {
    console.log('run fetchAllItem!');

    this.setState({ isLoading: true });
    (new ILApi()).fetchAllItem()
      .then((result) => {
        const items = result.data.data;
        this.setState({ items: items })
      })
      .catch((error) => {
        failureCallBack(error)
      })
      .finally(() => {
        this.setState({ isLoading: true })
      });
  }

  handleAddItem = (title) => {
    console.log('run handleAddItem!');

    this.setState({ isLoading: true });
    (new ILApi()).addItem(title)
      .then((result) => {
        const newItem = result.data.data;
        let newItems = this.state.items.slice();
        newItems.unshift(newItem);
        this.setState({ items: newItems })
      })
      .catch((error) => {
        failureCallBack(error)
      })
      .finally(() => {
        this.setState({ isLoading: false })
      });
  }
  // TODO: https://projects.lukehaas.me/css-loaders/ の利用は？

  handleArchiveItem = (item, e) => {
    console.log('run handleArchiveItem!');
    // Archiveボタンを押したときに、親要素の
    // onClick属性も実行されてしまうのを止める
    e.stopPropagation();

    this.setState({ isLoading: true });
    (new ILApi()).archiveItem(item.id)
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

  renderItem = (item) => {
    if (item.id === separatorIndex ) {
      return (
        <ListItem
          key={item.id}
          id={separatorIdAttr}
          className={separatorClass}
          title={item.title}
        />
      );
    } else {
      const itemIdAttr = `${itemClass}${item.id}`
      return (
        <ListItem
          key={item.id}
          id={itemIdAttr}
          className={itemClass}
          title={item.title}
          swipeout
        >
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
    console.log('run render!');
    return(
      <Page>
        <Navbar>
          <NavTitle>
            Ivy Lee List
            <Preloader
              size={21}
              style={{visibility: this.state.isLoading ? "visible" : "hidden"}}>
            </Preloader>
          </NavTitle>
          <NavRight>
            <Link iconF7="check_round" href="/ILArchive"></Link>
          </NavRight>
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
          onSortableSort={this.handleMoveItem} >
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
