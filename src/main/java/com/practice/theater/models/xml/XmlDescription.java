package com.practice.theater.models.xml;

import javax.xml.bind.annotation.*;
import java.util.List;

@XmlRootElement(name = "description")
@XmlAccessorType(XmlAccessType.FIELD)
public final class XmlDescription {
    @XmlElementWrapper(name = "categories")
    @XmlElement(name = "category")
    private List<XmlCategory> categories;
    @XmlElementWrapper(name = "halls")
    @XmlElement(name = "hall")
    private List<XmlHall> halls;

    public List<XmlCategory> getCategories() {
        return categories;
    }

    public void setCategories(List<XmlCategory> categories) {
        this.categories = categories;
    }

    public List<XmlHall> getHalls() {
        return halls;
    }

    public void setHalls(List<XmlHall> halls) {
        this.halls = halls;
    }
}
