const memberProjectComponent = {};

memberProjectComponent.dialogAllMemberProject = function ($scope) {
  $scope.showDialogAllMemberProject = false;

  $scope.openDialogAllMemberProject = function (event) {
    event.stopPropagation();
    $scope.showDialogAddLabelOut = false;
    $scope.showDialogAddLabel = false;
    $scope.showDialogAddPriorityLevel = false;
    $scope.showDialogAllMemberProjectOut = false;

    if (!$scope.showDialogAllMemberProject) {
      $scope.showDialogAllMemberProject = true;
    } else {
      $scope.showDialogAllMemberProject = false;
    }

    $scope.clickOutPopupAllMemberProject();
  };

  $scope.clickOutPopupAllMemberProject = function () {
    document.addEventListener(
      "click",
      function (event) {
        if (
          !document
            .querySelector(".dialogAllMemberProject")
            .contains(event.target)
        ) {
          $scope.$apply(function () {
            $scope.closeDialogAllMemberProject();
          });
        } else {
          $scope.clickOutPopupAllMemberProject();
        }
      },
      { once: true }
    );
  };

  $scope.closeDialogAllMemberProject = function () {
    $scope.showDialogAllMemberProject = false;
  };
};
