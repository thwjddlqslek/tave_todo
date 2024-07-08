import './App.css';
import { useEffect, useState} from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { getFirestore, collection, addDoc, doc, setDoc, deleteDoc, getDocs, query, orderBy, where } from "firebase/firestore";
import { AppBar, Container, Toolbar, Typography } from '@mui/material';
import { GoogleAuthProvider, getAuth, signInWithRedirect, onAuthStateChanged, signOut,} from "firebase/auth";
import { app, db, provider, auth } from './firebase';
import compileCode  from './CompilerApp';

// todo input
const TodoItemInputField = (props) => {
  const [input, setInput] = useState(""); //입력 필드의 현재 값으로 초기화
  const onSubmit = () => {
    if (input.trim() === "") { 
      return;
    }
    props.onSubmit(input);
    setInput("");
    
  };

  return (<div>
    <TextField 
    id='todo-item-input' 
    label='Paste Your Todo Memo!' 
    variant='outlined' 
    value={input} 
    onChange={(e)=> setInput(e.target.value)}
    sx={{
      width:'40%',
      minWidth: '200px',
      maxWidth: '350px',
      marginTop: '50px', 
      marginBottom: '25px', 
      marginRight: '15px',
      "& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
        borderWidth: "7px", 
        borderColor: "#6c553a",
        transition: "border-color 0.3s ease-in-out"},
      "&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
        borderColor: "#98886c", // 호버 시 테두리 색상 변경
        },  
      }}
    />
    <Button 
    variant="outlined" 
    onClick={onSubmit}
    sx={{
      width:'80px',
      height:'56px', 
      marginTop: '50px', 
      marginBottom: '25px',
      borderWidth: '2px',
      borderColor: '#6c553a',
      backgroundColor: '#6c553a',
      color: '#F1EEE6'}}
    >Paste</Button>
{/*     <div className='bingo-item'>
      <span>{input}</span>
    </div> */}
  </div>);
};

// todo header appbar 
const TodoListAppBar = (props) => {
  // google login
  const loginWithGoogleButton = (
    <Button color="inherit" onClick={() => {
      signInWithRedirect(auth, provider);
    }}>Google Login</Button>
  );
  const logoutButton = (
    <Button color="inherit" onClick={() => {
      signOut(auth);
    }}>Log out</Button>
  );

  const button = props.currentUser === null ? loginWithGoogleButton : logoutButton;

  //change colorbar
  const backgroundColors = [ '#B4ECFB', '#BEBDFA', '#FFD9FC', '#FFB8A6', '#C6FFAE'];
  const [backgroundColor, setBackgroundColor] = useState('#BEBDFA');

  const handleChangeColor = () => {
    const randomIndex = Math.floor(Math.random() * backgroundColors.length);
    const newColor = backgroundColors[randomIndex];
    setBackgroundColor(newColor);
  } 


  return (
    <AppBar position='static' style={{background: backgroundColor }}>
      <Toolbar>
      <Button color='inherit' onClick={handleChangeColor}>CHANGE BAR</Button>
        <Typography variant='h6' component='div' sx={{flexGrow: 1}}>
          Todo Memo App
        </Typography>
        {button}
      </Toolbar>
    </AppBar>
  )
}

// todo memo color change
const TodoItemBox = (props) => {
  const [memoColor, setMemoColor] = useState('#FBF4AD');
  const memoColors = [ '#FAD5E6', '#C8DAEE', '#FBF4AD', '#E5F2E8', '#FFFFFF'];

  const memoChangeColor = () => {
    const randomIndex = Math.floor(Math.random() * memoColors.length);
    const newMemoColor = memoColors[randomIndex];
    setMemoColor(newMemoColor);
  };
  return (
    <div className='box-style' style={{backgroundColor: memoColor}}>
      <TodoItem
        todoItem={props.todoItem}
        onTodoItemClick={props.onTodoItemClick}
        onRemoveClick={props.onRemoveClick}
      />
      <Button variant='outlined' onClick={memoChangeColor}
      sx={{
        width:'55px', 
        height:'40px', 
        borderWidth: '2px',
        backgroundColor: '#6c553a',
        borderColor: '#6c553a',
        color: '#F1EEE6'}}>Color</Button>
    </div>
  );
};

// todo 기능
const TodoItem = (props) => {
  const [isDeleted, setIsDeleted] = useState(false);

  const memoChangeColor = () => {
    const randomIndex = Math.floor(Math.random() * props.memoColors.length);
    const newMemoColor = props.memoColors[randomIndex];
    props.setMemoColor(newMemoColor);
  };


  const handleRemoveClick = async () => {
    setIsDeleted(true); // 삭제 효과를 주기 위해 상태 변경
    // 삭제 로직 실행 (예: 서버에서 삭제)
  };

  const handleAnimationEnd = () =>{
    if (isDeleted) {
      props.onRemoveClick(props.todoItem);
    }
  };
  return (<li className={`todo-item ${props.todoItem.isFinished ? 'finished' : ''}`} onAnimationEnd={handleAnimationEnd}>
    <span
      onClick={() => props.onTodoItemClick(props.todoItem)}>
        {props.todoItem.todoItemContent}
    </span>
    <div className='button-container'>
    <Button variant='outlined' onClick={handleRemoveClick}
    sx={{
      width:'55px',
      height:'40px', 
      borderWidth: '2px',
      borderColor: '#6c553a',
      backgroundColor: '#F1EEE6',
      color: '#6c553a'}}>Erase</Button>
    </div>
  </li>)};

const TodoItemList = (props) => {
  const todoList = props.todoItemList.map((todoItem, index) => {
    return (<TodoItemBox 
    key={todoItem.id}  
    todoItem={todoItem} 
    onTodoItemClick={props.onTodoItemClick} 
    onRemoveClick={props.onRemoveClick}
    />);
  });

  /* return (<div className="todo-item-list">
    <Typography variant="h6" component="div" 
    sx={{ fontWeight: 'bold', marginBottom: '10px', fontSize:'25px' ,color: '#F1EEE6'}}>
        Memo Board
      </Typography>
    <ul>{todoList}</ul>
  </div>); */
  return (<Container sx={{ 
    width: '50%',
    maxWidth: '350px',
    minWidth: '350px',
    height: 'auto',
    minHeight: '546px',
    padding: '1%',
    border : '13px solid',
    borderColor : '#6c553a',
    backgroundColor: '#0A3711',
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '15px'
    }}>
  <Typography variant="h6" component="div" 
  sx={{ fontWeight: 'bold', marginBottom: '10px', fontSize:'25px' ,color: '#F1EEE6'}}>
      Memo Board
    </Typography>
  <ul>{todoList}</ul>
</Container>);
}

function App() {
  const [todoItemList, setTodoItemList] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  onAuthStateChanged(auth, (user) => {
    if (user) {
      setCurrentUser(user.uid);
    } else {
      setCurrentUser(null);
    }
  });

  const syncTodoItemListStateWithFirestore = () => {
    const q = query(collection(db, "todoItem"), where("userId", "==", currentUser), orderBy("createdTime", "desc"));
    getDocs(q).then((querySnapshot) => {
      const firestoreTodoItemList = [];
      querySnapshot.forEach((doc) => {
        firestoreTodoItemList.push({
          id: doc.id,
          todoItemContent : doc.data().todoItemContent,
          isFinished: doc.data().isFinished,
          createdTime : doc.data().createdTime ?? 0,
          userId: doc.data().userId,
        });
      });
      setTodoItemList(firestoreTodoItemList);
    });
  }

  useEffect(() => {
    syncTodoItemListStateWithFirestore();
  }, [currentUser]);

  const onSubmit = async (newTodoItem) => { //async 이유 영상 보기
    await addDoc(collection(db, "todoItem"),{
      todoItemContent : newTodoItem,
      isFinished: false,
      createdTime : Math.floor(Date.now()/1000),
      userId : currentUser,
    });
    syncTodoItemListStateWithFirestore();
    /* setTodoItemList([...todoItemList, {
      // 문제점 : listState 바꿀 수 있는 부분이 여러 부분이라, 헷갈릴 수 있음.
      // 해결점 : dataflow simplify -> 직접 state 변경x, firestore update -> 다시 읽어와서 update
      id: docRef.id,
      todoItemContent: newTodoItem,
      isFinished: false,
    }]); */
  };
  
  const onTodoItemClick = async (clickedTodoItem) => {
    const todoItemRef = doc(db, "todoItem", clickedTodoItem.id);
    await setDoc(todoItemRef, {isFinished: !clickedTodoItem.isFinished}, {merge:true});
    syncTodoItemListStateWithFirestore();

    /* setTodoItemList(todoItemList.map((todoItem) => {
      if (clickedTodoItem.id === todoItem.id) {
        return {
          id: clickedTodoItem.id,
          todoItemContent: clickedTodoItem.todoItemContent,
          isFinished: !clickedTodoItem.isFinished,
        }
      } else {
        return todoItem;
      }
    })) */
  }

  const onRemoveClick = async (removedTodoItem) => {
    const todoItemRef = doc(db, "todoItem", removedTodoItem.id);
    await deleteDoc(todoItemRef);
    syncTodoItemListStateWithFirestore();
    /* setTodoItemList(todoItemList.filter((todoItem) => {
      return todoItem.id !== removedTodoItem.id;
    })); */
  };
  
  const onAnimationEnd = (removedTodoItem) => {
    setTodoItemList(todoItemList.filter((todoItem) => {
      return todoItem.id !== removedTodoItem.id;
    }));
  }

  

  return (
    <div className="App">
      <h1>jdoodle API Example</h1>
      <compileCode />
      <TodoListAppBar currentUser={currentUser}/>
      <TodoItemInputField onSubmit={onSubmit} />
      <TodoItemList todoItemList={todoItemList} 
      onTodoItemClick={onTodoItemClick}
      onRemoveClick={onRemoveClick} />
      
    </div>
  );
}

export default App;
