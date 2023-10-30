app.service("MeActivityService", function ($http) {
  var actvities = [];

  this.getActivities = function () {
    return actvities;
  };

  this.setActivities = function (data) {
    actvities = data;
  };

  this.fetchActivities = function (idTodo) {
    return $http.get(apiMemberAllActivityByIdTodo + "/" + idTodo).then(
      function (response) {
        if (response.status === 200) {
          actvities = response.data.data;
        }
        return response;
      },
      function (errors) {
        console.log(errors);
      }
    );
  };
});
