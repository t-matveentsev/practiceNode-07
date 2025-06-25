import { Router } from "express";
import {
  addMovieController,
  deleteMovieController,
  getMoviesByIdController,
  getMoviesController,
  patchMovieController,
  upsertMovieController,
} from "../controllers/movies.js";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import { validateBody } from "../utils/validateBody.js";
import { movieAddSchema, movieUpdateSchema } from "../validation/movies.js";
import { isValidId } from "../middlewares/isValidId.js";
import { authenticate } from "../middlewares/authenticate.js";
import { upload } from "../middlewares/multer.js";

const moviesRouter = Router();

moviesRouter.use(authenticate);

moviesRouter.get("/", ctrlWrapper(getMoviesController));

moviesRouter.get("/:id", isValidId, ctrlWrapper(getMoviesByIdController));

moviesRouter.post(
  "/",
  validateBody(movieAddSchema),
  ctrlWrapper(addMovieController)
);

moviesRouter.put(
  "/:id",
  isValidId,
  validateBody(movieAddSchema),
  ctrlWrapper(upsertMovieController)
);

moviesRouter.patch(
  "/:id",
  isValidId,
  upload.single("posterUrl"),
  validateBody(movieUpdateSchema),
  ctrlWrapper(patchMovieController)
);

moviesRouter.delete("/:id", isValidId, ctrlWrapper(deleteMovieController));

export default moviesRouter;
