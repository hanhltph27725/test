app.service("MeDashBoardService", function ($http) {
  let countTodoByTodoListAllProject = 0;

  this.getCountTodoByTodoListAllProject = function () {
    return countTodoByTodoListAllProject;
  };

  this.fetchCountTodoByTodoListAllProject = function (projectId, todoListId) {
    return $http
      .get(
        apiCountTodoByTodoListAllProject +
          "?projectId=" +
          projectId +
          "&todoListId=" +
          todoListId
      )
      .then(
        function (response) {
          if (response.status === 200) {
            countTodoByTodoListAllProject = response.data.data;
          }
          return response;
        },
        function (errors) {
          console.log(errors);
        }
      );
  };

  let countTodoByDueDateAllProject = 0;

  this.getCountTodoByDueDateAllProject = function () {
    return countTodoByDueDateAllProject;
  };

  this.fetchCountTodoByDueDateAllProject = function (projectId, statusTodo) {
    return $http
      .get(
        apiCountTodoByDueDateAllProject +
          "?projectId=" +
          projectId +
          "&statusTodo=" +
          statusTodo
      )
      .then(
        function (response) {
          if (response.status === 200) {
            countTodoByDueDateAllProject = response.data.data;
          }
          return response;
        },
        function (errors) {
          console.log(errors);
        }
      );
  };

  let countTodoByNoDueDateAllProject = 0;

  this.getCountTodoByNoDueDateAllProject = function () {
    return countTodoByNoDueDateAllProject;
  };

  this.fetchCountTodoByNoDueDateAllProject = function (projectId) {
    return $http
      .get(apiCountTodoByNoDueDateAllProject + "?projectId=" + projectId)
      .then(
        function (response) {
          if (response.status === 200) {
            countTodoByNoDueDateAllProject = response.data.data;
          }
          return response;
        },
        function (errors) {
          console.log(errors);
        }
      );
  };

  let countTodoByMemberAllProject = 0;

  this.getCountTodoByMemberAllProject = function () {
    return countTodoByMemberAllProject;
  };

  this.fetchCountTodoByMemberAllProject = function (projectId, memberId) {
    return $http
      .get(
        apiCountTodoByMemberAllProject +
          "?projectId=" +
          projectId +
          "&memberId=" +
          memberId
      )
      .then(
        function (response) {
          if (response.status === 200) {
            countTodoByMemberAllProject = response.data.data;
          }
          return response;
        },
        function (errors) {
          console.log(errors);
        }
      );
  };

  let countTodoByNoMemberAllProject = 0;

  this.getCountTodoByNoMemberAllProject = function () {
    return countTodoByNoMemberAllProject;
  };

  this.fetchCountTodoByNoMemberAllProject = function (projectId) {
    return $http
      .get(apiCountTodoByNoMemberAllProject + "?projectId=" + projectId)
      .then(
        function (response) {
          if (response.status === 200) {
            countTodoByNoMemberAllProject = response.data.data;
          }
          return response;
        },
        function (errors) {
          console.log(errors);
        }
      );
  };

  let countTodoByLabelAllProject = 0;

  this.getCountTodoByLabelAllProject = function () {
    return countTodoByLabelAllProject;
  };

  this.fetchCountTodoByLabelAllProject = function (projectId, labelProjectId) {
    return $http
      .get(
        apiCountTodoByLabelAllProject +
          "?projectId=" +
          projectId +
          "&labelProjectId=" +
          labelProjectId
      )
      .then(
        function (response) {
          if (response.status === 200) {
            countTodoByLabelAllProject = response.data.data;
          }
          return response;
        },
        function (errors) {
          console.log(errors);
        }
      );
  };

  let countTodoByNoLabelAllProject = 0;

  this.getCountTodoByNoLabelAllProject = function () {
    return countTodoByNoLabelAllProject;
  };

  this.fetchCountTodoByNoLabelAllProject = function (projectId) {
    return $http
      .get(apiCountTodoByNoLabelAllProject + "?projectId=" + projectId)
      .then(
        function (response) {
          if (response.status === 200) {
            countTodoByNoLabelAllProject = response.data.data;
          }
          return response;
        },
        function (errors) {
          console.log(errors);
        }
      );
  };
});

app.service("MeDashboardPeriodService", function ($http) {
  let countTodoByTodoListPeriod = 0;

  this.getCountTodoByTodoListPeriod = function () {
    return countTodoByTodoListPeriod;
  };

  this.fetchCountTodoByTodoListPeriod = function (
    projectId,
    periodId,
    todoListId
  ) {
    return $http
      .get(
        apiCountTodoByTodoListPeriod +
          "?projectId=" +
          projectId +
          "&periodId=" +
          periodId +
          "&todoListId=" +
          todoListId
      )
      .then(
        function (response) {
          if (response.status === 200) {
            countTodoByTodoListPeriod = response.data.data;
          }
          return response;
        },
        function (errors) {
          console.log(errors);
        }
      );
  };

  let countTodoByDueDatePeriod = 0;

  this.getCountTodoByDueDatePeriod = function () {
    return countTodoByDueDatePeriod;
  };

  this.fetchCountTodoByDueDatePeriod = function (
    projectId,
    periodId,
    statusTodo
  ) {
    return $http
      .get(
        apiCountTodoByDueDatePeriod +
          "?projectId=" +
          projectId +
          "&periodId=" +
          periodId +
          "&statusTodo=" +
          statusTodo
      )
      .then(
        function (response) {
          if (response.status === 200) {
            countTodoByDueDatePeriod = response.data.data;
          }
          return response;
        },
        function (errors) {
          console.log(errors);
        }
      );
  };

  let countTodoByNoDueDatePeriod = 0;

  this.getCountTodoByNoDueDatePeriod = function () {
    return countTodoByNoDueDatePeriod;
  };

  this.fetchCountTodoByNoDueDatePeriod = function (projectId, periodId) {
    return $http
      .get(
        apiCountTodoByNoDueDatePeriod +
          "?projectId=" +
          projectId +
          "&periodId=" +
          periodId
      )
      .then(
        function (response) {
          if (response.status === 200) {
            countTodoByNoDueDatePeriod = response.data.data;
          }
          return response;
        },
        function (errors) {
          console.log(errors);
        }
      );
  };

  let countTodoByMemberPeriod = 0;

  this.getCountTodoByMemberPeriod = function () {
    return countTodoByMemberPeriod;
  };

  this.fetchCountTodoByMemberPeriod = function (projectId, periodId, memberId) {
    return $http
      .get(
        apiCountTodoByMemberPeriod +
          "?projectId=" +
          projectId +
          "&periodId=" +
          periodId +
          "&memberId=" +
          memberId
      )
      .then(
        function (response) {
          if (response.status === 200) {
            countTodoByMemberPeriod = response.data.data;
          }
          return response;
        },
        function (errors) {
          console.log(errors);
        }
      );
  };

  let countTodoByNoMemberPeriod = 0;

  this.getCountTodoByNoMemberPeriod = function () {
    return countTodoByNoMemberPeriod;
  };

  this.fetchCountTodoByNoMemberPeriod = function (projectId, periodId) {
    return $http
      .get(
        apiCountTodoByNoMemberPeriod +
          "?projectId=" +
          projectId +
          "&periodId=" +
          periodId
      )
      .then(
        function (response) {
          if (response.status === 200) {
            countTodoByNoMemberPeriod = response.data.data;
          }
          return response;
        },
        function (errors) {
          console.log(errors);
        }
      );
  };

  let countTodoByLabelPeriod = 0;

  this.getCountTodoByLabelPeriod = function () {
    return countTodoByLabelPeriod;
  };

  this.fetchCountTodoByLabelPeriod = function (
    projectId,
    periodId,
    labelProjectId
  ) {
    return $http
      .get(
        apiCountTodoByLabelPeriod +
          "?projectId=" +
          projectId +
          "&periodId=" +
          periodId +
          "&labelProjectId=" +
          labelProjectId
      )
      .then(
        function (response) {
          if (response.status === 200) {
            countTodoByLabelPeriod = response.data.data;
          }
          return response;
        },
        function (errors) {
          console.log(errors);
        }
      );
  };

  let countTodoByNoLabelPeriod = 0;

  this.getCountTodoByNoLabelPeriod = function () {
    return countTodoByNoLabelPeriod;
  };

  this.fetchCountTodoByNoLabelPeriod = function (projectId, periodId) {
    return $http
      .get(
        apiCountTodoByNoLabelPeriod +
          "?projectId=" +
          projectId +
          "&periodId=" +
          periodId
      )
      .then(
        function (response) {
          if (response.status === 200) {
            countTodoByNoLabelPeriod = response.data.data;
          }
          return response;
        },
        function (errors) {
          console.log(errors);
        }
      );
  };
});
