import createHttpError from "http-errors";

import {
  getMovies,
  getMovieById,
  addMovie,
  updateMovie,
  deleteMovieById,
} from "../services/movies.js";
import { parsePaginationParams } from "../utils/parsePaginationParams.js";
import { parseSortParams } from "../utils/parseSortParams.js";
import { movieSortFields } from "../db/models/Movie.js";
import { parsMovieFilterParams } from "../utils/filters/parseMovieFilterParams.js";
import { saveFile } from "../utils/saveFile.js";

export const getMoviesController = async (req, res) => {
  const paginationParams = parsePaginationParams(req.query);
  const sortParams = parseSortParams(req.query, movieSortFields);
  const filters = parsMovieFilterParams(req.query);
  filters.owner = req.user._id;
  const data = await getMovies({ ...paginationParams, ...sortParams, filters });
  res.json({
    status: 200,
    message: "Successfully find movies",
    data,
  });
};

export const getMoviesByIdController = async (req, res) => {
  const { id } = req.params;
  const data = await getMovieById(id);

  if (!data) {
    throw createHttpError(404, `Movie with id=${id} not found`);
  }

  res.json({
    status: 200,
    message: `Successfully find movie with id=${id}`,
    data,
  });
};

export const addMovieController = async (req, res) => {
  const { _id: owner } = req.user;
  const data = await addMovie({ ...req.body, owner });

  res.status(201).json({
    status: 201,
    message: "Successfully add movie",
    data,
  });
};

export const upsertMovieController = async (req, res) => {
  const { id } = req.params;
  const { data, isNew } = await updateMovie(id, req.body, { upsert: true });
  const status = isNew ? 201 : 200;

  res.status(status).json({
    status,
    message: "Successfully update movie",
    data,
  });
};

export const patchMovieController = async (req, res) => {
  const { id } = req.params;
  let posterUrl = null;

  if (req.file) {
    posterUrl = await saveFile(req.file);
  }

  const result = await updateMovie(id, { ...req.body, posterUrl });

  if (!result) {
    throw createHttpError(404, `Movie with id=${id} not found`);
  }

  res.json({
    status: 200,
    message: "Successfully update movie",
    data: result.data,
  });
};

export const deleteMovieController = async (req, res) => {
  const { id } = req.params;
  const data = await deleteMovieById(id);

  if (!data) {
    throw createHttpError(404, `Movie with id=${id} not found`);
  }

  res.status(204).send();
};
