package com.portalprojects.core.member.service;

import com.portalprojects.core.common.base.TodoAndTodoListObject;
import com.portalprojects.core.common.base.TodoObject;
import com.portalprojects.core.member.model.request.MeCreateDetailTodoRequest;
import com.portalprojects.core.member.model.request.MeCreateTodoRequest;
import com.portalprojects.core.member.model.request.MeDeleteDeadlineTodoRequest;
import com.portalprojects.core.member.model.request.MeDeleteDetailTodoRequest;
import com.portalprojects.core.member.model.request.MeDeleteTodoRequest;
import com.portalprojects.core.member.model.request.MeFilterTodoRequest;
import com.portalprojects.core.member.model.request.MeSortTodoRequest;
import com.portalprojects.core.member.model.request.MeUpdateCompleteTodoRequest;
import com.portalprojects.core.member.model.request.MeUpdateDeTailTodoRequest;
import com.portalprojects.core.member.model.request.MeUpdateDeadlineTodoRequest;
import com.portalprojects.core.member.model.request.MeUpdateDescriptionsTodoRequest;
import com.portalprojects.core.member.model.request.MeUpdateIndexTodoRequest;
import com.portalprojects.core.member.model.request.MeUpdateNameTodoRequest;
import com.portalprojects.core.member.model.request.MeUpdateProgressTodoRequest;
import com.portalprojects.core.member.model.request.MeUpdateStatusTodoRequest;
import com.portalprojects.core.member.model.request.MeUpdateTodoRequest;
import com.portalprojects.core.member.model.request.MeUpdateTypeTodoRequest;
import com.portalprojects.core.member.model.response.MeDeleteTodoResponse;
import com.portalprojects.core.member.model.response.MeDetailTodoResponse;
import com.portalprojects.core.member.model.response.MeTodoResponse;
import com.portalprojects.entity.Todo;
import jakarta.validation.Valid;
import org.springframework.data.repository.query.Param;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;

import java.util.List;

/**
 * @author thangncph26123
 */
public interface MeTodoService {

    List<MeTodoResponse> getToDoByPeriodAndTodoList(String idPeriod, String idTodoList);

    MeTodoResponse findTodoById(@Param("idTodo") String idTodo);

    TodoObject updateNameTodo(@Valid MeUpdateNameTodoRequest request);

    List<MeTodoResponse> filter(MeFilterTodoRequest request, String idPeriod, String idTodoList);

    String checkTodoFilter(MeFilterTodoRequest req, String idPeriod, String idTodoList, String idTodo);

    Todo findById(String id);

    List<MeDetailTodoResponse> getDetailTodo(String idTodo);

    TodoObject updatePriorityLevel(@Valid MeUpdateTodoRequest request, StompHeaderAccessor headerAccessor);

    TodoObject updateProgress(@Valid MeUpdateProgressTodoRequest request, StompHeaderAccessor headerAccessor);

    TodoObject createTodoChecklist(@Valid MeCreateDetailTodoRequest request);

    Todo updateTodoChecklist(@Valid MeUpdateDeTailTodoRequest request);

    TodoObject updateStatusTodo(@Valid MeUpdateStatusTodoRequest request);

    TodoObject deleteDetailTodo(@Valid MeDeleteDetailTodoRequest request);

    TodoObject updateDescriptionsTodo(@Valid final MeUpdateDescriptionsTodoRequest request, StompHeaderAccessor headerAccessor);

    TodoObject updateDeadlineTodo(@Valid MeUpdateDeadlineTodoRequest request, StompHeaderAccessor headerAccessor);

    TodoObject deleteDeadlineTodo(@Valid MeDeleteDeadlineTodoRequest request, StompHeaderAccessor headerAccessor);

    Todo createTodo(@Valid MeCreateTodoRequest request, StompHeaderAccessor headerAccessor);

    TodoAndTodoListObject updateIndexTodo(@Valid MeUpdateIndexTodoRequest request);

    TodoObject updateCompleteTodo(@Valid MeUpdateCompleteTodoRequest request);

    TodoAndTodoListObject updateIndexTodoViewTable(@Valid MeUpdateIndexTodoRequest request);

    MeDeleteTodoResponse deleteTodo(@Valid MeDeleteTodoRequest request);

    String sortTodoPriority(@Valid MeSortTodoRequest request);

    String sortTodoDeadline(@Valid MeSortTodoRequest request);

    TodoObject updateTypeTodo(@Valid MeUpdateTypeTodoRequest request);

    Integer countTodoByTodoListAllProject(String projectId, String todoListId);

    Integer countTodoByDueDateAllProject(String projectId, Integer statusTodo);

    Integer countTodoByNoDueDateAllProject(String projectId);

    Integer countTodoByMemberAllProject(String projectId, String memberId);

    Integer countTodoByNoMemberAllProject(String projectId);

    Integer countTodoByLabelAllProject(String projectId, String labelProjectId);

    Integer countTodoByNoLabelAllProject(String projectId);

    //////////////////////////////////////////////////////////////////////////

    Integer countTodoByTodoListPeriod(String projectId, String periodId, String todoListId);

    Integer countTodoByDueDatePeriod(String projectId, String periodId, Integer statusTodo);

    Integer countTodoByNoDueDatePeriod(String projectId, String periodId);

    Integer countTodoByMemberPeriod(String projectId, String periodId, String memberId);

    Integer countTodoByNoMemberPeriod(String projectId, String periodId);

    Integer countTodoByLabelPeriod(String projectId, String periodId, String labelProjectId);

    Integer countTodoByNoLabelPeriod(String projectId, String periodId);
}
