const labelComponent = {};

labelComponent.dialogAddLabel = function (
  $scope,
  MeLabelService,
  $routeParams,
  stompClient
) {
  $scope.showDialogAddLabel = false;

  $scope.openDialogAddLabel = function (event) {
    $scope.showDialogAddMemberOut = false;
    $scope.showDialogAddAttachment = false;
    $scope.showDialogAddImage = false;
    $scope.showDialogAddMember = false;
    $scope.showDialogAddPriorityLevel = false;
    $scope.searchLabelDialog = "";
    event.stopPropagation();
    if (!$scope.showDialogAddLabel) {
      $scope.showDialogAddLabel = true;
    } else {
      $scope.showDialogAddLabel = false;
    }

    $scope.dialogStyleAddLabel = {
      top: event.clientY - 180 + "px",
      left: event.clientX + "px",
    };

    MeLabelService.fetchLabels($scope.projectId).then(function () {
      $scope.listLabel = MeLabelService.getAllLabels();

      $scope.listLabel.forEach((lbAll) => {
        let label = $scope.detailTodo.listLabelDetailTodo.find(
          (lbDetail) => lbAll.id === lbDetail.id
        );
        if (label != null) {
          lbAll.checkLabel = true;
        } else {
          lbAll.checkLabel = false;
        }
      });
    });

    $scope.clickOutPopupAddLabel();
  };

  $scope.clickOutPopupAddLabel = function () {
    document.addEventListener(
      "click",
      function (event) {
        if (!document.querySelector(".dialogAddLabel").contains(event.target)) {
          $scope.$apply(function () {
            $scope.closeDialogAddLabel();
          });
        } else {
          $scope.clickOutPopupAddLabel();
        }
      },
      { once: true }
    );
  };

  $scope.closeDialogAddLabel = function () {
    $scope.showDialogAddLabel = false;
  };

  $scope.showDialogCreateLabel = false;

  $scope.openDialogCreateLabel = function (event) {
    $scope.colorLabelCreate = "#FA8072";
    $scope.showDialogAddMemberOut = false;
    $scope.showDialogAddAttachment = false;
    $scope.showDialogAddImage = false;
    $scope.showDialogAddLabel = false;
    $scope.showDialogAddMember = false;
    $scope.showDialogAddPriorityLevel = false;
    $scope.nameLabelCreate = "";
    event.stopPropagation();
    if (!$scope.showDialogCreateLabel) {
      $scope.showDialogCreateLabel = true;
    } else {
      $scope.showDialogCreateLabel = false;
    }

    $scope.clickOutPopupCreateLabel();
  };

  $scope.clickOutPopupCreateLabel = function () {
    document.addEventListener(
      "click",
      function (event) {
        if (
          !document.querySelector(".dialogCreateLabel").contains(event.target)
        ) {
          $scope.$apply(function () {
            $scope.closeDialogCreateLabel();
          });
        } else {
          $scope.clickOutPopupCreateLabel();
        }
      },
      { once: true }
    );
  };

  $scope.closeDialogCreateLabel = function () {
    $scope.showDialogCreateLabel = false;
  };

  $scope.showDialogCreateLabelViewTable = false;

  $scope.openDialogCreateLabelViewTable = function (event) {
    $scope.colorLabelCreate = "#FA8072";
    $scope.showDialogAddMemberOut = false;
    $scope.showDialogAddAttachment = false;
    $scope.showDialogAddImage = false;
    $scope.showDialogAddLabel = false;
    $scope.showDialogAddMember = false;
    $scope.showDialogAddPriorityLevel = false;
    $scope.nameLabelCreate = "";
    event.stopPropagation();
    if (!$scope.showDialogCreateLabelViewTable) {
      $scope.showDialogCreateLabelViewTable = true;
    } else {
      $scope.showDialogCreateLabelViewTable = false;
    }

    document.querySelector(".dialogCreateLabelViewTable").style.left = "48%";
    document.querySelector(".dialogCreateLabelViewTable").style.top = "100px";

    $scope.closeDialogAddLabelViewTable();
    $scope.clickOutPopupCreateLabelViewTable();
  };

  $scope.clickOutPopupCreateLabelViewTable = function () {
    document.addEventListener(
      "click",
      function (event) {
        if (
          !document
            .querySelector(".dialogCreateLabelViewTable")
            .contains(event.target)
        ) {
          $scope.$apply(function () {
            $scope.closeDialogCreateLabelViewTable();
          });
        } else {
          $scope.clickOutPopupCreateLabelViewTable();
        }
      },
      { once: true }
    );
  };

  $scope.closeDialogCreateLabelViewTable = function () {
    $scope.showDialogCreateLabelViewTable = false;
  };

  $scope.showDialogAddLabelViewTable = false;

  $scope.openDialogAddLabelViewTable = function (event) {
    $scope.showDialogAddMemberOut = false;
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

    $scope.dialogStyleAddLabelViewTable = {
      top: event.clientY + "px",
      left: event.clientX + "px",
    };

    MeLabelService.fetchLabels($scope.projectId).then(function () {
      $scope.listLabel = MeLabelService.getAllLabels();

      $scope.listLabel.forEach((lbAll) => {
        let label = $scope.detailTodo.listLabelDetailTodo.find(
          (lbDetail) => lbAll.id === lbDetail.id
        );
        if (label != null) {
          lbAll.checkLabel = true;
        } else {
          lbAll.checkLabel = false;
        }
      });
    });

    $scope.clickOutPopupAddLabelViewTable();
  };

  $scope.clickOutPopupAddLabelViewTable = function () {
    document.addEventListener(
      "click",
      function (event) {
        if (
          !document
            .querySelector(".dialogAddLabelViewTable")
            .contains(event.target)
        ) {
          $scope.$apply(function () {
            $scope.closeDialogAddLabelViewTable();
          });
        }
      },
      { once: true }
    );
  };

  $scope.closeDialogAddLabelViewTable = function () {
    $scope.showDialogAddLabelViewTable = false;
  };

  $scope.backDialogAddLabel = function (event) {
    $scope.openDialogAddLabel(event);
    $scope.showDialogCreateLabel = false;
    $scope.showDialogUpdateLabel = false;
  };

  $scope.backDialogAddLabelViewTalbe = function (event) {
    $scope.openDialogAddLabelViewTalbe(event);
    $scope.showDialogCreateLabelViewTalbe = false;
    $scope.showDialogUpdateLabelViewTalbe = false;
  };

  $scope.createLabel = function () {
    let obj = {
      name: $scope.nameLabelCreate,
      color: $scope.colorLabelCreate,
      projectId: $scope.projectId,
    };

    if ($scope.nameLabelCreate == "") {
      toastr.error("Tên nhãn không được để trống !", "Thông báo!", {
        closeButton: true,
        progressBar: true,
        positionClass: "toast-top-center",
      });
      return;
    }

    stompClient.send(
      "/action/create-label/" + $scope.projectId,
      {},
      JSON.stringify(obj)
    );

    $scope.nameLabelCreate = "";
    $scope.colorLabelCreate = "#FA8072";
  };

  $scope.actionReloadDataCreateLabel = function (message) {
    let obj = JSON.parse(message.body).data;
    let newObj = {
      id: obj.id,
      code: obj.code,
      name: obj.name,
      colorLabel: obj.colorLabel,
    };

    if ($scope.listLabel != null && $scope.listLabel.length > 0) {
      $scope.listLabel.unshift(newObj);
    }
    if ($scope.listLabelFilter != null && $scope.listLabelFilter.length > 0) {
      $scope.listLabelFilter.unshift(newObj);
    }

    $scope.$apply();
  };

  // Update

  $scope.showDialogUpdateLabel = false;

  $scope.openDialogUpdateLabel = function (event, id, name, color) {
    $scope.showDialogAddMemberOut = false;
    $scope.showDialogAddAttachment = false;
    $scope.showDialogAddImage = false;
    $scope.showDialogAddLabel = false;
    $scope.showDialogAddMember = false;
    $scope.showDialogAddPriorityLevel = false;
    $scope.nameLabelCreate = "";
    event.stopPropagation();
    if (!$scope.showDialogUpdateLabel) {
      $scope.showDialogUpdateLabel = true;
    } else {
      $scope.showDialogUpdateLabel = false;
    }

    $scope.idLabelUpdate = id;
    $scope.nameLabelUpdate = name;
    $scope.colorLabelUpdate = color;

    $scope.clickOutPopupUpdateLabel();
  };

  $scope.clickOutPopupUpdateLabel = function () {
    document.addEventListener(
      "click",
      function (event) {
        if (
          !document.querySelector(".dialogUpdateLabel").contains(event.target)
        ) {
          $scope.$apply(function () {
            $scope.closeDialogUpdateLabel();
          });
        } else {
          $scope.clickOutPopupUpdateLabel();
        }
      },
      { once: true }
    );
  };

  $scope.closeDialogUpdateLabelViewTable = function () {
    $scope.showDialogUpdateLabelViewTable = false;
  };

  $scope.showDialogUpdateLabelViewTable = false;

  $scope.openDialogUpdateLabelViewTable = function (event, id, name, color) {
    $scope.showDialogAddMemberOut = false;
    $scope.showDialogAddAttachment = false;
    $scope.showDialogAddImage = false;
    $scope.showDialogAddLabel = false;
    $scope.showDialogAddMember = false;
    $scope.showDialogAddPriorityLevel = false;
    $scope.nameLabelCreate = "";
    event.stopPropagation();
    if (!$scope.showDialogUpdateLabelViewTable) {
      $scope.showDialogUpdateLabelViewTable = true;
    } else {
      $scope.showDialogUpdateLabelViewTable = false;
    }

    document.querySelector(".dialogUpdateLabelViewTable").style.left = "48%";
    document.querySelector(".dialogUpdateLabelViewTable").style.top = "100px";
    $scope.idLabelUpdate = id;
    $scope.nameLabelUpdate = name;
    $scope.colorLabelUpdate = color;
    $scope.closeDialogAddLabelViewTable();
    $scope.clickOutPopupUpdateLabelViewTable();
  };

  $scope.clickOutPopupUpdateLabelViewTable = function () {
    document.addEventListener(
      "click",
      function (event) {
        if (
          !document
            .querySelector(".dialogUpdateLabelViewTable")
            .contains(event.target)
        ) {
          $scope.$apply(function () {
            $scope.closeDialogUpdateLabelViewTable();
          });
        } else {
          $scope.clickOutPopupUpdateLabelViewTable();
        }
      },
      { once: true }
    );
  };

  $scope.closeDialogUpdateLabelViewTable = function () {
    $scope.showDialogUpdateLabelViewTable = false;
  };

  $scope.closeDialogUpdateLabel = function () {
    $scope.showDialogUpdateLabel = false;
  };

  $scope.updateLabel = function () {
    let obj = {
      id: $scope.idLabelUpdate,
      name: $scope.nameLabelUpdate,
      color: $scope.colorLabelUpdate,
    };
    if ($scope.nameLabelUpdate == "") {
      toastr.error("Tên nhãn không được để trống !", "Thông báo!", {
        closeButton: true,
        progressBar: true,
        positionClass: "toast-top-center",
      });
      return;
    }

    stompClient.send(
      "/action/update-label/" + $scope.projectId,
      {},
      JSON.stringify(obj)
    );
  };

  $scope.actionReloadDataUpdateLabel = function (message) {
    const { id, code, name, colorLabel } = JSON.parse(message.body).data;

    $scope.listTask.forEach((lt) => {
      lt.todoList.forEach((td) => {
        const labelToUpdate = td.labels.find((lb) => lb.id === id);
        if (labelToUpdate) {
          Object.assign(labelToUpdate, { id, code, name, colorLabel });
        }
      });
    });

    if ($scope.listLabelFilter != null && $scope.listLabelFilter.length > 0) {
      $scope.listLabelFilter.forEach((item) => {
        if (item.id == id) {
          item.id = id;
          item.code = code;
          item.name = name;
          item.colorLabel = colorLabel;
        }
      });
    }

    if ($scope.detailTodo.id != null) {
      const labelInDetail = $scope.detailTodo.listLabelDetailTodo.some(
        (item) => {
          if (item.id === id) {
            Object.assign(item, { id, code, name, colorLabel });
            return true;
          }
          return false;
        }
      );

      if (labelInDetail) {
        $scope.$apply();
      }
    } else {
      $scope.$apply();
    }
  };

  $scope.showDialogConfirmDeleteLabel = false;

  $scope.openDialogConfirmDeleteLabel = function (event, id) {
    event.stopPropagation();
    $scope.showDialogAddPriorityLevel = false;
    $scope.showDialogConfirmDeleteLabel = false;

    if (!$scope.showDialogConfirmDeleteLabel) {
      $scope.showDialogConfirmDeleteLabel = true;
    } else {
      $scope.showDialogConfirmDeleteLabel = false;
    }

    $scope.idLabelDelete = id;

    $scope.dialogStyleConfirmDeleteLabel = {
      top: event.clientY + "px",
      left: event.clientX - 130 + "px",
    };

    $scope.clickOutPopupConfirmDeleteLabel();
  };

  $scope.clickOutPopupConfirmDeleteLabel = function () {
    document.addEventListener(
      "click",
      function (event) {
        if (
          !document
            .querySelector(".dialogConfirmDeleteLabel")
            .contains(event.target)
        ) {
          $scope.$apply(function () {
            $scope.closeDialogConfirmDeleteLabel();
          });
        } else {
          $scope.clickOutPopupConfirmDeleteLabel();
        }
      },
      { once: true }
    );
  };

  $scope.closeDialogConfirmDeleteLabel = function () {
    $scope.showDialogConfirmDeleteLabel = false;
  };

  $scope.showDialogConfirmDeleteLabelViewTable = false;

  $scope.openDialogConfirmDeleteLabelViewTable = function (event, id) {
    event.stopPropagation();
    $scope.showDialogAddPriorityLevel = false;
    $scope.showDialogConfirmDeleteLabelViewTable = false;

    if (!$scope.showDialogConfirmDeleteLabelViewTable) {
      $scope.showDialogConfirmDeleteLabelViewTable = true;
    } else {
      $scope.showDialogConfirmDeleteLabelViewTable = false;
    }

    $scope.idLabelDelete = id;

    $scope.dialogStyleConfirmDeleteLabelViewTable = {
      top: event.clientY + "px",
      left: event.clientX - 130 + "px",
    };

    $scope.clickOutPopupConfirmDeleteLabelViewTable();
  };

  $scope.clickOutPopupConfirmDeleteLabelViewTable = function () {
    document.addEventListener(
      "click",
      function (event) {
        if (
          !document
            .querySelector(".dialogConfirmDeleteLabelViewTable")
            .contains(event.target)
        ) {
          $scope.$apply(function () {
            $scope.closeDialogConfirmDeleteLabelViewTable();
          });
        } else {
          $scope.clickOutPopupConfirmDeleteLabelViewTable();
        }
      },
      { once: true }
    );
  };

  $scope.closeDialogConfirmDeleteLabelViewTable = function () {
    $scope.showDialogConfirmDeleteLabelViewTable = false;
  };

  $scope.deleteLabel = function () {
    let obj = {
      id: $scope.idLabelDelete,
      projectId: $scope.projectId,
    };

    stompClient.send(
      "/action/delete-label/" + $scope.projectId,
      {},
      JSON.stringify(obj)
    );
    $scope.showDialogConfirmDeleteLabel = false;
    $scope.showDialogConfirmDeleteLabelViewTable = false;
  };

  $scope.actionReloadDataDeleteLabel = function (message) {
    let id = JSON.parse(message.body).data;

    $scope.listTask.forEach((lt) => {
      lt.todoList.forEach((td) => {
        td.labels.forEach((lb) => {
          if (lb.id == id) {
            td.labels.splice(td.labels.indexOf(lb), 1);
          }
        });
      });
    });

    if ($scope.listLabelFilter != null && $scope.listLabelFilter.length > 0) {
      $scope.detailTodo.listLabelFilter.forEach((item) => {
        if (item.id == id) {
          $scope.detailTodo.listLabelFilter.splice(
            $scope.detailTodo.listLabelFilter.indexOf(item),
            1
          );
        }
      });
    }

    if ($scope.detailTodo.id != null) {
      $scope.detailTodo.listLabelDetailTodo.forEach((item) => {
        if (item.id == id) {
          $scope.detailTodo.listLabelDetailTodo.splice(
            $scope.detailTodo.listLabelDetailTodo.indexOf(item),
            1
          );
        }
      });
    }

    $scope.$apply();
  };
};

labelComponent.createAndDeleteLabel = function (
  $scope,
  $routeParams,
  stompClient
) {
  $scope.createLabelTodo = _.debounce(function (idLabel, idTodoCreate) {
    let headers = {
      idLabel: idLabel,
      idTodoCreateOrDelete: idTodoCreate,
      idTodoList: $scope.idTodoList,
      idTodo: $scope.idTodo,
    };
    let periodCurrentId = $routeParams.idPeriod;
    stompClient.send(
      "/action/create-label-todo" +
        "/" +
        $scope.projectId +
        "/" +
        periodCurrentId,
      {},
      JSON.stringify(headers)
    );
  }, 500);

  $scope.deleteLabelTodo = _.debounce(function (idLabel, idTodoDelete) {
    let headers = {
      idLabel: idLabel,
      idTodoCreateOrDelete: idTodoDelete,
      idTodoList: $scope.idTodoList,
      idTodo: $scope.idTodo,
    };
    let periodCurrentId = $routeParams.idPeriod;
    stompClient.send(
      "/action/delete-label-todo" +
        "/" +
        $scope.projectId +
        "/" +
        periodCurrentId,
      {},
      JSON.stringify(headers)
    );
  }, 500);

  $scope.changeCheckboxLabel = function (idLabel, idTodo, checkLabel) {
    if (checkLabel) {
      $scope.deleteLabelTodo(idLabel, idTodo);
    } else {
      $scope.createLabelTodo(idLabel, idTodo);
    }
  };
};

labelComponent.actionReloadLabelTodo = function (
  $scope,
  MeLabelService,
  MeFindTodoById
) {
  $scope.actionReloadDataLabel = async function (id, idTodoList, idTodo) {
    try {
      await MeLabelService.fetchLabels($scope.projectId);
      await MeLabelService.fetchLabel(id);

      if ($scope.detailTodo.id != null && $scope.detailTodo.id == idTodo) {
        $scope.detailTodo.listLabelDetailTodo = MeLabelService.getLabels();

        $scope.listLabel = MeLabelService.getAllLabels();

        $scope.listLabel.forEach((lbAll) => {
          let label = $scope.detailTodo.listLabelDetailTodo.find(
            (lbDetail) => lbAll.id === lbDetail.id
          );
          if (label != null) {
            lbAll.checkLabel = true;
          } else {
            lbAll.checkLabel = false;
          }
        });
      }

      $scope.todoFindById = $scope.findTodoById(idTodoList, idTodo);

      if ($scope.todoFindById != null) {
        $scope.todoFindById.labels = MeLabelService.getLabels();
      } else {
        await MeFindTodoById.fetchTodo(idTodo);
        $scope.todoFindById = MeFindTodoById.getTodo();
      }

      $scope.loadDataAfterFilter(idTodoList, idTodo);

      if ($scope.idTodoAssign == idTodo) {
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
      }

      $scope.$apply();
      $scope.clickOutPopupAddLabel();
    } catch (error) {
      console.log(error);
    }
  };

  $scope.showDialogNote = false;

  $scope.openDialogNote = function (event) {
    event.stopPropagation();
    $scope.showDialogAddPriorityLevel = false;
    $scope.showDialogNote = false;

    if (!$scope.showDialogNote) {
      $scope.showDialogNote = true;
    } else {
      $scope.showDialogNote = false;
    }

    $scope.dialogStyleNote = {
      top: event.clientY + "px",
      left: event.clientX - 130 + "px",
    };

    $scope.clickOutPopupNote();
  };

  $scope.clickOutPopupNote = function () {
    document.addEventListener(
      "click",
      function (event) {
        if (!document.querySelector(".dialogNote").contains(event.target)) {
          $scope.$apply(function () {
            $scope.closeDialogNote();
          });
        } else {
          $scope.clickOutPopupNote();
        }
      },
      { once: true }
    );
  };

  $scope.closeDialogNote = function () {
    $scope.showDialogNote = false;
  };
};
