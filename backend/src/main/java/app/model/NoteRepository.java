package app.model;

import org.springframework.data.jpa.repository.JpaRepository;

/** Reads and writes Note rows; Spring Data implements it. */
public interface NoteRepository extends JpaRepository<Note, String> {}
