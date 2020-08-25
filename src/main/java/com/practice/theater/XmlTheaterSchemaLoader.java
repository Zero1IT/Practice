package com.practice.theater;

import com.practice.theater.models.xml.XmlCategory;
import com.practice.theater.models.xml.XmlDescription;
import com.practice.theater.models.xml.XmlHall;
import com.practice.theater.models.xml.XmlRow;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import javax.xml.bind.JAXBContext;
import javax.xml.bind.JAXBException;
import javax.xml.bind.Unmarshaller;
import java.io.InputStream;
import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.Arrays;
import java.util.List;

public class XmlTheaterSchemaLoader {

    private static final Logger LOGGER = LogManager.getLogger(XmlTheaterSchemaLoader.class);
    private final InputStream stream;

    public XmlTheaterSchemaLoader(InputStream stream) {
        this.stream = stream;
    }

    public XmlDescription getXmlDescription() throws JAXBException {
        JAXBContext context = JAXBContext.newInstance(XmlDescription.class);
        Unmarshaller unmarshaller = context.createUnmarshaller();
        return (XmlDescription) unmarshaller.unmarshal(stream);
    }

    public void mapToDatabase(Connection connection) {
        try {
            XmlDescription description = getXmlDescription();
            boolean hallsSuccess = toDatabaseHalls(description.getHalls(), connection);
            boolean categoriesSuccess = toDatabaseCategories(description.getCategories(), connection);
            if (!categoriesSuccess) {
                LOGGER.info("Not all categories was appended from xml to database");
            }
            if (!hallsSuccess) {
                LOGGER.info("Not all halls was appended from xml to database");
            }
            for (XmlHall hall : description.getHalls()) {
                boolean b = toDatabaseRows(hall.getRows(), hall.getName(), connection);
                hall.getRows().forEach(r -> System.out.println(r.getNumber() + ": " + r.getHint()));
                if (!b) {
                    LOGGER.info("Rows wasn't appended to {}", hall.getName());
                }
            }
        } catch (JAXBException e) {
            LOGGER.error(e);
        }
    }

    private static boolean toDatabaseHalls(List<XmlHall> halls, Connection connection) {
        try (CallableStatement stm = connection.prepareCall(ServiceLocator.getInstance().getQuery("xml.saveHall"))) {
            for (XmlHall hall : halls) {
                stm.setString(1, hall.getName());
                stm.addBatch();
                stm.clearParameters();
            }
            return Arrays.stream(stm.executeBatch())
                    .allMatch(i -> i > 0);
        } catch (SQLException e) {
            LOGGER.error(e);
        }
        return false;
    }

    private static boolean toDatabaseRows(List<XmlRow> rows, String hall, Connection connection) {
        try (CallableStatement stm = connection.prepareCall(ServiceLocator.getInstance().getQuery("xml.saveRows"))) {
            connection.setAutoCommit(false);
            for (XmlRow row : rows) {
                stm.setString(1, hall);
                stm.setInt(2, row.getNumber());
                stm.setInt(3, row.getCount());
                stm.setString(4, row.getHint());
                stm.setString(5, row.getCategory());
                stm.addBatch();
                stm.clearParameters();
            }
            boolean b = Arrays.stream(stm.executeBatch())
                    .allMatch(i -> i > 0);
            if (b) connection.commit();
            else connection.rollback();
            return b;
        } catch (SQLException e) {
            LOGGER.error(e);
        }
        return false;
    }

    private static boolean toDatabaseCategories(List<XmlCategory> categories, Connection connection) {
        try (CallableStatement stm = connection.prepareCall(ServiceLocator.getInstance().getQuery("xml.saveCategory"))) {
            for (XmlCategory category : categories) {
                stm.setString(1, category.getName());
                stm.setBigDecimal(2, category.getPrice());
                stm.addBatch();
                stm.clearParameters();
            }
            return Arrays.stream(stm.executeBatch())
                    .allMatch(i -> i > 0);
        } catch (SQLException e) {
            LOGGER.error(e);
        }
        return false;
    }
}
