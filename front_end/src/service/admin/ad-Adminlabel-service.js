app.service("AdViewLabelService", function ($http) {
  var labels = [];
  var totalpages = 0;

  this.getLabel = function () {
    return labels;
  };

  this.getTotalpages = function () {
    return totalpages;
  };

  this.setLabel = function (data) {
    labels = data;
  };

  this.fetchLabel = function () {
    return $http.get(admin_label).then(
      function (response) {
        if (response.status === 200) {
          labels = response.data.data.data;
          console.log(labels);
          totalpages = response.data.data.totalPages;
        }
        return response;
      },
      function (errors) {
        console.log(errors);
      }
    );
  };

  this.searchLabel = function (inputName,inputCode) {
    return $http.get(admin_label + "?name=" + inputName +"&code="+inputCode).then(
      function (response) {
        if (response.status === 200) {
          labels = response.data.data.data;
          totalpages = response.data.data.totalPages;
        }
        return response;
      },
      function (errors) {
        console.log(errors);
      }
    );
  };

  this.pageLabel = function (inputName,inputCode, currentPage) {
    return $http
      .get(admin_label + "?name=" + inputName +"&code="+inputCode + "&page=" + currentPage)
      .then(
        function (response) {
          if (response.status === 200) {
            labels = response.data.data.data;
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

app.service("GetAllIdLabelService", function ($http) {

  var listStatusFix = [];
  this.getAllLabel = function () {
    return listStatusFix;
  };

  this.setAllLabel = function (data) {
    listStatusFix = data;
  };

  this.fetchAllIdStatusLabel = function () {
    return $http.get(admin_label_status+"/0").then(
      function (response) {
        if (response.status === 200) {
          listStatusFix = response.data.data;
          console.log(listStatusFix)
        }
        return response;
      },
      function (errors) {
        console.log(errors);
      }
    );
  };
});
