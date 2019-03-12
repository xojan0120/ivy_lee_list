import React, { Component } from 'react';
import {
    Page,
    List,
} from 'framework7-react';
import $$ from 'dom7';
import ILApi from './ILApi';

export default class ILList extends Component {
  constructor(props) {
    console.log("run constructor");

    super(props);

    this.state = {
      vlData: { items: [] }
    }
  }

  componentDidMount = () => {
    console.log('run componentDidMount');

    let item = {id:0, task: null}

    // 下記の処理は、APIからデータを取得し、初期表示データとして設定している。
    let promise = (new ILApi()).test();
    promise.then((result) => {
      item.task = result.data.data.pref
      let newItems = this.getVirtualList().items;
      newItems.push(item)
      this.setState({
        vlData: { items: newItems }
      })
    })
  }

  // このrenderExternalは<List>のrenderExternalプロパティに設定する。
  // このメソッドの実行タイミングは以下の２つである。
  //   1. ページ初回表示時のみ、renderの後。
  //   2. 1以降は、renderの直前。
  // このメソッドの中で、this.setStateのvlDataを更新してあげれば、
  // 新しいvlDataでrenderされる。
  //
  // vl:     VirtualListのインスタンス
  // vlData: 現在のVirtualListのデータ
  renderExternal(vl, vlData) {
    console.log('run renderExternal!');

    //console.log(vl);
    //console.log(vlData);
    this.setState({ vlData });
  }

  // VirtualListのインスタンスを取得する
  getVirtualList = () => {
    return $$(".virtual-list")[0].f7VirtualList
  }

  handleClick = (e) => {
    console.log("run handleClick! (append item)")

    const item = { id: 1, task: "add item" }
    // f7VirtualListのappendItemでVirtualListにデータを追加することで、
    // renderが実行される。renderの直前には、renderExternalが実行されるため、
    // this.state.vlDataの内容も更新された上で、renderされる。
    this.getVirtualList().appendItem(item);

    // ↓このthis.state.vlDataの更新処理は、
    // renderExternalメソッドでさせているので、
    // ここでは不要。
    //let items = this.state.vlData.items
    //this.setState({
    //  vlData: { items: items }
    //})
  }

  render() {
    console.log("run render!");
    return(
      <Page>
        <button onClick={this.handleClick}>test</button>

        {/*
            virtualListParamsのitemsとrenderExternalは必須の模様
         */}
        <List 
          virtualList
          virtualListParams={{
            items: [],
            renderExternal: this.renderExternal.bind(this)
          }}
        >

        {/* 
            <ul>タグで囲ってあげないと、なぜか中身が空の<ul>が
            renderされてしまう。その空の<ul>の下にitems.mapの
            内容がrenderされてしまう。
        */}
        <ul>
          {
            this.state.vlData.items.map((item, index)=>{
              return <li key={item.id}>{item.id} {item.task}</li>
            })
          }
        </ul>
      </List>
    </Page>
    );
  }
}
