package com.portalprojects.core.member.service.impl;

import com.portalprojects.core.common.base.TodoObject;
import com.portalprojects.core.member.model.request.MeChangeCoverTodoRequest;
import com.portalprojects.core.member.model.request.MeCreateImageRequest;
import com.portalprojects.core.member.model.request.MeDeleteImageRequest;
import com.portalprojects.core.member.model.request.MeUpdateNameImageRequest;
import com.portalprojects.core.member.model.response.MeImageResponse;
import com.portalprojects.core.member.repository.MeActivityRepository;
import com.portalprojects.core.member.repository.MeImageRepository;
import com.portalprojects.core.member.repository.MeTodoRepository;
import com.portalprojects.core.member.service.MeImageService;
import com.portalprojects.entity.Activity;
import com.portalprojects.entity.Image;
import com.portalprojects.entity.Todo;
import com.portalprojects.infrastructure.constant.Message;
import com.portalprojects.infrastructure.constant.StatusImage;
import com.portalprojects.infrastructure.exception.rest.MessageHandlingException;
import com.portalprojects.infrastructure.successnotification.ConstantMessageSuccess;
import com.portalprojects.infrastructure.successnotification.SuccessNotificationSender;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import lombok.Synchronized;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;

/**
 * @author thangncph26123
 */
@Service
@Validated
public class MeImageServiceImpl implements MeImageService {

    @Autowired
    private MeImageRepository meImageRepository;

    @Autowired
    private MeTodoRepository meTodoRepository;

    @Autowired
    private MeActivityRepository meActivityRepository;

    @Autowired
    private SuccessNotificationSender successNotificationSender;

    @Override
    @Synchronized
    @CacheEvict(value = {"todosByPeriodAndTodoList", "todoById", "detailTodosById", "activityByIdTodo", "todosByFilter"}, allEntries = true)
    public TodoObject add(@Valid MeCreateImageRequest request, StompHeaderAccessor headerAccessor) {
        Image image = new Image();
        image.setTodoId(request.getIdTodo());
        image.setNameImage(request.getNameFileOld());
        Integer countImage = meImageRepository.countImageByIdTodo(request.getIdTodo());
        if (countImage == 0) {
            image.setStatusImage(StatusImage.COVER);
        } else {
            image.setStatusImage(StatusImage.NO_COVER);
        }
        image.setNameFile(request.getNameFile());
        Image newImage = meImageRepository.save(image);
        if (countImage == 0) {
            Optional<Todo> todoFind = meTodoRepository.findById(request.getIdTodo());
            if (!todoFind.isPresent()) {
                throw new MessageHandlingException(Message.TO_DO_NOT_EXISTS);
            }
            todoFind.get().setImageId(newImage.getId());
            todoFind.get().setNameFile(request.getNameFile());
            meTodoRepository.save(todoFind.get());
        }
        Activity activity = new Activity();
        activity.setProjectId(request.getProjectId());
        activity.setTodoListId(request.getIdTodoList());
        activity.setTodoId(request.getIdTodo());
        activity.setImageId(newImage.getId());
        activity.setMemberCreatedId(request.getIdUser());
        activity.setContentAction("đã thêm " + request.getNameFileOld() + " vào thẻ này");
        activity.setUrlImage(request.getIdTodo() + "/" + request.getNameFile());

        successNotificationSender.senderNotification(ConstantMessageSuccess.TAI_ANH_LEN_THANH_CONG, headerAccessor);
        TodoObject todoObject = TodoObject.builder().data(newImage)
                .dataActivity(meActivityRepository.save(activity))
                .idTodoList(request.getIdTodoList())
                .idTodo(request.getIdTodo()).build();
        return todoObject;
    }

    @Override
    @Synchronized
    public void uploadFile(String idTodo, MultipartFile file) {
        try {
            Path currentPath = Paths.get("");
            String parentPath = currentPath.toAbsolutePath().toString().substring(0, currentPath.toAbsolutePath().toString().lastIndexOf("\\"));
            String pathFile = parentPath + "/front_end/assets/imgTodo/";
            String folderName = idTodo;
            String absoluteFilePathFolder = pathFile + folderName;

            File folder = new File(absoluteFilePathFolder);
            if (!folder.exists()) {
                folder.mkdirs();
            }

            String absoluteFilePath = absoluteFilePathFolder + "/";
            String fileName = file.getOriginalFilename();
            String filePath = absoluteFilePath + fileName;
            file.transferTo(new File(filePath));
//            Files.write(Path.of(filePath), file.getBytes());

        } catch (Exception ex) {
            ex.printStackTrace();
        }
    }

    @Override
    public Image findById(String id) {
        return meImageRepository.findById(id).get();
    }

    @Override
    public List<MeImageResponse> getAllByIdTodo(String idTodo) {
        return meImageRepository.getAllByIdTodo(idTodo);
    }

    @Override
    @Synchronized
    @Transactional
    public Image updateNameImage(@Valid MeUpdateNameImageRequest request, StompHeaderAccessor headerAccessor) {
        Optional<Image> imageFind = meImageRepository.findById(request.getId());
        if (!imageFind.isPresent()) {
            throw new MessageHandlingException(Message.IMAGE_NOT_EXISTS);
        }
        imageFind.get().setNameImage(request.getNameImage());
        successNotificationSender.senderNotification(ConstantMessageSuccess.CAP_NHAT_THANH_CONG, headerAccessor);
        return meImageRepository.save(imageFind.get());
    }

    @Override
    @Synchronized
    @CacheEvict(value = {"todosByPeriodAndTodoList", "todoById", "detailTodosById", "activityByIdTodo", "todosByFilter"}, allEntries = true)
    @Transactional
    public TodoObject deleteImage(@Valid MeDeleteImageRequest request, StompHeaderAccessor headerAccessor) {
        if (request.getStatusImage().equals("0")) {
            Optional<Todo> todoFind = meTodoRepository.findById(request.getIdTodo());
            if (!todoFind.isPresent()) {
                throw new MessageHandlingException(Message.TO_DO_NOT_EXISTS);
            }
            todoFind.get().setImageId(null);
            todoFind.get().setNameFile(null);
            meTodoRepository.save(todoFind.get());
        }
        Path currentPath = Paths.get("");
        String parentPath = currentPath.toAbsolutePath().toString().substring(0, currentPath.toAbsolutePath().toString().lastIndexOf("\\"));
        String pathFile = parentPath + "/front_end/assets/imgTodo/" + request.getIdTodo() + "/" + request.getNameFile();
        File file = new File(pathFile);
        file.delete();

        Activity activityFind = meActivityRepository.findActivityByIdImage(request.getId());
        activityFind.setUrlImage(null);
        activityFind.setImageId(null);
        meActivityRepository.save(activityFind);

        Activity activity = new Activity();
        activity.setProjectId(request.getProjectId());
        activity.setTodoListId(request.getIdTodoList());
        activity.setTodoId(request.getIdTodo());
        activity.setMemberCreatedId(request.getIdUser());
        activity.setContentAction("đã xóa " + request.getNameImage() + " khỏi thẻ này");
        Activity newActivity = meActivityRepository.save(activity);

        meImageRepository.deleteById(request.getId());
        successNotificationSender.senderNotification(ConstantMessageSuccess.XOA_THANH_CONG, headerAccessor);
        TodoObject todoObject = TodoObject.builder().data(request.getId())
                .dataActivity(newActivity)
                .idTodoList(request.getIdTodoList()).
                idTodo(request.getIdTodo()).build();
        return todoObject;
    }

    @Override
    @Synchronized
    @CacheEvict(value = {"todosByPeriodAndTodoList", "todoById", "detailTodosById", "todosByFilter"}, allEntries = true)
    @Transactional
    public TodoObject changeCoverTodo(@Valid MeChangeCoverTodoRequest request, StompHeaderAccessor headerAccessor) {
        Optional<Todo> todoFind = meTodoRepository.findById(request.getIdTodo());
        if (!todoFind.isPresent()) {
            throw new MessageHandlingException(Message.TO_DO_NOT_EXISTS);
        }
        Optional<Image> imageFind = meImageRepository.findById(request.getIdImage());
        if (!imageFind.isPresent()) {
            throw new MessageHandlingException(Message.IMAGE_NOT_EXISTS);
        }
        if (request.getStatus().equals("0")) { // xóa khỏi cover
            todoFind.get().setImageId(null);
            todoFind.get().setNameFile(null);
            successNotificationSender.senderNotification(ConstantMessageSuccess.XOA_THANH_CONG, headerAccessor);
        } else {
            todoFind.get().setImageId(request.getIdImage());
            todoFind.get().setNameFile(request.getNameFile());
            meImageRepository.updateCoverOld(request.getIdTodo());
            successNotificationSender.senderNotification(ConstantMessageSuccess.CAP_NHAT_THANH_CONG, headerAccessor);
        }
        if (imageFind.get().getStatusImage().equals(StatusImage.COVER)) {
            imageFind.get().setStatusImage(StatusImage.NO_COVER);
        } else {
            imageFind.get().setStatusImage(StatusImage.COVER);
        }
        Image newImage = meImageRepository.save(imageFind.get());
        TodoObject todoObject = TodoObject.builder().data(meTodoRepository.save(todoFind.get()))
                .dataImage(newImage)
                .idTodoList(request.getIdTodoList()).idTodo(request.getIdTodo()).build();
        return todoObject;
    }
}
