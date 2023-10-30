const ActivityComponent = {};

ActivityComponent.actionShowDetailActivity = function (
  $scope,
  MeActivityService,
  ConvertLongToDateString
) {
  $scope.showDetailActivity = async function () {
    $scope.showDetailActivityTrueFalse = true;

    await MeActivityService.fetchActivities($scope.detailTodo.id);

    $scope.listActivityByIdTodo = MeActivityService.getActivities();

    $scope.listActivityByIdTodo.forEach((item) => {
      let memberCreatedById = $scope.findMemberById(item.memberCreatedId);

      item.nameMemberCreated =
        memberCreatedById.name + " " + memberCreatedById.code;
      item.imageMemberCreated = memberCreatedById.image;

      ConvertLongToDateString.setDateString(item.createdDate);
      item.convertDate = ConvertLongToDateString.getDateString();
    });
    console.log($scope.listActivityByIdTodo);
    $scope.$apply();
  };

  $scope.convertObjectActivity = function (objActivity) {
    let obj = {
      id: objActivity.id,
      memberCreatedId: objActivity.memberCreatedId,
      memberId: objActivity.memberId,
      projectId: objActivity.projectId,
      todoId: objActivity.todoId,
      todoListId: objActivity.todoListId,
      contentAction: objActivity.contentAction,
      urlImage: objActivity.urlImage,
      createdDate: objActivity.createdDate,
      nameMemberCreated: "",
      imageMemberCreated: "",
      convertDate: "",
    };

    let memberCreatedById = $scope.findMemberById(obj.memberCreatedId);

    obj.nameMemberCreated =
      memberCreatedById.name + " " + memberCreatedById.code;
    obj.imageMemberCreated = memberCreatedById.image;

    ConvertLongToDateString.setDateString(obj.createdDate);
    obj.convertDate = ConvertLongToDateString.getDateString();

    $scope.listActivityByIdTodo.unshift(obj);
  };
};
