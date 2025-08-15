import { Router } from "express";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import { validateBody } from "../utils/validateBody.js";
import {
  authSignupSchema,
  authSigninSchema,
  googleOAuthValidationSchema,
} from "../validation/auth.js";
import {
  signupController,
  verifyController,
  signinController,
  refreshController,
  signoutController,
  getGoogleOAuthLinkController,
  signUpOrSigninGoogleController,
} from "../controllers/auth.js";

const authRouter = Router();

authRouter.post(
  "/signup",
  validateBody(authSignupSchema),
  ctrlWrapper(signupController)
);

authRouter.get("/verify", ctrlWrapper(verifyController));

authRouter.post(
  "/signin",
  validateBody(authSigninSchema),
  ctrlWrapper(signinController)
);

authRouter.post("/refresh", ctrlWrapper(refreshController));

authRouter.post("/signout", ctrlWrapper(signoutController));

authRouter.post(
  "/get-google-oauth-link",
  ctrlWrapper(getGoogleOAuthLinkController)
);
authRouter.post(
  "/signin-with-google",
  validateBody(googleOAuthValidationSchema),
  ctrlWrapper(signUpOrSigninGoogleController)
);

export default authRouter;
