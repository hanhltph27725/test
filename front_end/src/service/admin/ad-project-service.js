app.service("AdProjcetService", function ($http) {
  var projects = [];

  this.getProject = function () {
    return projects;
  };

  this.setProject = function (data) {
    projects = data;
  };

  this.fetchProject = function () {
    return $http.get(projcetAPI).then(
      function (response) {
        if (response.status === 200) {
          projects = response.data.data.data;
        }
        return response;
      },
      function (errors) {
        console.log(errors);
      }
    );
  };
});

app.service("getOneAdProjcetService", function ($http) {
  var projects = {};

  this.getProject = function () {
    return projects;
  };

  this.setProject = function (data) {
    projects = data;
  };

  this.fetchProject = function (idProject) {
    return $http.get(projcetAPI + "/" + idProject).then(
      function (response) {
        if (response.status === 200) {
          projects = response.data.data.data;
        }
        return response;
      },
      function (errors) {
        console.log(errors);
      }
    );
  };
});

app.service("AdGetAllProject", function ($http) {
  var project = [];
  var totalpages = 0;

  this.getProject = function () {
    return project;
  };

  this.getTotalpages = function () {
    return totalpages;
  };

  this.setProject = function (data) {
    project = data;
  };

  this.fetchProject = function () {
    return $http.get(projcetAPI).then(
      function (response) {
        if (response.status === 200) {
          project = response.data.data.data;
          totalpages = response.data.data.totalPages;
        }
        return response;
      },
      function (errors) {
        console.log(errors);
      }
    );
  };

  this.searchProject = function (inputNameProject,inputNameCategory) {
    return $http.get(projcetAPI + "/search" + "?name=" + inputNameProject +"&nameCategory="+inputNameCategory).then(
      function (response) {
        if (response.status === 200) {
          project = response.data.data.data;
          totalpages = response.data.data.totalPages;
        }
        return response;
      },
      function (errors) {
        console.log(errors);
      }
    );
  };

  this.pageProject = function (inputNameProject,inputNameCategory, currentPage) {
    return $http
      .get(
        projcetAPI + "/search" + "?name=" + inputNameProject +"&nameCategory="+inputNameCategory+ "&page=" + currentPage
      )
      .then(
        function (response) {
          if (response.status === 200) {
            project = response.data.data.data;
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

// member
app.service("AdMemberProjcetService", function ($http) {
  var memberProjects = [];

  this.getMemberProject = function () {
    return memberProjects;
  };

  this.setPMemberProject = function (data) {
    memberProjects = data;
  };

  this.findAllMemberJoinProject = function (idProject) {
    return $http
      .get(member_ProjcetAPI + "/list-member-projetc/" + idProject)
      .then(
        function (response) {
          if (response.status === 200) {
            memberProjects = response.data;
          }
          return response;
        },
        function (errors) {
          console.log(errors);
        }
      );
  };
});

app.service("getOneAdMemberProjcetService", function ($http) {
  var memberProject = {};

  this.getMemberProject = function () {
    return memberProject;
  };

  this.setMemberProject = function (data) {
    memberProject = data;
  };

  this.getOneMemberProject = function (idMember, idProject) {
    return $http
      .get(
        member_ProjcetAPI +
          "/get-one?idProject=" +
          idProject +
          "&idMember=" +
          idMember
      )
      .then(
        function (response) {
          if (response.status === 200) {
            memberProject = response.data.data;
          }
          return response;
        },
        function (errors) {
          console.log(errors);
        }
      );
  };
});
app.service("AdProjcetCategoryService", function ($http) {
  var projectCategory = [];

  this.getProjectCategory = function () {
    return projectCategory;
  };

  this.setProjectCategory = function (data) {
    projectCategory = data;
  };

  this.fetchProjectCategory = function (idProject) {
    return $http.get(project_categoryAPI_getByIdProject+"/"+idProject).then(
      function (response) {
        if (response.status === 200) {
          projectCategory = response.data.data;
          console.log(projectCategory);
        }
        return response;
      },
      function (errors) {
        console.log(errors);
      }
    );
  };
});
