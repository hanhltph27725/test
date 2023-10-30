app.controller(
  "myCtrl",
  function (
    $scope,
    $http,
    $rootScope,
    MeNotificationMemberService,
    ConvertLongToDateString
  ) {
    $scope.idUser = "c5cf1e20-bdd4-11ed-afa1-0242ac120002";
    $scope.listBackground = [
      "https://images.unsplash.com/photo-1678377986216-60bf00dfbbd8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1674511564261-4cda0b8ac9f7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2071&q=80",
      "https://images.unsplash.com/photo-1679597454485-d1d04f88b78a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1679423137857-f326e886bdf6?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1858&q=80",
      "https://images.unsplash.com/photo-1677696393693-d158fbef7d4b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1932&q=80",
      "https://images.unsplash.com/photo-1677741447337-48aba59a8f61?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1974&q=80",
      "https://images.unsplash.com/photo-1678175718150-b56b0352264e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1887&q=80",
      "https://images.unsplash.com/photo-1678384979913-5a1007bc4a8a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2071&q=80",
      "https://images.unsplash.com/photo-1676218074966-77217db68f1d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2071&q=80",
      "https://images.unsplash.com/photo-1676218074669-9a7358eb75d8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2071&q=80",
      "https://images.unsplash.com/photo-1675671233507-c8b670d27525?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1674763124932-d0105f1a0e7a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1674423094917-05bc57093875?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1666718350701-ddd15ae61a7b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80",
      "https://images.unsplash.com/photo-1679673177212-8a011a4f86f7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1172&q=80",
      "https://images.unsplash.com/photo-1675152747761-ce9cb788ad92?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1169&q=80",
      "https://images.unsplash.com/photo-1674191362105-a5661aec326d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
      "https://images.unsplash.com/photo-1678497178335-b2e3c404bf62?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
      "https://images.unsplash.com/photo-1669731426783-32733ddb6cd1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1171&q=80",
      "https://images.unsplash.com/photo-1668405409882-0b3a8b6fc912?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
      "https://images.unsplash.com/photo-1680808487011-5c3a75aaade0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1331&q=80",
      "https://images.unsplash.com/photo-1666126431272-8bffcafa6fb1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
    ];

    const socketMain = new SockJS(
      "http://localhost:6789/portal-projects-websocket-endpoint"
    );
    const stompClientMain = Stomp.over(socketMain);

    stompClientMain.connect({}, function (frame) {
      stompClientMain.subscribe(
        "/portal-projects/create-notification/" + $scope.idUser,
        function (message) {
          $scope.loadNotification();

          toastr.info("Bạn có một thông báo mới !", "Thông báo!", {
            closeButton: true,
            progressBar: true,
            positionClass: "toast-bottom-right",
          });
        }
      );
    });

    $scope.convertDateString = function (dateString) {
      const date = new Date(Number(dateString));
      const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      const day = date.getDate();
      const monthIndex = date.getMonth();
      const monthName = monthNames[monthIndex];
      const hours = date.getHours();
      const minutes = date.getMinutes();
      const formattedHours = hours.toString().padStart(2, "0");
      const formattedMinutes = minutes.toString().padStart(2, "0");
      const formattedTime = `${monthName} ${day} at ${formattedHours}:${formattedMinutes}`;
      return formattedTime;
    };

    $scope.loadNotification = function () {
      MeNotificationMemberService.fetchNotificationMembers(
        $scope.idUser,
        0
      ).then(function (response) {
        $rootScope.listNotification =
          MeNotificationMemberService.getNotificationMembers();
        $rootScope.listNotification.forEach((item) => {
          item.convertDate = $scope.convertDateString(item.createdDate);
        });
        $rootScope.totalPagesNotification =
          MeNotificationMemberService.getTotalPages();
        $rootScope.currentPageNotification =
          MeNotificationMemberService.getCurrentPage();
      });

      MeNotificationMemberService.fetchCountNotificationMember(
        $scope.idUser
      ).then(function () {
        $rootScope.countNotificationMember =
          MeNotificationMemberService.getCount();
      });
    };

    $scope.loadNotification();

    $scope.stopEvent = function (event) {
      event.stopPropagation();
    };

    $scope.updateStatusNotificationMember = function (xx, id) {
      if (xx.status == 0) {
        xx.status = 1;
        $rootScope.countNotificationMember =
          $rootScope.countNotificationMember - 1;
      }
      $http
        .put(
          apiURLDomain +
            "/member/notification-member/update-status" +
            "?idNotificationMember=" +
            id
        )
        .then(function (response) {});
    };

    $scope.showMoreNotification = function () {
      $rootScope.currentPageNotification =
        $rootScope.currentPageNotification + 1;
      MeNotificationMemberService.fetchNotificationMembers(
        $scope.idUser,
        $rootScope.currentPageNotification
      ).then(function (response) {
        $rootScope.listShowMoreNotification =
          MeNotificationMemberService.getNotificationMembers();
        $rootScope.listShowMoreNotification.forEach((item) => {
          item.convertDate = $scope.convertDateString(item.createdDate);
        });
        $rootScope.listShowMoreNotification.forEach((item) => {
          $rootScope.listNotification.push(item);
        });
        $rootScope.totalPagesNotification =
          MeNotificationMemberService.getTotalPages();
        $rootScope.currentPageNotification =
          MeNotificationMemberService.getCurrentPage();
      });
    };
  }
);

app.directive("myTooltip", function () {
  return {
    restrict: "A",
    scope: {
      tooltipContent: "@",
    },
    link: function (scope, element, attrs) {
      $(element).attr("data-bs-toggle", "tooltip");
      $(element).attr("title", scope.tooltipContent);
      $(element).attr("data-bs-placement", "top");
      $(element).attr("data-bs-delay", "500");
      $(".tooltip").css("z-index", 999999999999);
      $(element).tooltip();
      $(element).click(function () {
        $(element).tooltip("dispose");
      });
      $(element).mouseenter(function () {
        $(element).tooltip();
      });
      scope.$watch("tooltipContent", function (newVal) {
        $(element).tooltip("dispose");
        $(element).attr("data-bs-toggle", "tooltip");
        $(element).attr("title", newVal);
        $(element).attr("data-bs-delay", "500");
        $(element).attr("data-bs-placement", "top");
        $(element).tooltip();
      });
    },
  };
});

app.run(function ($rootScope) {
  $rootScope.$on("$routeChangeStart", function () {
    $rootScope.loading = true;
  });
  $rootScope.$on("$routeChangeSuccess", function () {
    $rootScope.loading = false;
  });
  $rootScope.$on("$routeChangeError", function () {
    $rootScope.loading = false;
    alert("Lỗi, Không tải được template");
  });
});

app.directive("quillEditor", function () {
  return {
    require: "ngModel",
    link: function (scope, element, attrs, ngModel) {
      var quill = new Quill(element[0], {
        theme: "snow",
        placeholder: "Thêm mô tả đầu việc",
      });

      element.on("paste", function (event) {
        event.preventDefault();
        var text = (event.originalEvent || event).clipboardData.getData(
          "text/plain"
        );
        document.execCommand("insertHTML", false, text);
      });

      quill.on("text-change", function () {
        ngModel.$setViewValue(quill.root.innerHTML);
      });

      ngModel.$render = function () {
        quill.root.innerHTML = ngModel.$viewValue;
      };
    },
  };
});

app.directive("quillEditorComment", function () {
  return {
    require: "ngModel",
    link: function (scope, element, attrs, ngModel) {
      var quill = new Quill(element[0], {
        theme: "snow",
        placeholder: "Bình luận, nhập @ để nhắc tới ai đó ...",
      });

      // element.on("paste", function (event) {
      //   event.preventDefault();
      //   var text = (event.originalEvent || event).clipboardData.getData(
      //     "text/plain"
      //   );
      //   document.execCommand("insertHTML", false, text);
      //   alert(
      //     "Nếu muốn upload ảnh bạn có thể sử dụng tính năng upload ảnh ở thanh menu !"
      //   );
      // });

      quill.on("text-change", function () {
        ngModel.$setViewValue(quill.root.innerHTML);
      });

      ngModel.$render = function () {
        quill.root.innerHTML = ngModel.$viewValue;
      };
    },
  };
});

app.directive("quillViewer", function () {
  return {
    require: "ngModel",
    link: function (scope, element, attrs, ngModel) {
      var quill = new Quill(element[0], {
        theme: "snow",
        readOnly: true,
        modules: {
          toolbar: false,
        },
      });

      ngModel.$render = function () {
        quill.root.innerHTML = ngModel.$viewValue;
      };
    },
  };
});
