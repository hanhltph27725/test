const projectComponent = {};

projectComponent.showHideRightMenu = function ($scope) {
  const menuButton = document.querySelector(".more-menu");
  const rightMenu = document.getElementById("right-menu");
  const changebackgroundMenu = document.getElementById("new-menu");
  const previousMenu = document.getElementById("previous-menu");
  const newMenu = document.getElementById("change-background");
  const closeMenuButton = document.getElementById("close-menu");

  let handleDocumentClick = function (event) {
    if (
      rightMenu.classList.contains("active") &&
      !rightMenu.contains(event.target) &&
      event.target !== menuButton &&
      event.target !== previousMenu
    ) {
      closeMenu(rightMenu, handleDocumentClick);
    }
  };

  let handleDocumentClickNewMenu = function (event) {
    if (
      changebackgroundMenu.classList.contains("active") &&
      !changebackgroundMenu.contains(event.target) &&
      event.target !== newMenu
    ) {
      closeMenu(changebackgroundMenu, handleDocumentClickNewMenu);
    }
  };

  function closeMenu(menu, handle) {
    menu.classList.remove("active");
    if (menu === changebackgroundMenu) {
      document.removeEventListener("click", handle);
    } else if (menu === rightMenu) {
      document.removeEventListener("click", handle);
    }
  }

  function toggleMenu(menu, handle) {
    menu.classList.toggle("active");
    if (menu.classList.contains("active")) {
      document.addEventListener("click", handle);
    } else {
      document.removeEventListener("click", handle);
    }
  }

  newMenu.addEventListener("click", function () {
    toggleMenu(changebackgroundMenu, handleDocumentClickNewMenu);
  });

  menuButton.addEventListener("click", function () {
    toggleMenu(rightMenu, handleDocumentClick);
  });

  closeMenuButton.addEventListener("click", function () {
    closeMenu(rightMenu, handleDocumentClick);
  });

  previousMenu.addEventListener("click", function () {
    closeMenu(changebackgroundMenu, handleDocumentClickNewMenu);
  });
};

projectComponent.changeBackgroundProject = function ($scope, stompClient) {
  $scope.changeBackground = function (item, type) {
    let obj = {
      projectId: $scope.projectId,
      name: item,
      type: type,
    };

    stompClient.send(
      "/action/update-background-project" + "/" + $scope.projectId,
      {},
      JSON.stringify(obj)
    );
  };

  $scope.actionReloadBackground = function (message) {
    let obj = JSON.parse(message.body).data;
    if (obj.backgroundImage != null) {
      $scope.detailProject.backgroundImage = obj.backgroundImage;
      document.body.style.backgroundImage =
        "url('" + $scope.detailProject.backgroundImage + "')";
    }
    if (obj.backgroundColor != null) {
      $scope.detailProject.backgroundColor = obj.backgroundColor;
      document.body.style.backgroundColor =
        $scope.detailProject.backgroundColor;
    }
  };
};

projectComponent.fetchAllDataProject = async function (
  $scope,
  $rootScope,
  $location,
  idProject,
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
) {
  await Promise.all([
    MeDetailProjectService.fetchProject(idProject),
    MeMemberService.fetchMembers(),
    MeMemberProjectService.fetchMembers(idProject),
    MeTodoListService.fetchTodoList(idProject),
    MeGetAllPeriodById.fetchPeriods(idProject),
  ]);

  $scope.detailProject = MeDetailProjectService.getProject();
  if ($scope.detailProject.backgroundImage != null) {
    document.body.style.backgroundImage =
      "url('" + $scope.detailProject.backgroundImage + "')";
  }

  if ($scope.detailProject.backgroundColor != null) {
    document.body.style.backgroundColor = $scope.detailProject.backgroundColor;
  }

  document.title = $scope.detailProject.name + " | Portal Project";
  $scope.listMemberById = MeMemberService.getMembers();

  $scope.listTask = MeTodoListService.getTodoList();
  $scope.listPeriodById = MeGetAllPeriodById.getPeriods();

  let periodCurrent = $scope.listPeriodById.filter((pe) => {
    return pe.status == 1;
  })[0];

  if (periodCurrent) {
    $scope.valuePeriod = periodCurrent.id;
  } else {
    $scope.valueInput = "";
  }

  $scope.periodCurrentId = localStorage.getItem("localIdPeriod:" + idProject);

  if (periodCurrent != null && $scope.periodCurrentId == null) {
    localStorage.setItem("localIdPeriod:" + idProject, $scope.valuePeriod);
    $scope.periodCurrentId = $scope.valuePeriod;
  }

  let idPeriodUrl = $location.search().idPeriod;
  if (idPeriodUrl != null) {
    localStorage.setItem("localIdPeriod:" + idProject, idPeriodUrl);
    $scope.periodCurrentId = idPeriodUrl;
  }

  let idTodoUrl = $location.search().idTodo;

  if ($scope.periodCurrentId != null) {
    $location
      .path("/member/project-is-participating/" + $scope.projectId)
      .search({ idPeriod: $scope.periodCurrentId });

    todoComponent.loadDataTodo(
      $scope,
      $scope.periodCurrentId,
      MeTodoService,
      MeAssignService,
      MeLabelService,
      ConvertLongToDateString
    );
  }

  if (idTodoUrl != null) {
    $location.search("idTodo", idTodoUrl).replace();
  }

  $scope.listMemberProject = [];
  $scope.listMemberFilter = [];
  $scope.listManagerProject = [];
  $scope.listLeaderProject = [];
  $scope.listDevProject = [];
  $scope.listTesterProject = [];

  const memberProject = MeMemberProjectService.getMembers();

  memberProject.forEach((meRes) => {
    const member = $scope.listMemberById.find((me) => meRes.memberId === me.id);
    if (member) {
      member.checkMemberAssign = false;
      member.roleProject = meRes.role + "";
      member.statusWork = meRes.statusWork + "";
      member.idMemberProject = meRes.id;
      $scope.listMemberProject.push(member);
      $scope.listMemberFilter.push(member);
      if (meRes.role == 0) {
        $scope.listManagerProject.push(member);
      } else if (meRes.role == 1) {
        $scope.listLeaderProject.push(member);
      } else if (meRes.role == 2) {
        $scope.listDevProject.push(member);
      } else {
        $scope.listTesterProject.push(member);
      }
    }
  });

  $scope.listMemberNotInProject = [];

  $scope.listMemberNotInProject = $scope.listMemberById.filter((member) => {
    return !memberProject.some((meRes) => meRes.memberId === member.id);
  });

  $scope.checkNumberMember = true;
  $scope.numberMemberMore = $scope.listMemberProject.length - 5;

  if ($scope.listMemberProject.length <= 5) {
    $scope.checkNumberMember = false;
  } else {
    $scope.checkNumberMember = true;
  }
  $rootScope.ignoreUpdate = false;

  $scope.$apply();
};
