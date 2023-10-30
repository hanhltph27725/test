const ViewTable = {};

ViewTable.addComponent = function (
  $scope,
  $routeParams,
  MeAssignService,
  MeLabelService,
  stompClient
) {
  $scope.openViewBoard = function (event) {
    event.stopPropagation();
    $scope.showDialogViewTable = false;
    localStorage.setItem("showDialogViewTable:" + $scope.projectId, false);
    document.querySelector(".container-custom-trello").scrollLeft = 0;
    $scope.selectedView = "board";
  };

  $scope.openDialogAddMemberTableView = function (event, id, itemListTask) {
    $scope.idTodoAssign = id;
    $scope.idTodo = id;
    $scope.idTodoList = itemListTask.id;
    MeAssignService.fetchMember(id).then(function () {
      event.stopPropagation();
      $scope.showDialogAddLabel = false;
      $scope.showDialogAddPriorityLevel = false;
      $scope.showDialogAddAttachment = false;
      $scope.showDialogAddImage = false;
      $scope.searchMemberDialog = "";

      if (!$scope.showDialogAddMemberViewTable) {
        $scope.showDialogAddMemberViewTable = true;
      } else {
        $scope.showDialogAddMemberViewTable = false;
      }

      $scope.dialogStyleAddMemberViewTable = {
        top: event.clientY - 200 + "px",
        left: event.clientX - 150 + "px",
      };

      $scope.listMemberProject.forEach((meId) => {
        let memberCheckAssign = $scope.listMemberById
          .filter((member) => MeAssignService.getMembers().includes(member.id))
          .find((me) => meId.id === me.id);
        if (memberCheckAssign != null) {
          meId.checkMemberAssign = true;
        } else {
          meId.checkMemberAssign = false;
        }
      });

      $scope.clickOutPopupAddMemberViewTable();
    });
  };

  $scope.openDialogAddLabelTableView = function (event, id, itemListTask) {
    $scope.idTodoAssign = id;
    $scope.idTodo = id;
    $scope.idTodoList = itemListTask.id;

    MeLabelService.fetchLabels($scope.projectId).then(function () {
      $scope.listLabel = MeLabelService.getAllLabels();

      MeLabelService.fetchLabel(id).then(function () {
        $scope.showDialogAddAttachment = false;
        $scope.showDialogAddImage = false;
        $scope.showDialogAddMember = false;
        $scope.showDialogAddPriorityLevel = false;
        $scope.searchLabelDialog = "";
        event.stopPropagation();
        if (!$scope.showDialogAddLabelViewTable) {
          $scope.showDialogAddLabelViewTable = true;
        } else {
          $scope.showDialogAddLabelViewTable = false;
        }

        document.querySelector(".dialogAddLabelViewTable").style.left = "48%";
        document.querySelector(".dialogAddLabelViewTable").style.top = "100px";

        $scope.listLabel = MeLabelService.getAllLabels();

        $scope.listLabel.forEach((lbAll) => {
          lbAll.checkLabel = false;
          let label = MeLabelService.getLabels().find(
            (lbDetail) => lbAll.id === lbDetail.id
          );
          if (label != null) {
            lbAll.checkLabel = true;
          } else {
            lbAll.checkLabel = false;
          }
        });

        $scope.clickOutPopupAddLabelViewTable();
      });
    });
  };

  $scope.showDialogViewTable = false;

  $scope.openDialogViewTable = function (event) {
    var element = document.querySelector(".dialog-bodyViewTable");
    element.scrollTop = 0;
    event.stopPropagation();
    $scope.selectedView = "table";

    $scope.showDialogAddLabelOut = false;
    localStorage.setItem("showDialogViewTable:" + $scope.projectId, true);

    $scope.showDialogAddLabel = false;
    $scope.showDialogAddPriorityLevel = false;
    $scope.showDialogViewTable = false;
    if (!$scope.showDialogViewTable) {
      $scope.showDialogViewTable = true;
    } else {
      $scope.showDialogViewTable = false;
    }
  };

  $scope.clickOutPopupViewTable = function () {
    document.addEventListener(
      "click",
      function (event) {
        if (
          !document.querySelector(".dialogViewTable").contains(event.target)
        ) {
          $scope.$apply(function () {
            $scope.closeDialogViewTable();
          });
        } else {
          $scope.clickOutPopupViewTable();
        }
      },
      { once: true }
    );
  };

  $scope.closeDialogViewTable = function () {
    $scope.showDialogViewTable = false;
  };

  $scope.updateIndexTodoViewTable = function (todo, index) {
    let nameTodoListNew = "";
    $scope.listTask.forEach((item) => {
      if (
        item.id == document.querySelectorAll("#valueTodoListNew")[index].value
      ) {
        nameTodoListNew = item.name;
      }
    });
    let obj = {
      idTodo: todo.id,
      idTodoListOld: todo.objTodoListSelect.id,
      nameTodoListOld: todo.objTodoListSelect.name,
      idTodoListNew:
        document.querySelectorAll("#valueTodoListNew")[index].value,
      nameTodoListNew: nameTodoListNew,
      indexBefore: todo.indexTodo,
      indexAfter: todo.indexTodo,
      periodId: $routeParams.idPeriod,
      projectId: $scope.projectId,
      idUser: $scope.idUser,
    };

    stompClient.send(
      "/action/update-index-todo-view-table" +
        "/" +
        $scope.projectId +
        "/" +
        $routeParams.idPeriod,
      {},
      JSON.stringify(obj)
    );
  };

  $scope.getInputWidth = function () {
    var width = $scope.detailProject.name.length + "ch";
    return {
      width: width,
    };
  };

  $scope.changeInputNameproject = _.debounce(function () {
    alert($scope.detailProject.name);
  }, 500);

  $scope.showDialogViewBtnAddTodoTodoList = false;

  $scope.openDialogViewBtnAddTodoTodoList = function (event) {
    event.stopPropagation();
    $scope.showDialogAddLabelOut = false;
    $scope.showDialogAddTodoViewTable = false;
    $scope.showDialogAddTodoListViewTable = false;
    $scope.showDialogAddLabel = false;
    $scope.showDialogAddPriorityLevel = false;
    $scope.showDialogViewBtnAddTodoTodoList = false;

    if (!$scope.showDialogViewBtnAddTodoTodoList) {
      $scope.showDialogViewBtnAddTodoTodoList = true;
    } else {
      $scope.showDialogViewBtnAddTodoTodoList = false;
    }

    $scope.clickOutPopupViewBtnAddTodoTodoList();
  };

  $scope.clickOutPopupViewBtnAddTodoTodoList = function () {
    document.addEventListener(
      "click",
      function (event) {
        if (
          !document
            .querySelector(".dialogViewBtnAddTodoTodoList")
            .contains(event.target)
        ) {
          $scope.$apply(function () {
            $scope.closeDialogViewBtnAddTodoTodoList();
          });
        } else {
          $scope.clickOutPopupViewBtnAddTodoTodoList();
        }
      },
      { once: true }
    );
  };

  $scope.closeDialogViewBtnAddTodoTodoList = function () {
    $scope.showDialogViewBtnAddTodoTodoList = false;
  };

  //
  $scope.showDialogAddTodoViewTable = false;

  $scope.openDialogAddTodoViewTable = function (event) {
    event.stopPropagation();
    $scope.showDialogAddLabelOut = false;
    $scope.showDialogViewBtnAddTodoTodoList = false;
    $scope.showDialogAddLabel = false;
    $scope.showDialogAddPriorityLevel = false;
    $scope.showDialogAddTodoViewTable = false;

    if (!$scope.showDialogAddTodoViewTable) {
      $scope.showDialogAddTodoViewTable = true;
    } else {
      $scope.showDialogAddTodoViewTable = false;
    }

    $scope.clickOutPopupAddTodoViewTable();
  };

  $scope.clickOutPopupAddTodoViewTable = function () {
    document.addEventListener(
      "click",
      function (event) {
        if (
          !document
            .querySelector(".dialogAddTodoViewTable")
            .contains(event.target)
        ) {
          $scope.$apply(function () {
            $scope.closeDialogAddTodoViewTable();
          });
        } else {
          $scope.clickOutPopupAddTodoViewTable();
        }
      },
      { once: true }
    );
  };

  $scope.closeDialogAddTodoViewTable = function () {
    $scope.showDialogAddTodoViewTable = false;
  };
  //

  $scope.showDialogAddTodoListViewTable = false;

  $scope.openDialogAddTodoListViewTable = function (event) {
    event.stopPropagation();
    $scope.showDialogAddLabelOut = false;
    $scope.showDialogViewBtnAddTodoTodoList = false;
    $scope.showDialogAddLabel = false;
    $scope.showDialogAddPriorityLevel = false;
    $scope.showDialogAddTodoListViewTable = false;

    if (!$scope.showDialogAddTodoListViewTable) {
      $scope.showDialogAddTodoListViewTable = true;
    } else {
      $scope.showDialogAddTodoListViewTable = false;
    }

    $scope.clickOutPopupAddTodoListViewTable();
  };

  $scope.clickOutPopupAddTodoListViewTable = function () {
    document.addEventListener(
      "click",
      function (event) {
        if (
          !document
            .querySelector(".dialogAddTodoListViewTable")
            .contains(event.target)
        ) {
          $scope.$apply(function () {
            $scope.closeDialogAddTodoListViewTable();
          });
        } else {
          $scope.clickOutPopupAddTodoListViewTable();
        }
      },
      { once: true }
    );
  };

  $scope.closeDialogAddTodoListViewTable = function () {
    $scope.showDialogAddTodoListViewTable = false;
  };

  $scope.addTodoCardViewTable = function () {
    let nameTodoList = "";
    let todoListId = $("#valueSelectTodoListCardViewTable").val();
    $scope.listTask.forEach((item) => {
      if (item.id == todoListId) {
        nameTodoList = item.name;
      }
    });
    let obj = {
      name: $scope.valueInputNameCardViewTable,
      todoListId: todoListId,
      nameTodoList: nameTodoList,
      periodId: $routeParams.idPeriod,
      projectId: $scope.projectId,
      idUser: $scope.idUser,
    };

    stompClient.send(
      "/action/create-todo" + "/" + $scope.projectId + "/" + obj.periodId,
      {},
      JSON.stringify(obj)
    );
    $scope.valueInputNameCardViewTable = "";
    $scope.checkValueINputNameCardViewTable = false;
    $("#valueSelectTodoListCardViewTable").val($scope.listTask[0].id);
  };

  $scope.checkValueINputNameCardViewTable = false;

  $scope.watchValueImputNameCardViewTable = function () {
    if (
      $scope.valueInputNameCardViewTable == "" ||
      $scope.valueInputNameCardViewTable.length > 100
    ) {
      $scope.checkValueINputNameCardViewTable = false;
    } else {
      $scope.checkValueINputNameCardViewTable = true;
    }
  };

  $scope.addTodoListViewTable = function () {
    let obj = {
      name: $scope.valueInputNameTodoListViewTable,
      idProject: $scope.projectId,
    };
    stompClient.send(
      "/action/create-todo-list" + "/" + $scope.projectId,
      {},
      JSON.stringify(obj)
    );
    $scope.valueInputNameTodoListViewTable = "";
    $scope.checkValueINputNameTodoListViewTable = false;
  };

  $scope.checkValueINputNameTodoListViewTable = false;

  $scope.watchValueImputNameTodoListViewTable = function () {
    if (
      $scope.valueInputNameTodoListViewTable == "" ||
      $scope.valueInputNameTodoListViewTable.length > 100
    ) {
      $scope.checkValueINputNameTodoListViewTable = false;
    } else {
      $scope.checkValueINputNameTodoListViewTable = true;
    }
  };
};
