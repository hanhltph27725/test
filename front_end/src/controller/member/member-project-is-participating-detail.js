window.MemberProjectIsParticipatingDetailController = function (
  $scope,
  $http,
  $filter,
  $rootScope,
  $timeout,
  $location,
  $routeParams,
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
  MeTodoTodoListHelper,
  MeFilterTodoService,
  MeCheckFilterTodo,
  MeFindTodoById,
  MeActivityService,
  MeCommentService,
  MeImageService,
  MeResourceService
) {
  document.querySelector("body").classList.add("toggle-sidebar");
  $scope.idUser = "c5cf1e20-bdd4-11ed-afa1-0242ac120002";
  // change background
  const socket = new SockJS(
    "http://localhost:6789/portal-projects-websocket-endpoint"
  );
  const stompClient = Stomp.over(socket);

  $scope.projectId = $routeParams.id;

  $rootScope.ignoreUpdate = true;

  $scope.objFilter = {
    name: "",
    member: [],
    label: [],
    dueDate: [],
  };

  $scope.detailTodo = null;

  projectComponent.changeBackgroundProject($scope, stompClient);

  // change Period Select
  periodComponent.changePeriod(
    $scope,
    $location,
    $scope.projectId,
    stompClient,
    MeTodoService,
    MeAssignService,
    MeLabelService,
    ConvertLongToDateString
  );

  periodComponent.actionLoadDataAfterFilter(
    $scope,
    $routeParams,
    MeAssignService,
    MeLabelService,
    ConvertLongToDateString,
    MeTodoTodoListHelper,
    MeCheckFilterTodo
  );

  // Member manager
  memberComponent.componentMemberManager(
    $scope,
    stompClient,
    MeMemberProjectService
  );

  commentComponent.functionComment(
    $scope,
    $http,
    stompClient,
    $routeParams,
    ConvertLongToDateString,
    MeCommentService,
    $filter
  );

  // MenuRight
  projectComponent.showHideRightMenu($scope);

  // Drag And Drop TodoList
  todoListComponent.dragAndDropTodoList($scope, stompClient);

  // Drag And Drop Todo
  todoComponent.dragAndDropTodo(
    $scope,
    $routeParams,
    stompClient,
    MeTodoTodoListHelper,
    ConvertLongToDateString
  );

  // Add card
  todoComponent.addCardTodo(
    $scope,
    $routeParams,
    stompClient,
    MeTodoTodoListHelper
  );

  // Hide modal
  todoListComponent.hideModal($scope, $location);

  //Detail Todo
  todoComponent.actionDetailTodo(
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
  );

  // resizeDescription
  todoComponent.resizeDescription($scope);

  // dialogAllMemberProject
  memberProjectComponent.dialogAllMemberProject($scope);

  // dialogAddPriorityLevel
  todoComponent.actionAddPriorityLevel(
    $scope,
    $routeParams,
    stompClient,
    MeDetailTodoService
  );

  // dialogProfile
  memberComponent.dialogProfile($scope);

  // dialogAddMember
  memberComponent.dialogAddMember($scope);

  // Create And Delete assign
  assignComponent.createAndDeleteAssign($scope, $routeParams, stompClient);

  // JOin and Out Assign
  assignComponent.joinAndOutAssign($scope, $routeParams, stompClient);

  $scope.findTodoById = function (idTodoList, idTodo) {
    $scope.todoListFind = MeTodoTodoListHelper.findTodoList(
      $scope.listTask,
      idTodoList
    );
    return MeTodoTodoListHelper.findTodo($scope.todoListFind.todoList, idTodo);
  };

  // actionReloadDataAssign
  assignComponent.actionReloadDataAssign(
    $scope,
    MeAssignService,
    MeFindTodoById,
    ConvertLongToDateString
  );

  // dialogAddLabel
  labelComponent.dialogAddLabel(
    $scope,
    MeLabelService,
    $routeParams,
    stompClient
  );

  // Dialog deadline
  todoComponent.dialogAddDeadline($scope);

  // dialogAddFilter
  periodComponent.dialogAddFilter(
    $scope,
    $location,
    $routeParams,
    MeAssignService,
    MeLabelService,
    ConvertLongToDateString,
    MeFilterTodoService,
    MeTodoService
  );

  //createAndDeleteLabel
  labelComponent.createAndDeleteLabel($scope, $routeParams, stompClient);

  // actionReloadLabelTodo
  labelComponent.actionReloadLabelTodo($scope, MeLabelService, MeFindTodoById);

  // dialogAddPriorityLevel
  todoComponent.dialogAddPriorityLevel($scope);

  // showMenuDialogPeriod
  periodComponent.showMenuDialogPeriod($scope, $routeParams);

  // action AddAndSaveTodo
  todoComponent.actionSaveAndAddTodoInCheckList(
    $scope,
    $routeParams,
    $timeout,
    stompClient
  );

  // changeProgressTodo
  todoComponent.changeProgressTodo($scope, $routeParams, stompClient);

  // actionRemoveTodoInCheckList
  todoComponent.actionRemoveTodoInCheckList($scope, $routeParams, stompClient);

  // saveDescriptionComponent
  todoComponent.saveDescriptionComponent($scope, $routeParams, stompClient);

  todoComponent.actionUpdateCompleteTodo(
    $scope,
    $location,
    $routeParams,
    stompClient,
    ConvertLongToDateString,
    MeFindTodoById,
    MeTodoTodoListHelper
  );

  // Subscribe websocket
  stomClientComponent.connectSuccess(
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
  );

  // actionSaveAndRemoveDueDate
  todoComponent.actionSaveAndRemoveDueDate(
    $scope,
    $routeParams,
    stompClient,
    ConvertLongToDateString,
    MeFindTodoById
  );

  // actionAddTodoList
  todoListComponent.actionAddTodoList(
    $scope,
    stompClient,
    MeTodoTodoListHelper
  );

  periodComponent.functionFilterTodo(
    $scope,
    $routeParams,
    $location,
    MeFilterTodoService,
    MeAssignService,
    MeLabelService,
    ConvertLongToDateString
  );

  periodComponent.select2Filter($scope);

  ActivityComponent.actionShowDetailActivity(
    $scope,
    MeActivityService,
    ConvertLongToDateString
  );

  imageComponent.actionImageComponent(
    $scope,
    $http,
    $location,
    $routeParams,
    stompClient,
    ConvertLongToDateString
  );

  ViewTable.addComponent(
    $scope,
    $routeParams,
    MeAssignService,
    MeLabelService,
    stompClient
  );

  resourceComponent.actionResourceComponent(
    $scope,
    stompClient,
    $routeParams,
    ConvertLongToDateString
  );

  if (
    localStorage.getItem("showDialogViewTable:" + $scope.projectId) == "true"
  ) {
    $scope.showDialogViewTable = true;
    $scope.selectedView = "table";
  } else {
    $scope.showDialogViewTable = false;
    $scope.selectedView = "board";
  }

  todoComponent.actionSortTodo(
    $scope,
    $routeParams,
    stompClient,
    MeTodoService,
    MeAssignService,
    MeLabelService,
    ConvertLongToDateString,
    MeFilterTodoService
  );
};
