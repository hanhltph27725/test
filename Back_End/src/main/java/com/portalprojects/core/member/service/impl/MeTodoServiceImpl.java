package com.portalprojects.core.member.service.impl;

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
import com.portalprojects.core.member.model.response.MeCountTodoResponse;
import com.portalprojects.core.member.model.response.MeDeleteTodoResponse;
import com.portalprojects.core.member.model.response.MeDetailTodoResponse;
import com.portalprojects.core.member.model.response.MeTodoResponse;
import com.portalprojects.core.member.repository.MeActivityRepository;
import com.portalprojects.core.member.repository.MePeriodRepository;
import com.portalprojects.core.member.repository.MeProjectRepository;
import com.portalprojects.core.member.repository.MeTodoRepository;
import com.portalprojects.core.member.service.MeTodoService;
import com.portalprojects.entity.Activity;
import com.portalprojects.entity.Period;
import com.portalprojects.entity.PeriodTodo;
import com.portalprojects.entity.Project;
import com.portalprojects.entity.Todo;
import com.portalprojects.infrastructure.constant.Message;
import com.portalprojects.infrastructure.constant.PriorityLevel;
import com.portalprojects.infrastructure.constant.StatusReminder;
import com.portalprojects.infrastructure.constant.StatusTodo;
import com.portalprojects.infrastructure.constant.TypeTodo;
import com.portalprojects.infrastructure.exception.rest.MessageHandlingException;
import com.portalprojects.infrastructure.successnotification.ConstantMessageSuccess;
import com.portalprojects.infrastructure.successnotification.SuccessNotificationSender;
import com.portalprojects.repository.PeriodTodoRepository;
import com.portalprojects.util.DateConverter;
import com.portalprojects.util.DateTimeUtil;
import com.portalprojects.util.TodoHelper;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import lombok.Synchronized;
import org.apache.commons.io.FileUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;

import java.io.File;
import java.math.RoundingMode;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.text.DecimalFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

/**
 * @author thangncph26123
 */
@Service
@Validated
public class MeTodoServiceImpl implements MeTodoService {

    @Autowired
    private MeTodoRepository meTodoRepository;

    @Autowired
    private PeriodTodoRepository periodTodoRepository;

    @Autowired
    private SuccessNotificationSender successNotificationSender;

    @Autowired
    private MeActivityRepository meActivityRepository;

    @Autowired
    private MePeriodRepository mePeriodRepository;

    @Autowired
    private MeProjectRepository meProjectRepository;

    @Autowired
    private TodoHelper todoHelper;

    @Override
    @Cacheable(value = "todosByPeriodAndTodoList", key = "#idPeriod + '_' + #idTodoList")
    public List<MeTodoResponse> getToDoByPeriodAndTodoList(String idPeriod, String idTodoList) {
        return meTodoRepository.getToDoByPeriodAndIdTodoList(idPeriod, idTodoList);
    }

    @Override
    public MeTodoResponse findTodoById(String idTodo) {
        return meTodoRepository.findTodoById(idTodo);
    }

    @Override
    @Synchronized
    @CacheEvict(value = {"todosByPeriodAndTodoList", "todoById", "detailTodosById", "todosByFilter"}, allEntries = true)
    @Transactional
    public TodoObject updateNameTodo(@Valid MeUpdateNameTodoRequest request) {
        Optional<Todo> todoFind = meTodoRepository.findById(request.getIdTodo());
        if (!todoFind.isPresent()) {
            throw new MessageHandlingException(Message.TO_DO_NOT_EXISTS);
        }
        todoFind.get().setName(request.getName());
        TodoObject todoObject = TodoObject.builder().data(meTodoRepository.save(todoFind.get())).idTodoList(request.getIdTodoList()).idTodo(request.getIdTodo()).build();
        return todoObject;
    }

    @Override
    @Cacheable(value = "todosByFilter", key = "#request.name.toString() + '-' + #request.member.toString() + '_' + #request.label.toString() + '_' + #request.dueDate.toString() + '_' + #idPeriod + '_' + #idTodoList")
    public List<MeTodoResponse> filter(MeFilterTodoRequest request, String idPeriod, String idTodoList) {
        if (request.getLabel().isEmpty()) {
            List<String> newList = new ArrayList<>();
            newList.add("empty");
            request.setLabel(newList);
        }
        if (request.getMember().isEmpty()) {
            List<String> newList = new ArrayList<>();
            newList.add("empty");
            request.setMember(newList);
        }
        if (request.getDueDate().isEmpty()) {
            List<String> newList = new ArrayList<>();
            newList.add("empty");
            request.setDueDate(newList);
        }
        return meTodoRepository.filter(request, idPeriod, idTodoList);
    }

    @Override
    public String checkTodoFilter(MeFilterTodoRequest request, String idPeriod, String idTodoList, String idTodo) {
        if (request.getLabel().isEmpty()) {
            List<String> newList = new ArrayList<>();
            newList.add("empty");
            request.setLabel(newList);
        }
        if (request.getMember().isEmpty()) {
            List<String> newList = new ArrayList<>();
            newList.add("empty");
            request.setMember(newList);
        }
        if (request.getDueDate().isEmpty()) {
            List<String> newList = new ArrayList<>();
            newList.add("empty");
            request.setDueDate(newList);
        }
        return meTodoRepository.checkTodoFilter(request, idPeriod, idTodoList, idTodo);
    }

    @Override
    @Cacheable(value = "todoById", key = "#id + '_todo'")
    public Todo findById(String id) {
        return meTodoRepository.findById(id).get();
    }

    @Override
    @Cacheable(value = "detailTodosById", key = "#idTodo + '_detail'")
    public List<MeDetailTodoResponse> getDetailTodo(String idTodo) {
        return meTodoRepository.getDetailTodo(idTodo);
    }

    @Override
    @CacheEvict(value = {"todosByPeriodAndTodoList", "todoById", "detailTodosById", "todosByFilter"}, allEntries = true)
    @Synchronized
    @Transactional
    public TodoObject updatePriorityLevel(@Valid MeUpdateTodoRequest request, StompHeaderAccessor headerAccessor) {
        Optional<Todo> todoFindById = meTodoRepository.findById(request.getIdTodo());
        if (!todoFindById.isPresent()) {
            throw new MessageHandlingException(Message.TO_DO_NOT_EXISTS);
        }
        PriorityLevel[] priorityLevels = PriorityLevel.values();
        todoFindById.get().setPriorityLevel(priorityLevels[request.getPriorityLevel()]);
        TodoObject todoObject = TodoObject.builder().data(meTodoRepository.save(todoFindById.get())).idTodoList(request.getIdTodoList()).idTodo(request.getIdTodo()).build();
        successNotificationSender.senderNotification(ConstantMessageSuccess.CAP_NHAT_THANH_CONG, headerAccessor);
        return todoObject;
    }

    @Override
    @CacheEvict(value = {"todosByPeriodAndTodoList", "todoById", "detailTodosById", "todosByFilter"}, allEntries = true)
    @Synchronized
    @Transactional
    public TodoObject updateProgress(@Valid MeUpdateProgressTodoRequest request, StompHeaderAccessor headerAccessor) {
        Optional<Todo> todoFindById = meTodoRepository.findById(request.getIdTodo());
        if (!todoFindById.isPresent()) {
            throw new MessageHandlingException(Message.TO_DO_NOT_EXISTS);
        }
        todoFindById.get().setProgress(request.getProgress());
        updateProgressPeriod(request.getPeriodId());
        if (request.getProgress() == 100 && todoFindById.get().getDeadline() == null) {
            todoFindById.get().setStatusTodo(StatusTodo.HOAN_THANH_SOM);
        }
        TodoObject todoObject = TodoObject.builder().data(meTodoRepository.save(todoFindById.get())).idTodoList(request.getIdTodoList()).idTodo(request.getIdTodo()).build();
        return todoObject;
    }

    @Override
    @CacheEvict(value = {"todosByPeriodAndTodoList", "todoById", "detailTodosById", "todosByFilter"}, allEntries = true)
    @Synchronized
    public TodoObject createTodoChecklist(@Valid MeCreateDetailTodoRequest request) {
        Todo todo = new Todo();
        todo.setCode("todo_" + DateTimeUtil.convertDateToTimeStampSecond());
        todo.setName(request.getName());
        todo.setTodoId(request.getIdTodo());
        todo.setStatusTodo(StatusTodo.CHUA_HOAN_THANH);
        Todo todoSave = meTodoRepository.save(todo);
        MeCountTodoResponse meCountTodoResponse = updateProgress(request.getPeriodId(), request.getIdTodo());
        TodoObject todoObject = TodoObject.builder().data(todoSave).idTodoList(request.getIdTodoList()).idTodo(request.getIdTodo()).numberTodoComplete(meCountTodoResponse.getNumberTodoComplete()).numberTodo(meCountTodoResponse.getNumberTodo()).build();
        return todoObject;
    }

    @Override
    @CacheEvict(value = {"todosByPeriodAndTodoList", "todoById", "detailTodosById", "todosByFilter"}, allEntries = true)
    @Synchronized
    @Transactional
    public Todo updateTodoChecklist(@Valid MeUpdateDeTailTodoRequest request) {
        Optional<Todo> todo = meTodoRepository.findById(request.getIdTodoCreateOrDelete());
        if (!todo.isPresent()) {
            throw new MessageHandlingException(Message.TO_DO_NOT_EXISTS);
        }
        todo.get().setName(request.getName());
        Todo todoSave = meTodoRepository.save(todo.get());
        return todoSave;
    }

    @Override
    @CacheEvict(value = {"todosByPeriodAndTodoList", "todoById", "detailTodosById", "todosByFilter"}, allEntries = true)
    @Synchronized
    @Transactional
    public TodoObject updateStatusTodo(@Valid MeUpdateStatusTodoRequest request) {
        Optional<Todo> todoFind = meTodoRepository.findById(request.getIdTodoChange());
        if (!todoFind.isPresent()) {
            throw new MessageHandlingException(Message.TO_DO_NOT_EXISTS);
        }
        if (request.getStatusTodo() == 0) {
            todoFind.get().setStatusTodo(StatusTodo.DA_HOAN_THANH);
        } else {
            todoFind.get().setStatusTodo(StatusTodo.CHUA_HOAN_THANH);
        }
        Todo todoInCheckList = meTodoRepository.save(todoFind.get());
        MeCountTodoResponse meCountTodoResponse = updateProgress(request.getPeriodId(), request.getTodoId());
        TodoObject todoObject = TodoObject.builder().data(todoInCheckList).
                idTodoList(request.getIdTodoList()).
                idTodo(request.getIdTodo()).
                numberTodoComplete(meCountTodoResponse.getNumberTodoComplete()).
                numberTodo(meCountTodoResponse.getNumberTodo()).build();
        return todoObject;
    }

    @Override
    @CacheEvict(value = {"todosByPeriodAndTodoList", "todoById", "detailTodosById", "todosByFilter"}, allEntries = true)
    @Synchronized
    @Transactional
    public TodoObject deleteDetailTodo(@Valid MeDeleteDetailTodoRequest request) {
        meTodoRepository.deleteById(request.getId());
        MeCountTodoResponse meCountTodoResponse = updateProgress(request.getPeriodId(), request.getTodoId());
        TodoObject todoObject = TodoObject.builder().data(request.getId()).idTodoList(request.getIdTodoList()).idTodo(request.getIdTodo()).numberTodoComplete(meCountTodoResponse.getNumberTodoComplete()).numberTodo(meCountTodoResponse.getNumberTodo()).build();
        return todoObject;
    }

    @Override
    @CacheEvict(value = {"todosByPeriodAndTodoList", "todoById", "detailTodosById", "todosByFilter"}, allEntries = true)
    @Synchronized
    @Transactional
    public TodoObject updateDescriptionsTodo(@Valid MeUpdateDescriptionsTodoRequest request, StompHeaderAccessor headerAccessor) {
        Optional<Todo> todoFind = meTodoRepository.findById(request.getIdTodo());
        if (!todoFind.isPresent()) {
            throw new MessageHandlingException(Message.TO_DO_NOT_EXISTS);
        }
        todoFind.get().setDescriptions(request.getDescriptions());
        if (request.getDescriptions().equals("<p><br></p>")) {
            todoFind.get().setDescriptions(null);
        }
        TodoObject todoObject = TodoObject.builder().data(meTodoRepository.save(todoFind.get())).idTodoList(request.getIdTodoList()).idTodo(request.getIdTodo()).build();
        successNotificationSender.senderNotification(ConstantMessageSuccess.CAP_NHAT_THANH_CONG, headerAccessor);
        return todoObject;
    }

    @Override
    @CacheEvict(value = {"todosByPeriodAndTodoList", "todoById", "detailTodosById", "activityByIdTodo", "todosByFilter"}, allEntries = true)
    @Synchronized
    @Transactional
    public TodoObject updateDeadlineTodo(@Valid MeUpdateDeadlineTodoRequest request, StompHeaderAccessor headerAccessor) {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss");
        Date deadline = null;
        try {
            deadline = sdf.parse(request.getDeadline());
        } catch (ParseException e) {
            throw new MessageHandlingException(Message.INVALID_DATE);
        }
        Optional<Todo> todoFind = meTodoRepository.findById(request.getIdTodo());
        if (!todoFind.isPresent()) {
            throw new MessageHandlingException(Message.TO_DO_NOT_EXISTS);
        }
        todoFind.get().setDeadline(deadline.getTime());
        if (request.getReminder().equals("none")) {
            todoFind.get().setReminderTime(null);
            todoFind.get().setStatusReminder(null);
        } else {
            todoFind.get().setReminderTime(deadline.getTime() - Long.parseLong(request.getReminder()));
            todoFind.get().setStatusReminder(StatusReminder.CHUA_GUI);
        }

        Activity activity = new Activity();
        activity.setMemberCreatedId(request.getIdUser());
        activity.setProjectId(request.getProjectId());
        activity.setTodoListId(request.getIdTodoList());
        activity.setTodoId(request.getIdTodo());
        activity.setContentAction("đã cập nhật ngày hạn của thẻ này thành " + DateConverter.convertDateToString(deadline.getTime()));
        TodoObject todoObject = TodoObject.builder().data(meTodoRepository.save(todoFind.get()))
                .dataActivity(meActivityRepository.save(activity))
                .idTodoList(request.getIdTodoList()).idTodo(request.getIdTodo()).build();
        successNotificationSender.senderNotification(ConstantMessageSuccess.CAP_NHAT_THANH_CONG, headerAccessor);
        return todoObject;
    }

    @Override
    @CacheEvict(value = {"todosByPeriodAndTodoList", "todoById", "detailTodosById", "activityByIdTodo", "todosByFilter"}, allEntries = true)
    @Synchronized
    @Transactional
    public TodoObject deleteDeadlineTodo(@Valid MeDeleteDeadlineTodoRequest request, StompHeaderAccessor headerAccessor) {
        Optional<Todo> todoFind = meTodoRepository.findById(request.getIdTodo());
        if (!todoFind.isPresent()) {
            throw new MessageHandlingException(Message.TO_DO_NOT_EXISTS);
        }
        todoFind.get().setDeadline(null);
        todoFind.get().setCompletionTime(null);
        todoFind.get().setReminderTime(null);
        todoFind.get().setStatusReminder(StatusReminder.CHUA_GUI);
        Activity activity = new Activity();
        activity.setMemberCreatedId(request.getIdUser());
        activity.setProjectId(request.getProjectId());
        activity.setTodoListId(request.getIdTodoList());
        activity.setTodoId(request.getIdTodo());
        activity.setContentAction("đã xóa ngày hạn của thẻ này");
        TodoObject todoObject = TodoObject.builder().data(meTodoRepository.save(todoFind.get())).
                dataActivity(meActivityRepository.save(activity)).
                idTodoList(request.getIdTodoList()).idTodo(request.getIdTodo()).build();
        successNotificationSender.senderNotification(ConstantMessageSuccess.XOA_THANH_CONG, headerAccessor);
        return todoObject;
    }

    @Override
    @CacheEvict(value = {"todosByPeriodAndTodoList", "todoById", "detailTodosById", "todosByFilter"}, allEntries = true)
    @Synchronized
    public Todo createTodo(@Valid MeCreateTodoRequest request, StompHeaderAccessor headerAccessor) {
        Todo todo = new Todo();
        todo.setCode(todoHelper.genCodeTodo(request.getTodoListId()));
        todo.setIndexTodo(todoHelper.genIndexTodo(request.getTodoListId(), request.getPeriodId()));
        todo.setName(request.getName());
        todo.setStatusTodo(StatusTodo.CHUA_HOAN_THANH);
        todo.setTodoListId(request.getTodoListId());
        todo.setProgress((short) 0);
        todo.setType(TypeTodo.CONG_VIEC);
        Todo newTodo = meTodoRepository.save(todo);

        PeriodTodo periodTodo = new PeriodTodo();
        periodTodo.setTodoId(newTodo.getId());
        periodTodo.setPeriodId(request.getPeriodId());
        periodTodoRepository.save(periodTodo);

        Activity activity = new Activity();
        activity.setTodoId(newTodo.getId());
        activity.setTodoListId(request.getTodoListId());
        activity.setProjectId(request.getProjectId());
        activity.setMemberCreatedId(request.getIdUser());
        activity.setContentAction("đã thêm thẻ này vào " + request.getNameTodoList());
        meActivityRepository.save(activity);

        updateProgressPeriod(request.getPeriodId());
        successNotificationSender.senderNotification(ConstantMessageSuccess.THEM_THANH_CONG, headerAccessor);
        return newTodo;
    }

    @Override
    @CacheEvict(value = {"todosByPeriodAndTodoList", "todoById", "detailTodosById", "activityByIdTodo", "todosByFilter"}, allEntries = true)
    @Synchronized
    @Transactional
    public TodoAndTodoListObject updateIndexTodo(@Valid MeUpdateIndexTodoRequest request) {
        if (request.getIdTodoListOld().equals(request.getIdTodoListNew()) && request.getIndexBefore() == request.getIndexAfter() - 1) {
            throw new MessageHandlingException(Message.ERROR_UNKNOWN);
        }
        Optional<Todo> todoFind = meTodoRepository.findById(request.getIdTodo());
        if (request.getIdTodoListOld().equals(request.getIdTodoListNew())) {
            Short indexMaxTodo = meTodoRepository.getIndexTodoMax(request.getIdTodoListNew(), request.getPeriodId());
            if (request.getIndexAfter() - 1 <= indexMaxTodo) {
                if (request.getIndexBefore() <= request.getIndexAfter() - 1) {
                    if (request.getIndexAfter() == 0) {
                        request.setIndexAfter((short) (request.getIndexAfter() + 1));
                    }
                    meTodoRepository.updateIndexTodoDecs(request.getIndexBefore(), (short) (request.getIndexAfter() - 1), request.getPeriodId(), request.getIdTodoListOld());
                    todoFind.get().setIndexTodo((short) (request.getIndexAfter() - 1));
                    return TodoAndTodoListObject.builder().data(meTodoRepository.save(todoFind.get())).
                            idTodoListOld(request.getIdTodoListOld()).
                            indexBefore((int) request.getIndexBefore()).
                            indexAfter((int) request.getIndexAfter() - 1).build();
                } else {
                    meTodoRepository.updateIndexTodoAsc(request.getIndexBefore(), request.getIndexAfter(), request.getPeriodId(), request.getIdTodoListOld());
                    todoFind.get().setIndexTodo(request.getIndexAfter());
                    return TodoAndTodoListObject.builder().data(meTodoRepository.save(todoFind.get())).
                            idTodoListOld(request.getIdTodoListOld()).
                            indexBefore((int) request.getIndexBefore()).
                            indexAfter((int) request.getIndexAfter()).build();
                }
            } else {
                if (request.getIndexBefore() <= request.getIndexAfter() - 1) {
                    meTodoRepository.updateIndexTodoDecs(request.getIndexBefore(), indexMaxTodo, request.getPeriodId(), request.getIdTodoListOld());
                } else {
                    meTodoRepository.updateIndexTodoAsc(request.getIndexBefore(), indexMaxTodo, request.getPeriodId(), request.getIdTodoListOld());
                }
                todoFind.get().setIndexTodo(indexMaxTodo);
                return TodoAndTodoListObject.builder().data(meTodoRepository.save(todoFind.get())).
                        idTodoListOld(request.getIdTodoListOld()).
                        indexBefore((int) request.getIndexBefore()).
                        indexAfter(Integer.valueOf(indexMaxTodo)).build();
            }
        } else {
            Activity activity = new Activity();
            activity.setTodoId(request.getIdTodo());
            activity.setTodoListId(request.getIdTodoListNew());
            activity.setProjectId(request.getProjectId());
            activity.setMemberCreatedId(request.getIdUser());
            activity.setContentAction("đã kéo thẻ này từ " + request.getNameTodoListOld() + " tới " + request.getNameTodoListNew());
            Short countTodo = meTodoRepository.countTodoInTodoList(request.getIdTodoListNew(), request.getPeriodId());
            if (countTodo == 0) {
                meTodoRepository.updateIndexTodoInTodoListOld(request.getIdTodoListOld(), request.getPeriodId(), request.getIndexBefore());
                todoFind.get().setIndexTodo((short) 0);
                todoFind.get().setTodoListId(request.getIdTodoListNew());
                return TodoAndTodoListObject.builder().data(meTodoRepository.save(todoFind.get())).
                        dataActivity(meActivityRepository.save(activity)).
                        idTodoListOld(request.getIdTodoListOld()).
                        indexBefore((int) request.getIndexBefore()).
                        indexAfter(0).build();
            } else {
                Short indexMaxTodo = meTodoRepository.getIndexTodoMax(request.getIdTodoListNew(), request.getPeriodId());
                meTodoRepository.updateIndexTodoInTodoListOld(request.getIdTodoListOld(), request.getPeriodId(), request.getIndexBefore());
                if (request.getIndexAfter() <= indexMaxTodo) {
                    meTodoRepository.updateIndexTodoInTodoListNew(request.getIdTodoListNew(), request.getPeriodId(), request.getIndexAfter());
                    todoFind.get().setIndexTodo(request.getIndexAfter());
                    todoFind.get().setTodoListId(request.getIdTodoListNew());
                    return TodoAndTodoListObject.builder().data(meTodoRepository.save(todoFind.get())).
                            dataActivity(meActivityRepository.save(activity)).
                            idTodoListOld(request.getIdTodoListOld()).
                            indexBefore((int) request.getIndexBefore()).
                            indexAfter((int) request.getIndexAfter()).build();
                } else {
                    todoFind.get().setIndexTodo(++indexMaxTodo);
                    todoFind.get().setTodoListId(request.getIdTodoListNew());
                    return TodoAndTodoListObject.builder().data(meTodoRepository.save(todoFind.get())).
                            dataActivity(meActivityRepository.save(activity)).
                            idTodoListOld(request.getIdTodoListOld()).
                            indexBefore((int) request.getIndexBefore()).
                            indexAfter(Integer.valueOf(indexMaxTodo)).build();
                }
            }
        }
    }

    @Override
    @CacheEvict(value = {"todosByPeriodAndTodoList", "todoById", "detailTodosById", "activityByIdTodo", "todosByFilter"}, allEntries = true)
    @Synchronized
    @Transactional
    public TodoObject updateCompleteTodo(@Valid MeUpdateCompleteTodoRequest request) {
        Optional<Todo> todoFind = meTodoRepository.findById(request.getId());
        if (!todoFind.isPresent()) {
            throw new MessageHandlingException(Message.TO_DO_NOT_EXISTS);
        }
        Activity activity = new Activity();
        activity.setTodoListId(request.getIdTodoList());
        activity.setTodoId(request.getIdTodo());
        activity.setProjectId(request.getProjectId());
        activity.setMemberCreatedId(request.getIdUser());
        Short countTodo = meTodoRepository.countTodoInCheckList(request.getIdTodo());
        if (request.getStatus() == 0) {
            todoFind.get().setCompletionTime(new Date().getTime());
            activity.setContentAction("đã đánh dấu hoàn thành công việc");
            if (new Date().getTime() > todoFind.get().getDeadline()) {
                todoFind.get().setStatusTodo(StatusTodo.HOAN_THANH_MUON);
            } else {
                todoFind.get().setStatusTodo(StatusTodo.HOAN_THANH_SOM);
            }
            if (countTodo == 0) {
                todoFind.get().setProgress((short) 100);
                updateProgressPeriod(request.getPeriodId());
            }
        } else {
            todoFind.get().setCompletionTime(null);
            activity.setContentAction("đã đánh dấu chưa hoàn thành công việc");
            todoFind.get().setStatusTodo(StatusTodo.CHUA_HOAN_THANH);
            if (countTodo == 0) {
                todoFind.get().setProgress((short) 0);
                updateProgressPeriod(request.getPeriodId());
            }
        }
        TodoObject todoObject = TodoObject.builder().data(meTodoRepository.save(todoFind.get()))
                .dataActivity(meActivityRepository.save(activity))
                .idTodoList(request.getIdTodoList()).idTodo(request.getIdTodo()).build();
        return todoObject;
    }

    @Override
    @CacheEvict(value = {"todosByPeriodAndTodoList", "todoById", "detailTodosById", "activityByIdTodo", "todosByFilter"}, allEntries = true)
    @Transactional
    @Synchronized
    public TodoAndTodoListObject updateIndexTodoViewTable(@Valid MeUpdateIndexTodoRequest request) {
        Optional<Todo> todoFind = meTodoRepository.findById(request.getIdTodo());
        if (!todoFind.isPresent()) {
            throw new MessageHandlingException(Message.TO_DO_NOT_EXISTS);
        }
        Short indexMaxTodo = meTodoRepository.getIndexTodoMax(request.getIdTodoListNew(), request.getPeriodId());
        if (indexMaxTodo == null) {
            indexMaxTodo = -1;
        }
        todoFind.get().setIndexTodo(++indexMaxTodo);
        todoFind.get().setTodoListId(request.getIdTodoListNew());

        Activity activity = new Activity();
        activity.setTodoId(request.getIdTodo());
        activity.setTodoListId(request.getIdTodoListNew());
        activity.setProjectId(request.getProjectId());
        activity.setMemberCreatedId(request.getIdUser());
        activity.setContentAction("đã kéo thẻ này từ " + request.getNameTodoListOld() + " tới " + request.getNameTodoListNew());

        TodoAndTodoListObject todoAndTodoListObject = TodoAndTodoListObject.builder().data(meTodoRepository.save(todoFind.get())).
                dataActivity(meActivityRepository.save(activity)).
                idTodoListOld(request.getIdTodoListOld()).
                indexBefore((int) request.getIndexBefore()).
                indexAfter(Integer.valueOf(indexMaxTodo)).build();
        return todoAndTodoListObject;
    }

    @Override
    @Synchronized
    @Transactional
    @CacheEvict(value = {"todosByPeriodAndTodoList", "todoById", "detailTodosById", "todosByFilter"}, allEntries = true)
    public MeDeleteTodoResponse deleteTodo(@Valid MeDeleteTodoRequest request) {
        Optional<Todo> todoFind = meTodoRepository.findById(request.getId());
        if (!todoFind.isPresent()) {
            throw new MessageHandlingException(Message.TO_DO_NOT_EXISTS);
        }

        meTodoRepository.deleteCommentTodo(request.getId());
        meTodoRepository.deleteAssignTodo(request.getId());

        meTodoRepository.deleteImageTodo(request.getId());
        Path currentPath = Paths.get("");
        String parentPath = currentPath.toAbsolutePath().toString().substring(0, currentPath.toAbsolutePath().toString().lastIndexOf("\\"));
        String pathFile = parentPath + "/front_end/assets/imgTodo/" + request.getId();
        try {
            File directory = new File(pathFile);
            FileUtils.deleteDirectory(directory);
        } catch (Exception e) {
            e.printStackTrace();
        }

        meTodoRepository.deleteResourceTodo(request.getId());
        meTodoRepository.deleteActivityTodo(request.getId(), request.getIdProject());
        meTodoRepository.deletePeriodTodo(request.getId(), request.getIdPeriod());
        meTodoRepository.deleteTodoInCheckList(request.getId());
        meTodoRepository.deleteLabelProjectTodo(request.getId());

        String idTodoList = todoFind.get().getTodoListId();
        meTodoRepository.updateIndexTodo(idTodoList, (int) todoFind.get().getIndexTodo());
        meTodoRepository.deleteById(request.getId());

        updateProgressPeriod(request.getIdPeriod());
        MeDeleteTodoResponse meDeleteTodoResponse = MeDeleteTodoResponse.builder()
                .idTodo(request.getId()).idTodoList(idTodoList).build();
        return meDeleteTodoResponse;
    }

    @Override
    @CacheEvict(value = {"todosByPeriodAndTodoList", "todosByFilter"}, allEntries = true)
    @Synchronized
    public String sortTodoPriority(@Valid MeSortTodoRequest request) {
        if (request.getType() == 0) {
            meTodoRepository.sortByPriorityAsc(request.getIdPeriod());
        }
        if (request.getType() == 1) {
            meTodoRepository.sortByPriorityDesc(request.getIdPeriod());
        }
        return request.getIdPeriod();
    }

    @Override
    @CacheEvict(value = {"todosByPeriodAndTodoList", "todosByFilter"}, allEntries = true)
    @Synchronized
    public String sortTodoDeadline(MeSortTodoRequest request) {
        if (request.getType() == 0) {
            meTodoRepository.sortByDeadlineAsc(request.getIdPeriod());
        }
        if (request.getType() == 1) {
            meTodoRepository.sortByDeadlineDesc(request.getIdPeriod());
        }
        return request.getIdPeriod();
    }

    @Override
    @Synchronized
    @Transactional
    @CacheEvict(value = {"todoById", "detailTodosById"}, allEntries = true)
    public TodoObject updateTypeTodo(@Valid MeUpdateTypeTodoRequest request) {
        Optional<Todo> todoFind = meTodoRepository.findById(request.getId());
        if (!todoFind.isPresent()) {
            throw new MessageHandlingException(Message.TO_DO_NOT_EXISTS);
        }
        if (request.getType() == 0) {
            todoFind.get().setType(TypeTodo.TAI_LIEU);
        } else {
            todoFind.get().setType(TypeTodo.CONG_VIEC);
        }
        Todo newTodo = meTodoRepository.save(todoFind.get());
        updateProgressPeriod(request.getPeriodId());
        TodoObject todoObject = TodoObject.builder().data(newTodo).
                idTodoList(request.getIdTodoList()).
                idTodo(request.getIdTodo()).build();
        return todoObject;
    }

    @Override
    public Integer countTodoByTodoListAllProject(String projectId, String todoListId) {
        return meTodoRepository.countTodoByTodoListAllProject(projectId, todoListId);
    }

    @Override
    public Integer countTodoByDueDateAllProject(String projectId, Integer statusTodo) {
        return meTodoRepository.countTodoByDueDateAllProject(projectId, statusTodo);
    }

    @Override
    public Integer countTodoByNoDueDateAllProject(String projectId) {
        return meTodoRepository.countTodoByNoDueDateAllProject(projectId);
    }

    @Override
    public Integer countTodoByMemberAllProject(String projectId, String memberId) {
        return meTodoRepository.countTodoByMemberAllProject(projectId, memberId);
    }

    @Override
    public Integer countTodoByNoMemberAllProject(String projectId) {
        return meTodoRepository.countTodoByNoMemberAllProject(projectId);
    }

    @Override
    public Integer countTodoByLabelAllProject(String projectId, String labelProjectId) {
        return meTodoRepository.countTodoByLabelAllProject(projectId, labelProjectId);
    }

    @Override
    public Integer countTodoByNoLabelAllProject(String projectId) {
        return meTodoRepository.countTodoByNoLabelAllProject(projectId);
    }

    @Override
    public Integer countTodoByTodoListPeriod(String projectId, String periodId, String todoListId) {
        return meTodoRepository.countTodoByTodoListPeriod(projectId, periodId, todoListId);
    }

    @Override
    public Integer countTodoByDueDatePeriod(String projectId, String periodId, Integer statusTodo) {
        return meTodoRepository.countTodoByDueDatePeriod(projectId, periodId, statusTodo);
    }

    @Override
    public Integer countTodoByNoDueDatePeriod(String projectId, String periodId) {
        return meTodoRepository.countTodoByNoDueDatePeriod(projectId, periodId);
    }

    @Override
    public Integer countTodoByMemberPeriod(String projectId, String periodId, String memberId) {
        return meTodoRepository.countTodoByMemberPeriod(projectId, periodId, memberId);
    }

    @Override
    public Integer countTodoByNoMemberPeriod(String projectId, String periodId) {
        return meTodoRepository.countTodoByNoMemberPeriod(projectId, periodId);
    }

    @Override
    public Integer countTodoByLabelPeriod(String projectId, String periodId, String labelProjectId) {
        return meTodoRepository.countTodoByLabelPeriod(projectId, periodId, labelProjectId);
    }

    @Override
    public Integer countTodoByNoLabelPeriod(String projectId, String periodId) {
        return meTodoRepository.countTodoByNoLabelPeriod(projectId, periodId);
    }

    public MeCountTodoResponse updateProgress(String idPeriod, String todoId) {
        Short countTodoComplete = meTodoRepository.countTodoComplete(todoId);
        Short countTodoInCheckList = meTodoRepository.countTodoInCheckList(todoId);
        Optional<Todo> todo = meTodoRepository.findById(todoId);
        if (countTodoInCheckList > 0) {
            short progress = (short) (countTodoComplete * 100 / countTodoInCheckList);
            todo.get().setProgress(progress);
            if (todo.get().getDeadline() == null) {
                if (progress == 100) {
                    todo.get().setStatusTodo(StatusTodo.HOAN_THANH_SOM);
                } else {
                    todo.get().setStatusTodo(StatusTodo.CHUA_HOAN_THANH);
                }
            }
        }
        if (countTodoInCheckList == 0) {
            todo.get().setProgress((short) 0);
        }
        meTodoRepository.save(todo.get());
        updateProgressPeriod(idPeriod);
        return new MeCountTodoResponse(countTodoComplete, countTodoInCheckList);
    }

    private void updateProgressPeriod(String idPeriod) {
        List<Short> listProgressByIdPeriod = meTodoRepository.getAllProgressByIdPeriod(idPeriod);

        int sum = 0;
        for (Short progress : listProgressByIdPeriod) {
            if (progress != null) {
                sum += progress;
            }
        }
        float average = (float) sum / listProgressByIdPeriod.size();

        DecimalFormat decimalFormat = new DecimalFormat("#.#");
        decimalFormat.setRoundingMode(RoundingMode.HALF_UP);
        String roundedAverage = decimalFormat.format(average);
        Optional<Period> periodFind = mePeriodRepository.findById(idPeriod);
        if (!periodFind.isPresent()) {
            throw new MessageHandlingException(Message.PERIOD_NOT_EXISTS);
        }
        periodFind.get().setProgress(Float.parseFloat(roundedAverage));
        mePeriodRepository.save(periodFind.get());

        List<Float> listProgressByIdProject = mePeriodRepository.getAllProgressByIdProject(periodFind.get().getProjectId());

        float sumPro = 0;
        for (Float progress : listProgressByIdProject) {
            sumPro += progress;
        }
        float averagePro = sumPro / listProgressByIdProject.size();

        DecimalFormat decimalFormatPro = new DecimalFormat("#.##");
        decimalFormatPro.setRoundingMode(RoundingMode.HALF_UP);
        String roundedAveragePro = decimalFormatPro.format(averagePro);

        Optional<Project> projectFind = meProjectRepository.findById(periodFind.get().getProjectId());
        if (!projectFind.isPresent()) {
            throw new MessageHandlingException(Message.PROJECT_NOT_EXISTS);
        }
        projectFind.get().setProgress(Float.parseFloat(roundedAveragePro));
        meProjectRepository.save(projectFind.get());
    }
}
