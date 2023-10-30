const imageComponent = {};

imageComponent.actionImageComponent = function (
  $scope,
  $http,
  $location,
  $routeParams,
  stompClient,
  ConvertLongToDateString
) {
  $scope.showDialogAddImage = false;

  $scope.openDialogAddImage = function (event) {
    event.stopPropagation();
    $scope.showDialogAddLabelOut = false;
    $scope.showDialogAddDeadline = false;
    $scope.showDialogAddLabel = false;
    $scope.showDialogAddAttachment = false;
    $scope.showDialogUpdateAttachment = false;
    $scope.showDialogAddPriorityLevel = false;
    $scope.searchMemberDialog = "";

    if (!$scope.showDialogAddImage) {
      $scope.showDialogAddImage = true;
    } else {
      $scope.showDialogAddImage = false;
    }

    $scope.dialogStyleAddImage = {
      top: event.clientY -180 + "px",
      left: event.clientX -130 + "px",
    };

    $scope.valueChangeProgress = $scope.detailTodo.progress;

    $scope.clickOutPopupAddImage();
  };

  $scope.clickOutPopupAddImage = function () {
    document.addEventListener(
      "click",
      function (event) {
        if (!document.querySelector(".dialogAddImage").contains(event.target)) {
          $scope.$apply(function () {
            $scope.closeDialogAddImage();
          });
        } else {
          $scope.clickOutPopupAddImage();
        }
      },
      { once: true }
    );
  };

  $scope.closeDialogAddImage = function () {
    $scope.showDialogAddImage = false;
  };

  var guid = () => {
    var w = () => {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    };
    return `${w()}${w()}-${w()}-${w()}-${w()}-${w()}${w()}${w()}`;
  };

  $scope.uploadFileImage = function (event) {
    event.preventDefault();
    let fileInput = document.querySelector("#valueFileImageUpload");
    let file = fileInput.files[0];
    let uuidNameFile = guid();
    let newName = uuidNameFile + ".jpg";

    let newFile = new File([file], newName, { type: file.type });
    let formData = new FormData();
    formData.append("file", newFile);
    var idTodo = $scope.detailTodo.id;
    formData.append("idTodo", idTodo);

    // $http
    //   .post("http://localhost:6789/member/image/upload", formData, {
    //     transformRequest: angular.identity,
    //     headers: { "Content-Type": undefined },
    //   })
    //   .then(
    //     function (response) {
    //     },
    //     function (error) {
    //       alert(error);
    //     }
    //   );
    $.ajax({
      type: "POST",
      url: "http://localhost:6789/member/image/upload",
      contentType: false,
      processData: false,
      cache: false,
      data: formData,
      success: function (data) {},
      error: function (error) {},
    });

    let obj = {
      id: $scope.detailTodo.id,
      nameFile: newName,
      nameFileOld: document.querySelector("#valueFileImageUpload").files[0]
        .name,
      idTodo: $scope.idTodo,
      idTodoList: $scope.idTodoList,
      projectId: $scope.projectId,
      idUser: $scope.idUser,
    };
    stompClient.send(
      "/action/create-image/" + $scope.projectId + "/" + $routeParams.idPeriod,
      {},
      JSON.stringify(obj)
    );

    document.querySelector("#valueFileImageUpload").value = null;
    $scope.showDialogAddImage = false;
  };

  $scope.actionReloadDataCreateImage = function (message) {
    let obj = JSON.parse(message.body).data.data;
    let objActivity = JSON.parse(message.body).data.dataActivity;
    let idTodo = JSON.parse(message.body).data.idTodo;
    let idTodoList = JSON.parse(message.body).data.idTodoList;

    if (obj.statusImage == "COVER") {
      if ($scope.detailTodo.id != null && $scope.detailTodo.id == idTodo) {
        $scope.detailTodo.imageId = obj.id;
        $scope.detailTodo.nameFile = obj.nameFile;
      }

      $scope.todoFindById = $scope.findTodoById(idTodoList, idTodo);

      if ($scope.todoFindById != null) {
        $scope.todoFindById.imageId = obj.id;
        $scope.todoFindById.nameFile = obj.nameFile;
      }
    }
    if ($scope.detailTodo.id != null && $scope.detailTodo.id == idTodo) {
      let newObj = {
        id: obj.id,
        nameFile: obj.nameFile,
        nameImage: obj.nameImage,
        statusImage: obj.statusImage == "COVER" ? 0 : 1,
        todoId: obj.todoId,
        createdDate: obj.createdDate,
      };
      ConvertLongToDateString.setDateYearString(newObj.createdDate);
      newObj.convertDate = ConvertLongToDateString.getDateYearString();
      $scope.listImageDetailTodo.unshift(newObj);
    }

    if (
      $scope.detailTodo.id != null &&
      $scope.showDetailActivityTrueFalse &&
      objActivity != null &&
      $scope.detailTodo.id == idTodo
    ) {
      $scope.convertObjectActivity(objActivity);
    }
    $scope.$apply();
  };

  $scope.showDialogUpdateNameImage = false;

  $scope.openDialogUpdateNameImage = function (event, id, nameImage) {
    event.stopPropagation();
    $scope.showDialogAddLabelOut = false;
    $scope.showDialogAddLabel = false;
    $scope.showDialogAddPriorityLevel = false;
    $scope.showDialogUpdateNameImage = false;
    if (!$scope.showDialogUpdateNameImage) {
      $scope.showDialogUpdateNameImage = true;
    } else {
      $scope.showDialogUpdateNameImage = false;
    }

    $scope.dialogStyleUpdateNameImage = {
      top: event.clientY + "px",
      left: event.clientX + "px",
    };
    $scope.idImageDialog = id;
    $("#valueUpdateNameImage").val(nameImage);

    $scope.clickOutPopupUpdateNameImage();
  };

  $scope.clickOutPopupUpdateNameImage = function () {
    document.addEventListener(
      "click",
      function (event) {
        if (
          !document
            .querySelector(".dialogUpdateNameImage")
            .contains(event.target)
        ) {
          $scope.$apply(function () {
            $scope.closeDialogUpdateNameImage();
          });
        } else {
          $scope.clickOutPopupUpdateNameImage();
        }
      },
      { once: true }
    );
  };

  $scope.closeDialogUpdateNameImage = function () {
    $scope.showDialogUpdateNameImage = false;
  };

  $scope.updateNameImage = function () {
    if ($("#valueUpdateNameImage").val().trim() == "") {
      toastr.error("Tên ảnh không được để trống !", "Thông báo!", {
        closeButton: true,
        progressBar: true,
        positionClass: "toast-top-center",
      });
      return;
    }
    if ($("#valueUpdateNameImage").val().trim().length > 100) {
      toastr.error("Tên ảnh không quá 100 kí tự !", "Thông báo!", {
        closeButton: true,
        progressBar: true,
        positionClass: "toast-top-center",
      });
      return;
    }

    let obj = {
      id: $scope.idImageDialog,
      nameImage: $("#valueUpdateNameImage").val(),
    };
    console.log(obj);
    stompClient.send(
      "/action/update-name-image/" +
        $scope.projectId +
        "/" +
        $routeParams.idPeriod,
      {},
      JSON.stringify(obj)
    );

    $scope.showDialogUpdateNameImage = false;
  };

  $scope.actionReloadDataUpdateNameImage = function (message) {
    let obj = JSON.parse(message.body).data;

    if ($scope.detailTodo.id != null && $scope.detailTodo.id == obj.todoId) {
      $scope.listImageDetailTodo.forEach((item) => {
        if (item.id == obj.id) {
          item.nameImage = obj.nameImage;
        }
      });
    }

    $scope.$apply();
  };

  $scope.idImageDelete = "";
  $scope.nameFileDelete = "";
  $scope.nameImageDelete = "";
  $scope.statusImageDelete = "";

  $scope.deleteImage = function () {
    let obj = {
      id: $scope.idImageDelete,
      nameFile: $scope.nameFileDelete,
      nameImage: $scope.nameImageDelete,
      statusImage: $scope.statusImageDelete + "",
      idTodo: $scope.idTodo,
      idTodoList: $scope.idTodoList,
      projectId: $scope.projectId,
      idUser: $scope.idUser,
    };

    stompClient.send(
      "/action/delete-image/" + $scope.projectId + "/" + $routeParams.idPeriod,
      {},
      JSON.stringify(obj)
    );

    $scope.showDialogConfirmDeleteImage = false;
  };

  $scope.actionReloadDataDeleteImage = function (message) {
    let idImage = JSON.parse(message.body).data.data;
    let objActivity = JSON.parse(message.body).data.dataActivity;
    let idTodo = JSON.parse(message.body).data.idTodo;
    let idTodoList = JSON.parse(message.body).data.idTodoList;

    $scope.imageCheck = null;

    if ($scope.detailTodo.id != null && $scope.detailTodo.id == idTodo) {
      $scope.listImageDetailTodo.forEach((item) => {
        if (item.id == idImage) {
          if (item.statusImage == 0) {
            $scope.detailTodo.imageId = null;
            $scope.detailTodo.nameFile = null;
            $scope.imageCheck = item;
          }
          $scope.listImageDetailTodo.splice(
            $scope.listImageDetailTodo.indexOf(item),
            1
          );
        }
      });
    }

    if ($scope.imageCheck != null) {
      $scope.todoFindById = $scope.findTodoById(idTodoList, idTodo);
      if ($scope.todoFindById != null) {
        $scope.todoFindById.imageId = null;
        $scope.todoFindById.nameFile = null;
      }
    }

    if (
      $scope.detailTodo.id != null &&
      $scope.showDetailActivityTrueFalse &&
      objActivity != null &&
      $scope.detailTodo.id == idTodo
    ) {
      $scope.convertObjectActivity(objActivity);
    }

    $scope.$apply();

    return;
  };

  $scope.showDialogShowDetailImage = false;

  $scope.openDialogShowDetailImage = function (event, item) {
    event.stopPropagation();
    $scope.showDialogAddLabelOut = false;
    $scope.showDialogAddLabel = false;
    $scope.showDialogAddPriorityLevel = false;
    $scope.showDialogShowDetailImage = false;
    if (!$scope.showDialogShowDetailImage) {
      $scope.showDialogShowDetailImage = true;
    } else {
      $scope.showDialogShowDetailImage = false;
    }

    if (item == null) {
      $scope.titleShowDetailImage = "Chi tiết ảnh";
      $scope.pathIdTodo = $scope.detailTodo.id;
      $scope.pathNameFile = $scope.detailTodo.nameFile;
    } else {
      $scope.titleShowDetailImage = item.nameImage;
      $scope.pathIdTodo = item.todoId;
      $scope.pathNameFile = item.nameFile;
    }

    $scope.clickOutPopupShowDetailImage();
  };

  $scope.clickOutPopupShowDetailImage = function () {
    document.addEventListener(
      "click",
      function (event) {
        if (
          !document
            .querySelector(".dialogShowDetailImage")
            .contains(event.target)
        ) {
          $scope.$apply(function () {
            $scope.closeDialogShowDetailImage();
          });
        } else {
          $scope.clickOutPopupShowDetailImage();
        }
      },
      { once: true }
    );
  };

  $scope.closeDialogShowDetailImage = function () {
    $scope.showDialogShowDetailImage = false;
  };

  $scope.changeCoverImage = function (id, nameFile, statusImage) {
    let obj = {
      idTodo: $scope.detailTodo.id,
      idImage: id,
      nameFile: nameFile,
      idTodoList: $scope.idTodoList,
      status: statusImage + "",
    };
    console.log(obj);

    stompClient.send(
      "/action/change-cover-image/" +
        $scope.projectId +
        "/" +
        $routeParams.idPeriod,
      {},
      JSON.stringify(obj)
    );
  };

  $scope.actionReloadDataChangeCoverImage = function (message) {
    let objTodo = JSON.parse(message.body).data.data;
    let objImage = JSON.parse(message.body).data.dataImage;
    let idTodo = JSON.parse(message.body).data.idTodo;
    let idTodoList = JSON.parse(message.body).data.idTodoList;

    if ($scope.detailTodo.id != null && $scope.detailTodo.id == idTodo) {
      if (objImage.statusImage == "COVER") {
        $scope.detailTodo.imageId = objImage.id;
        $scope.detailTodo.nameFile = objImage.nameFile;
      } else {
        $scope.detailTodo.imageId = null;
        $scope.detailTodo.nameFile = null;
      }
    }
    $scope.todoFindById = $scope.findTodoById(idTodoList, idTodo);
    if ($scope.todoFindById != null) {
      if (objImage.statusImage == "COVER") {
        $scope.todoFindById.imageId = objImage.id;
        $scope.todoFindById.nameFile = objImage.nameFile;
      } else {
        $scope.todoFindById.imageId = null;
        $scope.todoFindById.nameFile = null;
      }
    }

    $scope.listImageDetailTodo.forEach((item) => {
      if (item.id == objImage.id) {
        if (objImage.statusImage == "COVER") {
          item.statusImage = 0;
        } else {
          item.statusImage = 1;
        }
      }
      if (item.id != objImage.id && objImage.statusImage == "COVER") {
        if (item.statusImage == 0) {
          item.statusImage = 1;
        }
      }
    });

    $scope.$apply();
  };

  $scope.showDialogConfirmDeleteImage = false;

  $scope.openDialogConfirmDeleteImage = function (
    event,
    id,
    nameFile,
    nameImage,
    statusImage
  ) {
    event.stopPropagation();
    $scope.showDialogAddLabelOut = false;
    $scope.showDialogAddLabel = false;
    $scope.showDialogAddPriorityLevel = false;
    $scope.showDialogConfirmDeleteImage = false;
    if (!$scope.showDialogConfirmDeleteImage) {
      $scope.showDialogConfirmDeleteImage = true;
    } else {
      $scope.showDialogConfirmDeleteImage = false;
    }

    $scope.idImageDelete = id;
    $scope.nameFileDelete = nameFile;
    $scope.nameImageDelete = nameImage;
    $scope.statusImageDelete = statusImage;

    $scope.dialogStyleConfirmDeleteImage = {
      top: event.clientY + "px",
      left: event.clientX + "px",
    };

    $scope.clickOutPopupConfirmDeleteImage();
  };

  $scope.clickOutPopupConfirmDeleteImage = function () {
    document.addEventListener(
      "click",
      function (event) {
        if (
          !document
            .querySelector(".dialogConfirmDeleteImage")
            .contains(event.target)
        ) {
          $scope.$apply(function () {
            $scope.closeDialogConfirmDeleteImage();
          });
        } else {
          $scope.clickOutPopupConfirmDeleteImage();
        }
      },
      { once: true }
    );
  };

  $scope.closeDialogConfirmDeleteImage = function () {
    $scope.showDialogConfirmDeleteImage = false;
  };
};
