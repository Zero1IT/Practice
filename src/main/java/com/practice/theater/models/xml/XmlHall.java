package com.practice.theater.models.xml;

import javax.xml.bind.annotation.*;
import java.util.List;

@XmlRootElement(name = "hall")
@XmlAccessorType(XmlAccessType.FIELD)
public final class XmlHall {
    @XmlAttribute(name = "name")
    private String name;
    @XmlElement(name = "row")
    private List<XmlRow> rows;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<XmlRow> getRows() {
        return rows;
    }

    public void setRows(List<XmlRow> rows) {
        this.rows = rows;
    }
}
