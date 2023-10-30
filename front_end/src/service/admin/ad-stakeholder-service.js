app.service("AdGetAllStakeholderService", function ($http) {
  var stakeholder = [];
  var totalPages = 0;

  this.getStakeholder = function () {
    return stakeholder;
  };

  this.getTotalPages = function () {
    return totalPages;
  };

  this.setStakeholder = function (data) {
    stakeholder = data;
  };

  this.fetchStakeholder = function () {
    return $http.get(stakeholderAPI).then(
      function (response) {
        if (response.status === 200) {
          stakeholder = response.data.data.data;
          totalPages = response.data.data.totalPages;
        }
        return response;
      },
      function (errors) {
        console.log(errors);
      }
    );
  };

  this.searchStakeholder = function (inputSearchName, inputUser) {
    return $http
      .get(
        stakeholderAPI + "?name=" + inputSearchName + "&userName=" + inputUser
      )
      .then(
        function (response) {
          if (response.status === 200) {
            stakeholder = response.data.data.data;
            totalPages = response.data.data.totalPages;
          }
          return response;
        },
        function (errors) {
          console.log(errors);
        }
      );
  };

  this.pageStakeholder = function (inputSearchName, inputUser, currentPage) {
    return $http
      .get(
        stakeholderAPI +
          "?name=" +
          inputSearchName +
          "&userName=" +
          inputUser +
          "&page=" +
          currentPage
      )
      .then(
        function (response) {
          if (response.status === 200) {
            stakeholder = response.data.data.data;
            totalPages = response.data.data.totalPages;
          }
          return response;
        },
        function (errors) {
          console.log(errors);
        }
      );
  };
});
