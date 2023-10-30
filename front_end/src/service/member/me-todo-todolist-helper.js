app.service("MeTodoTodoListHelper", function () {

  this.findTodoList = function (listTodoList, id) {
    let todoList = listTodoList.filter((item) => {
      return item.id === id;
    })[0];
    return todoList;
  };

  this.findTodo = function(listTodo, id){
    let todo = listTodo.filter((item) => {
        return item.id === id;
      })[0];
      return todo;
  }
});
