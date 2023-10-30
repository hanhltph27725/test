const todoListComponent = {};

todoListComponent.dragAndDropTodoList = function ($scope, stompClient) {
  $scope.checkScroll = false;

  $scope.onDragStartCard = function (item, index) {
    if (item != null) {
      $scope.checkScroll = true;
      $scope.draggedItem = item;
      $scope.draggedIndex = index;
    }
  };

  $scope.itemDrag == null;

  $scope.onDropCard = function (item, index) {
    if ($scope.itemDrag == null || $scope.itemDrag.indexTodoList != null) {
      if ($scope.draggedIndex === index || $scope.draggedIndex == -1) {
        return;
      }
      if ($scope.draggedItem != null) {
        let obj = {
          idTodoList: $scope.draggedItem.id,
          indexBefore: $scope.draggedIndex,
          indexAfter: index,
        };
        document.querySelectorAll(".card-body").forEach((item) => {
          item.style.overflowY = "auto";
        });
        $scope.checkScroll = false;
        stompClient.send(
          "/action/update-todo-list" + "/" + $scope.projectId,
          {},
          JSON.stringify(obj)
        );
      }
    }
    $scope.itemDrag = null;
  };
};

todoListComponent.hideModal = function ($scope, $location) {
  $("#modal_show_detail_todo").on("hidden.bs.modal", function () {
    $location.search("idTodo", null).replace();
    window.history.pushState(null, null, $location.absUrl());
    document.title = $scope.detailProject.name + " | Portal Project";
    $scope.detailTodo = null;
    $scope.$apply();
  });

  $scope.actionReloadTodoList = function (message) {
    let idTodoList = JSON.parse(message.body).data.data;
    let indexBefore = JSON.parse(message.body).data.indexBefore;
    let indexAfter = JSON.parse(message.body).data.indexAfter;

    let objTodoList = $scope.listTask.find((tdlst) => tdlst.id === idTodoList);

    $scope.listTask.splice(indexBefore, 1);
    $scope.listTask.splice(indexAfter, 0, objTodoList);

    $scope.listTask.forEach((item, index) => {
      item.indexTodoList = index;
    });

    $scope.listTask.forEach((tdl) => {
      $scope.listTodoViewTable.forEach((item) => {
        if (tdl.id == item.objTodoList.id) {
          item.objTodoList = {
            id: tdl.id,
            name: tdl.name,
            code: tdl.code,
            indexTodoList: tdl.indexTodoList,
            checkShowAddCard: tdl.checkShowAddCard,
          };
        }
      });
    });

    $scope.sortTodoByTodoListAndTodo();

    $scope.$apply();
  };
};

todoListComponent.actionAddTodoList = function (
  $scope,
  stompClient,
  MeTodoTodoListHelper
) {
  $scope.checkShowAddTodoList = false;

  $scope.closeAddTodoList = function () {
    $scope.checkShowAddTodoList = false;
    $scope.$apply();
  };
  $scope.nameTodoListAdd = "";

  $scope.addTodoList = function () {
    if ($scope.nameTodoListAdd == "") {
      toastr.error("Tên danh sách không được để trống !", "Thông báo!", {
        closeButton: true,
        progressBar: true,
        positionClass: "toast-top-center",
      });
      return;
    }
    let obj = {
      name: $scope.nameTodoListAdd,
      idProject: $scope.projectId,
    };
    stompClient.send(
      "/action/create-todo-list" + "/" + $scope.projectId,
      {},
      JSON.stringify(obj)
    );
    $scope.checkShowAddTodoList = false;
    $scope.nameTodoListAdd = "";
    setTimeout(() => {
      document.querySelector(".container-custom-trello").scrollLeft = 10000000;
    }, 1);
  };

  $scope.actionReloadAddTodoList = function (message) {
    let obj = JSON.parse(message.body).data;
    let newObj = {
      id: obj.id,
      code: obj.code,
      name: obj.name,
      indexTodoList: obj.indexTodoList,
      todoList: [],
      checkShowAddCard: false,
    };
    $scope.listTask.push(newObj);

    $scope.$apply();
  };

  $scope.updateNameTodoList = _.debounce(function (idTodoList, index) {
    if (
      document.querySelectorAll("#nameTodoListUpdate")[index].value.trim() == ""
    ) {
      toastr.error("Tên danh sách không được để trống !", "Thông báo!", {
        closeButton: true,
        progressBar: true,
        positionClass: "toast-top-center",
      });
      return;
    }

    if (
      document.querySelectorAll("#nameTodoListUpdate")[index].value.trim()
        .length > 100
    ) {
      toastr.error("Tên danh sách không quá 100 kí tự !", "Thông báo!", {
        closeButton: true,
        progressBar: true,
        positionClass: "toast-top-center",
      });
      return;
    }

    let obj = {
      idTodoList: idTodoList,
      name: document
        .querySelectorAll("#nameTodoListUpdate")
        [index].value.trim(),
    };

    stompClient.send(
      "/action/update-name-todo-list" + "/" + $scope.projectId,
      {},
      JSON.stringify(obj)
    );
  }, 500);

  $scope.actionReloadUpdateNameTodoList = function (message) {
    console.log(message);
    let obj = JSON.parse(message.body).data;

    if (
      $scope.detailTodo.id != null &&
      $scope.itemListTask != null &&
      $scope.itemListTask.id == obj.id
    ) {
      $scope.itemListTask.name = obj.name;
    }

    $scope.tododListFindById = MeTodoTodoListHelper.findTodoList(
      $scope.listTask,
      obj.id
    );
    $scope.tododListFindById.name = obj.name;
    $scope.$apply();
  };

  $scope.deleteTodoList = function () {
    if ($scope.objTodoListDelete.todoList.length > 0) {
      toastr.error("Không thể xóa danh sách đang có đầu việc !", "Thông báo!", {
        closeButton: true,
        progressBar: true,
        positionClass: "toast-top-center",
      });
      return;
    }
    let obj = {
      id: $scope.objTodoListDelete.id,
      projectId: $scope.projectId,
    };

    stompClient.send(
      "/action/delete-todo-list" + "/" + $scope.projectId,
      {},
      JSON.stringify(obj)
    );

    $scope.showDialogMenuTodoList = false;
  };

  $scope.actionReloadDeleteTodoList = function (message) {
    let id = JSON.parse(message.body).data;
    let objDelete = {};
    $scope.listTask.forEach((item) => {
      if (item.id === id) {
        objDelete = item;
      }
    });
    $scope.listTask.forEach((item) => {
      if (item.indexTodoList > objDelete.indexTodoList) {
        item.indexTodoList = item.indexTodoList - 1;
      }
    });

    $scope.listTask.splice($scope.listTask.indexOf(objDelete), 1);
    $scope.$apply();
  };
};
