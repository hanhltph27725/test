window.MemberProjectIsParticipatingController = function (
  $scope,
  MeProjectService,
  MeMemberProjectService,
  MeMemberService
) {
  document.body.style.backgroundImage = "url('" + "')";
  document.body.style.backgroundColor = "";
  document.title = "Danh sách dự án | Portal Project";
  $scope.idUser = "c5cf1e20-bdd4-11ed-afa1-0242ac120002";

  Promise.all([
    MeMemberService.fetchMembers(),
    MeProjectService.fetchProjects($scope.idUser),
  ]).then(function () {
    $scope.listMembersById = MeMemberService.getMembers();
    $scope.listProjectById = MeProjectService.getProjects();

    if ($scope.listProjectById.length === 0) {
      $scope.nodataProjects = "Bạn chưa tham gia dự án nào";
    } else {
      $scope.nodataProjects = "";
    }

    const fetchMemberProjects = $scope.listProjectById.map((item) => {
      return MeMemberProjectService.fetchMembers(item.id).then(function () {
        let listMemberFetch = MeMemberProjectService.getMembers();
        item.listMember = listMemberFetch.map((member) => {
          return $scope.listMembersById.find((me) => me.id == member.memberId);
        });
      });
    });

    Promise.all(fetchMemberProjects).then(function () {});
  });
};
