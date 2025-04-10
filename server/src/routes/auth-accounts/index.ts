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
import jwt from "@elysiajs/jwt";
import { OrganizationMemberRole, UserRole } from "@prisma/client";

export const authAccountRouter = new Elysia({
  prefix: "/auth-accounts",
  tags: ["auth-accounts"],
})
  .use(
    jwt({
      name: "jwt",
      secret: process.env.JWT_SECRET!,
    })
  )
  .post(
    "/create-with-email",
    async (ctx) => {
      // confirm password
      const isMatchingPassword = ctx.body.password === ctx.body.confirmPassword;

      if (!isMatchingPassword) {
        throw HttpError.BadRequest("Passwords do not match");
      }

      const hashedPassword = await Bun.password.hash(ctx.body.password);

      // create new user
      await prisma.user.create({
        data: {
          firstName: ctx.body.firstName,
          lastName: ctx.body.lastName,
          role: UserRole.USER,
          EmailAuths: {
            create: {
              emailAddress: ctx.body.emailAddress,
              password: hashedPassword,
            },
          },
          OrganizationMembers: {
            create: {
              role: OrganizationMemberRole.OWNER,
              Organization: {
                create: {
                  name: "Default Organization",
                  description: "Default Organization",
                  Projects: {
                    create: {
                      name: "Default Project",
                      description: "Default Project",
                    },
                  },
                },
              },
            },
          },
        },
      });

      return {
        message: "User created successfully",
        userEmail: ctx.body.emailAddress,
      };
    },
    {
      body: t.Object({
        firstName: t.String({ maxLength: 250, minLength: 1 }),
        lastName: t.String({ maxLength: 250, minLength: 1 }),
        emailAddress: t.String({ format: "email" }),
        password: t.String({ maxLength: 250, minLength: 8 }),
        confirmPassword: t.String({ maxLength: 250, minLength: 8 }),
      }),
      response: t.Object({
        message: t.String(),
        userEmail: t.String(),
      }),
      detail: "Create a new user, organizaton, and project",
    }
  );
// .post(
//   "/create-passkey-options",
//   async (ctx) => {
//     const options: PublicKeyCredentialCreationOptionsJSON =
//       await generateRegistrationOptions({
//         rpName: rpName,
//         rpID: rpID,
//         userName: ctx.body.name,
//         userDisplayName: ctx.body.displayName,
//         // Don't prompt users for additional information about the authenticator
//         // (Recommended for smoother UX)
//         attestationType: "none",
//         // Prevent users from re-registering existing authenticators
//         excludeCredentials: [],
//         // See "Guiding use of authenticators via authenticatorSelection" below
//         authenticatorSelection: {
//           // Defaults
//           residentKey: "preferred",
//           userVerification: "preferred",
//           // Optional
//           authenticatorAttachment: "cross-platform",
//         },
//       });

//     const newUserSessionId = crypto.randomUUID();

//     // create a token
//     const token = await ctx.jwt.sign({ sub: newUserSessionId });

//     ctx.cookie["passkey-user-id"].set({
//       value: token,
//       secure: true,
//     });

//     // save session and options
//     // ctx.store["store"][newUserSessionId] = options;
//     await tempSaveUserSessionAndOptions({
//       userSessionId: newUserSessionId,
//       passkeyOption: options,
//     });

//     return options;
//   },
//   {
//     body: t.Object({
//       name: t.String(),
//       displayName: t.String(),
//     }),
//     response: t.Object({
//       attestation: t.Optional(t.Any()),
//       attestationFormats: t.Optional(t.Any()),
//       authenticatorSelection: t.Optional(t.Any()),
//       challenge: t.Optional(t.Any()),
//       excludeCredentials: t.Optional(t.Any()),
//       extensions: t.Optional(t.Any()),
//       hints: t.Optional(t.Any()),
//       pubKeyCredParams: t.Any(),
//       rp: t.Any(),
//       timeout: t.Optional(t.Any()),
//       user: t.Any(),
//     }),
//   }
// )
// .post(
//   "/create-with-passkey",
//   async (ctx) => {
//     const token = ctx.cookie["passkey-user-id"].value;

//     const decodedToken = await ctx.jwt.verify(token as string);

//     if (!decodedToken) {
//       throw HttpError.BadRequest("Invalid token");
//     }

//     const tempSessionId = decodedToken.sub;

//     if (!tempSessionId) {
//       throw HttpError.Unauthorized("Missing session");
//     }

//     // (Pseudocode) Get `options.challenge` that was saved above
//     const currentOptions: PublicKeyCredentialCreationOptionsJSON | null =
//       await getTempSessionOptions({ userSessionId: tempSessionId });

//     // const currentOptions = ctx.store["store"][
//     //   tempSessionId
//     // ] as PublicKeyCredentialCreationOptionsJSON;

//     if (!currentOptions) {
//       throw HttpError.Unauthorized("No temp session option found");
//     }

//     // The body is already parsed by Elysia as a JavaScript object
//     const response = ctx.body as RegistrationResponseJSON;
//     let verification;
//     try {
//       verification = await verifyRegistrationResponse({
//         response: response,
//         expectedChallenge: currentOptions.challenge,
//         expectedOrigin: [origin],
//         expectedRPID: [rpID],
//       });
//     } catch (error) {
//       console.error("Verification failed", error);
//       throw HttpError.Unauthorized("Verification failed");
//     }

//     if (!verification.registrationInfo) {
//       throw HttpError.Unauthorized("No registration info found");
//     }

//     const { credential, credentialDeviceType, credentialBackedUp } =
//       verification.registrationInfo;

//     // create user and passkey
//     await prisma.user.create({
//       data: {
//         firstName: currentOptions.user.name,
//         lastName: currentOptions.user.name,
//         role: UserRole.USER,
//         PasskeyAuths: {
//           create: {
//             counter: credential.counter,
//             deviceType: credentialDeviceType,
//             publicKey: credential.publicKey,
//             webAuthnUserId: currentOptions.user.id,
//             backedUpAt: credentialBackedUp ? new Date() : undefined,
//             transports: JSON.stringify(credential.transports),
//             isBackupEligible: credentialBackedUp,
//           },
//         },
//       },
//     });

//     return {
//       isVerified: true,
//     };
//   },
//   {
//     body: t.Object({
//       id: t.String(),
//       rawId: t.String(),
//       response: t.Object({
//         clientDataJSON: t.String(),
//         attestationObject: t.String(),
//         // Optional fields
//         transports: t.Optional(t.Array(t.String())),
//         authenticatorData: t.Optional(t.String()),
//         publicKey: t.Optional(t.String()),
//         publicKeyAlgorithm: t.Optional(t.Number()),
//       }),
//       type: t.String(),
//       clientExtensionResults: t.Optional(t.Record(t.String(), t.Any())),
//     }),
//     response: t.Object({
//       isVerified: t.Boolean(),
//     }),
//   }
// );
