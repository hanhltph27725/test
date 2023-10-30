window.AdminStakeholderManagementController = function (
  $scope,
  $http,
  $routeParams,
  AdGetAllStakeholderService
) {
  $scope.listStakeholder = [];
  document.body.style.backgroundImage = "url('" + "')";
  document.title = "Quản lý bên liên quan | Portal Projects";
  loadDataListStakeholder();

  $scope.input_searchName = "";
  $scope.input_searchUser = "";
  $scope.arrayPage = [];
  function loadDataListStakeholder() {
    AdGetAllStakeholderService.fetchStakeholder().then(function () {
      $scope.listStakeholder = AdGetAllStakeholderService.getStakeholder();
      $scope.totalPages = AdGetAllStakeholderService.getTotalPages();
      $scope.arrayPage = genArrayPage($scope.totalPages);
    });
  }
  // search stakeholder
  $scope.searchStakeholder = function () {
    AdGetAllStakeholderService.searchStakeholder(
      $scope.input_searchName,
      $scope.input_searchUser
    ).then(function () {
      $scope.listStakeholder = AdGetAllStakeholderService.getStakeholder();
      $scope.totalPages = AdGetAllStakeholderService.getTotalPages();
      $scope.arrayPage = genArrayPage($scope.totalPages);
    });
  };
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
    AdGetAllStakeholderService.pageStakeholder(
      $scope.input_searchName,
      $scope.input_searchUser,
      currentPage
    ).then(function () {
      $scope.listStakeholder = AdGetAllStakeholderService.getStakeholder();
      $scope.arrayPage = genArrayPage(
        AdGetAllStakeholderService.getTotalPages()
      );
    });
  };

  $scope.form_stakeholder = {
    id: "",
    username: "",
    name: "",
    phoneNumber: "",
    emailFE: "",
    emailFPT: "",
  };

  $scope.clearModal = function () {
    $scope.form_stakeholder.name = "";
    $scope.form_stakeholder.username = "";
    $scope.form_stakeholder.phoneNumber = "";
    $scope.form_stakeholder.emailFE = "";
    $scope.form_stakeholder.emailFPT = "";
    $scope.error_username = "";
    $scope.error_name = "";
    $scope.error_phone = "";
    $scope.error_emailFpt = "";
    $scope.error_emailFe = "";
  };

  $scope.clearBoLoc = function () {
    $scope.input_searchName = "";
    $scope.input_searchUser = "";
    loadDataListStakeholder();
  };

  function checkValidate() {
    let check = 0;
    var regexPhone =
      /(0?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}/;
    var regexEmailFe = /\w+@fe.edu.vn/;
    var regexEmailFpt = /\w+@fpt.edu.vn/;
    if ($scope.form_stakeholder.username.trim().length === 0) {
      ++check;
      $scope.error_username = "User Name _ không được để trống !";
    } else if ($scope.form_stakeholder.username.length > 20) {
      ++check;
      $scope.error_username = "User Name _ không quá 20 ký tự !";
    } else {
      $scope.error_username = "";
    }

    if ($scope.form_stakeholder.name.trim().length === 0) {
      ++check;
      $scope.error_name = "Tên _ không được để trống !";
    } else if ($scope.form_stakeholder.name.trim().length > 100) {
      ++check;
      $scope.error_name = "Tên _ không quá 100 ký tự !";
    } else {
      $scope.error_name = "";
    }

    if ($scope.form_stakeholder.phoneNumber.trim().length === 0) {
      ++check;
      $scope.error_phone = "SĐT _ không được để trống !";
    } else if (!$scope.form_stakeholder.phoneNumber.match(regexPhone)) {
      ++check;
      $scope.error_phone = "SĐT _ Không đúng định dạng !";
    } else {
      $scope.error_phone = "";
    }

    if ($scope.form_stakeholder.emailFE.trim().length === 0) {
      ++check;
      $scope.error_emailFe = "EmailFE _ không được để trống !";
    } else if (!$scope.form_stakeholder.emailFE.match(regexEmailFe)) {
      ++check;
      $scope.error_emailFe = "EmailFE _ Không đúng định dạng !";
    } else {
      $scope.error_emailFe = "";
    }

    if ($scope.form_stakeholder.emailFPT.trim().length === 0) {
      ++check;
      $scope.error_emailFpt = "EmailFPT _ không được để trống !";
    } else if (!$scope.form_stakeholder.emailFPT.match(regexEmailFpt)) {
      ++check;
      $scope.error_emailFpt = "EmailFPT_ Không đúng định dạng !";
    } else {
      $scope.error_emailFpt = "";
    }
    if (check > 0) {
      return false;
    }
    return true;
  }

  //add stakeholder
  $scope.addStakeholder = function () {
    if (checkValidate() == true) {
      $http.post(stakeholderAPI + "/add", $scope.form_stakeholder).then(
        function (response) {
          loadDataListStakeholder();
          toastr.success("Thêm thành công", "Thông báo!", {
            closeButton: true,
            progressBar: true,
            positionClass: "toast-top-center",
          });
          $("#stakeholderModal").modal("hide");
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

  $scope.viTri = -1;
  function viewStakeholder(stakeholder, index) {
    $scope.form_stakeholder.id = stakeholder.id;
    $scope.form_stakeholder.username = stakeholder.userName;
    $scope.form_stakeholder.name = stakeholder.name;
    $scope.form_stakeholder.phoneNumber = stakeholder.phoneNumber;
    $scope.form_stakeholder.emailFE = stakeholder.emailFe;
    $scope.form_stakeholder.emailFPT = stakeholder.emailFpt;
    $scope.viTri = index;
  }
  // detail Stakeholder
  $scope.detailStakeholder = function (event, index) {
    event.preventDefault();
    let stakeholder = $scope.listStakeholder[index];
    viewStakeholder(stakeholder, index);
  };

  // update stakeholder
  $scope.updateStakeholder = function (event) {
    event.preventDefault();
    let stakeholderId = $scope.form_stakeholder.id;
    let api = stakeholderAPI + "/update/" + stakeholderId;
    if (checkValidate() == true) {
      $http.put(api, $scope.form_stakeholder).then(
        function (response) {
          loadDataListStakeholder();
          toastr.success("Cập nhật thành công", "Thông báo!", {
            closeButton: true,
            progressBar: true,
            positionClass: "toast-top-center",
          });
          $("#stakeholderModalUpdate").modal("hide");
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
};
