window.MemberDashboardController = function (
  $scope,
  $routeParams,
  MeDetailProjectService,
  MeTodoListService,
  MeDashBoardService,
  MeMemberService,
  MeMemberProjectService,
  MeLabelService,
  MeGetAllPeriodById,
  MeDashboardPeriodService,
  MeDetailPeriod
) {
  document.querySelector("body").classList.add("toggle-sidebar");
  document.body.style.backgroundImage = "url('" + "')";
  document.body.style.backgroundColor = "";

  let idProject = $routeParams.id;
  $scope.projectId = idProject;

  $scope.progressProject = 0;

  var circle = new ProgressBar.Circle("#progress-container", {
    color: "orange",
    strokeWidth: 10,
    duration: 1500,
    easing: "easeInOut",
    trailColor: "#e0e0e0",
    trailWidth: 10,
    text: {
      value: "0%",
      style: {
        color: "rgb(61, 61, 61)",
        fontSize: "16px",
      },
      className: "progress-text",
    },
    step: function (state, circle) {
      var progress = circle.value();
      var color;

      if (progress <= 0.25) {
        color = "#f34848";
      } else if (progress <= 0.5) {
        color = "orange";
      } else if (progress <= 0.75) {
        color = "#1b88c7";
      } else {
        color = "#58ca50";
      }

      circle.setText((progress * 100).toFixed(2) + "%");
      circle.path.setAttribute("stroke", color);
    },
  });

  $scope.loadDataProject = function () {
    MeDetailProjectService.fetchProject(idProject).then(function () {
      $scope.detailProject = MeDetailProjectService.getProject();
      document.title = "Thống kê | " + $scope.detailProject.name;
      $scope.progressProject = $scope.detailProject.progress / 100;
      circle.animate($scope.progressProject);
    });
  };

  MeGetAllPeriodById.fetchPeriods($scope.projectId).then(function () {
    $scope.listPeriod = MeGetAllPeriodById.getPeriods();
  });

  // Khai báo

  $scope.initVariables = function () {
    // TodoList
    $scope.arrayTodoListColumn = ["Danh sách"];
    $scope.arrayCountTodoListColumn = ["Danh sách"];
    $scope.arrayCountTodoListPie = [["Danh sách", "Danh sách"]];

    // Due Date
    $scope.valueHoanThanh = 0;
    $scope.valueChuaHoanThanh = 0;
    $scope.valueHoanThanhSom = 0;
    $scope.valueHoanThanhMuon = 0;
    $scope.valueQuaHan = 0;
    $scope.valueKhongCoHan = 0;

    // Member
    $scope.arrayMemberColumn = ["Thành viên"];
    $scope.arrayCountMemberColumn = ["Thành viên"];
    $scope.arrayCountMemberPie = [["Thành viên", "Thành viên"]];

    //Label
    $scope.arrayLabelColumn = ["Nhãn"];
    $scope.arrayCountLabelColumn = ["Nhãn"];
    $scope.arrayCountLabelPie = [["Nhãn", "Nhãn"]];
  };

  $scope.loadAllChartAllProject = function () {
    $scope.loadDataProject();
    $scope.initVariables();
    MeTodoListService.fetchTodoList($scope.projectId).then(async function () {
      $scope.listTodoList = MeTodoListService.getTodoList();

      for (let i = 0; i < $scope.listTodoList.length; i++) {
        let item = $scope.listTodoList[i];
        $scope.arrayTodoListColumn.push(item.name);

        await MeDashBoardService.fetchCountTodoByTodoListAllProject(
          $scope.projectId,
          item.id
        ).then(function () {
          let count = MeDashBoardService.getCountTodoByTodoListAllProject();
          $scope.arrayCountTodoListColumn.push(Number(count));

          let objTodoListPie = [item.name, Number(count)];
          $scope.arrayCountTodoListPie.push(objTodoListPie);
        });
      }

      $scope.loadChartTodoList();
    });

    // TodoList
    $scope.loadChartTodoList = function () {
      google.charts.load("current", { packages: ["corechart"] });
      google.charts.setOnLoadCallback(drawChartColumnTodoList);

      function drawChartColumnTodoList() {
        var data = google.visualization.arrayToDataTable([
          $scope.arrayTodoListColumn,
          $scope.arrayCountTodoListColumn,
        ]);
        var options = {
          title: "Thống kê đầu việc theo danh sách",
          chartArea: { width: "50%" },
          vAxis: {
            title: "Số đầu việc",
          },
        };
        var chart = new google.visualization.ColumnChart(
          document.getElementById("chart_div_column_todo_list")
        );
        chart.draw(data, options);
      }

      google.charts.load("current", { packages: ["corechart"] });
      google.charts.setOnLoadCallback(drawChartPieTodoList);
      function drawChartPieTodoList() {
        var data = google.visualization.arrayToDataTable(
          $scope.arrayCountTodoListPie
        );
        var options = {
          title: "Thống kê đầu việc theo danh sách",
          is3D: true,
        };
        var chart = new google.visualization.PieChart(
          document.getElementById("chart_div_pie_todo_list")
        );
        chart.draw(data, options);
      }
    };

    Promise.all([
      MeDashBoardService.fetchCountTodoByDueDateAllProject($scope.projectId, 0),
      MeDashBoardService.fetchCountTodoByDueDateAllProject($scope.projectId, 2),
      MeDashBoardService.fetchCountTodoByDueDateAllProject($scope.projectId, 3),
      MeDashBoardService.fetchCountTodoByDueDateAllProject($scope.projectId, 4),
      MeDashBoardService.fetchCountTodoByNoDueDateAllProject($scope.projectId),
    ]).then(function (responses) {
      $scope.valueChuaHoanThanh = responses[0].data.data;
      $scope.valueHoanThanhSom = responses[1].data.data;
      $scope.valueHoanThanhMuon = responses[2].data.data;
      $scope.valueQuaHan = responses[3].data.data;
      $scope.valueKhongCoHan = responses[4].data.data;
      $scope.valueHoanThanh =
        $scope.valueHoanThanhSom + $scope.valueHoanThanhMuon;

      $scope.loadChartDueDate();
    });

    // Due Date
    $scope.loadChartDueDate = function () {
      google.charts.load("current", { packages: ["corechart"] });
      google.charts.setOnLoadCallback(drawChartColumnDueDate);
      function drawChartColumnDueDate() {
        var data = google.visualization.arrayToDataTable([
          [
            "Ngày hạn",
            "Hoàn thành",
            "Hoàn thành sớm",
            "Hoàn thành muộn",
            "Chưa hoàn thành",
            "Quá hạn",
            "Không có hạn",
          ],
          [
            "Ngày hạn",
            $scope.valueHoanThanh,
            $scope.valueHoanThanhSom,
            $scope.valueHoanThanhMuon,
            $scope.valueChuaHoanThanh,
            $scope.valueQuaHan,
            $scope.valueKhongCoHan,
          ],
        ]);
        var options = {
          title: "Thống kê đầu việc theo ngày hạn",
          chartArea: { width: "50%" },
          vAxis: {
            title: "Số đầu việc",
          },
        };
        var chart = new google.visualization.ColumnChart(
          document.getElementById("chart_div_column_due_date")
        );
        chart.draw(data, options);
      }

      google.charts.load("current", { packages: ["corechart"] });
      google.charts.setOnLoadCallback(drawChartPieDueDate);
      function drawChartPieDueDate() {
        var data = google.visualization.arrayToDataTable([
          ["Ngày hạn", "Ngày hạn"],
          ["Hoàn thành sớm", $scope.valueHoanThanhSom],
          ["Hoàn thành muộn", $scope.valueHoanThanhMuon],
          ["Chưa hoàn thành", $scope.valueChuaHoanThanh],
          ["Quá hạn", $scope.valueQuaHan],
          ["Không có hạn", $scope.valueKhongCoHan],
        ]);
        var options = {
          title: "Thống kê đầu việc theo ngày hạn",
          is3D: true,
        };
        var chart = new google.visualization.PieChart(
          document.getElementById("chart_div_pie_due_date")
        );
        chart.draw(data, options);
      }
    };

    Promise.all([
      MeMemberService.fetchMembers(),
      MeMemberProjectService.fetchMembers($scope.projectId),
    ]).then(async function () {
      $scope.listMemberById = MeMemberService.getMembers();
      const memberProject = MeMemberProjectService.getMembers();

      $scope.listMemberProject = [];

      memberProject.forEach((meRes) => {
        const member = $scope.listMemberById.find(
          (me) => meRes.memberId === me.id
        );
        if (member) {
          member.checkMemberAssign = false;
          member.roleProject = meRes.role + "";
          member.statusWork = meRes.statusWork + "";
          member.idMemberProject = meRes.id;
          $scope.listMemberProject.push(member);
        }
      });

      for (let i = 0; i < $scope.listMemberProject.length; i++) {
        let item = $scope.listMemberProject[i];
        $scope.arrayMemberColumn.push(item.name + " " + item.code);

        await MeDashBoardService.fetchCountTodoByMemberAllProject(
          $scope.projectId,
          item.id
        ).then(function () {
          let count = MeDashBoardService.getCountTodoByMemberAllProject();
          $scope.arrayCountMemberColumn.push(count);

          let objMemberPie = [item.name + " " + item.code, count];
          $scope.arrayCountMemberPie.push(objMemberPie);
        });
      }

      await MeDashBoardService.fetchCountTodoByNoMemberAllProject(
        $scope.projectId
      ).then(function () {
        let count = MeDashBoardService.getCountTodoByNoMemberAllProject();
        $scope.arrayMemberColumn.push("Không có thành viên");
        $scope.arrayCountMemberColumn.push(count);

        let objMemberPie = ["Không có thành viên", count];
        $scope.arrayCountMemberPie.push(objMemberPie);
      });

      $scope.loadChartMember();
    });

    // Member
    $scope.loadChartMember = function () {
      google.charts.load("current", { packages: ["corechart"] });
      google.charts.setOnLoadCallback(drawChartColumnMember);
      function drawChartColumnMember() {
        var data = google.visualization.arrayToDataTable([
          $scope.arrayMemberColumn,
          $scope.arrayCountMemberColumn,
        ]);
        var options = {
          title: "Thống kê đầu việc theo thành viên",
          chartArea: { width: "50%" },
          // hAxis: {
          //   title: "Tên danh sách",
          // },
          vAxis: {
            title: "Số đầu việc",
          },
        };
        var chart = new google.visualization.ColumnChart(
          document.getElementById("chart_div_column_member")
        );
        chart.draw(data, options);
      }

      google.charts.load("current", { packages: ["corechart"] });
      google.charts.setOnLoadCallback(drawChartPieMember);
      function drawChartPieMember() {
        var data = google.visualization.arrayToDataTable(
          $scope.arrayCountMemberPie
        );
        var options = {
          title: "Thống kê đầu việc theo thành viên",
          is3D: true,
        };
        var chart = new google.visualization.PieChart(
          document.getElementById("chart_div_pie_member")
        );
        chart.draw(data, options);
      }
    };

    // Label

    MeLabelService.fetchLabels($scope.projectId).then(async function () {
      $scope.listLabel = MeLabelService.getAllLabels();

      for (let i = 0; i < $scope.listLabel.length; i++) {
        let item = $scope.listLabel[i];
        $scope.arrayLabelColumn.push(item.name);

        await MeDashBoardService.fetchCountTodoByLabelAllProject(
          $scope.projectId,
          item.id
        ).then(function () {
          let count = MeDashBoardService.getCountTodoByLabelAllProject();
          $scope.arrayCountLabelColumn.push(count);

          let objLabelPie = [item.name, count];
          $scope.arrayCountLabelPie.push(objLabelPie);
        });
      }

      await MeDashBoardService.fetchCountTodoByNoLabelAllProject(
        $scope.projectId
      ).then(function () {
        let count = MeDashBoardService.getCountTodoByNoLabelAllProject();
        $scope.arrayLabelColumn.push("Không có nhãn");
        $scope.arrayCountLabelColumn.push(count);

        let objLabelPie = ["Không có nhãn", count];
        $scope.arrayCountLabelPie.push(objLabelPie);
      });
      $scope.loadChartLabel();
    });

    $scope.loadChartLabel = function () {
      google.charts.load("current", { packages: ["corechart"] });
      google.charts.setOnLoadCallback(drawChartColumnLabel);
      function drawChartColumnLabel() {
        var data = google.visualization.arrayToDataTable([
          $scope.arrayLabelColumn,
          $scope.arrayCountLabelColumn,
        ]);
        var options = {
          title: "Thống kê đầu việc theo nhãn",
          chartArea: { width: "50%" },
          // hAxis: {
          //   title: "Tên danh sách",
          // },
          vAxis: {
            title: "Số đầu việc",
          },
        };
        var chart = new google.visualization.ColumnChart(
          document.getElementById("chart_div_column_label")
        );
        chart.draw(data, options);
      }

      google.charts.load("current", { packages: ["corechart"] });
      google.charts.setOnLoadCallback(drawChartPieLabel);
      function drawChartPieLabel() {
        var data = google.visualization.arrayToDataTable(
          $scope.arrayCountLabelPie
        );
        var options = {
          title: "Thống kê đầu việc theo nhãn",
          is3D: true,
        };
        var chart = new google.visualization.PieChart(
          document.getElementById("chart_div_pie_label")
        );
        chart.draw(data, options);
      }
    };
  };

  $scope.loadAllChartAllProject();

  $scope.showScrollTop = false;

  angular.element(window).bind("scroll", function () {
    var scrollPosition =
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0;
    $scope.showScrollTop = scrollPosition > 0;
    $scope.$apply();
  });

  $scope.scrollToTop = function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  $scope.valueChangePeriod = "0";

  $scope.changePeriod = function () {
    if ($scope.valueChangePeriod == "0") {
      $scope.loadAllChartAllProject();
    } else {
      $scope.loadAllChartPeriod();
    }
  };

  $scope.loadAllChartPeriod = function () {
    MeDetailPeriod.fetchPeriod($scope.valueChangePeriod).then(function () {
      let progressPeriodValue = MeDetailPeriod.getPeriod().progress;
      $scope.progressProject = progressPeriodValue / 100;
      circle.animate($scope.progressProject);
    });

    $scope.initVariables();
    MeTodoListService.fetchTodoList($scope.projectId).then(async function () {
      $scope.listTodoList = MeTodoListService.getTodoList();

      for (let i = 0; i < $scope.listTodoList.length; i++) {
        let item = $scope.listTodoList[i];
        $scope.arrayTodoListColumn.push(item.name);

        await MeDashboardPeriodService.fetchCountTodoByTodoListPeriod(
          $scope.projectId,
          $scope.valueChangePeriod,
          item.id
        ).then(function () {
          let count = MeDashboardPeriodService.getCountTodoByTodoListPeriod();
          $scope.arrayCountTodoListColumn.push(Number(count));

          let objTodoListPie = [item.name, Number(count)];
          $scope.arrayCountTodoListPie.push(objTodoListPie);
        });
      }

      $scope.loadChartTodoList();
    });

    // TodoList
    $scope.loadChartTodoList = function () {
      google.charts.load("current", { packages: ["corechart"] });
      google.charts.setOnLoadCallback(drawChartColumnTodoList);

      function drawChartColumnTodoList() {
        var data = google.visualization.arrayToDataTable([
          $scope.arrayTodoListColumn,
          $scope.arrayCountTodoListColumn,
        ]);
        var options = {
          title: "Thống kê đầu việc theo danh sách",
          chartArea: { width: "50%" },
          vAxis: {
            title: "Số đầu việc",
          },
        };
        var chart = new google.visualization.ColumnChart(
          document.getElementById("chart_div_column_todo_list")
        );
        chart.draw(data, options);
      }

      google.charts.load("current", { packages: ["corechart"] });
      google.charts.setOnLoadCallback(drawChartPieTodoList);
      function drawChartPieTodoList() {
        var data = google.visualization.arrayToDataTable(
          $scope.arrayCountTodoListPie
        );
        var options = {
          title: "Thống kê đầu việc theo danh sách",
          is3D: true,
        };
        var chart = new google.visualization.PieChart(
          document.getElementById("chart_div_pie_todo_list")
        );
        chart.draw(data, options);
      }
    };

    Promise.all([
      MeDashboardPeriodService.fetchCountTodoByDueDatePeriod(
        $scope.projectId,
        $scope.valueChangePeriod,
        0
      ),
      MeDashboardPeriodService.fetchCountTodoByDueDatePeriod(
        $scope.projectId,
        $scope.valueChangePeriod,
        2
      ),
      MeDashboardPeriodService.fetchCountTodoByDueDatePeriod(
        $scope.projectId,
        $scope.valueChangePeriod,
        3
      ),
      MeDashboardPeriodService.fetchCountTodoByDueDatePeriod(
        $scope.projectId,
        $scope.valueChangePeriod,
        4
      ),
      MeDashboardPeriodService.fetchCountTodoByNoDueDatePeriod(
        $scope.projectId,
        $scope.valueChangePeriod
      ),
    ]).then(function (responses) {
      $scope.valueChuaHoanThanh = responses[0].data.data;
      $scope.valueHoanThanhSom = responses[1].data.data;
      $scope.valueHoanThanhMuon = responses[2].data.data;
      $scope.valueQuaHan = responses[3].data.data;
      $scope.valueKhongCoHan = responses[4].data.data;
      $scope.valueHoanThanh =
        $scope.valueHoanThanhSom + $scope.valueHoanThanhMuon;

      $scope.loadChartDueDate();
    });

    // Due Date
    $scope.loadChartDueDate = function () {
      google.charts.load("current", { packages: ["corechart"] });
      google.charts.setOnLoadCallback(drawChartColumnDueDate);
      function drawChartColumnDueDate() {
        var data = google.visualization.arrayToDataTable([
          [
            "Ngày hạn",
            "Hoàn thành",
            "Hoàn thành sớm",
            "Hoàn thành muộn",
            "Chưa hoàn thành",
            "Quá hạn",
            "Không có hạn",
          ],
          [
            "Ngày hạn",
            $scope.valueHoanThanh,
            $scope.valueHoanThanhSom,
            $scope.valueHoanThanhMuon,
            $scope.valueChuaHoanThanh,
            $scope.valueQuaHan,
            $scope.valueKhongCoHan,
          ],
        ]);
        var options = {
          title: "Thống kê đầu việc theo ngày hạn",
          chartArea: { width: "50%" },
          vAxis: {
            title: "Số đầu việc",
          },
        };
        var chart = new google.visualization.ColumnChart(
          document.getElementById("chart_div_column_due_date")
        );
        chart.draw(data, options);
      }

      google.charts.load("current", { packages: ["corechart"] });
      google.charts.setOnLoadCallback(drawChartPieDueDate);
      function drawChartPieDueDate() {
        var data = google.visualization.arrayToDataTable([
          ["Ngày hạn", "Ngày hạn"],
          ["Hoàn thành sớm", $scope.valueHoanThanhSom],
          ["Hoàn thành muộn", $scope.valueHoanThanhMuon],
          ["Chưa hoàn thành", $scope.valueChuaHoanThanh],
          ["Quá hạn", $scope.valueQuaHan],
          ["Không có hạn", $scope.valueKhongCoHan],
        ]);
        var options = {
          title: "Thống kê đầu việc theo ngày hạn",
          is3D: true,
        };
        var chart = new google.visualization.PieChart(
          document.getElementById("chart_div_pie_due_date")
        );
        chart.draw(data, options);
      }
    };

    Promise.all([
      MeMemberService.fetchMembers(),
      MeMemberProjectService.fetchMembers($scope.projectId),
    ]).then(async function () {
      $scope.listMemberById = MeMemberService.getMembers();
      const memberProject = MeMemberProjectService.getMembers();

      $scope.listMemberProject = [];

      memberProject.forEach((meRes) => {
        const member = $scope.listMemberById.find(
          (me) => meRes.memberId === me.id
        );
        if (member) {
          member.checkMemberAssign = false;
          member.roleProject = meRes.role + "";
          member.statusWork = meRes.statusWork + "";
          member.idMemberProject = meRes.id;
          $scope.listMemberProject.push(member);
        }
      });

      for (let i = 0; i < $scope.listMemberProject.length; i++) {
        let item = $scope.listMemberProject[i];
        $scope.arrayMemberColumn.push(item.name + " " + item.code);

        await MeDashboardPeriodService.fetchCountTodoByMemberPeriod(
          $scope.projectId,
          $scope.valueChangePeriod,
          item.id
        ).then(function () {
          let count = MeDashboardPeriodService.getCountTodoByMemberPeriod();
          $scope.arrayCountMemberColumn.push(count);

          let objMemberPie = [item.name + " " + item.code, count];
          $scope.arrayCountMemberPie.push(objMemberPie);
        });
      }

      await MeDashboardPeriodService.fetchCountTodoByNoMemberPeriod(
        $scope.projectId,
        $scope.valueChangePeriod
      ).then(function () {
        let count = MeDashboardPeriodService.getCountTodoByNoMemberPeriod();
        $scope.arrayMemberColumn.push("Không có thành viên");
        $scope.arrayCountMemberColumn.push(count);

        let objMemberPie = ["Không có thành viên", count];
        $scope.arrayCountMemberPie.push(objMemberPie);
      });

      $scope.loadChartMember();
    });

    // Member
    $scope.loadChartMember = function () {
      google.charts.load("current", { packages: ["corechart"] });
      google.charts.setOnLoadCallback(drawChartColumnMember);
      function drawChartColumnMember() {
        var data = google.visualization.arrayToDataTable([
          $scope.arrayMemberColumn,
          $scope.arrayCountMemberColumn,
        ]);
        var options = {
          title: "Thống kê đầu việc theo thành viên",
          chartArea: { width: "50%" },
          // hAxis: {
          //   title: "Tên danh sách",
          // },
          vAxis: {
            title: "Số đầu việc",
          },
        };
        var chart = new google.visualization.ColumnChart(
          document.getElementById("chart_div_column_member")
        );
        chart.draw(data, options);
      }

      google.charts.load("current", { packages: ["corechart"] });
      google.charts.setOnLoadCallback(drawChartPieMember);
      function drawChartPieMember() {
        var data = google.visualization.arrayToDataTable(
          $scope.arrayCountMemberPie
        );
        var options = {
          title: "Thống kê đầu việc theo thành viên",
          is3D: true,
        };
        var chart = new google.visualization.PieChart(
          document.getElementById("chart_div_pie_member")
        );
        chart.draw(data, options);
      }
    };

    // Label

    MeLabelService.fetchLabels($scope.projectId).then(async function () {
      $scope.listLabel = MeLabelService.getAllLabels();

      for (let i = 0; i < $scope.listLabel.length; i++) {
        let item = $scope.listLabel[i];
        $scope.arrayLabelColumn.push(item.name);

        await MeDashboardPeriodService.fetchCountTodoByLabelPeriod(
          $scope.projectId,
          $scope.valueChangePeriod,
          item.id
        ).then(function () {
          let count = MeDashboardPeriodService.getCountTodoByLabelPeriod();
          $scope.arrayCountLabelColumn.push(count);

          let objLabelPie = [item.name, count];
          $scope.arrayCountLabelPie.push(objLabelPie);
        });
      }

      await MeDashboardPeriodService.fetchCountTodoByNoLabelPeriod(
        $scope.projectId,
        $scope.valueChangePeriod
      ).then(function () {
        let count = MeDashboardPeriodService.getCountTodoByNoLabelPeriod();
        $scope.arrayLabelColumn.push("Không có nhãn");
        $scope.arrayCountLabelColumn.push(count);

        let objLabelPie = ["Không có nhãn", count];
        $scope.arrayCountLabelPie.push(objLabelPie);
      });
      $scope.loadChartLabel();
    });

    $scope.loadChartLabel = function () {
      google.charts.load("current", { packages: ["corechart"] });
      google.charts.setOnLoadCallback(drawChartColumnLabel);
      function drawChartColumnLabel() {
        var data = google.visualization.arrayToDataTable([
          $scope.arrayLabelColumn,
          $scope.arrayCountLabelColumn,
        ]);
        var options = {
          title: "Thống kê đầu việc theo nhãn",
          chartArea: { width: "50%" },
          // hAxis: {
          //   title: "Tên danh sách",
          // },
          vAxis: {
            title: "Số đầu việc",
          },
        };
        var chart = new google.visualization.ColumnChart(
          document.getElementById("chart_div_column_label")
        );
        chart.draw(data, options);
      }

      google.charts.load("current", { packages: ["corechart"] });
      google.charts.setOnLoadCallback(drawChartPieLabel);
      function drawChartPieLabel() {
        var data = google.visualization.arrayToDataTable(
          $scope.arrayCountLabelPie
        );
        var options = {
          title: "Thống kê đầu việc theo nhãn",
          is3D: true,
        };
        var chart = new google.visualization.PieChart(
          document.getElementById("chart_div_pie_label")
        );
        chart.draw(data, options);
      }
    };
  };
};
