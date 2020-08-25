package com.practice.theater.repository.jdbc;

import com.practice.theater.ServiceLocator;
import com.practice.theater.models.xml.HallRow;
import com.practice.theater.models.xml.HallRowTakenPlace;
import com.practice.theater.repository.HallRowRepository;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class JdbcHallRowRepository extends JdbcRepository<Long, HallRow> implements HallRowRepository {

    private static final Logger LOGGER = LogManager.getLogger(JdbcHallRowRepository.class);

    public JdbcHallRowRepository() {
        super(HallRow.class);
    }

    @Override
    public List<HallRow> getHallRowsByHallId(long hallId) {
        return findByKeyInstances(getFieldTableName("hallId"), hallId);
    }

    @Override
    public List<HallRowTakenPlace> rowNumberWithAssociatedTakenPlaces(long dateId, long hallId) {
        List<HallRowTakenPlace> places = new ArrayList<>();
        executeAsTransaction(connection -> fillTakenPlaces(connection, places, dateId, hallId));
        return places;
    }

    private void fillTakenPlaces(Connection connection, List<HallRowTakenPlace> places, long dateId, long hallId) {
        try (CallableStatement stm = connection.prepareCall(ServiceLocator.getInstance().getQuery("hall.taken"))) {
            stm.setLong(1, dateId);
            stm.setLong(2, hallId);
            ResultSet resultSet = stm.executeQuery();
            fillList(resultSet, places);
        } catch (SQLException e) {
            LOGGER.error(e);
        }
    }

    private void fillList(ResultSet resultSet, List<HallRowTakenPlace> places) throws SQLException {
        while (resultSet.next()) {
            HallRowTakenPlace place = new HallRowTakenPlace();
            place.setNumber(resultSet.getInt(1));
            place.setPlace(resultSet.getInt(2));
            places.add(place);
        }
    }
}
