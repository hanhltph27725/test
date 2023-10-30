app.service("MeNotificationMemberService", function ($http) {
  var notificationMembers = [];
  let totalPages = 0;
  let currentPage = 0;
  let count = 0;
  this.getNotificationMembers = function () {
    return notificationMembers;
  };

  this.getTotalPages = function () {
    return totalPages;
  };

  this.getCurrentPage = function () {
    return currentPage;
  };

  this.getCount = function () {
    return count;
  };

  this.fetchNotificationMembers = function (memberId, page) {
    return $http
      .get(apiNotificationMember + "?memberId=" + memberId + "&page=" + page)
      .then(
        function (response) {
          if (response.status === 200) {
            notificationMembers = response.data.data.data;
            totalPages = response.data.data.totalPages;
            currentPage = response.data.data.currentPage;
          }
          return response;
        },
        function (errors) {
          console.log(errors);
        }
      );
  };

  this.fetchCountNotificationMember = function (memberId) {
    return $http.get(apiNotificationMember + "/count" + "?memberId=" + memberId).then(
      function (response) {
        if (response.status === 200) {
          count = response.data.data;
        }
        return response;
      },
      function (errors) {
        console.log(errors);
      }
    );
  };
});
