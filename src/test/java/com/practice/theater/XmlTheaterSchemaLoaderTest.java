package com.practice.theater;

import com.practice.theater.models.xml.XmlDescription;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

import javax.xml.bind.JAXBException;
import java.io.IOException;
import java.io.InputStream;

class XmlTheaterSchemaLoaderTest {
    @Test
    void readXmlTest() {
        try (InputStream stream = XmlTheaterSchemaLoader.class.getResourceAsStream("/category.xml")) {
            XmlTheaterSchemaLoader loader = new XmlTheaterSchemaLoader(stream);
            XmlDescription xmlDescription = loader.getXmlDescription();
            Assertions.assertEquals(10, xmlDescription.getHalls().get(0).getRows().size());
        } catch (IOException | JAXBException e) {
            e.printStackTrace();
        }
    }
}
