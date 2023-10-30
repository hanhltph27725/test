app.service("MeCommentService", function ($http) {
  var comments = [];
  var totalPageComments = 0;

  this.getComments = function () {
    return comments;
  };

  this.getTotalPageComments = function () {
    return totalPageComments;
  };

  this.setComments = function (data) {
    comments = data;
  };

  this.fetchComments = function (idTodo, page) {
    return $http
      .get(apiMemberGetAllCommentByIdTodo + "?idTodo=" + idTodo + "&page=" + page)
      .then(
        function (response) {
          if (response.status === 200) {
            comments = response.data.data.data;
            totalPageComments = response.data.data.totalPages;
          }
          return response;
        },
        function (errors) {
          console.log(errors);
        }
      );
  };
});
