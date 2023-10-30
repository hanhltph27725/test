package com.portalprojects.core.member.service.impl;

import com.portalprojects.core.member.model.response.MeActivityResponse;
import com.portalprojects.core.member.repository.MeActivityRepository;
import com.portalprojects.core.member.service.MeActivityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * @author thangncph26123
 */
@Service
public class MeActivityServiceImpl implements MeActivityService {

    @Autowired
    private MeActivityRepository meActivityRepository;

    @Override
    @Cacheable(value = "activityByIdTodo", key = "#idTodo + '_idTodo'")
    public List<MeActivityResponse> getAll(String idTodo) {
        return meActivityRepository.getAll(idTodo);
    }
}
