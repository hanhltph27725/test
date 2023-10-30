const assignComponent = {};

assignComponent.createAndDeleteAssign = function (
  $scope,
  $routeParams,
  stompClient
) {
  $scope.createAssign = _.debounce(function (
    idMember,
    nameMember,
    email,
    idTodoCreate
  ) {
    let headers = {
      idMember: idMember,
      nameMember: nameMember,
      email: email,
      idTodoCreateOrDelete: idTodoCreate,
      idTodoList: $scope.idTodoList,
      idTodo: $scope.idTodo,
      projectId: $scope.projectId,
      idUser: $scope.idUser,
    };

    stompClient.send(
      "/action/create-assign/" + $scope.projectId + "/" + $routeParams.idPeriod,
      {},
      JSON.stringify(headers)
    );
  },
  500);

  $scope.deleteAssign = _.debounce(function (
    idMember,
    nameMember,
    email,
    idTodoDelete
  ) {
    let obj = {
      idMember: idMember,
      nameMember: nameMember,
      email: email,
      idTodoCreateOrDelete: idTodoDelete,
      idTodoList: $scope.idTodoList,
      idTodo: $scope.idTodo,
      projectId: $scope.projectId,
      idUser: $scope.idUser,
    };

    stompClient.send(
      "/action/delete-assign/" + $scope.projectId + "/" + $routeParams.idPeriod,
      {},
      JSON.stringify(obj)
    );
  },
  500);

  $scope.createOrDeleteAssign = function (
    event,
    idMember,
    nameMember,
    email,
    idTodo,
    memberCheckAssign
  ) {
    if (memberCheckAssign) {
      $scope.deleteAssign(idMember, nameMember, email, idTodo);
    } else {
      $scope.createAssign(idMember, nameMember, email, idTodo);
    }
  };
};

assignComponent.actionReloadDataAssign = function (
  $scope,
  MeAssignService,
  MeFindTodoById,
  ConvertLongToDateString
) {
  $scope.actionReloadData = async function (
    message,
    todoId,
    idTodoList,
    idTodo
  ) {
    await MeAssignService.fetchMember(idTodo);

    const idMembers = MeAssignService.getMembers();
    let listMemberAfter = [];
    idMembers.forEach((meId) => {
      const member = $scope.listMemberById.find((me) => meId === me.id);
      if (member) {
        listMemberAfter.push(member);
      }
    });

    $scope.todoFindById = $scope.findTodoById(idTodoList, idTodo);

    if ($scope.todoFindById != null) {
      $scope.todoFindById.members = listMemberAfter;
    } else {
      await MeFindTodoById.fetchTodo(idTodo);
      $scope.todoFindById = MeFindTodoById.getTodo();
    }

    $scope.loadDataAfterFilter(idTodoList, idTodo);

    if ($scope.detailTodo.id != null && $scope.detailTodo.id == idTodo) {
      $scope.detailTodo.listMemberDetailTodo = $scope.listMemberById.filter(
        (member) => MeAssignService.getMembers().includes(member.id)
      );
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

      $scope.checkJoinTodo = true;

      $scope.detailTodo.listMemberDetailTodo.forEach((item) => {
        if (item.id === $scope.idUser) {
          $scope.checkJoinTodo = false;
        }
      });
    }

    if($scope.idTodoAssign == idTodo){
      $scope.listMemberAssign = $scope.listMemberById.filter(
        (member) => MeAssignService.getMembers().includes(member.id)
      );
      $scope.listMemberProject.forEach((meId) => {
        let memberCheckAssign = $scope.listMemberAssign.find(
          (me) => meId.id === me.id
        );
        if (memberCheckAssign != null) {
          meId.checkMemberAssign = true;
        } else {
          meId.checkMemberAssign = false;
        }
      });

      $scope.checkJoinTodo = true;

      $scope.listMemberAssign.forEach((item) => {
        if (item.id === $scope.idUser) {
          $scope.checkJoinTodo = false;
        }
      });
    }

    let objActivity = JSON.parse(message.body).data.dataActivity;

    if (
      $scope.detailTodo.id != null &&
      $scope.showDetailActivityTrueFalse &&
      objActivity != null &&
      $scope.detailTodo.id == idTodo
    ) {
      $scope.convertObjectActivity(objActivity);
    }

    $scope.$apply();
    $scope.clickOutPopupAddMember();
  };
};

assignComponent.joinAndOutAssign = function (
  $scope,
  $routeParams,
  stompClient
) {
  $scope.joinAssign = _.debounce(function (idMember, idTodoCreate) {
    let email = "";
    $scope.listMemberProject.forEach(item => {
      if(item.id == $scope.idUser){
        email = item.email;
      }
    })
    let headers = {
      idMember: idMember,
      nameMember: null,
      email: email,
      idTodoCreateOrDelete: idTodoCreate,
      idTodoList: $scope.idTodoList,
      idTodo: $scope.idTodo,
      projectId: $scope.projectId,
      idUser: $scope.idUser,
    };

    stompClient.send(
      "/action/join-assign/" + $scope.projectId + "/" + $routeParams.idPeriod,
      {},
      JSON.stringify(headers)
    );
  }, 500);

  $scope.outAssign = _.debounce(function (idMember, idTodoDelete) {
    let obj = {
      idMember: idMember,
      nameMember: null,
      email: null,
      idTodoCreateOrDelete: idTodoDelete,
      idTodoList: $scope.idTodoList,
      idTodo: $scope.idTodo,
      projectId: $scope.projectId,
      idUser: $scope.idUser,
    };

    stompClient.send(
      "/action/out-assign/" + $scope.projectId + "/" + $routeParams.idPeriod,
      {},
      JSON.stringify(obj)
    );
  }, 500);
};
