const memberComponent = {};

memberComponent.dialogProfile = function ($scope) {
  $scope.findMemberById = function (id) {
    return $scope.listMemberProject.filter((pe) => {
      return pe.id == id;
    })[0];
  };

  $scope.showDialogProfile = false;

  $scope.openDialogProfile = function (event) {
    event.stopPropagation();

    if (!$scope.showDialogProfile) {
      $scope.showDialogProfile = true;
    } else {
      $scope.showDialogProfile = false;
    }

    $scope.clickOutPopupProfile();
  };

  $scope.clickOutPopupProfile = function () {
    document.addEventListener(
      "click",
      function (event) {
        if (!document.querySelector(".dialogProfile").contains(event.target)) {
          $scope.$apply(function () {
            $scope.closeDialogProfile();
          });
        } else {
          $scope.clickOutPopupProfile();
        }
      },
      { once: true }
    );
  };

  $scope.closeDialogProfile = function () {
    $scope.showDialogProfile = false;
  };
};

memberComponent.dialogAddMember = function ($scope) {
  $scope.showDialogAddMember = false;

  $scope.openDialogAddMember = function (event) {
    event.stopPropagation();
    $scope.showDialogAddLabelOut = false;
    $scope.showDialogAddLabel = false;
    $scope.showDialogAddPriorityLevel = false;
    $scope.showDialogAddAttachment = false;
    $scope.showDialogAddImage = false;
    $scope.searchMemberDialog = "";

    if (!$scope.showDialogAddMember) {
      $scope.showDialogAddMember = true;
    } else {
      $scope.showDialogAddMember = false;
    }

    $scope.dialogStyleAddMember = {
      top: event.clientY + "px",
      left: event.clientX + "px",
    };

    $scope.listMemberProject.forEach((meId) => {
      let memberCheckAssign = $scope.detailTodo.listMemberDetailTodo.find(
        (me) => meId.id === me.id
      );
      if (memberCheckAssign != null) {
        meId.checkMemberAssign = true;
      } else {
        meId.checkMemberAssign = false;
      }
    });

    $scope.clickOutPopupAddMember();
  };

  $scope.clickOutPopupAddMember = function () {
    document.addEventListener(
      "click",
      function (event) {
        if (
          !document.querySelector(".dialogAddMember").contains(event.target)
        ) {
          $scope.$apply(function () {
            $scope.closeDialogAddMember();
          });
        } else {
          $scope.clickOutPopupAddMember();
        }
      },
      { once: true }
    );
  };

  $scope.closeDialogAddMember = function () {
    $scope.showDialogAddMember = false;
  };

  // 
  $scope.showDialogAddMemberViewTable = false;

  $scope.openDialogAddMemberViewTable = function (event) {
    event.stopPropagation();
    $scope.showDialogAddLabelOut = false;
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
      top: event.clientY + "px",
      left: event.clientX + "px",
    };

    $scope.listMemberProject.forEach((meId) => {
      let memberCheckAssign = $scope.detailTodo.listMemberDetailTodo.find(
        (me) => meId.id === me.id
      );
      if (memberCheckAssign != null) {
        meId.checkMemberAssign = true;
      } else {
        meId.checkMemberAssign = false;
      }
    });

    $scope.clickOutPopupAddMemberViewTable();
  };

  $scope.clickOutPopupAddMemberViewTable = function () {
    document.addEventListener(
      "click",
      function (event) {
        if (
          !document.querySelector(".dialogAddMemberViewTable").contains(event.target)
        ) {
          $scope.$apply(function () {
            $scope.closeDialogAddMemberViewTable();
          });
        } else {
          $scope.clickOutPopupAddMemberViewTable();
        }
      },
      { once: true }
    );
  };

  $scope.closeDialogAddMemberViewTable = function () {
    $scope.showDialogAddMemberViewTable = false;
  };
  // 

  $scope.showDialogSearchMemberComment = false;

  $scope.openDialogSearchMemberComment = function () {
    // event.stopPropagation();
    $scope.showDialogAddLabelOut = false;
    $scope.showDialogAddLabel = false;
    $scope.showDialogAddPriorityLevel = false;
    $scope.showDialogSearchMemberCommentOut = false;
    $scope.searchMemberDialog = "";

    if (!$scope.showDialogSearchMemberComment) {
      $scope.showDialogSearchMemberComment = true;
    } else {
      $scope.showDialogSearchMemberComment = false;
    }

    $scope.listMemberSearchComment = $scope.listMemberProject;

    $scope.clickOutPopupSearchMemberComment();
  };

  $scope.clickOutPopupSearchMemberComment = function () {
    document.addEventListener(
      "click",
      function (event) {
        if (
          !document
            .querySelector(".dialogSearchMemberComment")
            .contains(event.target)
        ) {
          $scope.$apply(function () {
            $scope.closeDialogSearchMemberComment();
          });
        } else {
          $scope.clickOutPopupSearchMemberComment();
        }
      },
      { once: true }
    );
  };

  $scope.closeDialogSearchMemberComment = function () {
    $scope.showDialogSearchMemberComment = false;
  };

  $scope.showDialogUocLuong = false;

  $scope.openDialogUocLuong = function (event) {
    event.stopPropagation();
    $scope.showDialogAddLabelOut = false;
    $scope.showDialogAddLabel = false;
    $scope.showDialogAddPriorityLevel = false;
    $scope.showDialogUocLuongOut = false;
    $scope.searchMemberDialog = "";

    if (!$scope.showDialogUocLuong) {
      $scope.showDialogUocLuong = true;
    } else {
      $scope.showDialogUocLuong = false;
    }

    $scope.valueChangeProgress = $scope.detailTodo.progress;

    $scope.clickOutPopupUocLuong();
  };

  $scope.clickOutPopupUocLuong = function () {
    document.addEventListener(
      "click",
      function (event) {
        if (!document.querySelector(".dialogUocLuong").contains(event.target)) {
          $scope.$apply(function () {
            $scope.closeDialogUocLuong();
          });
        } else {
          $scope.clickOutPopupUocLuong();
        }
      },
      { once: true }
    );
  };

  $scope.closeDialogUocLuong = function () {
    $scope.showDialogUocLuong = false;
  };
};

memberComponent.componentMemberManager = function (
  $scope,
  stompClient,
  MeMemberProjectService
) {
  $scope.showDialogMemberManager = false;

  $scope.openDialogMemberManager = function (event) {
    event.stopPropagation();
    $scope.showDialogAddLabelOut = false;
    $scope.showDialogAllMemberProject = false;
    $scope.showDialogAddLabel = false;
    $scope.showDialogAddPriorityLevel = false;
    $scope.showDialogMemberManager = false;
    if (!$scope.showDialogMemberManager) {
      $scope.showDialogMemberManager = true;
    } else {
      $scope.showDialogMemberManager = false;
    }
  };

  $scope.clickOutPopupMemberManager = function () {
    document.addEventListener(
      "click",
      function (event) {
        if (
          !document.querySelector(".dialogMemberManager").contains(event.target)
        ) {
          $scope.$apply(function () {
            $scope.closeDialogMemberManager();
          });
        } else {
          $scope.clickOutPopupMemberManager();
        }
      },
      { once: true }
    );
  };

  $scope.closeDialogMemberManager = function () {
    $scope.showDialogMemberManager = false;
  };

  $scope.updateMemberProject = function (idMemberProject, index) {
    let obj = {
      idMemberProject: idMemberProject,
      statusWork: parseInt(
        document.querySelectorAll(".select_status_work_member")[index].value
      ),
      role: parseInt(
        document.querySelectorAll(".select_role_member")[index].value
      ),
    };

    stompClient.send(
      "/action/update-member-project" + "/" + $scope.projectId,
      {},
      JSON.stringify(obj)
    );
  };

  $scope.actionReloadDataUpdateMemberProject = function (message) {
    let obj = JSON.parse(message.body).data;

    $scope.listMemberProject.forEach((item) => {
      if (item.idMemberProject == obj.id) {
        item.statusWork = obj.statusWork == "DANG_LAM" ? "0" : "1";
        item.roleProject =
          obj.role == "MANAGER"
            ? "0"
            : obj.role == "LEADER"
            ? "1"
            : obj.role == "DEV"
            ? "2"
            : "3";
      }
    });

    MeMemberProjectService.fetchMembers($scope.projectId).then(function () {
      const memberProject = MeMemberProjectService.getMembers();
      $scope.listManagerProject = [];
      $scope.listLeaderProject = [];
      $scope.listDevProject = [];
      $scope.listTesterProject = [];
      memberProject.forEach((meRes) => {
        const member = $scope.listMemberById.find(
          (me) => meRes.memberId === me.id
        );
        if (member) {
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
    });

    $scope.$apply();
  };

  $scope.showDialogMemberOutProject = false;

  $scope.openDialogMemberOutProject = function (event) {
    event.stopPropagation();
    $scope.showDialogAddLabelOut = false;
    $scope.showDialogAllMemberProject = false;
    $scope.showDialogMemberManager = false;
    $scope.showDialogAddLabel = false;
    $scope.showDialogAddPriorityLevel = false;
    $scope.showDialogMemberOutProject = false;
    if (!$scope.showDialogMemberOutProject) {
      $scope.showDialogMemberOutProject = true;
    } else {
      $scope.showDialogMemberOutProject = false;
    }
  };

  $scope.clickOutPopupMemberOutProject = function () {
    document.addEventListener(
      "click",
      function (event) {
        if (
          !document
            .querySelector(".dialogMemberOutProject")
            .contains(event.target)
        ) {
          $scope.$apply(function () {
            $scope.closeDialogMemberOutProject();
          });
        } else {
          $scope.clickOutPopupMemberOutProject();
        }
      },
      { once: true }
    );
  };

  $scope.closeDialogMemberOutProject = function () {
    $scope.showDialogMemberOutProject = false;
  };

  $scope.backMemberOutProject = function () {
    $scope.showDialogMemberOutProject = false;
    $scope.showDialogMemberManager = true;
  };

  $scope.createMemberProject = function (index, memberId) {
    let obj = {
      memberId: memberId,
      projectId: $scope.projectId,
      role: parseInt(
        document.querySelectorAll(".select_role_member_out_project")[index]
          .value
      ),
    };

    stompClient.send(
      "/action/create-member-project" + "/" + $scope.projectId,
      {},
      JSON.stringify(obj)
    );
  };

  $scope.actionReloadDataCreateMemberProject = function (message) {
    let obj = JSON.parse(message.body).data;

    let newObj = null;
    $scope.listMemberById.forEach((item) => {
      if (item.id == obj.memberId) {
        newObj = item;
        $scope.listMemberNotInProject.splice(
          $scope.listMemberNotInProject.indexOf(item),
          1
        );
      }
    });

    newObj.checknewObjAssign = false;
    newObj.roleProject =
      obj.role == "MANAGER"
        ? "0"
        : obj.role == "LEADER"
        ? "1"
        : obj.role == "DEV"
        ? "2"
        : "3";
    newObj.statusWork = obj.statusWork == "DANG_LAM" ? "0" : "1";
    newObj.idMemberProject = obj.id;

    $scope.listMemberProject.unshift(newObj);

    $scope.numberMemberMore = $scope.listMemberProject.length - 5;
    if ($scope.listMemberProject.length <= 5) {
      $scope.checkNumberMember = false;
    } else {
      $scope.checkNumberMember = true;
    }

    MeMemberProjectService.fetchMembers($scope.projectId).then(function () {
      const memberProject = MeMemberProjectService.getMembers();
      $scope.listManagerProject = [];
      $scope.listLeaderProject = [];
      $scope.listDevProject = [];
      $scope.listTesterProject = [];
      memberProject.forEach((meRes) => {
        const member = $scope.listMemberById.find(
          (me) => meRes.memberId === me.id
        );
        if (member) {
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
    });

    $scope.$apply();
  };
};
