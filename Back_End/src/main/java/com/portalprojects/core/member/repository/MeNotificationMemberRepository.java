package com.portalprojects.core.member.repository;

import com.portalprojects.core.member.model.request.MeFindNotificationMemberRequest;
import com.portalprojects.core.member.model.response.MeNotificationMemberResponse;
import com.portalprojects.repository.NotificationMemberRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

/**
 * @author thangncph26123
 */
public interface MeNotificationMemberRepository extends NotificationMemberRepository {

    @Query(value = """
            SELECT b.id, a.id as notification_id, a.content, a.url, b.status, b.created_date
            FROM notification a JOIN notification_member b ON a.id = b.notification_id
            WHERE b.member_id = :#{#req.memberId}
            ORDER BY b.created_date DESC 
            """, countQuery = """
            SELECT COUNT(1)
            FROM notification a JOIN notification_member b ON a.id = b.notification_id
            WHERE b.member_id = :#{#req.memberId}
            ORDER BY b.created_date DESC 
            """, nativeQuery = true)
    Page<MeNotificationMemberResponse> getAllNotificationMember(Pageable pageable, @Param("req") MeFindNotificationMemberRequest req);

    @Query(value = """
            SELECT COUNT(1) FROM notification_member a WHERE a.status = 0 AND a.member_id = :memberId
            """, nativeQuery = true)
    Integer countNotificationMember(@Param("memberId") String memberId);
}
