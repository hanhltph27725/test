app.service("MeResourceService", function ($http) {
  var resources = [];

  this.getResources = function () {
    return resources;
  };

  this.fetchResources = function (idTodo) {
    return $http.get(apiMemberResource + "?idTodo=" + idTodo).then(
      function (response) {
        if (response.status === 200) {
          resources = response.data.data;
        }
        return response;
      },
      function (errors) {
        console.log(errors);
      }
    );
  };
});
