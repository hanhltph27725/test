app.service("AdGetAllCategoryService", function ($http) {
  var categories = [];
  var categoriesId = [];
  var totalpages = 0;

  this.getCategory = function () {
    return categories;
  };

  this.getTotalpages = function () {
    return totalpages;
  };

  this.setCategory = function (data) {
    categories = data;
  };

  this.getCategoriesId= function () {
    return categoriesId;
  };

  this.fetchCategory = function () {
    return $http.get(categoryAPI).then(
      function (response) {
        if (response.status === 200) {
          categories = response.data.data.data;
          totalpages = response.data.data.totalPages;
        }
        return response;
      },
      function (errors) {
        console.log(errors);
      }
    );
  };

  this.fetchCategoryById = function () {
    return $http.get(categoryAPI_getById).then(
      function (response) {
        if (response.status === 200) {
          categoriesId = response.data.data;
          console.log(categoriesId);
        }
        return response;
      },
      function (errors) {
        console.log(errors);
      }
    );
  };

  this.searchCategory = function (inputName, inputCode) {
    return $http.get(categoryAPI + "/search" + "?name=" + inputName +"&code="+inputCode).then(
      function (response) {
        if (response.status === 200) {
          categories = response.data.data.data;
          totalpages = response.data.data.totalPages;
        }
        return response;
      },
      function (errors) {
        console.log(errors);
      }
    );
  };

  this.pageCategory = function (inputCode, inputName, currentPage) {
    return $http
      .get(
        categoryAPI +
          "/search" + "?name=" + inputName +"&code="+inputCode+
          "&page=" + currentPage
      )
      .then(
        function (response) {
          if (response.status === 200) {
            categories = response.data.data.data;
            totalpages = response.data.data.totalPages;
          }
          return response;
        },
        function (errors) {
          console.log(errors);
        }
      );
  };
});
