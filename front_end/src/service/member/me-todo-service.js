app.service("MeTodoService", function ($http) {
  var todo = [];

  this.getTodo = function () {
    return todo;
  };

  this.setTodo = function (data) {
    todo = data;
  };

  this.fetchTodo = function (idPeriod, idTodoList) {
    return $http
      .get(
        apiMemberTodo + "?idPeriod=" + idPeriod + "&idTodoList=" + idTodoList
      )
      .then(
        function (response) {
          if (response.status === 200) {
            todo = response.data.data;
          }
          return response;
        },
        function (errors) {
          
        }
      );
  };
});

app.service("MeFilterTodoService", function ($http) {
  var todos = [];

  this.getTodos = function () {
    return todos;
  };

  this.setTodos = function (data) {
    todos = data;
  };

  this.fetchTodos = function (idPeriod, idTodoList, paramFilter) {
    return $http
      .get(
        apiMemberFilterTodo +
          "?idPeriod=" +
          idPeriod +
          "&idTodoList=" +
          idTodoList +
          "&filter=" +
          paramFilter
      )
      .then(
        function (response) {
          if (response.status === 200) {
            todos = response.data.data;
          }
          return response;
        },
        function (errors) {
          console.log(errors);
        }
      );
  };
});

app.service("MeCheckFilterTodo", function ($http) {
  var todos = [];

  this.getTodos = function () {
    return todos;
  };

  this.setTodos = function (data) {
    todos = data;
  };

  this.fetchTodos = function (idPeriod, idTodoList, idTodo, paramFilter) {
    return $http
      .get(
        apiMemberCheckFilterTodo +
          "?idPeriod=" +
          idPeriod +
          "&idTodoList=" +
          idTodoList +
          "&idTodo=" +
          idTodo +
          "&filter=" +
          paramFilter
      )
      .then(
        function (response) {
          if (response.status === 200) {
            todos = response.data.data;
          }
          return response;
        },
        function (errors) {
          console.log(errors);
        }
      );
  };
});

app.service("MeFindTodoById", function ($http) {
  var todo = [];

  this.getTodo = function () {
    return todo;
  };

  this.fetchTodo = function (idTodo) {
    return $http.get(apiMemberFindTodoById + "?idTodo=" + idTodo).then(
      function (response) {
        if (response.status === 200) {
          todo = response.data.data;
        }
        return response;
      },
      function (errors) {
        console.log(errors);
      }
    );
  };
});

app.service("MeDetailTodoService", function ($http) {
  var todo = {};
  var todoDetail = {};

  this.getTodo = function () {
    return todo;
  };

  this.getTodoDetail = function () {
    return todoDetail;
  };

  this.setTodo = function (data) {
    todo = data;
  };

  this.fetchTodo = function (id) {
    return $http.get(apiMemberTodo + "/" + id).then(
      function (response) {
        if (response.status === 200) {
          todo = response.data.data;
        }
        return response;
      },
      function (errors) {
        console.log(errors);
      }
    );
  };

  this.fetchDetailTodo = function (id) {
    return $http.get(apiMemberTodo + "/detail/" + id).then(
      function (response) {
        if (response.status === 200) {
          todoDetail = response.data.data;
        }
        return response;
      },
      function (errors) {
        console.log(errors);
      }
    );
  };
});

app.service("ConvertLongToDateString", function () {
  let result = "";
  let resultMonthDay = "";
  let resultMonthDayYear = "";

  this.setMonthDay = function (dateString) {
    const date = new Date(dateString);
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const day = date.getDate();
    const monthIndex = date.getMonth();
    const monthName = monthNames[monthIndex];
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const formattedTime = `${monthName} ${day}`;
    resultMonthDay = formattedTime;
    return formattedTime;
  };

  this.setDateString = function (dateString) {
    const date = new Date(dateString);
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const day = date.getDate();
    const monthIndex = date.getMonth();
    const monthName = monthNames[monthIndex];
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const formattedHours = hours.toString().padStart(2, "0");
    const formattedMinutes = minutes.toString().padStart(2, "0");
    const formattedTime = `${monthName} ${day} at ${formattedHours}:${formattedMinutes}`;
    result = formattedTime;
    return formattedTime;
  };

  this.getDateString = function () {
    return result;
  };

  this.getMonthDay = function () {
    return resultMonthDay;
  };

  this.setDateYearString = function (dateString) {
    const date = new Date(dateString);
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const day = date.getDate();
    const year = date.getFullYear();
    const monthIndex = date.getMonth();
    const monthName = monthNames[monthIndex];
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const formattedHours = hours.toString().padStart(2, "0");
    const formattedMinutes = minutes.toString().padStart(2, "0");
    const formattedTime = `${monthName} ${day}, ${year} at ${formattedHours}:${formattedMinutes}`;
    resultMonthDayYear = formattedTime;
    return formattedTime;
  };

  this.getDateYearString = function () {
    return resultMonthDayYear;
  };

  this.convertLongToDate = function (timestamp) {
    var date = new Date(timestamp);
    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'PM' : 'AM';

    var formattedDate = ('0' + day).slice(-2) + '/' + ('0' + month).slice(-2) + '/' + year + ' ' + ('0' + hours).slice(-2) + ':' + ('0' + minutes).slice(-2) + ' ' + ampm;
    return formattedDate;
  };
});
