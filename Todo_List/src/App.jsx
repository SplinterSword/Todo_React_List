import { useState,useEffect } from 'react'
import Navbar from './components/Navbar'
import { v4 as uuidv4 } from 'uuid';
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";


function App() {
  const [todo, setTodo] = useState("")
  const [todos, setTodos] = useState([])
  const [showFinished, setShowFinished] = useState(true)

  useEffect(() => {
    let todoString = localStorage.getItem("todos")
    if (todoString){
      let todos = JSON.parse(localStorage.getItem("todos"))
      setTodos(todos)
    }
  }, [])
  
  const saveToLS = () => {
    localStorage.setItem("todos",JSON.stringify(todos));
  }

  const toggleFinished = (e)=>{
    setShowFinished(!showFinished)
  }

  const handleEdit = (e,id)=>{
    let t = todos.filter(i=>i.id == id)
    setTodo(t[0].todo)
    let newTodos = todos.filter(item => {
      return item.id != id
    })
    setTodos(newTodos)
    saveToLS();
  }

  const handleDelete = (e,id)=>{
    let newTodos = todos.filter(item => {
      return item.id != id
    })
    setTodos(newTodos)
    saveToLS();
  }

  const handleAdd = ()=>{
    setTodos([...todos, {id: uuidv4(),todo, isCompleted:false}])
    setTodo("")
    saveToLS();
  }

  const handleChange = (e)=>{
    setTodo(e.target.value)
  }

  const handleCheckbox = (e)=>{
    let id = e.target.name;
    todos.forEach((item)=>{
      if (id == item.id){
        item.isCompleted = !item.isCompleted
        return
      }
    })
    let newTodos = [...todos] //Copy object with new reference
    setTodos(newTodos)
    saveToLS();
  }

  return (
    <>
      <Navbar/>
      <div className="container mx-auto my-5 rounded-xl p-5 bg-violet-100 min-h-[80vh] md:w-1/2">
        <h1 className='font-bold text-center text-lg'>iTask - Manage your todos at one place</h1>
        <div className="addTodo my-5 flex flex-col gap-4">
          <h2 className='text-lg font-bold'>Add a Todo</h2>
          <input onChange={handleChange} value={todo} type="text" className='w-full px-3 py-1 rounded-lg'/>
          <button onClick={handleAdd} disabled={todo.length<=3} className='bg-violet-800 hover:bg-violet-950 disabled:bg-violet-400 px-2 py-1 text-sm font-bold text-white rounded-md'>Save</button>
        </div>
        <input onChange={toggleFinished} type="checkbox" checked={showFinished}/> Show Finished
        <h2 className='text-lg font-bold my-3'>Your Todo List</h2>
        <div className="todos">
          {todos.length == 0 && <div className='m-3'>No Todos to display</div>}
          {todos.map(item=>{
            return((showFinished || !item.isCompleted) && <div key={item.id} className="todo flex w-min-1/4 justify-between my-3">
                  <div className="flex gap-8 items-center">
                    <input name={item.id} onChange={handleCheckbox} type="checkbox" checked={item.isCompleted}/>
                    <div className={item.isCompleted?"line-through":""}>{item.todo}</div>
                  </div>
                  <div className="buttons">
                    <button onClick={(e) => {handleEdit(e, item.id)}} className='bg-violet-800 hover:bg-violet-950 px-2 py-1 text-sm font-bold text-white rounded-md mx-1'><FaEdit /></button>
                    <button onClick={(e) => {handleDelete(e, item.id)}} className='bg-violet-800 hover:bg-violet-950 px-2 py-1 text-sm font-bold text-white rounded-md mx-1'><MdDelete /></button>
                  </div>
                </div>
            )  
          })}
        </div>
      </div>
    </>
  )
}

export default App
