const periodComponent = {};

periodComponent.changePeriod = function (
  $scope,
  $location,
  idProject,
  stompClient,
  MeTodoService,
  MeAssignService,
  MeLabelService,
  ConvertLongToDateString
) {
  $scope.changePeriod = function () {
    localStorage.setItem("localIdPeriod:" + idProject, $scope.valuePeriod);
    $scope.periodCurrentId = $scope.valuePeriod;
    $location.search("idPeriod", $scope.valuePeriod).replace();
    window.history.pushState(null, null, $location.absUrl());
  };
};

periodComponent.watchUrl = function (
  stompClient,
  idProject,
  $scope,
  $rootScope,
  $location,
  MeTodoService,
  MeAssignService,
  MeLabelService,
  ConvertLongToDateString,
  MeDetailTodoService,
  MeTodoTodoListHelper
) {
  $scope.$watch(
    function () {
      return $location.search().idPeriod;
    },
    function (newVal, oldVal) {
      if (!$rootScope.ignoreUpdate && newVal !== oldVal) {
        if (newVal != null) {
          localStorage.setItem("localIdPeriod:" + idProject, newVal);
          $location
            .path("/member/project-is-participating/" + $scope.projectId)
            .search({ idPeriod: newVal });
          $scope.valuePeriod = newVal;

          let subscriptions = stompClient.subscriptions;

          for (let id in subscriptions) {
            stompClient.unsubscribe(id);
          }

          todoComponent.loadDataTodo(
            $scope,
            newVal,
            MeTodoService,
            MeAssignService,
            MeLabelService,
            ConvertLongToDateString
          );

          stomClientComponent.allSubcribePeriod(
            $scope,
            stompClient,
            $scope.valuePeriod
          );
        }
      }
    }
  );

  $scope.$watch(
    function () {
      return $location.search().idTodo;
    },
    function (newVal, oldVal) {
      if (newVal != "undified" && newVal != null) {
        // window.history.pushState(null, null, $location.absUrl());
        MeDetailTodoService.setTodo(null);
        MeDetailTodoService.fetchTodo(newVal).then(function () {
          let detailTodoFind = MeDetailTodoService.getTodo();
          console.log(detailTodoFind);
          if (detailTodoFind != null) {
            let todoListFindDetail = MeTodoTodoListHelper.findTodoList(
              $scope.listTask,
              detailTodoFind.todoListId
            );
            $("#modal_show_detail_todo").modal("show");
            $scope.loadDetailTodo(newVal, todoListFindDetail);
          } else {
            toastr.info("Đầu việc này đã bị xóa !", "Thông báo!", {
              closeButton: true,
              progressBar: true,
              positionClass: "toast-top-center",
            });
            $location.search("idTodo", null).replace();
            return;
          }
        });
      } else {
        $("#modal_show_detail_todo").modal("hide");
      }
    }
  );
};

periodComponent.showMenuDialogPeriod = function ($scope, $routeParams) {
  $scope.showDialogShowMenu = false;

  $scope.openDialogShowMenu = function (event) {
    event.stopPropagation();
    $scope.showDialogAddLabelOut = false;
    $scope.showDialogAddLabel = false;
    $scope.showDialogAddMember = false;
    $scope.showDialogAddMemberOut = false;
    $scope.showDialogAddPriorityLevel = false;

    $scope.valuePeriod = $routeParams.idPeriod;

    if (!$scope.showDialogShowMenu) {
      $scope.showDialogShowMenu = true;
    } else {
      $scope.showDialogShowMenu = false;
    }

    $scope.clickOutPopupShowMenu();
  };

  $scope.clickOutPopupShowMenu = function () {
    document.addEventListener(
      "click",
      function (event) {
        if (!document.querySelector(".dialogShowMenu").contains(event.target)) {
          $scope.$apply(function () {
            $scope.closeDialogShowMenu();
          });
        } else {
          $scope.clickOutPopupShowMenu();
        }
      },
      { once: true }
    );
  };

  $scope.closeDialogShowMenu = function () {
    $scope.showDialogShowMenu = false;
  };
};

periodComponent.dialogAddFilter = function (
  $scope,
  $location,
  $routeParams,
  MeAssignService,
  MeLabelService,
  ConvertLongToDateString,
  MeFilterTodoService,
  MeTodoService
) {
  $scope.showDialogFilter = false;

  $scope.nameTodoFilter = "";

  $scope.openDialogFilter = function (event) {
    event.stopPropagation();
    $scope.showDialogSort = false;
    $scope.searchLabelFilter = "";
    $scope.searchMemberFilter = "";
    $scope.listMemberProject.forEach((item) => {
      if (item.id == $scope.idUser) {
        $scope.userCurrent = item;
      }
    });

    MeLabelService.fetchLabels($scope.projectId).then(function () {
      $scope.listLabelFilter = MeLabelService.getAllLabels();
    });

    const dropdownMenu = document.querySelectorAll(".dropdown-menu li");
    dropdownMenu.forEach((item) => {
      item.addEventListener("click", (event) => {
        event.stopPropagation();
      });
    });

    if ($scope.listMemberFilter.length <= 1) {
      $scope.emptyMemberFilter = "Không tìm thấy thành viên nào";
    } else {
      $scope.emptyMemberFilter = "";
    }

    if ($scope.listLabelFilter == []) {
      $scope.emptyLabelFilter = "Không tìm thấy thành viên nào";
    } else {
      $scope.emptyLabelFilter = "";
    }

    if (!$scope.showDialogFilter) {
      $scope.showDialogFilter = true;
    } else {
      $scope.showDialogFilter = false;
    }

    $scope.clickOutPopupFilter();
  };

  $scope.filterByName = _.debounce(function (event) {
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
      //   console.log(Array.isArray($scope.objFilter[key]));
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
  }, 500);

  $scope.onMemberClicked = function (event) {
    const checkbox = event.currentTarget.querySelector(
      'input[type="checkbox"]'
    );
    if (checkbox != null) {
      checkbox.checked = !checkbox.checked;
    }

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
    event.stopPropagation();
  };

  $scope.findLabelById = function (id) {
    return $scope.listLabelFilter.filter((pe) => {
      return pe.id == id;
    })[0];
  };

  $scope.findMemberById = function (id) {
    return $scope.listMemberProject.filter((pe) => {
      return pe.id == id;
    })[0];
  };

  $scope.clickOutPopupFilter = function () {
    document.addEventListener(
      "click",
      function (event) {
        if (!document.querySelector(".dialogFilter").contains(event.target)) {
          $scope.$apply(function () {
            $scope.closeDialogFilter();
          });
        } else {
          $scope.clickOutPopupFilter();
        }
      },
      { once: true }
    );
  };

  $scope.closeDialogFilter = function () {
    $scope.showDialogFilter = false;
  };
};

periodComponent.loadDataFilter = function (
  $scope,
  idPeriod,
  paramFilter,
  MeFilterTodoService,
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
      return MeFilterTodoService.fetchTodos(
        idPeriod,
        item.id,
        paramFilter
      ).then(function () {
        item.todoList = MeFilterTodoService.getTodos();
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

periodComponent.functionFilterTodo = function (
  $scope,
  $routeParams,
  $location,
  MeFilterTodoService,
  MeAssignService,
  MeLabelService,
  ConvertLongToDateString
) {
  $scope.filterTodo = function () {
    $scope.objFilter.member.push(
      {
        id: "none",
        name: "none",
      }
      // {
      //   id: "c5cf1e20-bdd4-11ed-afa1-0242ac120002",
      //   name: "thangncph26123",
      // },
      // {
      //   id: "d21b02c0-bdd4-11ed-afa1-0242ac120002",
      //   name: "trilqph21111",
      // }
    );
    $scope.objFilter.label.push({
      id: "none",
      name: "none",
    });

    let newObj = {
      member: $scope.objFilter.member.map((item) => item.id),
      label: $scope.objFilter.label.map((item) => item.id),
    };
    let paramFilter = encodeURIComponent(JSON.stringify(newObj));
    let url = "";
    for (let key in $scope.objFilter) {
      if (Array.isArray($scope.objFilter[key])) {
        $scope.objFilter[key].forEach((item) => {
          url += key + ":" + item.name + ",";
        });
      } else {
        url += key + ":" + $scope.objFilter[key] + ",";
      }
    }
    url = url.slice(0, -1);
    $location.search("filter", url).replace();
    window.history.pushState(null, null, $location.absUrl());

    periodComponent.loadDataFilter(
      $scope,
      $routeParams.idPeriod,
      paramFilter,
      MeFilterTodoService,
      MeAssignService,
      MeLabelService,
      ConvertLongToDateString
    );
  };
};

periodComponent.actionLoadDataAfterFilter = function (
  $scope,
  $routeParams,
  MeAssignService,
  MeLabelService,
  ConvertLongToDateString,
  MeTodoTodoListHelper,
  MeCheckFilterTodo
) {
  $scope.loadDataAfterFilter = async function (idTodoList, idTodo) {
    if (
      !(
        $scope.objFilter.label.length === 0 &&
        $scope.objFilter.member.length === 0 &&
        $scope.objFilter.dueDate.length === 0
      )
    ) {
      $scope.todoListFindById = MeTodoTodoListHelper.findTodoList(
        $scope.listTask,
        idTodoList
      );

      let newObj = {
        member: $scope.objFilter.member.map((item) => item.id),
        label: $scope.objFilter.label.map((item) => item.id),
        dueDate: $scope.objFilter.dueDate.map((item) => item.id),
      };
      let paramFilter = encodeURIComponent(JSON.stringify(newObj));

      await MeCheckFilterTodo.fetchTodos(
        $routeParams.idPeriod,
        idTodoList,
        idTodo,
        paramFilter
      );
      if (MeCheckFilterTodo.getTodos() == null) {
        if (
          $scope.todoFindById.members != null ||
          $scope.todoFindById.labels != null ||
          $scope.todoFindByIdd.deadline != null
        ) {
          $scope.todoListFindById.todoList.splice(
            $scope.todoListFindById.todoList.indexOf($scope.todoFindById),
            1
          );

          $scope.listTodoViewTable.forEach((item, index) => {
            if (item.id == $scope.todoFindById.id) {
              $scope.listTodoViewTable.splice(index, 1);
            }
          });
        }
      } else {
        if ($scope.todoFindById.numberTodo != 0) {
          $scope.todoFindById.progressOfTodo = parseInt(
            ($scope.todoFindById.numberTodoComplete /
              $scope.todoFindById.numberTodo) *
              100
          );
        } else {
          $scope.todoFindById.progressOfTodo = $scope.todoFindById.progress;
        }
        if ($scope.todoFindById.deadline != null) {
          ConvertLongToDateString.setMonthDay($scope.todoFindById.deadline);
          $scope.todoFindById.deadlineString =
            ConvertLongToDateString.getMonthDay();
        }

        if ($scope.todoFindById.members == null) {
          $scope.todoFindById.members = [];
          await MeAssignService.fetchMember($scope.todoFindById.id);
          const idMembers = MeAssignService.getMembers();
          idMembers.forEach((meId) => {
            const member = $scope.listMemberById.find((me) => meId === me.id);
            if (member) {
              $scope.todoFindById.members.push(member);
            }
          });

          $scope.todoFindById.objTodoList = {
            id: $scope.todoListFindById.id,
            name: $scope.todoListFindById.name,
            code: $scope.todoListFindById.code,
            indexTodoList: $scope.todoListFindById.indexTodoList,
            checkShowAddCard: $scope.todoListFindById.checkShowAddCard,
          };
          $scope.todoFindById.objTodoListSelect = {
            id: $scope.todoListFindById.id,
            name: $scope.todoListFindById.name,
          };

          $scope.todoFindById.listTodoList = [];

          $scope.listTodoViewTable.unshift($scope.todoFindById);
          $scope.sortTodoByTodoListAndTodo();
        }

        if ($scope.todoFindById.labels == null) {
          await MeLabelService.fetchLabel($scope.todoFindById.id);
          $scope.todoFindById.labels = MeLabelService.getLabels();
        }

        let check = 0;
        $scope.todoListFindById.todoList.forEach((item) => {
          if ($scope.todoFindById.id == item.id) {
            check++;
          }
        });
        if (check == 0) {
          $scope.todoListFindById.todoList.splice(
            $scope.todoFindById.indexTodo,
            0,
            $scope.todoFindById
          );
        }

        $scope.todoListFindById.todoList.sort(
          (a, b) => a.indexTodo - b.indexTodo
        );
      }
    }
    $scope.todoFindById = null;
    $scope.$apply();
  };

  $scope.checkedNoneMember = function (event) {
    if (document.querySelector("#none_member").checked) {
      document.querySelector("#none_member").checked = false;
    } else {
      document.querySelector("#none_member").checked = true;
    }
    $scope.onMemberClicked(event);
  };

  $scope.checkedAssignMe = function (event) {
    if (document.querySelector("#assign_me").checked) {
      document.querySelector("#assign_me").checked = false;
    } else {
      document.querySelector("#assign_me").checked = true;
    }
    $scope.onMemberClicked(event);
  };

  $scope.checkedNoDueDate = function (event) {
    if (document.querySelector("#no_due_date").checked) {
      document.querySelector("#no_due_date").checked = false;
    } else {
      document.querySelector("#no_due_date").checked = true;
    }
    $scope.onMemberClicked(event);
  };

  $scope.checkedOverDueDate = function (event) {
    if (document.querySelector("#over_due_date").checked) {
      document.querySelector("#over_due_date").checked = false;
    } else {
      document.querySelector("#over_due_date").checked = true;
    }
    $scope.onMemberClicked(event);
  };

  $scope.checkedComplete = function (event) {
    if (document.querySelector("#complete").checked) {
      document.querySelector("#complete").checked = false;
    } else {
      document.querySelector("#complete").checked = true;
    }
    $scope.onMemberClicked(event);
  };

  $scope.checkedNotComplete = function (event) {
    if (document.querySelector("#not_complete").checked) {
      document.querySelector("#not_complete").checked = false;
    } else {
      document.querySelector("#not_complete").checked = true;
    }
    $scope.onMemberClicked(event);
  };

  $scope.checkedNoneLabel = function (event) {
    if (document.querySelector("#none_label").checked) {
      document.querySelector("#none_label").checked = false;
    } else {
      document.querySelector("#none_label").checked = true;
    }
    $scope.onMemberClicked(event);
  };

  $scope.clickAllMember = function (event) {
    if (!document.querySelector("#checked_all").checked) {
      let listmemberfilter = document.querySelectorAll(
        "#list_member_filter_id"
      );
      listmemberfilter.forEach((item) => {
        item.checked = false;
      });
    } else {
      let listmemberfilter = document.querySelectorAll(
        "#list_member_filter_id"
      );
      listmemberfilter.forEach((item) => {
        item.checked = true;
      });
    }

    $scope.onMemberClicked(event);
  };

  $scope.clickAllLabel = function (event) {
    if (!document.querySelector("#checked_all_label").checked) {
      let listlabelfilter = document.querySelectorAll("#list_label_filter_id");
      listlabelfilter.forEach((item) => {
        item.checked = false;
      });
    } else {
      let listlabelfilter = document.querySelectorAll("#list_label_filter_id");
      listlabelfilter.forEach((item) => {
        item.checked = true;
      });
    }

    $scope.onMemberClicked(event);
  };
};

periodComponent.select2Filter = function ($scope) {};
