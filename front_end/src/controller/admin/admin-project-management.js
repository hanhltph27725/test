window.AdminProjectManagementController = function (
  $scope,
  $http,
  AdGetAllProject,
  MeMemberService,
  AdMemberProjcetService,
  getOneAdMemberProjcetService,
  GetAllIdLabelService,
  AdGetAllCategoryService,
  AdProjcetCategoryService
) {
  document.body.style.backgroundImage = "url('" + "')";
  document.title = "Quản lý dự án | Portal Projects";
  $scope.listProject = [];
  $scope.listIdCategory = [];
  $scope.formSearch = {
    nameProject: "",
    nameCategory: "",
  };
  $scope.form_project = {
    id: "",
    code: "",
    name: "",
    descriptions: "",
    startTime: "",
    endTime: "",
    progress: 0,
    statusProject: "1",
  };

  $scope.form_project_update = {
    id: "",
    code: "",
    name: "",
    descriptions: "",
    startTime: "",
    endTime: "",
    progress: 0,
    statusProject: "1",
  };

  //load data
  $scope.arrayPage = [];
  function loadDataListProject() {
    AdGetAllProject.fetchProject().then(function () {
      $scope.listProject = AdGetAllProject.getProject();
      $scope.totalPages = AdGetAllProject.getTotalpages();
      $scope.arrayPage = genArrayPage($scope.totalPages);
    });
  }
  function loadDataListIdCategory() {
    AdGetAllCategoryService.fetchCategoryById().then(function () {
      $scope.listIdCategory = AdGetAllCategoryService.getCategoriesId();
      console.log($scope.listIdCategory);
    });
  }

  loadDataListIdCategory();
  loadDataListProject();

  //search tên dự án
  $scope.formSearch = {
    nameProject: "",
    nameCategory: "",
  };
  console.log($scope.formSearch);
  $scope.search = function () {
    AdGetAllProject.searchProject(
      $scope.formSearch.nameProject,
      $scope.formSearch.nameCategory
    ).then(function () {
      $scope.listProject = AdGetAllProject.getProject();
      $scope.totalPages = AdGetAllProject.getTotalpages();
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
    AdGetAllProject.pageProject(
      $scope.formSearch.nameProject,
      $scope.formSearch.nameCategory,
      currentPage
    ).then(function () {
      $scope.listProject = AdGetAllProject.getProject();
      $scope.arrayPage = genArrayPage(AdGetAllProject.getTotalpages());
    });
  };

  // clear
  $scope.clearInputModalAdd = function () {
    $scope.form_project.name = "";
    $scope.form_project.code = "";
    $scope.form_project.descriptions = "";
    $scope.form_project.startTime = "";
    $scope.form_project.endTime = "";
  };

  $scope.clearInputSearch = function () {
    $scope.formSearch.nameProject = "";
    $scope.formSearch.nameCategory = "";
  };

  // lấy danh sách thể loại khi add project
  $scope.selectedCategories = {}; // khởi tạo object rỗng để lưu trữ các giá trị được chọn
  $scope.getSelectedCategories = function () {
    var selected = [];
    angular.forEach(Object.keys($scope.selectedCategories), function (key) {
      if ($scope.selectedCategories[key]) {
        selected.push(key);
      }
    });
    return selected;
  };

  //clear all selected checked
  $scope.clearSelectedCategories = function () {
    angular.forEach(Object.keys($scope.selectedCategories), function (key) {
      $scope.selectedCategories[key] = false;
    });
  };

  $scope.detailCate = []; // Khởi tạo mảng detail
  $scope.selectedCategoriesCheck = {}; // Khởi tạo object selectedCategoriesCheck
  $scope.listUpdateProjectCategoryByIdProject = [];

  // Hàm updateDetail() được gọi khi người dùng check hoặc uncheck checkbox
  $scope.updateDetail = function (id) {
    $scope.detailCate = [];
    $scope.listIdCategory.forEach(function (item) {
      // Kiểm tra xem `id` của phần tử đang được duyệt có tồn tại trong `listProjectCategoryByIdProject` không
      if (item.checkboxCategory == true) {
        $scope.detailCate.push(item.id);
      }
    });
    console.log($scope.detailCate);
  };

  // thêm project
  $scope.project_creat = {};
  $scope.addProject = function () {
    let check = 0;
    if ($scope.getSelectedCategories().length <= 0) {
      ++check;
      $scope.errorCategoryAdd = "Vui lòng chọn thể loại dự án";
    }
    if ($scope.form_project.code === "") {
      ++check;
      $scope.errorCodeAdd = "Mã dự án không để trống";
    } else if ($scope.form_project.code.length > 15) {
      $scope.errorCodeAdd = "Mã dự án không quá 15 ký tự";
      return;
    } else {
      $scope.errorCodeAdd = "";
    }

    if ($scope.form_project.name === "") {
      ++check;
      $scope.errorNameAdd = "Tên dự án không để trống";
    } else {
      $scope.errorNameAdd = "";
    }

    if ($scope.form_project.startTime === "") {
      ++check;
      $scope.errorStartTimeAdd = "Ngày bắt đầu dự án không để trống";
    } else {
      $scope.errorStartTimeAdd = "";
    }

    if ($scope.form_project.endTime === "") {
      ++check;
      $scope.errorEndTimeAdd = "Ngày kết thúc dự án không để trống";
    } else {
      $scope.errorEndTimeAdd = "";
    }

    if (
      $scope.form_project.endTime.getTime() <
      $scope.form_project.startTime.getTime()
    ) {
      $scope.errorStartTimeAdd =
        "Ngày bắt đầu dự án không nhỏ hơn ngày hiện tại";
      ++check;
    } else {
      $scope.errorStartTimeAdd = "";
    }

    if ($scope.form_project.endTime.getTime() < new Date().getTime()) {
      $scope.form_project.statusProject = "2";
    } else if ($scope.form_project.startTime.getTime() > new Date().getTime()) {
      $scope.form_project.statusProject = "1";
    } else {
      $scope.form_project.statusProject = "0";
    }

    if ($scope.form_project.descriptions === "") {
      ++check;
      $scope.errorDescriptionsAdd = "Mô tả dự án không để trống";
    } else {
      $scope.errorDescriptionsAdd = "";
    }

    if (check == 0) {
      $http
        .post(projcetAPI, {
          code: $scope.form_project.code,
          name: $scope.form_project.name,
          descriptions: $scope.form_project.descriptions,
          startTime: $scope.form_project.startTime.getTime(),
          endTime: $scope.form_project.endTime.getTime(),
          progress: $scope.form_project.progress,
          statusProject: $scope.form_project.statusProject,
        })
        .then(
          function (response) {
            toastr.success("Thêm thành công", "Thông báo!", {
              closeButton: true,
              progressBar: true,
              positionClass: "toast-top-center",
            });
            $("#exampleModal").modal("hide");
            $("#modal_showMember").modal("show");
            $scope.project_creat = response.data.data;

            addProjectCategory($scope.project_creat.id);
            $scope.clearSelectedCategories();
            loadDataListProject();
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

  $scope.Update = function (event) {
    event.preventDefault();
    let projectId = $scope.form_project_update.id;
    let api = projcetAPI + "/" + projectId;
    updateProjectCategory(projectId);
    //check
    let check = 0;
    if ($scope.form_project_update.code === "") {
      ++check;
      $scope.errorCodeUpdate = "Mã dự án không để trống";
    } else if ($scope.form_project_update.code.length > 15) {
      $scope.errorCodeUpdate = "Mã dự án không quá 15 ký tự";
      return;
    } else {
      $scope.errorCodeUpdate = "";
    }

    if ($scope.form_project_update.name === "") {
      ++check;
      $scope.errorNameUpdate = "Tên dự án không để trống";
    } else {
      $scope.errorNameUpdate = "";
    }

    if ($scope.form_project_update.startTime === "") {
      ++check;
      $scope.errorStartTimeUpdate = "Ngày bắt đầu dự án không để trống";
    } else {
      $scope.errorStartTimeUpdate = "";
    }

    if ($scope.form_project_update.endTime === "") {
      ++check;
      $scope.errorEndTimeUpdate = "Ngày kết thúc dự án không để trống";
    } else {
      $scope.errorEndTimeUpdate = "";
    }

    if (
      $scope.form_project_update.endTime.getTime() <
      $scope.form_project_update.startTime.getTime()
    ) {
      $scope.errorStartTimeUpdate =
        "Ngày bắt đầu dự án không nhỏ hơn ngày hiện tại";
      ++check;
    } else {
      $scope.errorStartTimeUpdate = "";
    }

    if ($scope.form_project_update.startTime.getTime() < new Date().getTime()) {
      $scope.form_project_update.statusProject = "0";
    } else if (
      $scope.form_project_update.startTime.getTime() > new Date().getTime()
    ) {
      $scope.form_project_update.statusProject = "1";
    } else if (
      $scope.form_project_update.endTime.getTime() < new Date().getTime()
    ) {
      $scope.form_project_update.statusProject = "2";
    }

    if ($scope.form_project_update.descriptions === "") {
      ++check;
      $scope.errorDescriptionsUpdate = "Mô tả dự án không để trống";
    } else {
      $scope.errorDescriptionsUpdate = "";
    }

    if (check == 0) {
      $http
        .put(api, {
          code: $scope.form_project_update.code,
          name: $scope.form_project_update.name,
          descriptions: $scope.form_project_update.descriptions,
          startTime: $scope.form_project_update.startTime.getTime(),
          endTime: $scope.form_project_update.endTime.getTime(),
          // if để set trạng thái
          progress: 0,
          statusProject: "1",
        })
        .then(
          function (response) {
            toastr.success("Update thành công", "Thông báo!", {
              closeButton: true,
              progressBar: true,
              positionClass: "toast-top-center",
            });
            $("#exampleModalUpdate").modal("hide");
            loadDataListProject();
          },
          function (error) {
            toastr.error(error.data.message, "Thông báo!", {
              closeButton: true,
              progressBar: true,
              positionClass: "toast-top-center",
            });
          }
        );
    }
  };

  // member
  $scope.listMemberById = [];
  MeMemberService.fetchMembers().then(function () {
    $scope.listMemberById = MeMemberService.getMembers();
  });

  // lấy list projectCategory by idProject
  $scope.listProjectCategoryByIdProject = [];
  function loadDataListProjectCategory(idProject) {
    AdProjcetCategoryService.fetchProjectCategory(idProject).then(function () {
      $scope.listProjectCategoryByIdProject =
        AdProjcetCategoryService.getProjectCategory();
      // Duyệt qua từng phần tử trong danh sách `listIdCategory`
      $scope.listIdCategory.forEach(function (item) {
        item.checkboxCategory = false;
        // Kiểm tra xem `id` của phần tử đang được duyệt có tồn tại trong `listProjectCategoryByIdProject` không
        $scope.listProjectCategoryByIdProject.forEach(function (a) {
          if (a.idCategory == item.id) {
            item.checkboxCategory = true;
            $scope.listUpdateProjectCategoryByIdProject.push(item.id);
          }
        });
        console.log($scope.listProjectCategoryByIdProject);
      });
    });
  }

  // detail
  $scope.indexProject = -1;
  $scope.detail = function (event, index) {
    event.preventDefault();
    let project = $scope.listProject[index];
    console.log(project.id);
    $scope.form_project_update.id = project.id;
    $scope.form_project_update.code = project.code;
    $scope.form_project_update.name = project.name;
    $scope.form_project_update.startTime = new Date(project.startTime);
    $scope.form_project_update.endTime = new Date(project.endTime);
    $scope.form_project_update.progress = project.progress;
    $scope.form_project_update.statusProject = project.statusProject;
    $scope.form_project_update.descriptions = project.descriptions;
    $scope.indexProject = index;
    loadDataListMemberJoinProject(project.id);
    loadDataListMemberNotJoinProject(project.id);
    loadDataListProjectCategory(project.id);
  };

  // get member join project
  $scope.listMemberJoinProject = [];
  function loadDataListMemberJoinProject(idProject) {
    AdMemberProjcetService.findAllMemberJoinProject(idProject).then(
      function () {
        let list = [];
        let membersAll = $scope.listMemberById;
        list = AdMemberProjcetService.getMemberProject();
        $scope.listMemberJoinProject = membersAll.filter(function (obj1) {
          return list.data.some(function (obj2) {
            return obj2.memberId === obj1.id;
          });
        });
      }
    );
  }

  // get member not join project
  $scope.listMemberNotJoinProject = [];
  function loadDataListMemberNotJoinProject(idProject) {
    AdMemberProjcetService.findAllMemberJoinProject(idProject).then(
      function () {
        let list = AdMemberProjcetService.getMemberProject();
        let membersAll = $scope.listMemberById;

        $scope.listMemberNotJoinProject = membersAll.filter(function (obj1) {
          return list.data.every(function (obj2) {
            return obj2.memberId !== obj1.id;
          });
        });

        console.log($scope.listMemberNotJoinProject);
      }
    );
  }

  $scope.selectedItems = [];
  $scope.selectedRoles = {};
  $scope.selectedRole = "";
  $scope.toggleSelection = function (item, indexCheckbox) {
    if (
      document.querySelectorAll(".checkBoxMemberAdd")[indexCheckbox].checked
    ) {
      var index = $scope.selectedItems.indexOf(item);
      if (index > -1) {
        $scope.selectedItems.splice(index, 1);
      } else {
        if (
          document.querySelectorAll("#valueSelectedRoleAdd")[indexCheckbox]
            .value == ""
        ) {
          toastr.error("Hãy chọn vị trí", "Thông báo!", {
            closeButton: true,
            progressBar: true,
            positionClass: "toast-top-center",
          });
          document.querySelectorAll(".checkBoxMemberAdd")[
            indexCheckbox
          ].checked = false;
          return;
        }
        $scope.selectedItems.push({
          member: item,
          role: document.querySelectorAll("#valueSelectedRoleAdd")[
            indexCheckbox
          ].value,
        });
      }
      if ($scope.selectedItems.length === 0) {
        $scope.selectedRoles = {};
        var checkboxes = document.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(function (checkbox) {
          checkbox.checked = false;
        });
      }
    } else {
      $scope.selectedItems.splice(indexCheckbox, 1);
    }

    console.log($scope.selectedItems);
  };

  $scope.clearSelectedItems = function () {
    $scope.selectedItems = [];
    $scope.selectedRoles = {};
    $scope.selectedItemsUpdate = [];
    $scope.selectedRolesUpdate = {};
    var checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(function (checkbox) {
      checkbox.checked = false;
    });
  };

  $scope.addMemberProject = function (event) {
    event.preventDefault();
    var listMemberProject = [];
    let project = $scope.project_creat;
    let api = member_ProjcetAPI + "/add-all";
    console.log($scope.selectedItems);
    for (let i = 0; i < $scope.selectedItems.length; i++) {
      listMemberProject.push({
        projectId: project.id,
        memberId: $scope.selectedItems[i].member.id,
        role: $scope.selectedItems[i].role,
        statusWork: "0",
      });
    }
    console.log(listMemberProject);
    $http.post(api, listMemberProject).then(
      function (response) {
        toastr.success("Thêm thành công", "Thông báo!", {
          closeButton: true,
          progressBar: true,
          positionClass: "toast-top-center",
        });
        $("#modal_showMember").modal("hide");
        $scope.clearSelectedItems();
        loadDataListProject();
      },
      function (error) {
        toastr.error(error.data.message, "Thông báo!", {
          closeButton: true,
          progressBar: true,
          positionClass: "toast-top-center",
        });
      }
    );
  };

  // thêm project category
  function addProjectCategory(idProject) {
    let projectCategoryId = [];
    let listCategoryId = $scope.getSelectedCategories();
    let project = idProject;
    for (let i = 0; i < listCategoryId.length; i++) {
      projectCategoryId.push({
        projectId: project,
        categoryId: listCategoryId[i],
      });
    }
    console.log(projectCategoryId);
    $http.post(project_categoryAPI, projectCategoryId).then(
      function (response) {
        if (response.status === 201) {
          console.log(response.data.data);
          $scope.clearSelectedCategories();
          loadDataListProject();
        }
      },
      function (error) {
        console.log(error);
      }
    );
  }

  function updateProjectCategory(idProject) {
    let projectCategoryId = [];
    let listCategoryId = $scope.detailCate;
    let project = idProject;
    for (let i = 0; i < listCategoryId.length; i++) {
      projectCategoryId.push({
        projectId: project,
        categoryId: listCategoryId[i],
      });
    }
    console.log(projectCategoryId);
    $http
      .put(project_categoryAPI_update + "/" + project, projectCategoryId)
      .then(
        function (response) {
          if (response.status === 200) {
            console.log(response.data.data);
            $scope.clearSelectedCategories();
            loadDataListProject();
          }
        },
        function (error) {
          console.log(error);
        }
      );
  }
  $scope.toggleCheckbox = function (event, cateId) {
    event.stopPropagation();
    $scope.selectedCategories[cateId] = !$scope.selectedCategories[cateId];
  };

  $scope.toggleCheckboxUpdate = function (event, cate) {
    cate.checkboxCategory = !cate.checkboxCategory;
    $scope.detailCate = [];
    $scope.listIdCategory.forEach(function (item) {
      // Kiểm tra xem `id` của phần tử đang được duyệt có tồn tại trong `listProjectCategoryByIdProject` không
      if (item.checkboxCategory == true) {
        $scope.detailCate.push(item.id);
      }
    });
    console.log($scope.detailCate);
    event.stopPropagation();
  };

  $scope.selectedItemsUpdate = [];
  $scope.selectedRolesUpdate = {};
  $scope.selectedRoleUpdate = "";
  $scope.toggleSelectionUpdate = function (item, indexCheckBox) {
    if (
      document.querySelectorAll(".checkBoxMemberUpdate")[indexCheckBox].checked
    ) {
      var index = $scope.selectedItemsUpdate.indexOf(item);
      if (index > -1) {
        $scope.selectedItemsUpdate.splice(index, 1);
      } else {
        if (
          document.querySelectorAll("#valueSelectedRole")[indexCheckBox]
            .value == ""
        ) {
          toastr.error("Hãy chọn vị trí", "Thông báo!", {
            closeButton: true,
            progressBar: true,
            positionClass: "toast-top-center",
          });
          document.querySelectorAll(".checkBoxMemberUpdate")[
            indexCheckBox
          ].checked = false;
          return;
        }
        $scope.selectedItemsUpdate.push({
          member: item,
          role: document.querySelectorAll("#valueSelectedRole")[indexCheckBox]
            .value,
        });
      }
      if ($scope.selectedItemsUpdate.length === 0) {
        $scope.selectedRolesUpdate = {};
        var checkboxes = document.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(function (checkbox) {
          checkbox.checked = false;
        });
      }
    } else {
      $scope.selectedItemsUpdate.splice(indexCheckBox, 1);
    }

    console.log($scope.selectedItemsUpdate);
  };
  $scope.addMemberProjectUpdate = function (event) {
    event.preventDefault();
    let project = $scope.form_project_update.id;
    var listMemberProject = [];
    let api = member_ProjcetAPI + "/add-all";
    console.log($scope.selectedItemsUpdate);
    for (let i = 0; i < $scope.selectedItemsUpdate.length; i++) {
      listMemberProject.push({
        projectId: project,
        memberId: $scope.selectedItemsUpdate[i].member.id,
        role: $scope.selectedItemsUpdate[i].role,
        statusWork: "0",
      });
    }
    $http.post(api, listMemberProject).then(
      function (response) {
        toastr.success("Thêm thành công", "Thông báo!", {
          closeButton: true,
          progressBar: true,
          positionClass: "toast-top-center",
        });
        $("#modal_showMember_add_member").modal("hide");
        loadDataListProject();
        $scope.clearSelectedItems();
      },
      function (error) {
        toastr.error(error.data.message, "Thông báo!", {
          closeButton: true,
          progressBar: true,
          positionClass: "toast-top-center",
        });
      }
    );
  };

  // delete menber join dự án
  $scope.deleteMenberJoinProject = function (event, index) {
    event.preventDefault();
    let memberId = $scope.listMemberJoinProject[index].id;
    let projectId = $scope.form_project_update.id;
    let api = member_ProjcetAPI;
    getOneAdMemberProjcetService
      .getOneMemberProject(memberId, projectId)
      .then(function () {
        $scope.ktar = getOneAdMemberProjcetService.getMemberProject();
        console.log($scope.ktar);
        $http.delete(api + "/" + $scope.ktar.id).then(
          function (response) {
            toastr.success("Xóa thành công", "Thông báo!", {
              closeButton: true,
              progressBar: true,
              positionClass: "toast-top-center",
            });
            $("#exampleModal_delete_memberJoinProject").modal("hide");
            loadDataListMemberJoinProject(projectId);
          },
          function (error) {
            toastr.error(error.data.message, "Thông báo!", {
              closeButton: true,
              progressBar: true,
              positionClass: "toast-top-center",
            });
          }
        );
      });
  };

  $scope.loadDeleteMemberProject = function (event) {
    event.preventDefault();
    $("#modal_showMember_update").modal("hide");
    loadDataListProject();
  };
};
