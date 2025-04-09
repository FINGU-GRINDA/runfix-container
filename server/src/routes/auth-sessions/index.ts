import Elysia, { t } from "elysia";
import {
  generateRegistrationOptions,
  PublicKeyCredentialCreationOptionsJSON,
  RegistrationResponseJSON,
  verifyRegistrationResponse,
} from "@simplewebauthn/server";
import {
  getTempSessionOptions,
  tempSaveUserSessionAndOptions,
} from "./services";
import { rpID, rpName, origin } from "./constants";
import { prisma } from "../../deps/prisma";
import { HttpError } from "elysia-http-error";
import { authenticateUser } from "../../plugins/authentication";
import jwt from "@elysiajs/jwt";
import { env } from "../../../config";
import { UserRole } from "@prisma/client";

export const authSessionRouter = new Elysia({
  prefix: "/auth-sessions",
  tags: ["auth-sessions"],
})
  .use(
    jwt({
      name: "jwt",
      secret: process.env.JWT_SECRET!,
    })
  )
  .post(
    "/create-with-email-sign-in",
    async (ctx) => {
      // authenticate user
      const dbEmailAuth = await prisma.emailAuth.findUnique({
        where: {
          emailAddress: ctx.body.emailAddress,
        },
        include: {
          User: true,
        },
      });

      if (!dbEmailAuth) {
        throw HttpError.Unauthorized("Invalid credentials");
      }

      const isPasswordVerified = await Bun.password.verify(
        ctx.body.password,
        dbEmailAuth.password as string
      );

      if (!dbEmailAuth.User) {
        throw HttpError.Unauthorized("Missing user");
      }

      if (!isPasswordVerified) {
        throw HttpError.Unauthorized("Invalid credentials");
      }

      const expireAt =
        new Date().getTime() +
        env.AUTH_TOKEN_EXPIRY_DURATION_MINUTES * 60 * 1000;

      // create new access token
      const newToken = await ctx.jwt.sign({
        sub: JSON.stringify(dbEmailAuth.User),
        exp: expireAt,
      });

      const userAgent = ctx.request.headers.get("user-agent");
      const headers = ctx.request.headers.toJSON();
      const ipAddress = ctx.request.headers.get("x-real-ip");

      // create new access token
      const newSession = await prisma.session.create({
        data: {
          accessToken: newToken,
          userAgent: userAgent!,
          userId: dbEmailAuth.User.id,
          headers: headers,
          ipAddress: ipAddress!,
        },
      });

      ctx.cookie.session.set({
        value: newToken,
        secure: true,
        httpOnly: true,
      });

      return {
        message: "Successfully signed in",
      };
    },
    {
      body: t.Object({
        emailAddress: t.String({ format: "email" }),
        password: t.String(),
      }),
      response: t.Object({
        message: t.String(),
      }),
    }
  )
  .post("/sign-out", async (ctx) => {
    ctx.cookie.session.set({
      value: "",
      secure: true,
    });

    return {
      message: "Successfully signed out",
    };
  })
  .post(
    "/create-with-passkey-options",
    async (ctx) => {
      const options: PublicKeyCredentialCreationOptionsJSON =
        await generateRegistrationOptions({
          rpName: rpName,
          rpID: rpID,
          userName: ctx.body.name,
          userDisplayName: ctx.body.displayName,
          // Don't prompt users for additional information about the authenticator
          // (Recommended for smoother UX)
          attestationType: "none",
          // Prevent users from re-registering existing authenticators
          excludeCredentials: [],
          // See "Guiding use of authenticators via authenticatorSelection" below
          authenticatorSelection: {
            // Defaults
            residentKey: "preferred",
            userVerification: "preferred",
            // Optional
            authenticatorAttachment: "cross-platform",
          },
        });

      const newUserSessionId = crypto.randomUUID();

      // create a token
      const token = await ctx.jwt.sign({ sub: newUserSessionId });

      ctx.cookie["passkey-user-id"].set({
        value: token,
        secure: true,
      });

      // save session and options
      // ctx.store["store"][newUserSessionId] = options;
      await tempSaveUserSessionAndOptions({
        userSessionId: newUserSessionId,
        passkeyOption: options,
      });

      return options;
    },
    {
      body: t.Object({
        name: t.String(),
        displayName: t.String(),
      }),
      response: t.Object({
        attestation: t.Optional(t.Any()),
        attestationFormats: t.Optional(t.Any()),
        authenticatorSelection: t.Optional(t.Any()),
        challenge: t.Optional(t.Any()),
        excludeCredentials: t.Optional(t.Any()),
        extensions: t.Optional(t.Any()),
        hints: t.Optional(t.Any()),
        pubKeyCredParams: t.Any(),
        rp: t.Any(),
        timeout: t.Optional(t.Any()),
        user: t.Any(),
      }),
    }
  )
  .post(
    "/create-with-passkey",
    async (ctx) => {
      const token = ctx.cookie["passkey-user-id"].value;

      const decodedToken = await ctx.jwt.verify(token as string);

      if (!decodedToken) {
        throw HttpError.BadRequest("Invalid token");
      }

      const tempSessionId = decodedToken.sub;

      if (!tempSessionId) {
        throw HttpError.Unauthorized("Missing session");
      }

      // (Pseudocode) Get `options.challenge` that was saved above
      const currentOptions: PublicKeyCredentialCreationOptionsJSON | null =
        await getTempSessionOptions({ userSessionId: tempSessionId });

      // const currentOptions = ctx.store["store"][
      //   tempSessionId
      // ] as PublicKeyCredentialCreationOptionsJSON;

      if (!currentOptions) {
        throw HttpError.Unauthorized("No temp session option found");
      }

      // The body is already parsed by Elysia as a JavaScript object
      const response = ctx.body as RegistrationResponseJSON;
      let verification;
      try {
        verification = await verifyRegistrationResponse({
          response: response,
          expectedChallenge: currentOptions.challenge,
          expectedOrigin: [origin],
          expectedRPID: [rpID],
        });
      } catch (error) {
        console.error("Verification failed", error);
        throw HttpError.Unauthorized("Verification failed");
      }

      if (!verification.registrationInfo) {
        throw HttpError.Unauthorized("No registration info found");
      }

      const { credential, credentialDeviceType, credentialBackedUp } =
        verification.registrationInfo;

      // create user and passkey
      const user = await prisma.user.create({
        data: {
          firstName: currentOptions.user.name,
          lastName: currentOptions.user.name,
          role: UserRole.USER,
          PasskeyAuths: {
            create: {
              counter: credential.counter,
              deviceType: credentialDeviceType,
              publicKey: credential.publicKey,
              webAuthnUserId: currentOptions.user.id,
              backedUpAt: credentialBackedUp ? new Date() : undefined,
              transports: JSON.stringify(credential.transports),
              isBackupEligible: credentialBackedUp,
            },
          },
        },
      });

      const newToken = await ctx.jwt.sign({ sub: JSON.stringify(user) });

      ctx.cookie.session.set({
        value: newToken,
        secure: true,
      });

      return {
        isVerified: true,
      };
    },
    {
      body: t.Object({
        id: t.String(),
        rawId: t.String(),
        response: t.Object({
          clientDataJSON: t.String(),
          attestationObject: t.String(),
          // Optional fields
          transports: t.Optional(t.Array(t.String())),
          authenticatorData: t.Optional(t.String()),
          publicKey: t.Optional(t.String()),
          publicKeyAlgorithm: t.Optional(t.Number()),
        }),
        type: t.String(),
        clientExtensionResults: t.Optional(t.Record(t.String(), t.Any())),
      }),
      response: t.Object({
        isVerified: t.Boolean(),
      }),
    }
  )
  .guard((app) =>
    app
      .use(authenticateUser)
      .post(
        "/sign-out",
        async (ctx) => {
          if (!ctx.user) {
            throw HttpError.Unauthorized(
              "User not authenticated, already signed out"
            );
          }

          // invalidate session
          const session = await prisma.session.update({
            where: {
              id: ctx.user.id,
            },
            data: {
              invalidatedAt: new Date(),
            },
          });

          return {
            success: true,
            expiredSession: session,
          };
        },
        {
          response: t.Object({
            success: t.Boolean(),
            expiredSession: t.Any(),
          }),
        }
      )
      .get(
        "/who-am-i",
        async (ctx) => {
          if (!ctx.user) {
            return null;
          }

          // Transform ctx.user to match the expected response schema
          return {
            id: ctx.user.id,
            createdAt: ctx.user.createdAt,
            updatedAt: ctx.user.updatedAt,
            firstName: ctx.user.firstName,
            lastName: ctx.user.lastName,
            profilePicture: ctx.user.profilePicture,
          };
        },
        {
          response: t.Nullable(
            t.Object({
              id: t.String(),
              createdAt: t.Date(),
              updatedAt: t.Date(),
              firstName: t.String(),
              lastName: t.String(),
              profilePicture: t.Nullable(t.String()),
            })
          ),
        }
      )
  );
