app.service("MeImageService", function ($http) {
  var image = [];

  this.getImage = function () {
    return image;
  };

  this.fetchImage = function (id) {
    return $http.get(apiMemberDetailImage + "/" + id).then(
      function (response) {
        if (response.status === 200) {
          image = response.data.data;
        }
        return response;
      },
      function (errors) {
        console.log(errors);
      }
    );
  };

  var images = [];

  this.getImages = function () {
    return images;
  };

  this.fetchImages = function (idTodo) {
    return $http.get(apiMemberGetAllImage + "/" + idTodo).then(
      function (response) {
        if (response.status === 200) {
          images = response.data.data;
        }
        return response;
      },
      function (errors) {
        console.log(errors);
      }
    );
  };
});
