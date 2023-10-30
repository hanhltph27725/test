const resourceComponent = {};

resourceComponent.actionResourceComponent = function (
  $scope,
  stompClient,
  $routeParams,
  ConvertLongToDateString
) {
  $scope.showDialogAddAttachment = false;

  $scope.openDialogAddAttachment = function (event) {
    event.stopPropagation();
    $scope.urlAttachment = "";
    $scope.nameAttachment = "";
    $scope.showDialogAddImage = false;
    $scope.showDialogAddLabelOut = false;
    $scope.showDialogAddDeadline = false;
    $scope.showDialogAddLabel = false;
    $scope.showDialogAddPriorityLevel = false;
    $scope.searchMemberDialog = "";
    $scope.showDialogUpdateAttachment = false;

    if (!$scope.showDialogAddAttachment) {
      $scope.showDialogAddAttachment = true;
    } else {
      $scope.showDialogAddAttachment = false;
    }

    $scope.dialogStyleAddAttachment = {
      top: event.clientY - 230 + "px",
      left: event.clientX - 130 + "px",
    };

    $scope.clickOutPopupAddAttachment();
  };

  $scope.clickOutPopupAddAttachment = function () {
    document.addEventListener(
      "click",
      function (event) {
        if (
          !document.querySelector(".dialogAddAttachment").contains(event.target)
        ) {
          $scope.$apply(function () {
            $scope.closeDialogAddAttachment();
          });
        } else {
          $scope.clickOutPopupAddAttachment();
        }
      },
      { once: true }
    );
  };

  $scope.closeDialogAddAttachment = function () {
    $scope.showDialogAddAttachment = false;
  };

  $scope.urlAttachment = "";
  $scope.nameAttachment = "";

  $scope.addAttachment = function () {
    if ($scope.urlAttachment == "") {
      toastr.error("Nội dung của link không được để trống !", "Thông báo!", {
        closeButton: true,
        progressBar: true,
        positionClass: "toast-top-center",
      });
      return;
    }

    if ($scope.urlAttachment.length > 1000) {
      toastr.error(
        "Nội dung của link không vượt quá 1000 ký tự !",
        "Thông báo!",
        {
          closeButton: true,
          progressBar: true,
          positionClass: "toast-top-center",
        }
      );
      return;
    }

    if (
      $scope.nameAttachment != null &&
      $scope.nameAttachment != "" &&
      $scope.nameAttachment.length > 100
    ) {
      toastr.error("Tên link không vượt quá 100 ký tự !", "Thông báo!", {
        closeButton: true,
        progressBar: true,
        positionClass: "toast-top-center",
      });
      return;
    }

    let obj = {
      name: $scope.nameAttachment,
      url: $scope.urlAttachment,
      idTodo: $scope.idTodo,
      idTodoList: $scope.idTodoList,
      projectId: $scope.projectId,
      idUser: $scope.idUser
    };

    stompClient.send(
      "/action/create-resource/" +
        $scope.projectId +
        "/" +
        $routeParams.idPeriod,
      {},
      JSON.stringify(obj)
    );

    $scope.showDialogAddAttachment = false;
    $scope.urlAttachment = "";
    $scope.nameAttachment = "";
  };

  $scope.actionReloadDataCreateResource = function (message) {
    let obj = JSON.parse(message.body).data.data;
    let objActivity = JSON.parse(message.body).data.dataActivity;
    let idTodo = JSON.parse(message.body).data.idTodo;
    let idTodoList = JSON.parse(message.body).data.idTodoList;

    if ($scope.detailTodo.id != null && $scope.detailTodo.id == idTodo) {
      let newObjResource = {
        id: obj.id,
        name: obj.name,
        url: obj.url,
        todoId: obj.todoId,
        createdDate: obj.createdDate,
      };

      ConvertLongToDateString.setDateYearString(newObjResource.createdDate);
      newObjResource.convertDate = ConvertLongToDateString.getDateYearString();

      $scope.listResource.unshift(newObjResource);
    }

    if (
      $scope.detailTodo.id != null &&
      $scope.showDetailActivityTrueFalse &&
      objActivity != null &&
      $scope.detailTodo.id == idTodo
    ) {
      $scope.convertObjectActivity(objActivity);
    }

    $scope.$apply();
  };

  $scope.showDialogUpdateAttachment = false;

  $scope.openDialogUpdateAttachment = function (event, id, url, name) {
    event.stopPropagation();
    $scope.urlAttachment = "";
    $scope.nameAttachment = "";
    $scope.showDialogAddLabelOut = false;
    $scope.showDialogAddImage = false;
    $scope.showDialogAddLabel = false;
    $scope.showDialogAddAttachment = false;
    $scope.showDialogAddPriorityLevel = false;
    $scope.searchMemberDialog = "";

    if (!$scope.showDialogUpdateAttachment) {
      $scope.showDialogUpdateAttachment = true;
    } else {
      $scope.showDialogUpdateAttachment = false;
    }

    $scope.dialogStyleUpdateAttachment = {
      top: event.clientY + "px",
      left: event.clientX + "px",
    };

    $scope.idUpdateAttachment = id;
    $scope.urlUpdateAttachment = url;
    $scope.nameUpdateAttachment = name;

    $scope.clickOutPopupUpdateAttachment();
  };

  $scope.clickOutPopupUpdateAttachment = function () {
    document.addEventListener(
      "click",
      function (event) {
        if (
          !document
            .querySelector(".dialogUpdateAttachment")
            .contains(event.target)
        ) {
          $scope.$apply(function () {
            $scope.closeDialogUpdateAttachment();
          });
        } else {
          $scope.clickOutPopupUpdateAttachment();
        }
      },
      { once: true }
    );
  };

  $scope.closeDialogUpdateAttachment = function () {
    $scope.showDialogUpdateAttachment = false;
  };

  $scope.updateAttachment = function () {
    if ($("#valueUpdateUrlAttachment").val() == "") {
      toastr.error("Nội dung của link không được để trống !", "Thông báo!", {
        closeButton: true,
        progressBar: true,
        positionClass: "toast-top-center",
      });
      return;
    }

    if ($("#valueUpdateUrlAttachment").val().length > 1000) {
      toastr.error(
        "Nội dung của link không vượt quá 1000 ký tự !",
        "Thông báo!",
        {
          closeButton: true,
          progressBar: true,
          positionClass: "toast-top-center",
        }
      );
      return;
    }

    if (
      $("#valueUpdateNameAttachment").val() != null &&
      $("#valueUpdateNameAttachment").val() != "" &&
      $("#valueUpdateNameAttachment").val().length > 100
    ) {
      toastr.error("Tên link không vượt quá 100 ký tự !", "Thông báo!", {
        closeButton: true,
        progressBar: true,
        positionClass: "toast-top-center",
      });
      return;
    }
    let obj = {
      id: $scope.idUpdateAttachment,
      name: $("#valueUpdateNameAttachment").val(),
      url: $("#valueUpdateUrlAttachment").val(),
      idTodo: $scope.idTodo,
      idTodoList: $scope.idTodoList,
    };

    stompClient.send(
      "/action/update-resource/" +
        $scope.projectId +
        "/" +
        $routeParams.idPeriod,
      {},
      JSON.stringify(obj)
    );

    $scope.showDialogUpdateAttachment = false;
  };

  $scope.actionReloadDataUpdateResource = function (message) {
    let obj = JSON.parse(message.body).data.data;
    let idTodo = JSON.parse(message.body).data.idTodo;
    let idTodoList = JSON.parse(message.body).data.idTodoList;

    if ($scope.detailTodo.id != null && $scope.detailTodo.id == idTodo) {
      $scope.listResource.forEach((item) => {
        if (item.id == obj.id) {
          item.name = obj.name;
          item.url = obj.url;
        }
      });
    }

    $scope.$apply();
  };

  $scope.showDialogConfirmDeleteResource = false;

  $scope.openDialogConfirmDeleteResource = function (event, id, url, name) {
    event.stopPropagation();
    $scope.showDialogAddLabelOut = false;
    $scope.showDialogAddLabel = false;
    $scope.showDialogAddPriorityLevel = false;
    $scope.showDialogConfirmDeleteResource = false;
    if (!$scope.showDialogConfirmDeleteResource) {
      $scope.showDialogConfirmDeleteResource = true;
    } else {
      $scope.showDialogConfirmDeleteResource = false;
    }

    $scope.idResourceDelete = id;
    $scope.urlResourceDelete = url;
    $scope.nameResourceDelete = name;

    $scope.dialogStyleConfirmDeleteResource = {
      top: event.clientY + "px",
      left: event.clientX + "px",
    };

    $scope.clickOutPopupConfirmDeleteResource();
  };

  $scope.clickOutPopupConfirmDeleteResource = function () {
    document.addEventListener(
      "click",
      function (event) {
        if (
          !document
            .querySelector(".dialogConfirmDeleteResource")
            .contains(event.target)
        ) {
          $scope.$apply(function () {
            $scope.closeDialogConfirmDeleteResource();
          });
        } else {
          $scope.clickOutPopupConfirmDeleteResource();
        }
      },
      { once: true }
    );
  };

  $scope.closeDialogConfirmDeleteResource = function () {
    $scope.showDialogConfirmDeleteResource = false;
  };

  $scope.deleteResource = function () {
    let obj = {
      id: $scope.idResourceDelete,
      url: $scope.urlResourceDelete,
      name: $scope.nameResourceDelete,
      idTodo: $scope.idTodo,
      idTodoList: $scope.idTodoList,
      projectId: $scope.projectId,
      idUser: $scope.idUser,
    };

    stompClient.send(
      "/action/delete-resource/" +
        $scope.projectId +
        "/" +
        $routeParams.idPeriod,
      {},
      JSON.stringify(obj)
    );

    $scope.showDialogConfirmDeleteResource = false;
  };

  $scope.actionReloadDataDeleteResource = function (message) {
    let idResource = JSON.parse(message.body).data.data;
    let objActivity = JSON.parse(message.body).data.dataActivity;
    let idTodo = JSON.parse(message.body).data.idTodo;
    let idTodoList = JSON.parse(message.body).data.idTodoList;

    if ($scope.detailTodo.id != null && $scope.detailTodo.id == idTodo) {
      $scope.listResource.forEach((item) => {
        if (item.id == idResource) {
          $scope.listResource.splice($scope.listResource.indexOf(item), 1);
        }
      });
    }

    if (
      $scope.detailTodo.id != null &&
      $scope.showDetailActivityTrueFalse &&
      objActivity != null &&
      $scope.detailTodo.id == idTodo
    ) {
      $scope.convertObjectActivity(objActivity);
    }

    $scope.$apply();
  };
};
