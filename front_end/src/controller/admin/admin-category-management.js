window.AdminCategoryManagementController = function (
  $scope,
  $http,
  $routeParams,
  AdGetAllCategoryService
) {
  document.body.style.backgroundImage = "url('" + "')";
  document.title = "Quản lý thể loại | Portal Projects";
  $scope.listCategory = [];

  loadDataListCategory();

  $scope.arrayPage = [];
  function loadDataListCategory() {
    AdGetAllCategoryService.fetchCategory().then(function () {
      $scope.listCategory = AdGetAllCategoryService.getCategory();
      $scope.totalPages = AdGetAllCategoryService.getTotalpages();
      $scope.arrayPage = genArrayPage($scope.totalPages);
    });
  }

  function genArrayPage(value) {
    let array = [];
    for (let i = 1; i <= value; i++) {
      array.push(i);
    }
    return array;
  }

  $scope.currentPage = 0;
  $scope.actionPage = function (currentPage) {
    $scope.currentPage = currentPage;
    AdGetAllCategoryService.pageCategory($scope.input_search, currentPage).then(
      function () {
        $scope.listCategory = AdGetAllCategoryService.getCategory();
        $scope.arrayPage = genArrayPage(
          AdGetAllCategoryService.getTotalpages()
        );
      }
    );
  };

  // insert categories
  $scope.form_category = {
    id: "",
    code: "",
    name: "",
  };

  $scope.insertCategory = function () {
    let check = 0;
    if ($scope.form_category.code.trim().length === 0) {
      ++check;
      $scope.error_code = "Mã danh mục không để trống";
    } else if ($scope.form_category.code.length > 15) {
      ++check;
      $scope.error_code = "Mã danh mục không quá 15 ký tự";
    } else {
      $scope.error_code = "";
    }

    if ($scope.form_category.name.trim().length === 0) {
      ++check;
      $scope.error_name = "Tên danh mục không để trống";
    } else if ($scope.form_category.name.trim().length > 100) {
      ++check;
      $scope.error_name = "Tên danh mục không quá 100 ký tự";
    } else {
      $scope.error_name = "";
    }
    if (check == 0) {
      $http.post(categoryAPI + "/add", $scope.form_category).then(
        function (response) {
          loadDataListCategory();
          toastr.success("Thêm thành công", "Thông báo!", {
            closeButton: true,
            progressBar: true,
            positionClass: "toast-top-center",
          });
          $("#modalAddCategory").modal("hide");
        },
        function (error) {
          console.log(error);
          toastr.error(error.data.message, "Thông báo!", {
            closeButton: true,
            progressBar: true,
            positionClass: "toast-top-center",
          });
        }
      );
    }
  };

  // detail categories
  $scope.viTri = -1;
  $scope.form_detail_category = {
    id: "",
    code: "",
    name: "",
  };
  $scope.detailCategory = function (event, index) {
    event.preventDefault();
    let category = $scope.listCategory[index];
    $scope.form_detail_category.code = category.code;
    $scope.form_detail_category.name = category.name;
    $scope.viTri = index;
  };

  // update categories
  $scope.updateCategory = function (event) {
    event.preventDefault();
    let check = 0;
    if ($scope.form_detail_category.code.trim().length === 0) {
      ++check;
      $scope.error_code = "Mã danh mục không để trống";
    } else if ($scope.form_detail_category.code.trim().length > 15) {
      ++check;
      $scope.error_code = "Mã danh mục không quá 15 ký tự";
    } else {
      $scope.error_code = "";
    }

    if ($scope.form_detail_category.name.trim().length === 0) {
      ++check;
      $scope.error_name = "Tên danh mục không để trống";
    } else if ($scope.form_detail_category.name.trim().length > 100) {
      ++check;
      $scope.error_name = "Tên danh mục không quá 100 ký tự";
    } else {
      $scope.error_name = "";
    }

    let category = $scope.listCategory[$scope.viTri];
    let api = categoryAPI + "/" + category.id;

    if (check == 0) {
      $http.put(api, $scope.form_detail_category).then(
        function (response) {
          loadDataListCategory();
          toastr.success("Cập nhật thành công", "Thông báo!", {
            closeButton: true,
            progressBar: true,
            positionClass: "toast-top-center",
          });
          $("#modalUpdateCategory").modal("hide");
        },
        function (error) {
          console.log(error);
          toastr.error(error.data.message, "Thông báo!", {
            closeButton: true,
            progressBar: true,
            positionClass: "toast-top-center",
          });
        }
      );
    }
  };
  // search
  $scope.input_search = "";
  $scope.searchCategory = function () {
    AdGetAllCategoryService.searchCategory($scope.input_search).then(
      function () {
        $scope.listCategory = AdGetAllCategoryService.getCategory();
        $scope.totalPages = AdGetAllCategoryService.getTotalpages();
        $scope.arrayPage = genArrayPage($scope.totalPages);
      }
    );
  };
};
