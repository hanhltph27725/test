const todoComponent = {};

todoComponent.loadDataTodo = function (
  $scope,
  idPeriod,
  MeTodoService,
  MeAssignService,
  MeLabelService,
  ConvertLongToDateString
) {
  $scope.listTask.forEach((item) => {
    item.todoList = [];
    item.checkShowAddCard = false;
  });

  $scope.listTodoViewTable = [];

  Promise.all(
    $scope.listTask.map((item) => {
      return MeTodoService.fetchTodo(idPeriod, item.id).then(function () {
        item.todoList = MeTodoService.getTodo();
        if (item.todoList != []) {
          const assignPromises = item.todoList.map((td) => {
            if (td.numberTodo != 0) {
              td.progressOfTodo = parseInt(
                (td.numberTodoComplete / td.numberTodo) * 100
              );
            } else {
              td.progressOfTodo = td.progress;
            }
            if (td.deadline != null) {
              ConvertLongToDateString.setMonthDay(td.deadline);
              td.deadlineString = ConvertLongToDateString.getMonthDay();
            }
            return MeAssignService.fetchMember(td.id).then(function () {
              td.members = [];
              const idMembers = MeAssignService.getMembers();
              idMembers.forEach((meId) => {
                const member = $scope.listMemberById.find(
                  (me) => meId === me.id
                );
                if (member) {
                  td.members.push(member);
                }
              });

              td.objTodoList = {
                id: item.id,
                name: item.name,
                code: item.code,
                indexTodoList: item.indexTodoList,
                checkShowAddCard: item.checkShowAddCard,
              };
              td.objTodoListSelect = {
                id: item.id,
                name: item.name,
              };

              td.listTodoList = [];

              $scope.listTodoViewTable.unshift(td);
              $scope.sortTodoByTodoListAndTodo();
            });
          });

          const labelPromises = item.todoList.map((td) => {
            return MeLabelService.fetchLabel(td.id).then(function () {
              td.labels = MeLabelService.getLabels();
            });
          });

          return Promise.all([...assignPromises, ...labelPromises]);
        }
      });
    })
  );
};

todoComponent.dragAndDropTodo = function (
  $scope,
  $routeParams,
  stompClient,
  MeTodoTodoListHelper,
  ConvertLongToDateString
) {
  $scope.sortTodoByTodoListAndTodo = function () {
    $scope.listTodoViewTable.sort((a, b) => {
      if (a.objTodoList === null && b.objTodoList === null) return 0;
      if (a.objTodoList === null) return 1;
      if (b.objTodoList === null) return -1;

      if (a.objTodoList.indexTodoList !== b.objTodoList.indexTodoList) {
        return a.objTodoList.indexTodoList - b.objTodoList.indexTodoList;
      } else {
        return a.indexTodo - b.indexTodo;
      }
    });
  };

  $scope.selected = null;
  $scope.fromList = null;
  $scope.taskEnd = null;

  $scope.onDrop = function (event, index, item, external, type, xx) {
    console.log("Item", item, "dropped into", xx);

    $scope.itemDrag = item;
    $scope.taskEnd = xx;
    $scope.indexItemEnd = index;

    document.querySelectorAll(".card-body").forEach((item) => {
      item.style.overflowY = "auto";
    });
    $scope.checkScroll = false;
  };

  const container = document.querySelector(".container-custom-trello");

  container.addEventListener("scroll", function () {
    if (container.scrollLeft > 0 && $scope.checkScroll == true) {
      $scope.isHorizontalScrolling = true;
      document.querySelectorAll(".card-body").forEach((item) => {
        item.style.overflowY = "hidden";
      });
    }
  });

  $scope.onDragStart = function (event, index, list) {
    $scope.indexFirst = index;
    $scope.fromList = list;
    $scope.checkScroll = true;

    const mousePositionX = event.clientX;
    const screenWidth = window.innerWidth;
    const threshold = 10; // Giá trị ngưỡng tùy chọn để xác định khi nào chuột ở sát rìa màn hình

    if (mousePositionX <= threshold) {
      console.log("Con chuột ở sát rìa màn hình bên trái");
      // Ẩn thanh scroll bên trái tại đây
    } else if (mousePositionX >= screenWidth - threshold) {
      console.log("Con chuột ở sát rìa màn hình bên phải");
      // Ẩn thanh scroll bên phải tại đây
    } else {
      // Hiển thị thanh scroll bên trái và phải tại đây
    }
  };

  $scope.onDragEnd = function (item, xx, event, index) {
    $scope.itemEnd = xx;
    if (xx.id == $scope.taskEnd.id && index == $scope.indexItemEnd - 1) {
      return;
    }
    let obj = {
      idTodo: item.id,
      idTodoListOld: xx.id,
      nameTodoListOld: xx.name,
      idTodoListNew: $scope.taskEnd.id,
      nameTodoListNew: $scope.taskEnd.name,
      indexBefore: index,
      indexAfter: $scope.indexItemEnd,
      periodId: $scope.periodCurrentId,
      projectId: $scope.projectId,
      idUser: $scope.idUser,
    };
    // alert(obj.indexBefore + " / " + obj.indexAfter);

    stompClient.send(
      "/action/update-index-todo" +
        "/" +
        $scope.projectId +
        "/" +
        $routeParams.idPeriod,
      {},
      JSON.stringify(obj)
    );
  };

  $scope.actionReloadUpdateIndexTodo = function (message) {
    let objTodo = JSON.parse(message.body).data.data;
    let objActivity = JSON.parse(message.body).data.dataActivity;
    let idTodoListOld = JSON.parse(message.body).data.idTodoListOld;
    let indexBefore = JSON.parse(message.body).data.indexBefore;
    let indexAfter = JSON.parse(message.body).data.indexAfter;

    $scope.todoListOldItem = MeTodoTodoListHelper.findTodoList(
      $scope.listTask,
      idTodoListOld
    );
    $scope.todoListNewItem = MeTodoTodoListHelper.findTodoList(
      $scope.listTask,
      objTodo.todoListId
    );
    let objDragAndDrop = MeTodoTodoListHelper.findTodo(
      $scope.todoListOldItem.todoList,
      objTodo.id
    );

    if (objDragAndDrop != null) {
      const indexItem = $scope.todoListOldItem.todoList.indexOf(objDragAndDrop);

      if (objTodo.todoListId == idTodoListOld) {
        if (indexAfter === -1 || indexItem === indexAfter) {
        } else {
          $scope.todoListOldItem.todoList.splice(indexItem, 1);
          $scope.todoListNewItem.todoList.splice(indexAfter, 0, objDragAndDrop);
        }
      } else {
        $scope.todoListOldItem.todoList.splice(indexItem, 1);
        $scope.todoListNewItem.todoList.splice(indexAfter, 0, objDragAndDrop);
        if (
          $scope.detailTodo.id != null &&
          $scope.detailTodo.id == objTodo.id
        ) {
          $scope.itemListTask = MeTodoTodoListHelper.findTodoList(
            $scope.listTask,
            objTodo.todoListId
          );
        }
      }
    }

    $scope.todoListNewItem.todoList.forEach((item, index) => {
      item.indexTodo = index;
    });

    if (objTodo.todoListId != idTodoListOld) {
      $scope.todoListOldItem.todoList.forEach((item, index) => {
        item.indexTodo = index;
      });
    }

    $scope.listTodoViewTable.forEach((item) => {
      if (item.id == objTodo.id) {
        let newObj = {
          id: $scope.todoListNewItem.id,
          name: $scope.todoListNewItem.name,
          code: $scope.todoListNewItem.code,
          indexTodoList: $scope.todoListNewItem.indexTodoList,
          checkShowAddCard: $scope.todoListNewItem.checkShowAddCard,
        };
        item.objTodoList = newObj;

        let newObjSelect = {
          id: $scope.todoListNewItem.id,
          name: $scope.todoListNewItem.name,
        };
        item.objTodoListSelect = newObjSelect;
      }
    });

    $scope.sortTodoByTodoListAndTodo();

    if (
      !(
        $scope.objFilter.label.length === 0 &&
        $scope.objFilter.member.length === 0
      )
    ) {
      $scope.todoListNewItem.todoList.sort((a, b) => a.indexTodo - b.indexTodo);
    }

    if (
      objActivity != null &&
      $scope.showDetailActivityTrueFalse &&
      $scope.detailTodo.id != null &&
      $scope.detailTodo.id == objTodo.id
    ) {
      $scope.convertObjectActivity(objActivity);
    }
    $scope.$apply();
  };
};

todoComponent.addCardTodo = function (
  $scope,
  $routeParams,
  stompClient,
  MeTodoTodoListHelper
) {
  $scope.addACard = function (value) {
    $scope.listTask.forEach((item) => {
      item.checkShowAddCard = false;
    });
    $scope.listTask[value].checkShowAddCard = true;
    document.querySelectorAll(".card-body").forEach((item) => {
      item.style.maxHeight = "calc(100vh - 215px)";
    });

    setTimeout(() => {
      document.querySelectorAll(".card-body")[value].scrollTop = 10000000000000;
      document.querySelectorAll(".card-body")[value].style.maxHeight =
        "calc(100vh - 183px)";
    }, 1);
  };

  $scope.nameTodoAdd = "";

  $scope.addNewCard = function (value, todoListId, nameTodoList) {
    let listTitle = document.querySelectorAll('[name="inputTitle"]');
    if (listTitle[value].value.trim() == "") {
      toastr.error("Tên tiêu đề không được để trống !", "Thông báo!", {
        closeButton: true,
        progressBar: true,
        positionClass: "toast-top-center",
      });
      listTitle[value].value = "";
      return;
    }
    if ($routeParams.idPeriod == null) {
      toastr.error("Hãy chọn giai đoạn để thêm đầu việc !", "Thông báo!", {
        closeButton: true,
        progressBar: true,
        positionClass: "toast-top-center",
      });
      return;
    }
    let obj = {
      name: listTitle[value].value,
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
    listTitle[value].value = "";
    $scope.listTask[value].checkShowAddCard = false;
    setTimeout(() => {
      document.querySelectorAll(".card-body")[value].scrollTop = 10000000000000;
      document.querySelectorAll(".card-body")[value].style.maxHeight =
        "calc(100vh - 215px)";
    }, 1);
  };

  $scope.closeAddNewCard = function (value) {
    $scope.listTask[value].checkShowAddCard = false;
    document.querySelectorAll(".card-body")[value].style.maxHeight =
      "calc(100vh - 215px)";
  };

  $scope.actionReloadCreateTodo = function (message) {
    let obj = JSON.parse(message.body).data;

    let objTodoNew = {
      id: obj.id,
      code: obj.code,
      name: obj.name,
      priorityLevel: obj.priorityLevel,
      descriptions: null,
      deadline: obj.deadline,
      indexTodo: obj.indexTodo,
      numberTodoComplete: 0,
      numberTodo: 0,
    };

    $scope.todoListFind = MeTodoTodoListHelper.findTodoList(
      $scope.listTask,
      obj.todoListId
    );

    $scope.todoListFind.todoList.push(objTodoNew);

    objTodoNew.objTodoList = {
      id: $scope.todoListFind.id,
      name: $scope.todoListFind.name,
      code: $scope.todoListFind.code,
      indexTodoList: $scope.todoListFind.indexTodoList,
      checkShowAddCard: $scope.todoListFind.checkShowAddCard,
    };
    objTodoNew.objTodoListSelect = {
      id: $scope.todoListFind.id,
      name: $scope.todoListFind.name,
    };

    objTodoNew.listTodoList = [];
    objTodoNew.members = [];
    objTodoNew.labels = [];

    $scope.listTodoViewTable.unshift(objTodoNew);
    $scope.sortTodoByTodoListAndTodo();

    $scope.$apply();
  };
};

let descriptions = "";

todoComponent.actionDetailTodo = function (
  $scope,
  $routeParams,
  $location,
  MeAssignService,
  MeLabelService,
  MeDetailTodoService,
  ConvertLongToDateString,
  stompClient,
  MeCommentService,
  MeImageService,
  MeResourceService
) {
  $scope.actionDetailTodo = function (event, id, itemListTask) {
    event.preventDefault();
    if (
      event.target.className != "deadline_show_todo ng-binding ng-scope" &&
      event.target.className != "form-check-input form-check-sm" &&
      event.target.className != "deadline_show_todo ng-binding" &&
      event.target.className != "bx bx-time" &&
      event.target.className != "complete_show_todo ng-binding ng-scope" &&
      event.target.className != "complete_show_todo ng-binding" &&
      event.target.className != "complete_late_show_todo ng-binding ng-scope" &&
      event.target.className != "complete_late_show_todo ng-binding" &&
      event.target.className != "bx bx-time" &&
      event.target.className != "rounded-circle" &&
      event.target.className != "checkbox_deadline_show" &&
      event.target.className !=
        "complete_late_show_todo ng-binding ng-scope ng-isolate-scope" &&
      event.target.className !=
        "complete_show_todo ng-binding ng-scope ng-isolate-scope" &&
      event.target.className !=
        "deadline_show_todo ng-binding ng-scope ng-isolate-scope"
    ) {
      // $scope.loadDetailTodo(id, itemListTask);
      $location.search("idTodo", id).replace();
      // $("#modal_show_detail_todo").modal("show");
    }
  };

  $scope.loadDetailTodo = function (id, itemListTask) {
    $scope.checkJoinTodo = true;
    $scope.showDetailActivityTrueFalse = false;
    $scope.listActivityByIdTodo = [];

    $scope.idTodo = id;
    $scope.idTodoList = itemListTask.id;
    $scope.showDialogShowMenu = false;
    $scope.itemListTask = itemListTask;
    $("#modal_show_detail_todo").modal("show");
    $scope.listMemberProject.forEach((item) => {
      if (item.id == $scope.idUser) {
        $scope.userCurrent = item;
      }
    });

    Promise.all([
      MeDetailTodoService.fetchTodo(id),
      MeAssignService.fetchMember(id),
      MeLabelService.fetchLabel(id),
      MeDetailTodoService.fetchDetailTodo(id),
      MeCommentService.fetchComments(id, 0),
      MeImageService.fetchImages(id),
      MeResourceService.fetchResources(id),
    ]).then(
      function () {
        $scope.detailTodo = MeDetailTodoService.getTodo();
        $scope.idTodoAssign = $scope.detailTodo.id;
        $scope.nameDetailTodoUpdate = $scope.detailTodo.name;
        document.title =
          $scope.detailTodo.name + " on " + $scope.detailProject.name;

        $scope.detailTodo.listMemberDetailTodo = $scope.listMemberById.filter(
          (member) => MeAssignService.getMembers().includes(member.id)
        );

        $scope.detailTodo.listMemberDetailTodo.forEach((item) => {
          if (item.id === $scope.idUser) {
            $scope.checkJoinTodo = false;
          }
        });

        $scope.detailTodo.listLabelDetailTodo = MeLabelService.getLabels();
        $scope.detailTodo.listTaskDetailTodo =
          MeDetailTodoService.getTodoDetail();

        $scope.detailTodo.listTaskDetailTodo.forEach((item) => {
          item.checkShowFormUpdateTodoInTask = false;
        });

        descriptions = $scope.detailTodo.descriptions;

        ConvertLongToDateString.setDateString($scope.detailTodo.deadline);
        $scope.detailTodo.convertDate = ConvertLongToDateString.getDateString();

        if ($scope.detailTodo.completionTime != null) {
          ConvertLongToDateString.setDateString(
            $scope.detailTodo.completionTime
          );
          $scope.detailTodo.convertDateComplete =
            ConvertLongToDateString.getDateString();

          $scope.valueComplete = true;
        } else {
          $scope.valueComplete = false;
        }

        let count = $scope.detailTodo.listTaskDetailTodo.filter(function (
          todo
        ) {
          return todo.statusTodo === 1;
        }).length;

        let progressValue = 0;

        if ($scope.detailTodo.listTaskDetailTodo.length > 0) {
          progressValue = parseInt(
            (count / $scope.detailTodo.listTaskDetailTodo.length) * 100
          );
          document.querySelector("#progressTodo").value = progressValue;
        }
        if (
          $scope.detailTodo.listTaskDetailTodo != null &&
          $scope.detailTodo.listTaskDetailTodo.length == 0
        ) {
          document.querySelector("#progressTodo").value =
            $scope.detailTodo.progress;
          $scope.valueChangeProgress = $scope.detailTodo.progress;
        }

        $scope.listCommentByIdTodo = MeCommentService.getComments();
        $scope.totalPagesComment = MeCommentService.getTotalPageComments();
        $scope.currentPageComment = 0;
        $scope.listCommentByIdTodo.forEach((item) => {
          let memberCreatedById = $scope.findMemberById(item.memberId);

          item.nameMember =
            memberCreatedById.name + " " + memberCreatedById.code;
          item.imageMember = memberCreatedById.image;

          ConvertLongToDateString.setDateYearString(item.createdDate);
          item.convertDate = ConvertLongToDateString.getDateYearString();
          item.showFormEditComment = false;
        });

        $scope.listImageDetailTodo = MeImageService.getImages();

        $scope.listImageDetailTodo.forEach((item) => {
          ConvertLongToDateString.setDateYearString(item.createdDate);
          item.convertDate = ConvertLongToDateString.getDateYearString();
        });

        $scope.listResource = MeResourceService.getResources();
        $scope.listResource.forEach((item) => {
          ConvertLongToDateString.setDateYearString(item.createdDate);
          item.convertDate = ConvertLongToDateString.getDateYearString();
        });

        $scope.$apply();
      },
      function (error) {}
    );
  };

  $scope.updateNameDetailTodo = _.debounce(function () {
    if ($scope.nameDetailTodoUpdate == "") {
      toastr.error("Tên đầu việc không được để trống !", "Thông báo!", {
        closeButton: true,
        progressBar: true,
        positionClass: "toast-top-center",
      });
      return;
    }
    if ($scope.nameDetailTodoUpdate.length > 100) {
      toastr.error("Tên đầu việc không quá 100 kí tự !", "Thông báo!", {
        closeButton: true,
        progressBar: true,
        positionClass: "toast-top-center",
      });
      return;
    }
    let obj = {
      name: $scope.nameDetailTodoUpdate,
      idTodo: $scope.idTodo,
      idTodoList: $scope.idTodoList,
    };

    let periodCurrentId = $routeParams.idPeriod;
    stompClient.send(
      "/action/update-name-todo" +
        "/" +
        $scope.projectId +
        "/" +
        periodCurrentId,
      {},
      JSON.stringify(obj)
    );
  }, 500);

  $scope.actionReloadUpdateNameTodo = function (message) {
    console.log(message);
    let obj = JSON.parse(message.body).data.data;
    let idTodoList = JSON.parse(message.body).data.idTodoList;
    let idTodo = JSON.parse(message.body).data.idTodo;

    if ($scope.detailTodo.id != null && $scope.detailTodo.id == idTodo) {
      $scope.detailTodo.name = obj.name;
      $scope.nameDetailTodoUpdate = obj.name;
      document.title =
        $scope.detailTodo.name + " on " + $scope.detailProject.name;
    }

    $scope.todoFindById = $scope.findTodoById(idTodoList, idTodo);
    if ($scope.todoFindById != null) {
      $scope.todoFindById.name = obj.name;
    }

    $scope.$apply();
  };
};

todoComponent.saveDescriptionComponent = function (
  $scope,
  $routeParams,
  stompClient
) {
  $scope.myText = "";
  $scope.aaaaaaaaa = function () {
    console.log($scope.myText);
  };

  $scope.saveDescriptionsTodo = _.debounce(function () {
    const descriptionsNew = $scope.detailTodo.descriptions;
    console.log(descriptionsNew);
    if (descriptionsNew.length > 5000) {
      toastr.error("Mô tả tối đa 5000 ký tự !", "Thông báo!", {
        closeButton: true,
        progressBar: true,
        positionClass: "toast-top-center",
      });
      return;
    }
    if (descriptionsNew === descriptions) {
      return;
    }
    const lines = descriptionsNew.split("\n").filter((line, index, arr) => {
      const trimmedLine = line.trim();
      return index !== arr.length - 1 || trimmedLine !== "";
    });
    let obj = {
      idTodoUpdate: $scope.detailTodo.id,
      descriptions: lines.join("\n"),
      idTodoList: $scope.idTodoList,
      idTodo: $scope.idTodo,
    };
    let periodCurrentId = $routeParams.idPeriod;
    stompClient.send(
      "/action/update-descriptions-todo" +
        "/" +
        $scope.projectId +
        "/" +
        periodCurrentId,
      {},
      JSON.stringify(obj)
    );
  }, 300);

  $scope.actionReloadTodoDescriptions = function (message) {
    let obj = JSON.parse(message.body).data.data;
    let idTodoList = JSON.parse(message.body).data.idTodoList;
    let idTodo = JSON.parse(message.body).data.idTodo;
    if (
      $scope.detailTodo.id != null &&
      message != null &&
      $scope.detailTodo.id == idTodo
    ) {
      $scope.detailTodo.descriptions = obj.descriptions;
      descriptions = obj.descriptions;
    }

    $scope.findTodoById(idTodoList, idTodo).descriptions = obj.descriptions;

    $scope.$apply();
  };

  $scope.resetDescriptionsTodo = function () {
    $scope.detailTodo.descriptions = descriptions;
  };
};

todoComponent.resizeDescription = function ($scope) {};

todoComponent.dialogAddDeadline = function ($scope) {
  $scope.showDialogAddDeadline = false;

  $scope.openDialogAddDeadline = function (event) {
    event.stopPropagation();
    $scope.showDialogAddLabelOut = false;
    $scope.showDialogAddLabel = false;
    $scope.showDialogAddAttachment = false;
    $scope.showDialogAddImage = false;
    $scope.showDialogAddPriorityLevel = false;
    $scope.showDialogAddDeadline = false;
    if (!$scope.showDialogAddDeadline) {
      $scope.showDialogAddDeadline = true;
    } else {
      $scope.showDialogAddDeadline = false;
    }

    $scope.dialogStyleAddDeadline = {
      top: event.clientY - 250 + "px",
      left: event.clientX - 130 + "px",
    };

    if ($scope.detailTodo.deadline != null) {
      $scope.deadlineNew = new Date($scope.detailTodo.deadline);

      $scope.timeDeadline = new Date(
        $scope.deadlineNew.toLocaleDateString("en-CA") +
          ", " +
          $scope.deadlineNew.toLocaleTimeString()
      );

      if ($scope.detailTodo.reminderTime == null) {
        $scope.reminderValue = "none";
      } else {
        $scope.reminderValue =
          Number($scope.detailTodo.deadline - $scope.detailTodo.reminderTime) +
          "";
      }
    }
    $scope.clickOutPopupAddDeadline();
  };

  $scope.clickOutPopupAddDeadline = function () {
    document.addEventListener(
      "click",
      function (event) {
        if (
          !document.querySelector(".dialogAddDeadline").contains(event.target)
        ) {
          $scope.$apply(function () {
            $scope.closeDialogAddDeadline();
          });
        } else {
          $scope.clickOutPopupAddDeadline();
        }
      },
      { once: true }
    );
  };

  $scope.closeDialogAddDeadline = function () {
    $scope.showDialogAddDeadline = false;
  };
};

todoComponent.dialogAddPriorityLevel = function ($scope) {
  $scope.showDialogAddPriorityLevel = false;

  $scope.openDialogAddPriorityLevel = function (event) {
    event.stopPropagation();
    $scope.showDialogAddLabelOut = false;
    $scope.showDialogAddLabel = false;
    $scope.showDialogAddMember = false;
    $scope.showDialogAddMemberOut = false;
    $scope.showDialogAddDeadline = false;
    if (!$scope.showDialogAddPriorityLevel) {
      $scope.showDialogAddPriorityLevel = true;
    } else {
      $scope.showDialogAddPriorityLevel = false;
    }

    $scope.dialogStyleAddPriorityLevel = {
      top: event.clientY - 200 + "px",
      left: event.clientX - 130 + "px",
    };

    $scope.clickOutPopupAddPriorityLevel();
  };

  $scope.clickOutPopupAddPriorityLevel = function () {
    document.addEventListener(
      "click",
      function (event) {
        if (
          !document
            .querySelector(".dialogAddPriorityLevel")
            .contains(event.target)
        ) {
          $scope.$apply(function () {
            $scope.closeDialogAddPriorityLevel();
          });
        } else {
          $scope.clickOutPopupAddPriorityLevel();
        }
      },
      { once: true }
    );
  };

  $scope.closeDialogAddPriorityLevel = function () {
    $scope.showDialogAddPriorityLevel = false;
  };
};

todoComponent.actionAddPriorityLevel = function (
  $scope,
  $routeParams,
  stompClient,
  MeDetailTodoService
) {
  $scope.actionChangePriorityLevel = _.debounce(function (
    priorityLevel,
    idTodoChange
  ) {
    let obj = {
      idTodoChange: idTodoChange,
      priorityLevel: priorityLevel,
      idTodoList: $scope.idTodoList,
      idTodo: $scope.idTodo,
    };

    let periodCurrentId = $routeParams.idPeriod;
    stompClient.send(
      "/action/update-priority-todo" +
        "/" +
        $scope.projectId +
        "/" +
        periodCurrentId,
      {},
      JSON.stringify(obj)
    );
  },
  500);

  $scope.actionReloadDataPriorityTodo = function (id, idTodoList, idTodo) {
    Promise.all([MeDetailTodoService.fetchTodo(id)]).then(function () {
      if ($scope.detailTodo.id != null && $scope.detailTodo.id == idTodo) {
        $scope.detailTodo.priorityLevel =
          MeDetailTodoService.getTodo().priorityLevel;
      }
      let priorityLevel = MeDetailTodoService.getTodo().priorityLevel;

      $scope.findTodoById(idTodoList, idTodo).priorityLevel =
        priorityLevel == "QUAN_TRONG"
          ? 0
          : priorityLevel == "CAO"
          ? 1
          : priorityLevel == "TRUNG_BINH"
          ? 2
          : 3;

      $scope.$apply();
    });

    $scope.clickOutPopupAddPriorityLevel();
  };

  $scope.changeProgressUocLuong = _.debounce(function () {
    let obj = {
      id: $scope.idTodo,
      progress: $scope.valueChangeProgress,
      idTodo: $scope.idTodo,
      idTodoList: $scope.idTodoList,
      periodId: $routeParams.idPeriod,
    };

    stompClient.send(
      "/action/update-progress-todo" +
        "/" +
        $scope.projectId +
        "/" +
        $routeParams.idPeriod,
      {},
      JSON.stringify(obj)
    );
  }, 100);

  $scope.actionReloadDataChangeProgress = function (message) {
    let obj = JSON.parse(message.body).data.data;
    let idTodo = JSON.parse(message.body).data.idTodo;
    let idTodoList = JSON.parse(message.body).data.idTodoList;

    if ($scope.detailTodo.id != null && $scope.detailTodo.id == idTodo) {
      $scope.detailTodo.progress = obj.progress;
      document.querySelector("#progressTodo").value =
        $scope.detailTodo.progress;
    }

    $scope.todoFindById = $scope.findTodoById(idTodoList, idTodo);

    if ($scope.todoFindById != null) {
      $scope.todoFindById.progress = obj.progress;
      $scope.todoFindById.progressOfTodo = obj.progress;
    }
    $scope.$apply();
  };
};

todoComponent.actionSaveAndAddTodoInCheckList = function (
  $scope,
  $routeParams,
  $timeout,
  stompClient
) {
  $scope.valueAddTodoInChecklist = "";
  $scope.showAddTodoInList = false;

  $scope.closeAddTodoInCheckList = function () {
    $scope.showAddTodoInList = false;
    $scope.valueAddTodoInChecklist = "";
  };

  $scope.addNewTodoInCheckList = function (index, idTodoCreate) {
    if ($scope.valueAddTodoInChecklist.length == 0) {
      toastr.error("Tên đầu việc không được để trống !", "Thông báo!", {
        closeButton: true,
        progressBar: true,
        positionClass: "toast-top-center",
      });
    } else if ($scope.valueAddTodoInChecklist.length > 100) {
      toastr.error("Tên đầu việc không quá 100 kí tự !", "Thông báo!", {
        closeButton: true,
        progressBar: true,
        positionClass: "toast-top-center",
      });
    } else {
      let obj = {
        name: $scope.valueAddTodoInChecklist,
        idTodoCreateOrDelete: idTodoCreate,
        idTodoList: $scope.idTodoList,
        idTodo: $scope.idTodo,
        periodId: $routeParams.idPeriod,
      };
      let periodCurrentId = $routeParams.idPeriod;
      stompClient.send(
        "/action/create-todo-checklist" +
          "/" +
          $scope.projectId +
          "/" +
          periodCurrentId,
        {},
        JSON.stringify(obj)
      );
      $scope.valueAddTodoInChecklist = "";
      $scope.closeAddTodoInCheckList();
    }
  };

  $scope.showSaveTodoInCheckList = function (index, name, event) {
    if (
      !event.target.classList.contains("form-check-input") &&
      !event.target.classList.contains("div_remove_todo_in_checklist") &&
      !event.target.classList.contains("remove_todo_in_checklist")
    ) {
      $scope.detailTodo.listTaskDetailTodo.forEach((item) => {
        item.checkShowFormUpdateTodoInTask = false;
      });
      $scope.detailTodo.listTaskDetailTodo[
        index
      ].checkShowFormUpdateTodoInTask = true;
      $(".textarea_update_todo_in_task").eq(index).val(name);
    }
  };

  $scope.saveTodoInCheckList = function (index, id) {
    if ($(".textarea_update_todo_in_task").eq(index).val().length === 0) {
      toastr.error("Tên đầu việc không được để trống !", "Thông báo!", {
        closeButton: true,
        progressBar: true,
        positionClass: "toast-top-center",
      });
    } else if (
      $(".textarea_update_todo_in_task").eq(index).val().length > 100
    ) {
      toastr.error("Tên đầu việc tối đa 100 kí tự !", "Thông báo!", {
        closeButton: true,
        progressBar: true,
        positionClass: "toast-top-center",
      });
    } else {
      let obj = {
        name: $(".textarea_update_todo_in_task").eq(index).val(),
        idTodoCreateOrDelete: id,
        idTodo: $scope.idTodo,
        idTodoList: $scope.idTodoList,
      };
      let periodCurrentId = $routeParams.idPeriod;
      stompClient.send(
        "/action/update-todo-checklist" +
          "/" +
          $scope.projectId +
          "/" +
          periodCurrentId,
        {},
        JSON.stringify(obj)
      );
      $(".textarea_update_todo_in_task").eq(index).val("");
      $scope.closeSaveTodoInCheckList(index);
    }
  };

  $scope.closeSaveTodoInCheckList = function (index) {
    $timeout(function () {
      $scope.detailTodo.listTaskDetailTodo[
        index
      ].checkShowFormUpdateTodoInTask = false;
    });
  };

  $scope.actionReloadTodoInCheckList = function (message) {
    let obj = JSON.parse(message.body).data.data;
    let idTodoList = JSON.parse(message.body).data.idTodoList;
    let idTodo = JSON.parse(message.body).data.idTodo;
    let numberTodoComplete = JSON.parse(message.body).data.numberTodoComplete;
    let numberTodo = JSON.parse(message.body).data.numberTodo;

    if ($scope.detailTodo.id != null && $scope.detailTodo.id == idTodo) {
      let newTodo = {
        id: obj.id,
        code: obj.code,
        name: obj.name,
        statusTodo: obj.statusTodo == "CHUA_HOAN_THANH" ? 0 : 1,
        checkShowFormUpdateTodoInTask: false,
      };
      $scope.detailTodo.listTaskDetailTodo.unshift(newTodo);
      if (numberTodo > 0) {
        document.querySelector("#progressTodo").value = parseInt(
          (numberTodoComplete / numberTodo) * 100
        );
      } else {
        document.querySelector("#progressTodo").value = 0;
      }
    }

    $scope.todoFindUpdate = $scope.findTodoById(idTodoList, idTodo);

    $scope.todoFindUpdate.numberTodoComplete = numberTodoComplete;
    $scope.todoFindUpdate.numberTodo = numberTodo;
    $scope.todoFindUpdate.progressOfTodo = parseInt(
      (numberTodoComplete / numberTodo) * 100
    );

    $scope.$apply();
  };

  $scope.actionReloadSaveTodoInCheckList = function (message) {
    let obj = JSON.parse(message.body).data;
    if ($scope.detailTodo.id != null && $scope.detailTodo.id == obj.todoId) {
      $scope.detailTodo.listTaskDetailTodo.forEach((item) => {
        if (item.id == obj.id) {
          item.name = obj.name;
        }
      });
      $scope.$apply();
    }
  };
};

todoComponent.actionRemoveTodoInCheckList = function (
  $scope,
  $routeParams,
  stompClient
) {
  $scope.removeTodoInCheckList = function (id) {
    let obj = {
      id: id,
      todoId: $scope.detailTodo.id,
      idTodoList: $scope.idTodoList,
      idTodo: $scope.idTodo,
      periodId: $routeParams.idPeriod,
    };
    let periodCurrentId = $routeParams.idPeriod;
    stompClient.send(
      "/action/delete-todo-checklist" +
        "/" +
        $scope.projectId +
        "/" +
        periodCurrentId,
      {},
      JSON.stringify(obj)
    );
  };

  $scope.actionReloadTodoInCheckListDelete = function (message) {
    let id = JSON.parse(message.body).data.data;
    let idTodoList = JSON.parse(message.body).data.idTodoList;
    let idTodo = JSON.parse(message.body).data.idTodo;
    let numberTodoComplete = JSON.parse(message.body).data.numberTodoComplete;
    let numberTodo = JSON.parse(message.body).data.numberTodo;
    if ($scope.detailTodo.id != null && $scope.detailTodo.id == idTodo) {
      for (let i = 0; i < $scope.detailTodo.listTaskDetailTodo.length; i++) {
        if ($scope.detailTodo.listTaskDetailTodo[i].id === id) {
          $scope.detailTodo.listTaskDetailTodo.splice(i, 1);
          break;
        }
      }
      if (numberTodo > 0) {
        document.querySelector("#progressTodo").value = parseInt(
          (numberTodoComplete / numberTodo) * 100
        );
      } else {
        document.querySelector("#progressTodo").value = 0;
      }
    }
    $scope.todoFindUpdate = $scope.findTodoById(idTodoList, idTodo);
    $scope.todoFindUpdate.numberTodoComplete = numberTodoComplete;
    $scope.todoFindUpdate.numberTodo = numberTodo;
    $scope.todoFindUpdate.progressOfTodo = parseInt(
      (numberTodoComplete / numberTodo) * 100
    );
    $scope.$apply();
  };
};

todoComponent.changeProgressTodo = function (
  $scope,
  $routeParams,
  stompClient
) {
  $scope.changeProgressTodo = function (idTodoChange, statusTodo) {
    let obj = {
      idTodoChange: idTodoChange,
      statusTodo: statusTodo,
      periodId: $routeParams.idPeriod,
      todoId: $scope.detailTodo.id,
      idTodoList: $scope.idTodoList,
      idTodo: $scope.idTodo,
    };

    let periodCurrentId = $routeParams.idPeriod;
    stompClient.send(
      "/action/update-statustodo-todo-checklist" +
        "/" +
        $scope.projectId +
        "/" +
        periodCurrentId,
      {},
      JSON.stringify(obj)
    );
  };

  $scope.actionReloadTodoInCheckListByUpdateStatusTodo = function (message) {
    let obj = JSON.parse(message.body).data.data;
    let idTodoList = JSON.parse(message.body).data.idTodoList;
    let idTodo = JSON.parse(message.body).data.idTodo;
    let numberTodoComplete = JSON.parse(message.body).data.numberTodoComplete;
    let numberTodo = JSON.parse(message.body).data.numberTodo;
    if ($scope.detailTodo.id != null && $scope.detailTodo.id == idTodo) {
      $scope.detailTodo.listTaskDetailTodo.forEach((item) => {
        if (item.id == obj.id) {
          item.statusTodo = obj.statusTodo == "CHUA_HOAN_THANH" ? 0 : 1;
        }
      });
      if (numberTodo > 0) {
        document.querySelector("#progressTodo").value = parseInt(
          (numberTodoComplete / numberTodo) * 100
        );
      } else {
        document.querySelector("#progressTodo").value = 0;
      }
    }
    $scope.todoFindUpdate1 = $scope.findTodoById(idTodoList, idTodo);
    $scope.todoFindUpdate1.numberTodoComplete = numberTodoComplete;
    $scope.todoFindUpdate1.numberTodo = numberTodo;
    $scope.todoFindUpdate1.progressOfTodo = parseInt(
      (numberTodoComplete / numberTodo) * 100
    );

    $scope.$apply();
  };
};

todoComponent.actionSaveAndRemoveDueDate = function (
  $scope,
  $routeParams,
  stompClient,
  ConvertLongToDateString,
  MeFindTodoById
) {
  $scope.formatDateToString = function (timeString) {
    let timeStr = new Date(timeString);
    let yearTimeStr = timeStr.getFullYear();
    let monthTimeStr = String(timeStr.getMonth() + 1).padStart(2, "0");
    let dateTimeStr = String(timeStr.getDate()).padStart(2, "0");
    let hoursTimeStr = String(timeStr.getHours()).padStart(2, "0");
    let minutesTimeStr = String(timeStr.getMinutes()).padStart(2, "0");
    let secondsTimeStr = String(timeStr.getSeconds()).padStart(2, "0");

    return `${yearTimeStr}-${monthTimeStr}-${dateTimeStr} ${hoursTimeStr}:${minutesTimeStr}:${secondsTimeStr}`;
  };

  $scope.timeDeadline = "";
  $scope.reminderValue = "none";

  $scope.saveDueDate = function () {
    if ($scope.timeDeadline == null || $scope.timeDeadline === "") {
      toastr.error("Ngày hạn không được để trống !", "Thông báo!", {
        closeButton: true,
        progressBar: true,
        positionClass: "toast-top-center",
      });
    } else {
      let newFormatDeadline = $scope.formatDateToString($scope.timeDeadline);
      let obj = {
        idTodoUpdate: $scope.detailTodo.id,
        deadline: newFormatDeadline,
        reminder: $scope.reminderValue,
        idTodo: $scope.idTodo,
        idTodoList: $scope.idTodoList,
        projectId: $scope.projectId,
        idUser: $scope.idUser,
      };

      stompClient.send(
        "/action/update-deadline-todo" +
          "/" +
          $scope.projectId +
          "/" +
          $routeParams.idPeriod,
        {},
        JSON.stringify(obj)
      );
      $scope.showDialogAddDeadline = false;
    }
  };

  $scope.removeDueDate = function () {
    if ($scope.detailTodo.deadline == null) {
      toastr.error("Chưa có ngày hạn !", "Thông báo!", {
        closeButton: true,
        progressBar: true,
        positionClass: "toast-top-center",
      });
      return;
    }
    let obj = {
      idTodoDelete: $scope.detailTodo.id,
      idTodoList: $scope.idTodoList,
      idTodo: $scope.idTodo,
      projectId: $scope.projectId,
      idUser: $scope.idUser,
    };
    stompClient.send(
      "/action/delete-deadline-todo" +
        "/" +
        $scope.projectId +
        "/" +
        $routeParams.idPeriod,
      {},
      JSON.stringify(obj)
    );
  };

  $scope.actionReloadTodoDeadlineUpdate = async function (message) {
    let obj = JSON.parse(message.body).data.data;
    let objActivity = JSON.parse(message.body).data.dataActivity;
    let idTodoList = JSON.parse(message.body).data.idTodoList;
    let idTodo = JSON.parse(message.body).data.idTodo;
    if ($scope.detailTodo.id != null && $scope.detailTodo.id == idTodo) {
      ConvertLongToDateString.setDateString(obj.deadline);
      $scope.detailTodo.convertDate = ConvertLongToDateString.getDateString();
      $scope.detailTodo.deadline = obj.deadline;
    }

    $scope.todoFindById = $scope.findTodoById(idTodoList, idTodo);

    if ($scope.todoFindById != null) {
      $scope.todoFindById.deadline = obj.deadline;
      ConvertLongToDateString.setMonthDay(obj.deadline);
      $scope.todoFindById.deadlineString =
        ConvertLongToDateString.getMonthDay();
    } else {
      await MeFindTodoById.fetchTodo(idTodo);
      $scope.todoFindById = MeFindTodoById.getTodo();
    }

    $scope.loadDataAfterFilter(idTodoList, idTodo);

    if (
      $scope.detailTodo.id != null &&
      objActivity != null &&
      $scope.showDetailActivityTrueFalse &&
      $scope.detailTodo.id == idTodo
    ) {
      $scope.convertObjectActivity(objActivity);
    }
    $scope.$apply();
  };

  $scope.actionReloadTodoDeadlineDelete = async function (message) {
    let obj = JSON.parse(message.body).data.data;
    let objActivity = JSON.parse(message.body).data.dataActivity;
    let idTodoList = JSON.parse(message.body).data.idTodoList;
    let idTodo = JSON.parse(message.body).data.idTodo;
    if ($scope.detailTodo.id != null && $scope.detailTodo.id == idTodo) {
      $scope.detailTodo.convertDate = null;
      $scope.detailTodo.deadline = null;
      $scope.detailTodo.convertDateComplete = null;
      $scope.detailTodo.completionTime = null;
      $scope.valueComplete = false;
    }

    $scope.todoFindById = $scope.findTodoById(idTodoList, idTodo);

    if ($scope.todoFindById != null) {
      $scope.todoFindById.deadline = null;
      $scope.todoFindById.deadlineString = null;
      $scope.todoFindById.completionTime = null;
    } else {
      await MeFindTodoById.fetchTodo(idTodo);
      $scope.todoFindById = MeFindTodoById.getTodo();
    }

    $scope.loadDataAfterFilter(idTodoList, idTodo);

    if (
      $scope.detailTodo.id != null &&
      $scope.detailTodo.id == idTodo &&
      $scope.showDetailActivityTrueFalse &&
      objActivity != null
    ) {
      $scope.convertObjectActivity(objActivity);
    }
    $scope.$apply();
  };
};

todoComponent.actionUpdateCompleteTodo = function (
  $scope,
  $location,
  $routeParams,
  stompClient,
  ConvertLongToDateString,
  MeFindTodoById,
  MeTodoTodoListHelper
) {
  $scope.changeCompleteTodo = function () {
    let obj = {
      id: $scope.detailTodo.id,
      status: document.querySelector("#valueComplete").checked ? 0 : 1,
      idTodo: $scope.idTodo,
      idTodoList: $scope.idTodoList,
      projectId: $scope.projectId,
      periodId: $routeParams.idPeriod,
      idUser: $scope.idUser,
    };

    stompClient.send(
      "/action/update-complete-todo" +
        "/" +
        $scope.projectId +
        "/" +
        $routeParams.idPeriod,
      {},
      JSON.stringify(obj)
    );
  };

  $scope.changeCompleteTodoOut = function (status, id, idTodoList) {
    let obj = {
      id: id,
      status: status,
      idTodo: id,
      idTodoList: idTodoList,
      projectId: $scope.projectId,
      periodId: $routeParams.idPeriod,
      idUser: $scope.idUser,
    };

    stompClient.send(
      "/action/update-complete-todo" +
        "/" +
        $scope.projectId +
        "/" +
        $routeParams.idPeriod,
      {},
      JSON.stringify(obj)
    );
  };

  $scope.actionReloadDataUpdateCompleteTodo = async function (message) {
    let obj = JSON.parse(message.body).data.data;
    let objActivity = JSON.parse(message.body).data.dataActivity;
    let idTodo = JSON.parse(message.body).data.idTodo;
    let idTodoList = JSON.parse(message.body).data.idTodoList;

    if ($scope.detailTodo.id != null && $scope.detailTodo.id == idTodo) {
      $scope.detailTodo.completionTime = obj.completionTime;
      $scope.detailTodo.progress = obj.progress;
      document.querySelector("#progressTodo").value = obj.progress;
      if ($scope.detailTodo.completionTime != null) {
        ConvertLongToDateString.setDateString($scope.detailTodo.completionTime);
        $scope.detailTodo.convertDateComplete =
          ConvertLongToDateString.getDateString();

        $scope.valueComplete = true;
      } else {
        $scope.valueComplete = false;
      }
    }

    $scope.todoFindById = $scope.findTodoById(idTodoList, idTodo);
    if ($scope.todoFindById != null) {
      $scope.todoFindById.completionTime = obj.completionTime;
      $scope.todoFindById.progress = obj.progress;
      $scope.todoFindById.progressOfTodo = obj.progress;
    } else {
      await MeFindTodoById.fetchTodo(idTodo);
      $scope.todoFindById = MeFindTodoById.getTodo();
    }

    $scope.loadDataAfterFilter(idTodoList, idTodo);

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

  $scope.showDialogMenuTodoList = false;

  $scope.openDialogMenuTodoList = function (event, xx) {
    event.stopPropagation();
    $scope.showDialogAddLabelOut = false;
    $scope.showDialogAddLabel = false;
    $scope.showDialogAddPriorityLevel = false;
    $scope.showDialogMenuTodoList = false;
    if (!$scope.showDialogMenuTodoList) {
      $scope.showDialogMenuTodoList = true;
    } else {
      $scope.showDialogMenuTodoList = false;
    }

    $scope.objTodoListDelete = xx;

    $scope.dialogStyleMenuTodoList = {
      top: event.clientY + "px",
      left: event.clientX + "px",
    };

    $scope.clickOutPopupMenuTodoList();
  };

  $scope.clickOutPopupMenuTodoList = function () {
    document.addEventListener(
      "click",
      function (event) {
        if (
          !document.querySelector(".dialogMenuTodoList").contains(event.target)
        ) {
          $scope.$apply(function () {
            $scope.closeDialogMenuTodoList();
          });
        } else {
          $scope.clickOutPopupMenuTodoList();
        }
      },
      { once: true }
    );
  };

  $scope.closeDialogMenuTodoList = function () {
    $scope.showDialogMenuTodoList = false;
  };

  $scope.showDialogSort = false;

  $scope.openDialogSort = function (event) {
    event.stopPropagation();
    $scope.showDialogFilter = false;
    if (!$scope.showDialogSort) {
      $scope.showDialogSort = true;
    } else {
      $scope.showDialogSort = false;
    }

    $scope.dialogStyleSort = {
      top: event.clientY + "px",
      left: event.clientX + "px",
    };

    $scope.dialogStyleSort = {
      top: event.clientY + "px",
      left: event.clientX + "px",
    };

    $scope.clickOutPopupSort();
  };

  $scope.clickOutPopupSort = function () {
    document.addEventListener(
      "click",
      function (event) {
        if (!document.querySelector(".dialogSort").contains(event.target)) {
          $scope.$apply(function () {
            $scope.closeDialogSort();
          });
        } else {
          $scope.clickOutPopupSort();
        }
      },
      { once: true }
    );
  };

  $scope.closeDialogSort = function () {
    $scope.showDialogSort = false;
  };

  $scope.deleteTodo = function () {
    let obj = {
      id: $scope.detailTodo.id,
      idPeriod: $routeParams.idPeriod,
      idProject: $scope.projectId,
    };

    stompClient.send(
      "/action/delete-todo" +
        "/" +
        $scope.projectId +
        "/" +
        $routeParams.idPeriod,
      {},
      JSON.stringify(obj)
    );

    $scope.showDialogConfirmDeleteTodo = false;
  };

  $scope.actionReloadDeleteTodo = function (message) {
    let idTodo = JSON.parse(message.body).data.idTodo;
    let idTodoList = JSON.parse(message.body).data.idTodoList;

    $scope.todoFindById = $scope.findTodoById(idTodoList, idTodo);
    $scope.todoListFindById = MeTodoTodoListHelper.findTodoList(
      $scope.listTask,
      idTodoList
    );

    $scope.todoViewTableFindById = {};

    $scope.listTodoViewTable.forEach((item) => {
      if (item.id == idTodo) {
        $scope.todoViewTableFindById = item;
      }
    });

    $scope.todoListFindById.todoList.forEach((item) => {
      if (item.indexTodo > $scope.todoFindById.indexTodo && item.id != idTodo) {
        item.indexTodo = item.indexTodo - 1;
      }
    });

    $scope.listTodoViewTable.splice(
      $scope.listTodoViewTable.indexOf($scope.todoViewTableFindById),
      1
    );

    $scope.todoListFindById.todoList.splice(
      $scope.todoListFindById.todoList.indexOf($scope.todoFindById),
      1
    );

    if ($scope.detailTodo.id != null && $scope.detailTodo.id == idTodo) {
      $location.search("idTodo", null).replace();
      window.history.pushState(null, null, $location.absUrl());
      document.title = $scope.detailProject.name + " | Portal Project";
      $scope.detailTodo = null;
    }

    $scope.$apply();
  };

  $scope.showDialogConfirmDeleteTodo = false;

  $scope.openDialogConfirmDeleteTodo = function (event) {
    event.stopPropagation();
    $scope.showDialogAddPriorityLevel = false;
    $scope.showDialogConfirmDeleteTodo = false;

    if (!$scope.showDialogConfirmDeleteTodo) {
      $scope.showDialogConfirmDeleteTodo = true;
    } else {
      $scope.showDialogConfirmDeleteTodo = false;
    }

    $scope.dialogStyleConfirmDeleteTodo = {
      top: event.clientY - 100 + "px",
      left: event.clientX + "px",
    };

    $scope.clickOutPopupConfirmDeleteTodo();
  };

  $scope.clickOutPopupConfirmDeleteTodo = function () {
    document.addEventListener(
      "click",
      function (event) {
        if (
          !document
            .querySelector(".dialogConfirmDeleteTodo")
            .contains(event.target)
        ) {
          $scope.$apply(function () {
            $scope.closeDialogConfirmDeleteTodo();
          });
        } else {
          $scope.clickOutPopupConfirmDeleteTodo();
        }
      },
      { once: true }
    );
  };

  $scope.closeDialogConfirmDeleteTodo = function () {
    $scope.showDialogConfirmDeleteTodo = false;
  };
};

todoComponent.actionSortTodo = function (
  $scope,
  $routeParams,
  stompClient,
  MeTodoService,
  MeAssignService,
  MeLabelService,
  ConvertLongToDateString,
  MeFilterTodoService
) {
  $scope.sortTodoPriority = _.debounce(function (type) {
    let obj = {
      idPeriod: $routeParams.idPeriod,
      type: type,
    };

    stompClient.send(
      "/action/sort-todo-priority" +
        "/" +
        $scope.projectId +
        "/" +
        $routeParams.idPeriod,
      {},
      JSON.stringify(obj)
    );
  }, 400);

  $scope.actionReloadSortTodo = function (message) {
    let idPeriod = JSON.parse(message.body).data;
    if (
      $scope.objFilter.name == "" &&
      $scope.objFilter.label.length === 0 &&
      $scope.objFilter.member.length === 0 &&
      $scope.objFilter.dueDate.length === 0
    ) {
      todoComponent.loadDataTodo(
        $scope,
        idPeriod,
        MeTodoService,
        MeAssignService,
        MeLabelService,
        ConvertLongToDateString
      );
    } else {
      $scope.loadAfterFilterAndSort();
    }
  };

  $scope.loadAfterFilterAndSort = function () {
    $scope.objFilter = {
      name: $scope.nameTodoFilter,
      member: [],
      label: [],
      dueDate: [],
    };

    if ($("#none_member").prop("checked")) {
      $scope.objFilter.member.push({
        id: $("#none_member").val(),
        name: $("#none_member").val(),
      });
    }

    if ($("#assign_me").prop("checked")) {
      $scope.objFilter.member.push({
        id: $("#assign_me").val(),
        name: $scope.userCurrent.username,
      });
    }

    let listMemberDropdowm = document.querySelectorAll(
      "#list_member_filter_id"
    );
    let checkCountMember = 0;
    listMemberDropdowm.forEach((item) => {
      if (item.checked) {
        let mbById = $scope.findMemberById(item.value);
        checkCountMember++;
        $scope.objFilter.member.push({
          id: mbById.id,
          name: mbById.username,
        });
      }
    });

    if (checkCountMember == listMemberDropdowm.length) {
      document.querySelector("#checked_all").checked = true;
    } else {
      document.querySelector("#checked_all").checked = false;
    }

    if ($("#none_label").prop("checked")) {
      $scope.objFilter.label.push({
        id: $("#none_label").val(),
        name: $("#none_label").val(),
      });
    }

    let listLabelDropdowm = document.querySelectorAll("#list_label_filter_id");
    let checkCountLabel = 0;
    listLabelDropdowm.forEach((item) => {
      if (item.checked) {
        let lbById = $scope.findLabelById(item.value);
        checkCountLabel++;
        $scope.objFilter.label.push({
          id: lbById.id,
          name: lbById.name,
        });
      }
    });

    if (checkCountLabel == listLabelDropdowm.length) {
      document.querySelector("#checked_all_label").checked = true;
    } else {
      document.querySelector("#checked_all_label").checked = false;
    }

    if ($("#no_due_date").prop("checked")) {
      $scope.objFilter.dueDate.push({
        id: $("#no_due_date").val(),
        name: $("#no_due_date").val(),
      });
    }

    if ($("#over_due_date").prop("checked")) {
      $scope.objFilter.dueDate.push({
        id: $("#over_due_date").val(),
        name: $("#over_due_date").val(),
      });
    }

    if ($("#complete").prop("checked")) {
      $scope.objFilter.dueDate.push({
        id: $("#complete").val(),
        name: $("#complete").val(),
      });
    }

    if ($("#not_complete").prop("checked")) {
      $scope.objFilter.dueDate.push({
        id: $("#not_complete").val(),
        name: $("#not_complete").val(),
      });
    }

    if (
      $scope.objFilter.member.length === 0 &&
      $scope.objFilter.label.length === 0 &&
      $scope.objFilter.dueDate.length === 0 &&
      $scope.nameTodoFilter == ""
    ) {
      $location.search("filter", null).replace();
      window.history.pushState(null, null, $location.absUrl());
      todoComponent.loadDataTodo(
        $scope,
        $routeParams.idPeriod,
        MeTodoService,
        MeAssignService,
        MeLabelService,
        ConvertLongToDateString
      );
    } else {
      let newObj = {
        name: $scope.nameTodoFilter,
        member: $scope.objFilter.member.map((item) => item.id),
        label: $scope.objFilter.label.map((item) => item.id),
        dueDate: $scope.objFilter.dueDate.map((item) => item.id),
      };

      let paramFilter = encodeURIComponent(JSON.stringify(newObj));
      // let url = "";
      // for (let key in $scope.objFilter) {
      //   if (Array.isArray($scope.objFilter[key])) {
      //     $scope.objFilter[key].forEach((item) => {
      //       url += key + ":" + item.name + ",";
      //     });
      //   } else {
      //     url += key + ":" + $scope.objFilter[key] + ",";
      //   }
      // }
      // url = url.slice(0, -1);
      // $location.search("filter", url).replace();
      // window.history.pushState(null, null, $location.absUrl());

      periodComponent.loadDataFilter(
        $scope,
        $routeParams.idPeriod,
        paramFilter,
        MeFilterTodoService,
        MeAssignService,
        MeLabelService,
        ConvertLongToDateString
      );
    }
  };

  $scope.sortTodoDeadline = _.debounce(function (type) {
    let obj = {
      idPeriod: $routeParams.idPeriod,
      type: type,
    };

    stompClient.send(
      "/action/sort-todo-deadline" +
        "/" +
        $scope.projectId +
        "/" +
        $routeParams.idPeriod,
      {},
      JSON.stringify(obj)
    );
  }, 400);

  $scope.updateTypeTodo = function (type) {
    let obj = {
      id: $scope.detailTodo.id,
      type: type,
      idTodo: $scope.idTodo,
      idTodoList: $scope.idTodoList,
      periodId: $routeParams.idPeriod
    };

    stompClient.send(
      "/action/update-type-todo" +
        "/" +
        $scope.projectId +
        "/" +
        $routeParams.idPeriod,
      {},
      JSON.stringify(obj)
    );
  };

  $scope.actionReloadUpdateTypeTodo = function (message) {
    let obj = JSON.parse(message.body).data.data;
    let idTodo = JSON.parse(message.body).data.idTodo;
    let idTodoList = JSON.parse(message.body).data.idTodoList;

    if ($scope.detailTodo.id != null && $scope.detailTodo.id == idTodo) {
      $scope.detailTodo.type = obj.type;
    }

    $scope.$apply();
  };
};
