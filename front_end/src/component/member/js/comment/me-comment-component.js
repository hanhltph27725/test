const commentComponent = {};

commentComponent.functionComment = function (
  $scope,
  $http,
  stompClient,
  $routeParams,
  ConvertLongToDateString,
  MeCommentService,
  $filter
) {
  $scope.valueContentComment = "";
  if ($scope.valueContentComment == "") {
    $scope.isComment = true;
  }
  $scope.commentTodo = function () {
    let obj = {
      idTodo: $scope.detailTodo.id,
      content: $scope.valueContentComment,
      idUser: $scope.idUser,
    };

    var regex = /@(\w+)/g;
    var usernames = $scope.valueContentComment.match(regex);

    if (usernames) {
      var uniqueUsernames = [];
      usernames.forEach(function (name) {
        var username = name.slice(1);
        if (!uniqueUsernames.includes(username)) {
          uniqueUsernames.push(username);
        }
      });
      usernames = uniqueUsernames;
    }

    let listIdMember = [];
    let listEmail = [];
    $scope.listMemberProject.forEach(function (member) {
      usernames.forEach((item) => {
        if (member.username == item) {
          listIdMember.push(member.id);
          listEmail.push(member.email);
        }
      });
    });

    console.log(listIdMember);

    stompClient.send(
      "/action/create-comment" +
        "/" +
        $scope.projectId +
        "/" +
        $routeParams.idPeriod,
      {},
      JSON.stringify(obj)
    );

    let usernameCreated = "";

    $scope.listMemberProject.forEach((item) => {
      if (item.id == $scope.idUser) {
        usernameCreated = item.username;
      }
    });

    let objNoti = {
      listMemberId: listIdMember,
      listEmail: listEmail,
      todoId: $scope.detailTodo.id,
      url:
        "#/member/project-is-participating/" +
        $scope.projectId +
        "?idPeriod=" +
        $routeParams.idPeriod +
        "&idTodo=" +
        $scope.detailTodo.id,
      idUser: $scope.idUser,
      username: usernameCreated,
    };
    $http
      .post(apiURLDomain + "/member/notification", objNoti)
      .then(function (response) {
        listIdMember.forEach((item) => {
          if (item != $scope.idUser) {
            stompClient.send(
              "/action/create-notification" + "/" + item,
              {},
              JSON.stringify({})
            );
          }
        });
      });

    $scope.valueContentComment = "";
    $scope.isComment = true;
  };

  $scope.changeCommentInput = function (event) {
    if (
      $scope.valueContentComment == "" ||
      $scope.valueContentComment == "<p><br></p>"
    ) {
      $scope.isComment = true;
    } else {
      $scope.isComment = false;
    }
    var parser = new DOMParser();
    var doc = parser.parseFromString($scope.valueContentComment, "text/html");
    var innerString = doc.body.textContent;

    if (innerString.includes("@")) {
      var atIndex = innerString.lastIndexOf("@");
      var spaceIndex = innerString.indexOf(" ", atIndex);

      if (
        atIndex >=
        innerString.lastIndexOf(
          " ",
          innerString.indexOf(
            innerString.substr(
              innerString.length -
                innerString.slice().split("").reverse().join("").indexOf(" ") -
                1,
              innerString.length
            )
          )
        )
      ) {
        var selectedString = innerString.substring(
          atIndex + 1,
          spaceIndex != -1 ? spaceIndex : undefined
        );

        $scope.showDialogSearchMemberComment = true;
        $scope.listMemberSearchComment = $filter("filter")(
          $scope.listMemberProject,
          selectedString
        );
      } else {
        $scope.showDialogSearchMemberComment = false;
      }
    } else {
      $scope.showDialogSearchMemberComment = false;
    }
    if ($scope.valueContentComment == "") {
      $scope.showDialogSearchMemberComment = false;
    }
  };

  $scope.chosenMemberSearchComment = function (username) {
    var comment = $scope.valueContentComment;
    var atIndex = comment.lastIndexOf("@");
    if (atIndex !== -1) {
      comment = comment.substring(0, atIndex) + "@" + username;
    } else {
      comment = username;
    }
    $scope.valueContentComment = comment;
  };

  $scope.actionReloadDataCreateComment = function (message) {
    let obj = JSON.parse(message.body).data;

    if ($scope.detailTodo.id != null && $scope.detailTodo.id == obj.todoId) {
      let newObj = {
        id: obj.id,
        content: obj.content,
        memberId: obj.memberId,
        statusEdit: obj.statusEdit,
        todoId: obj.todoId,
        createdDate: obj.createdDate,
      };
      let memberCreatedById = $scope.findMemberById(newObj.memberId);

      newObj.nameMember = memberCreatedById.name + " " + memberCreatedById.code;
      newObj.imageMember = memberCreatedById.image;

      ConvertLongToDateString.setDateYearString(newObj.createdDate);
      newObj.convertDate = ConvertLongToDateString.getDateYearString();
      newObj.showFormEditComment = false;
      if (
        $scope.listCommentByIdTodo.length % 5 == 0 &&
        $scope.listCommentByIdTodo.length != 0
      ) {
        if ($scope.listCommentByIdTodo.length == 5) {
          $scope.totalPagesComment = 2;
        }
        $scope.listCommentByIdTodo.splice(
          $scope.listCommentByIdTodo.length - 1,
          1
        );
      }
      $scope.listCommentByIdTodo.unshift(newObj);
    }
    $scope.$apply();
  };

  $scope.showMore = async function () {
    if ($scope.currentPageComment <= $scope.totalPagesComment - 1) {
      $scope.currentPageComment++;
      await MeCommentService.fetchComments(
        $scope.detailTodo.id,
        $scope.currentPageComment
      );

      $scope.listCommentShowMore = MeCommentService.getComments();
      $scope.totalPagesComment = MeCommentService.getTotalPageComments();

      $scope.listCommentShowMore.forEach((item) => {
        let memberCreatedById = $scope.findMemberById(item.memberId);

        item.nameMember = memberCreatedById.name + " " + memberCreatedById.code;
        item.imageMember = memberCreatedById.image;

        ConvertLongToDateString.setDateYearString(item.createdDate);
        item.convertDate = ConvertLongToDateString.getDateYearString();
        item.showFormEditComment = false;
        $scope.listCommentByIdTodo.push(item);
      });
    }

    $scope.$apply();
  };

  $scope.editComment = function (id, index, content) {
    $scope.idCommentEdit = id;
    $scope.valueEditComment = content;
    $(".quill_edit_comment .ql-editor").eq(index).html(content);

    $scope.listCommentByIdTodo.forEach((item) => {
      if (item.id === id) {
        item.showFormEditComment = true;
      } else {
        item.showFormEditComment = false;
      }
    });
  };

  $scope.saveContentComment = function (index) {
    if ($scope.valueEditComment == "") {
      toastr.error("Nội dung không được để trống !", "Thông báo!", {
        closeButton: true,
        progressBar: true,
        positionClass: "toast-top-center",
      });
      return;
    }
    if ($scope.valueEditComment.length > 1000) {
      toastr.error("Nội dung không được vượt quá 1000 ký tự !", "Thông báo!", {
        closeButton: true,
        progressBar: true,
        positionClass: "toast-top-center",
      });
      return;
    }

    let obj = {
      id: $scope.idCommentEdit,
      content: $(".quill_edit_comment .ql-editor").eq(index).html(),
    };

    stompClient.send(
      "/action/update-comment" +
        "/" +
        $scope.projectId +
        "/" +
        $routeParams.idPeriod,
      {},
      JSON.stringify(obj)
    );

    $scope.listCommentByIdTodo[index].showFormEditComment = false;
  };

  $scope.actionReloadDataUpdateComment = function (message) {
    let obj = JSON.parse(message.body).data;

    if (
      $scope.detailTodo.id != null &&
      obj != null &&
      $scope.detailTodo.id == obj.todoId
    ) {
      $scope.listCommentByIdTodo.forEach((item) => {
        if (item.id == obj.id) {
          item.content = obj.content;
          item.statusEdit = obj.statusEdit;
        }
      });

      $scope.$apply();
    }
  };

  $scope.deleteComment = function (id) {
    let check = confirm("Bạn có chắc muốn xóa không ?");
    if (check) {
      let obj = {
        id: id,
      };
      stompClient.send(
        "/action/delete-comment" +
          "/" +
          $scope.projectId +
          "/" +
          $routeParams.idPeriod,
        {},
        JSON.stringify(obj)
      );
    }
  };

  $scope.resizeFormEditComment = function (index) {
    const textarea = document.querySelectorAll(".textarea_edit_comment")[index];
    if ($scope.detailTodo.id != null) {
      const rows = $scope.valueEditComment.split("\n").length;
      const lineHeight =
        parseInt(
          window.getComputedStyle(textarea).getPropertyValue("line-height")
        ) + 2.8;
      const height = rows * lineHeight;
      textarea.style.height = height + "px";
    } else {
      textarea.style.height = 100 + "px";
    }
  };

  $scope.actionReloadDataDeleteComment = async function (message) {
    let obj = JSON.parse(message.body).data;

    if (
      $scope.detailTodo.id != null &&
      obj != null &&
      $scope.detailTodo.id == obj.todoId
    ) {
      $scope.listCommentByIdTodo.forEach((item) => {
        if (item.id == obj.id) {
          $scope.listCommentByIdTodo.splice(
            $scope.listCommentByIdTodo.indexOf(item),
            1
          );
        }
      });
      if ($scope.totalPagesComment > 1) {
        let count = $scope.currentPageComment;
        await MeCommentService.fetchComments($scope.detailTodo.id, count);

        let newObj = MeCommentService.getComments()[4];
        let memberCreatedById = $scope.findMemberById(newObj.memberId);

        newObj.nameMember =
          memberCreatedById.name + " " + memberCreatedById.code;
        newObj.imageMember = memberCreatedById.image;

        ConvertLongToDateString.setDateYearString(newObj.createdDate);
        newObj.convertDate = ConvertLongToDateString.getDateYearString();
        newObj.showFormEditComment = false;

        $scope.totalPagesComment = MeCommentService.getTotalPageComments();
        $scope.listCommentByIdTodo.push(newObj);
      }
    }
    $scope.$apply();
  };

  $scope.replyComment = function (memberId) {
    let username = "";
    $scope.listMemberProject.forEach((item) => {
      if (item.id == memberId) {
        username = item.username;
      }
    });

    $scope.valueContentComment = "<p>@" + username + "</p>";
  };
};
