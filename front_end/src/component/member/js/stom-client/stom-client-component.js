const stomClientComponent = {};

stomClientComponent.connectSuccess = function (
  stompClient,
  $scope,
  $rootScope,
  $location,
  MeDetailProjectService,
  MeMemberService,
  MeGetAllPeriodById,
  MeTodoService,
  MeAssignService,
  MeLabelService,
  MeDetailTodoService,
  MeMemberProjectService,
  MeTodoListService,
  ConvertLongToDateString,
  MeTodoTodoListHelper
) {
  stompClient.connect({}, function (frame) {
    projectComponent
      .fetchAllDataProject(
        $scope,
        $rootScope,
        $location,
        $scope.projectId,
        MeDetailProjectService,
        MeMemberService,
        MeGetAllPeriodById,
        MeDetailTodoService,
        MeMemberProjectService,
        MeTodoListService,
        MeTodoTodoListHelper,
        MeTodoService,
        MeAssignService,
        MeLabelService,
        ConvertLongToDateString
      )
      .then(() => {
        stomClientComponent.allSubcribePeriod(
          $scope,
          stompClient,
          $scope.periodCurrentId
        );

        periodComponent.watchUrl(
          stompClient,
          $scope.projectId,
          $scope,
          $rootScope,
          $location,
          MeTodoService,
          MeAssignService,
          MeLabelService,
          ConvertLongToDateString,
          MeDetailTodoService,
          MeTodoTodoListHelper
        );
      });
  });
};

stomClientComponent.allSubcribePeriod = function (
  $scope,
  stompClient,
  idPeriod
) {
  let sessionId = /\/([^\/]+)\/websocket/.exec(
    stompClient.ws._transport.url
  )[1];

  stompClient.subscribe(
    "/portal-projects/success/" + sessionId,
    function (message) {
      let successObject = JSON.parse(message.body);
      toastr.success(successObject.successMessage, "Thông báo", {
        closeButton: true,
        progressBar: true,
        positionClass: "toast-top-center",
      });
    }
  );

  // Message bắt lỗi trả về cho client thực hiện thao tác
  stompClient.subscribe(
    "/portal-projects/error/" + sessionId,
    function (message) {
      var errorObject = JSON.parse(message.body);
      toastr.error(errorObject.errorMessage, "Lỗi", {
        closeButton: true,
        progressBar: true,
        positionClass: "toast-top-center",
      });
    }
  );

  stompClient.subscribe(
    "/portal-projects/create-todo-list" + "/" + $scope.projectId,
    function (message) {
      $scope.actionReloadAddTodoList(message);
    }
  );

  stompClient.subscribe(
    "/portal-projects/update-background-project" + "/" + $scope.projectId,
    function (message) {
      $scope.actionReloadBackground(message);
    }
  );

  stompClient.subscribe(
    "/portal-projects/todo-list" + "/" + $scope.projectId,
    function (message) {
      $scope.actionReloadTodoList(message);
    }
  );

  stompClient.subscribe(
    "/portal-projects/update-descriptions-todo" +
      "/" +
      $scope.projectId +
      "/" +
      idPeriod,
    function (message) {
      $scope.actionReloadTodoDescriptions(message);
    },
    function (error) {
      alert(error);
    }
  );

  stompClient.subscribe(
    "/portal-projects/assign" + "/" + $scope.projectId + "/" + idPeriod,
    function (message) {
      if (JSON.parse(message.body).data.data.todoId != null) {
        $scope.actionReloadData(
          message,
          JSON.parse(message.body).data.data.todoId,
          JSON.parse(message.body).data.idTodoList,
          JSON.parse(message.body).data.idTodo
        );
      } else {
        $scope.actionReloadData(
          message,
          JSON.parse(message.body).data.data,
          JSON.parse(message.body).data.idTodoList,
          JSON.parse(message.body).data.idTodo
        );
      }
    }
  );

  stompClient.subscribe(
    "/portal-projects/label-todo" + "/" + $scope.projectId + "/" + idPeriod,
    function (message) {
      console.log(message);
      if (JSON.parse(message.body).data.data.todoId != null) {
        $scope.actionReloadDataLabel(
          JSON.parse(message.body).data.data.todoId,
          JSON.parse(message.body).data.idTodoList,
          JSON.parse(message.body).data.idTodo
        );
      } else {
        $scope.actionReloadDataLabel(
          JSON.parse(message.body).data.data,
          JSON.parse(message.body).data.idTodoList,
          JSON.parse(message.body).data.idTodo
        );
      }
    }
  );

  stompClient.subscribe(
    "/portal-projects/todo" + "/" + $scope.projectId + "/" + idPeriod,
    function (message) {
      $scope.actionReloadDataPriorityTodo(
        JSON.parse(message.body).data.data.id,
        JSON.parse(message.body).data.idTodoList,
        JSON.parse(message.body).data.idTodo
      );
    }
  );

  stompClient.subscribe(
    "/portal-projects/create-todo-checklist" +
      "/" +
      $scope.projectId +
      "/" +
      idPeriod,
    function (message) {
      $scope.actionReloadTodoInCheckList(message);
    }
  );

  stompClient.subscribe(
    "/portal-projects/update-todo-checklist" +
      "/" +
      $scope.projectId +
      "/" +
      idPeriod,
    function (message) {
      $scope.actionReloadSaveTodoInCheckList(message);
    }
  );

  stompClient.subscribe(
    "/portal-projects/update-statustodo-todo-checklist" +
      "/" +
      $scope.projectId +
      "/" +
      idPeriod,
    function (message) {
      $scope.actionReloadTodoInCheckListByUpdateStatusTodo(message);
    }
  );

  stompClient.subscribe(
    "/portal-projects/delete-todo-checklist" +
      "/" +
      $scope.projectId +
      "/" +
      idPeriod,
    function (message) {
      $scope.actionReloadTodoInCheckListDelete(message);
    }
  );

  stompClient.subscribe(
    "/portal-projects/update-deadline-todo" +
      "/" +
      $scope.projectId +
      "/" +
      idPeriod,
    function (message) {
      $scope.actionReloadTodoDeadlineUpdate(message);
    }
  );

  stompClient.subscribe(
    "/portal-projects/delete-deadline-todo" +
      "/" +
      $scope.projectId +
      "/" +
      idPeriod,
    function (message) {
      $scope.actionReloadTodoDeadlineDelete(message);
    }
  );

  stompClient.subscribe(
    "/portal-projects/create-todo" + "/" + $scope.projectId + "/" + idPeriod,
    function (message) {
      $scope.actionReloadCreateTodo(message);
    }
  );

  stompClient.subscribe(
    "/portal-projects/update-index-todo" +
      "/" +
      $scope.projectId +
      "/" +
      idPeriod,
    function (message) {
      $scope.actionReloadUpdateIndexTodo(message);
    }
  );

  stompClient.subscribe(
    "/portal-projects/update-name-todo" +
      "/" +
      $scope.projectId +
      "/" +
      idPeriod,
    function (message) {
      $scope.actionReloadUpdateNameTodo(message);
    }
  );

  stompClient.subscribe(
    "/portal-projects/update-name-todo-list" + "/" + $scope.projectId,
    function (message) {
      $scope.actionReloadUpdateNameTodoList(message);
    }
  );

  stompClient.subscribe(
    "/portal-projects/create-comment" + "/" + $scope.projectId + "/" + idPeriod,
    function (message) {
      $scope.actionReloadDataCreateComment(message);
    }
  );

  stompClient.subscribe(
    "/portal-projects/update-comment" + "/" + $scope.projectId + "/" + idPeriod,
    function (message) {
      $scope.actionReloadDataUpdateComment(message);
    }
  );

  stompClient.subscribe(
    "/portal-projects/delete-comment" + "/" + $scope.projectId + "/" + idPeriod,
    function (message) {
      $scope.actionReloadDataDeleteComment(message);
    }
  );

  stompClient.subscribe(
    "/portal-projects/update-progress-todo" +
      "/" +
      $scope.projectId +
      "/" +
      idPeriod,
    function (message) {
      $scope.actionReloadDataChangeProgress(message);
    }
  );

  stompClient.subscribe(
    "/portal-projects/create-image" + "/" + $scope.projectId + "/" + idPeriod,
    function (message) {
      $scope.actionReloadDataCreateImage(message);
    }
  );

  stompClient.subscribe(
    "/portal-projects/update-name-image" +
      "/" +
      $scope.projectId +
      "/" +
      idPeriod,
    function (message) {
      $scope.actionReloadDataUpdateNameImage(message);
    }
  );

  stompClient.subscribe(
    "/portal-projects/delete-image" + "/" + $scope.projectId + "/" + idPeriod,
    function (message) {
      $scope.actionReloadDataDeleteImage(message);
    }
  );

  stompClient.subscribe(
    "/portal-projects/change-cover-image" +
      "/" +
      $scope.projectId +
      "/" +
      idPeriod,
    function (message) {
      $scope.actionReloadDataChangeCoverImage(message);
    }
  );

  stompClient.subscribe(
    "/portal-projects/create-resource" +
      "/" +
      $scope.projectId +
      "/" +
      idPeriod,
    function (message) {
      $scope.actionReloadDataCreateResource(message);
    }
  );

  stompClient.subscribe(
    "/portal-projects/update-resource" +
      "/" +
      $scope.projectId +
      "/" +
      idPeriod,
    function (message) {
      $scope.actionReloadDataUpdateResource(message);
    }
  );

  stompClient.subscribe(
    "/portal-projects/delete-resource" +
      "/" +
      $scope.projectId +
      "/" +
      idPeriod,
    function (message) {
      $scope.actionReloadDataDeleteResource(message);
    }
  );

  stompClient.subscribe(
    "/portal-projects/update-complete-todo" +
      "/" +
      $scope.projectId +
      "/" +
      idPeriod,
    function (message) {
      $scope.actionReloadDataUpdateCompleteTodo(message);
    }
  );

  stompClient.subscribe(
    "/portal-projects/create-label" + "/" + $scope.projectId,
    function (message) {
      $scope.actionReloadDataCreateLabel(message);
    }
  );

  stompClient.subscribe(
    "/portal-projects/update-label" + "/" + $scope.projectId,
    function (message) {
      $scope.actionReloadDataUpdateLabel(message);
    }
  );

  stompClient.subscribe(
    "/portal-projects/delete-label" + "/" + $scope.projectId,
    function (message) {
      $scope.actionReloadDataDeleteLabel(message);
    }
  );

  stompClient.subscribe(
    "/portal-projects/update-member-project" + "/" + $scope.projectId,
    function (message) {
      $scope.actionReloadDataUpdateMemberProject(message);
    }
  );

  stompClient.subscribe(
    "/portal-projects/create-member-project" + "/" + $scope.projectId,
    function (message) {
      $scope.actionReloadDataCreateMemberProject(message);
    }
  );

  stompClient.subscribe(
    "/portal-projects/update-index-todo-view-table" +
      "/" +
      $scope.projectId +
      "/" +
      idPeriod,
    function (message) {
      $scope.actionReloadUpdateIndexTodo(message);
    }
  );

  stompClient.subscribe(
    "/portal-projects/delete-todo-list" +
      "/" +
      $scope.projectId,
    function (message) {
      $scope.actionReloadDeleteTodoList(message);
    }
  );

  stompClient.subscribe(
    "/portal-projects/delete-todo" +
      "/" +
      $scope.projectId +
      "/" +
      idPeriod,
    function (message) {
      $scope.actionReloadDeleteTodo(message);
    }
  );

  stompClient.subscribe(
    "/portal-projects/sort-todo-priority" +
      "/" +
      $scope.projectId +
      "/" +
      idPeriod,
    function (message) {
      $scope.actionReloadSortTodo(message);
    }
  );

  stompClient.subscribe(
    "/portal-projects/sort-todo-deadline" +
      "/" +
      $scope.projectId +
      "/" +
      idPeriod,
    function (message) {
      $scope.actionReloadSortTodo(message);
    }
  );

  stompClient.subscribe(
    "/portal-projects/update-type-todo" +
      "/" +
      $scope.projectId +
      "/" +
      idPeriod,
    function (message) {
      $scope.actionReloadUpdateTypeTodo(message);
    }
  );
};
