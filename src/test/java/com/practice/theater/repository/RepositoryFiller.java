package com.practice.theater.repository;

import com.practice.theater.ServiceLocator;
import com.practice.theater.models.Author;
import com.practice.theater.models.Genre;
import com.practice.theater.models.Play;
import com.practice.theater.models.PlayDate;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.concurrent.TimeUnit;

class RepositoryFiller {

    private final AuthorRepository authorRepository =
            ServiceLocator.getInstance().getRepositoryFactory().authorRepository();
    private final GenreRepository genreRepository =
            ServiceLocator.getInstance().getRepositoryFactory().genreRepository();
    private final PlayRepository playRepository =
            ServiceLocator.getInstance().getRepositoryFactory().playRepository();


    @Test
    void fillToDatabaseAsTestMethod() {
        long start = playRepository.count();
        playRepository.addAll(Arrays.asList(
                getPlay("Apple", getAuthor("Jobs"), getGenre("Comedy")), // 1
                getPlay("Orange", getAuthor("Lemon"), getGenre("Juice")), // 2
                getPlay("Times", getAuthor("Dine True"), getGenre("Fighting")), // 3
                getPlay("BLM", getAuthor("Nigger"), getGenre("Action")), // 4
                getPlay("Covid-19", getAuthor("Chinese"), getGenre("2020")), // 5
                getPlay("Coronavirus", getAuthor("Animal"), getGenre("Science")), // 6
                getPlay("2-8", getAuthor("FCB"), getGenre("Violence")), // 7
                getPlay("Groove", getAuthor("CJ"), getGenre("RolePlay")), // 8
                getPlay("Witcher", getAuthor("Andrzej Sapkowski"), getGenre("Fantasy")), // 9
                getPlay("Ticker", getAuthor("Bomb Afanasy"), getGenre("Action")) // 10
        ));
        Assertions.assertEquals(start + 10, playRepository.count());
    }

    @Test
    void fillDatesToDatabaseAsTestMethod() {
        PlayDateRepository repository = ServiceLocator.getInstance().getRepositoryFactory().playDateRepository();
        long count = repository.count();
        List<Play> plays = playRepository.getAll();
        long beCount = count + plays.size() * 3;
        long currentTime = System.currentTimeMillis();
        long day = 1;
        List<PlayDate> playDateList = new ArrayList<>();
        for (Play play : plays) {
            for (int i = 0; i < 3; i++) {
                PlayDate playDate = new PlayDate();
                playDate.setPlay(play);
                playDate.setDate(Instant.ofEpochMilli(TimeUnit.DAYS.toMillis(day++) + currentTime));
                playDateList.add(playDate);
            }
        }
        repository.addAll(playDateList);
        Assertions.assertEquals(beCount, repository.count());
    }

    Play getPlay(String title, Author author, Genre genre) {
        Play play = new Play();
        play.setTitle(title);
        play.setAuthor(author);
        play.setGenre(genre);
        return play;
    }

    Author getAuthor(String name) {
        Author author = new Author();
        author.setName(name);
        authorRepository.add(author);
        return author;
    }

    Genre getGenre(String title) {
        Genre genre = new Genre();
        genre.setTitle(title);
        genreRepository.add(genre);
        return genre;
    }
}
