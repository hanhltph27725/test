package com.portalprojects.core.member.service;

import com.portalprojects.core.member.model.response.MeActivityResponse;

import java.util.List;

/**
 * @author thangncph26123
 */
public interface MeActivityService {

    List<MeActivityResponse> getAll(String idTodo);
}
