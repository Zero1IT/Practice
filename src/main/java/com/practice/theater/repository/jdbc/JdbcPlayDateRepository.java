package com.practice.theater.repository.jdbc;

import com.practice.theater.ServiceLocator;
import com.practice.theater.models.Play;
import com.practice.theater.models.PlayDate;
import com.practice.theater.repository.PlayDateRepository;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;

public class JdbcPlayDateRepository extends JdbcRepository<Long, PlayDate> implements PlayDateRepository {
    JdbcPlayDateRepository() {
        super(PlayDate.class);
    }

    @Override
    public List<PlayDate> getPlayDatesByPlay(Play play) {
        return findByKeyInstances(getFieldTableName("play"), play.getId(), play);
    }

    @Override
    public List<PlayDate> getPlayDatesByPlay(Play play, Instant from) {
        List<PlayDate> playDates = new ArrayList<>();
        executeAsTransaction(connection -> {
            String query = ServiceLocator.getInstance().getQuery("playdate.by_play_from");
            try (PreparedStatement statement = connection.prepareStatement(query)) {
                statement.setLong(1, play.getId());
                statement.setObject(2, LocalDateTime.ofInstant(from, ZoneId.systemDefault()));
                ResultSet resultSet = statement.executeQuery();
                while (resultSet.next()) {
                    playDates.add(ejectInstance(resultSet, play));
                }
            }
        });
        return playDates;
    }
}
