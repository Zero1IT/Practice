package com.practice.web.dto;

import java.util.List;
import java.util.Map;

public class HallRowInfoDto {
    private List<HallRowDto> rows;
    private Map<Integer, List<Integer>> exclude;

    public List<HallRowDto> getRows() {
        return rows;
    }

    public void setRows(List<HallRowDto> rows) {
        this.rows = rows;
    }

    public Map<Integer, List<Integer>> getExclude() {
        return exclude;
    }

    public void setExclude(Map<Integer, List<Integer>> exclude) {
        this.exclude = exclude;
    }
}
