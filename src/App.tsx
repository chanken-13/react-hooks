import React, {useState, useEffect, createContext, useReducer, useRef, useCallback, useMemo} from 'react'
// import './reset.css';
import './styles.css';
import Context from './components/ContextA'
import axios from 'axios'

import ButtonGroup from '@mui/material/ButtonGroup';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

//#region useState
const UseState = (): JSX.Element => {
  // countの初期値として、1~10までのランダムな数値を生成
  const initialState = useMemo(() => (Math.floor(Math.random() * 10) + 1), [])

  // count という名前の state 変数を宣言、初期値 initialState をセット
  const [count, setCount] = useState<number>(initialState)
  // open という名前の state 変数を宣言、初期値 true をセット
  const [open, setOpen] = useState<boolean>(true)

  // toggleの関数を宣言
  const toggle = () => setOpen(!open)

  return (
    <>
      <Button color="primary" variant="outlined" onClick={toggle}>{open ? 'close' : 'open'}</Button>
      <div className={open ? 'isOpen' : 'isClose'}>
        <p>現在の数字は{count}です</p>
        {/* setCount()は、countを更新するための関数。countを引数で受け取ることも出来る */}
        <ButtonGroup color="secondary" aria-label="outlined primary button group">
          <Button onClick={() => setCount(prevState => prevState + 1)}>+</Button>
          <Button onClick={() => setCount(count => count - 1)}>-</Button>
          <Button onClick={() => setCount(0)}>0</Button>
          <Button onClick={() => setCount(initialState)}>最初の数値に戻す</Button>
        </ButtonGroup>
      </div>
    </>
  )
}
//#endregion

//#region useEffect解体新書①
const UseEffect1 = (): JSX.Element => {
  const wait = (t: number) =>
    new Promise((r) => setTimeout(() => r(t), t));

  const fetchData = async () => {
    await wait(1000);
    const data = { test: 'test' };
    return data;
  };

  const [data, setData] = useState<{} | null>(null);

  console.log('render!', data);

  useEffect(() => {
    fetchData().then((r) => {
      setData(r);
    });
  }, []);

  return <div>{JSON.stringify(data, null, 2)}</div>;
};
//#endregion

//#region useEffect解体新書②
const UseEffect2 = (): JSX.Element => {
  const getRandomInt = (max: number): number => Math.floor(Math.random() * max);
  const [text, setText] = useState<string>('abc');

  useEffect(() => {
    const onTimeout = (): void => {
      console.log('⏰ ' + text);
    }

    console.log('🔵 Schedule "' + text + '" log');
    const timeoutId = setTimeout(onTimeout, getRandomInt(3000));

    // クリーンアップ処理
    return () => {
      console.log('🟡 Cancel "' + text + '" log');
      clearTimeout(timeoutId);
    };
  }, [text]);

  return (
    <>
      <label>
        What to log:{' '}
        <TextField size="small" variant="outlined" value={text} onChange={(e) => setText(e.target.value)}/>
      </label>
      <h3>{text}</h3>
    </>
  );
};
//#endregion

//#region useContext

type Person = {
  name: string;
  age: number;
}
const UseContext = (): JSX.Element => {
  //useStateを使ってuserを作成
  const [user, setUser] = useState<Person>({
    name: '花子',
    age: 27
  })
  //useStateを使ってhobbyを作成
  const [hobby, setHobby] = useState<string>('キャンプ')
  return (
    <>
      {/* //userContext。Providerを作成、valueにはuserをセット */}
      <UserContext.Provider value={user}>
        {/* //HobbyContext.Providerを作成、valueにはhobbyをセット */}
        <HobbyContext.Provider value={hobby}>
          <Context/>
        </HobbyContext.Provider>
      </UserContext.Provider>
    </>
  )
}

//createContextを使ってUserContextとHobbyContextを作成
export const UserContext = createContext<Person>({} as Person)
export const HobbyContext = createContext<string>('')

//#endregion

//#region useReducer1:stateが単数①
const UseReducer1 = (): JSX.Element => {
  const initialState = 0
  type Action =
    | 'increment'
    | 'decrement'
    | 'reset';

  //countStateとactionを渡して、新しいcountStateを返すように実装する
  const reducerFunc = (countState: number, action: Action)=> {
    //reducer関数にincrement、increment、reset処理を書く
    //どの処理を渡すかはactionを渡すことによって判断する
    switch (action){
      case 'increment':
        return countState + 1
      case 'decrement':
        return countState - 1
      case 'reset':
        return initialState
      default:
        return countState
    }
  }

  //作成したreducerFunc関数とcountStateをuseReducerに渡す
  //useReducerはcountStateとdispatchをペアで返すので、それぞれを分割代入
  const [count, dispatch] = useReducer(reducerFunc, initialState)
  //カウント数とそれぞれのactionを実行する<Button/>を設置する
  return (
    <>
      <h3>カウント：{count}</h3>
      <ButtonGroup color="primary" aria-label="outlined primary button group">
        <Button onClick={()=>dispatch('increment')}>increment</Button>
        <Button onClick={()=>dispatch('decrement')}>decrement</Button>
        <Button onClick={()=>dispatch('reset')}>reset</Button>
      </ButtonGroup>
    </>
  )
}
//#endregion

//#region useReducer2:stateが単数②
const UseReducer2 = (): JSX.Element => {
  const initialState = {
    count: 0
  }
  type State = { count: number };
  type Action =
  | 'INCREMENT'
  | 'DECREMENT'
  | 'DOUBLE_INCRE'
  | 'RESET';
  const reducer = (state: State, action: Action) => {
    switch(action){
      case 'INCREMENT':
          return {count: state.count + 1}
      case 'DECREMENT':
          return {count: state.count - 1}
      case 'DOUBLE_INCRE':
          return {count: state.count * 2}
      case 'RESET':
          return {count: 0}
      default:
          return state
    }
  }

  const [state, dispatch] = useReducer(reducer, initialState)

  return (
        <div className="">
            <h3>カウント: { state.count }</h3>
            <ButtonGroup color="primary" aria-label="outlined primary button group">
              <Button onClick={() => dispatch('INCREMENT')}>+</Button>
              <Button onClick={() => dispatch('DECREMENT')}>-</Button>
              <Button onClick={() => dispatch('DOUBLE_INCRE')}>++</Button>
              <Button onClick={() => dispatch('RESET')}>0</Button>
            </ButtonGroup>
            {/* <button onClick={() => dispatch({type: 'INCREMENT', payload: 5})}>+</button>
            <button onClick={() => dispatch({type: 'DECREMENT', payload: 5})}>-</button> */}
        </div>
  );
}
//#endregion

//#region useReducer3:stateが複数
const UseReducer3 = (): JSX.Element => {
  //counterの初期値を0に設定
  //2つのcountStateを扱う。それぞれのinitialStateを設定
  const initialState ={
    firstCounter: 0,
    secondCounter: 100
  }
  type State = { firstCounter: number, secondCounter: number };
  type ActionType =
  | { type: 'increment1' ,value: number }
  | { type: 'decrement1' ,value: number }
  | { type: 'increment2' ,value: number }
  | { type: 'decrement2' ,value: number }
  | { type: 'reset1' ,value?: number }
  | { type: 'reset2' ,value?: number };

  //reducer関数を作成
  //countStateとactionを渡して、新しいcountStateを返すように実装する
  const reducerFunc = (countState: State, action: ActionType) => {
  //reducer関数にincrement、increment、reset処理を書く
  //どの処理を渡すかはactionを渡すことによって判断する
  //switch文のactionをaction.typeに変更
  //firstCounter、secondCounter用にcaseを設定
  //複数のcounterStateを持っている場合は、更新前のcounterStateを展開し、オブジェクトのマージを行う
    switch (action.type){
      case 'increment1':
        return {...countState, firstCounter: countState.firstCounter + action.value}
      case 'decrement1':
        return {...countState, firstCounter: countState.firstCounter - action.value}
      case 'increment2':
        return {...countState, secondCounter: countState.secondCounter + action.value}
      case 'decrement2':
        return {...countState, secondCounter: countState.secondCounter - action.value}
      case 'reset1':
        return {...countState, firstCounter: initialState.firstCounter}
      case 'reset2':
        return {...countState, secondCounter: initialState.secondCounter}
      default:
        return countState
    }
  }

  //作成したreducerFunc関数とcountStateをuseReducerに渡す
  //useReducerはcountStateとdispatchをペアで返すので、それぞれを分割代入
  const [count, dispatch] = useReducer(reducerFunc, initialState)
  //カウント数とそれぞれのactionを実行する<Button/>を設置する
  //dispatchで渡しているactionをオブジェクトに変更して、typeとvalueを設定
  return (
    <>
      <h3>カウント：{count.firstCounter}</h3>
      <ButtonGroup color="primary" aria-label="outlined primary button group">
        <Button onClick={()=>dispatch({type: 'increment1', value: 1})}>increment1</Button>
        <Button onClick={()=>dispatch({type: 'decrement1', value: 1})}>decrement1</Button>
        <Button onClick={()=>dispatch({type: 'reset1'})}>reset</Button>
      </ButtonGroup>
      <h3>カウント2：{count.secondCounter}</h3>
      <ButtonGroup color="secondary" aria-label="outlined primary button group">
        <Button onClick={()=>dispatch({type: 'increment2', value: 100})}>increment2</Button>
        <Button onClick={()=>dispatch({type: 'decrement2', value: 100})}>decrement2</Button>
        <Button onClick={()=>dispatch({type: 'reset2'})}>reset</Button>
      </ButtonGroup>
    </>
  )
}
//#endregion

//#region useReducer4:useReducer()を使って外部APIを取得
const UseReducer4 = (): JSX.Element => {
  //initialStateを作成
  const initialState = {
    isLoading: true,
    isError: '',
    post: {}
  }

  //reducerを作成、stateとactionを渡して、新しいstateを返すように実装
  type State = { isLoading: boolean, isError: string, post: any };
  type ActionType =
  | { type: 'FETCH_INIT' ,payload: {} }
  | { type: 'FETCH_SUCCESS' ,payload: {} }
  | { type: 'FETCH_ERROR' ,payload?: {} };

  const dataFetchReducer = (dataState: State, action:ActionType): State =>{
    switch(action.type) {
      case 'FETCH_INIT':
      return {
        isLoading: true,
        post: {},
        isError: ''
      }
      //データの取得に成功した場合
      //成功なので、isErrorは''
      //postにはactionで渡されるpayloadを代入
      case 'FETCH_SUCCESS':
      return {
        isLoading: false,
        isError: '',
        post: action.payload,
      }
      //データの取得に失敗した場合
      //失敗なので、isErrorにエラーメッセージを設定
      case 'FETCH_ERROR':
      return {
        isLoading: false,
        post: {},
        isError: '読み込みに失敗しました'
      }
      //defaultではそのまま渡ってきたstateを返しておく
      default:
      return dataState
    }
  }

  //initialStateとreducer関数をuseReducer()に読み、stateとdispatchの準備
  const [dataState, dispatch] = useReducer(dataFetchReducer, initialState)

  useEffect(() => {
    //http getリクエストをurlを書く
    axios
    .get('https://jsonplaceholder.typicode.com/posts/1')
    //リクエストに成功した場合
    .then(res =>{
    //dispatch関数を呼び、type:には'FETCH_SUCCESS'、payloadには受け取ったデータを代入する
      dispatch({type:'FETCH_SUCCESS', payload: res.data})
    })
    //リクエストに失敗した場合catchの中に入ってくる
    .catch(err => {
      dispatch({type: 'FETCH_ERROR'})
    })
  })
  return (
    <>
      {/* Loadingが終わったら記事のタイトルを表示 */}
      <h3>{dataState.isLoading ? 'Loading...': dataState.post.title}</h3>
      {/* エラーがあった場合の処理 */}
      <p>{dataState.isError ? dataState.isError : null}</p>
    </>
  )
}
//#endregion

//#region useRef
// useRefを使ってDOMを参照
const UseRef = (): JSX.Element => {
  const inputEl = useRef<HTMLInputElement | null>(null);
  const [text, setText] = useState<string | undefined>('');
  const handleClick = () => {
    setText(inputEl.current?.value);
  };

  console.log("レンダリング！！");

  return (
    <>
      <TextField size="small" variant="outlined" type="text" inputRef={inputEl}/>
      <Button color="primary" variant="outlined" onClick={handleClick}>set text</Button>
      <p>テキスト : {text}</p>
    </>
  );
};
//#endregion

//#region useCallback,React.memo

//Buttonコンポーネント(子)
type ChildButtonProps = {
  counterState: () => void;
  buttonValue: string;
}
const ChildButton = React.memo((props:ChildButtonProps): JSX.Element => {
  console.log("Button child component:", props.buttonValue);

  return (
    <Button color="primary" variant="outlined" onClick={props.counterState}>{props.buttonValue}</Button>
  );
});

//コンポーネント（親）
const UseCallback = (): JSX.Element => {
  const [countStateA, setCountStateA] = useState<number>(0);
  const [countStateB, setCountStateB] = useState<number>(0);

  //Aボタンのstateセット用関数
  //useCallbackでラップし、依存配列にcountStateAを渡して、前回と差分があるかをみる
  //const incrementACounter = () => setCountStateA(countStateA + 1);
  const incrementACounter = useCallback(() => setCountStateA(countStateA + 1), [
    countStateA
  ]); //useCallbackでラップし、依存配列にcountStateBを渡して、前回と差分があるかをみる

  //Bボタンのstateセット用関数
  //const incrementBCounter = () => setCountStateB(countStateA + 1);
  const incrementBCounter = useCallback(() => setCountStateB(countStateB + 1), [
    countStateB
  ]);

  //Buttonコンポーネント(子)を呼び出す
  return (
    <>
      <p>A ボタン: {countStateA} &nbsp;
        <ChildButton counterState={incrementACounter} buttonValue="Aボタン" />
      </p>
      <p>B ボタン: {countStateB} &nbsp;
        <ChildButton counterState={incrementBCounter} buttonValue="Bボタン" />
      </p>
    </>
  );
}
//#endregion

//#region useMemo
const UseMemo = (): JSX.Element => {
  const square = (parameter: number): number => {
    console.log("square関数の実行観察");
    //正方形の面積を求める関数を定義する
    //パフォーマンスを観察したいので、わざと重い処理を置いてみる
    let i = 0
    while (i < 20000000) i++
    return parameter * parameter;
  };
  const [countA, setCountA] = useState<number>(0);
  const [countB, setCountB] = useState<number>(0);

  // 1ずつカウントが増える足し算A
  const resultA = (): void => {
    return setCountA(countA + 1);
  };

  // 1ずつカウントが増える足し算B
  const resultB = (): void => {
    return setCountB(countB + 1);
  };

  //正方形の面積をcountBを使った計算結果
  //useMemoを使って、計算結果をメモ化している
  //第２引数である依存配列にcountBを渡しているので、countAを更新しても、countBが更新されなければメモ化された描画結果を再利用するためsquare関数は更新されない
  const squareArea = useMemo(() => square(countB), [countB]);

  return (
    <>
      <p>
        計算結果A: {countA} &nbsp;
        <Button onClick={resultA} color="primary" variant="outlined">計算A + 1</Button>
      </p>
      <h4>【正方形の面積】</h4>
      <p>
        計算結果B: {countB} &nbsp;
        <Button onClick={resultB} color="primary" variant="outlined">計算B + 1</Button>
      </p>
      <p>計算結果B ✕ 計算結果B = {squareArea}</p>
    </>
  );
}

//#endregion

/************************************************************/
type CardProps = {
  title: string;
  children: JSX.Element;
}
const Card = (props: CardProps): JSX.Element => {
  return (
    <div className="l-wrapper card-radius">
      <article className="card">
        <div className="card__header">
          <p className="card__title">{props.title}</p>
        </div>
        <div className="card__body">
          {props.children}
        </div>
      </article>
    </div>
  )
}

const App = (): JSX.Element => {
  return (
    <div className="cards">
      <Card title="useState"><UseState/></Card>
      <Card title="useEffect1"><UseEffect1/></Card>
      <Card title="useEffect2"><UseEffect2/></Card>
      <Card title="useContext"><UseContext/></Card>
      <Card title="useReducer1:stateが単数①"><UseReducer1/></Card>
      <Card title="useReducer2:stateが単数②"><UseReducer2/></Card>
      <Card title="useReducer3:stateが複数"><UseReducer3/></Card>
      <Card title="useReducer4:外部APIを取得"><UseReducer4/></Card>
      <Card title="useRef"><UseRef/></Card>
      <Card title="useCallback,React.memo"><UseCallback/></Card>
      <Card title="useMemo"><UseMemo/></Card>
    </div>
  )
}

export default App
