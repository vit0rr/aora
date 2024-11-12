import { Env } from "@/types";
import {
  Account,
  Avatars,
  Client,
  Databases,
  ID,
  Query,
} from "react-native-appwrite";

type CreateUser = {
  email: string;
  password: string;
  username: string;
};

type SignIn = {
  email: string;
  password: string;
};

const ENDPOINT = process.env.ENDPOINT as string;
const PLATFORM = process.env.PLATFORM as string;
const PROJECT_ID = process.env.PROJECT_ID as string;
const DATABASE_ID = process.env.DATABASE_ID as string;
const USER_COLLECTION_ID = process.env.USER_COLLECTION_ID as string;
const VIDEO_COLLECTION_ID = process.env.VIDEO_COLLECTION_ID as string;
const STORAGE_ID = process.env.STORAGE_ID as string;

export const config = {
  endpoint: ENDPOINT,
  platform: PLATFORM,
  projectId: PROJECT_ID,
  databaseId: DATABASE_ID,
  userCollectionId: USER_COLLECTION_ID,
  videoCollectionId: VIDEO_COLLECTION_ID,
  storageId: STORAGE_ID,
};

const client = new Client();
client
  .setEndpoint(config.endpoint)
  .setProject(config.projectId)
  .setPlatform(config.platform);

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);

export const signIn = async ({ email, password }: SignIn) => {
  try {
    return account.createEmailPasswordSession(email, password);
  } catch (error) {
    throw new Error(JSON.stringify(error));
  }
};

export const createUser = async ({ email, password, username }: CreateUser) => {
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    );

    if (!newAccount) throw Error;

    const avatarUrl = avatars.getInitials(username);

    await signIn({ email, password });

    const newUser = await databases.createDocument(
      config.databaseId,
      config.userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email,
        username,
        avatar: avatarUrl,
      }
    );

    return newUser;
  } catch (error) {
    throw new Error(JSON.stringify(error));
  }
};

export const getCurrentUser = async () => {
  try {
    const currentAccount = await account.get();

    if (!currentAccount) throw Error;

    const currentUser = await databases.listDocuments(
      config.databaseId,
      config.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUser) throw Error;

    return currentUser.documents[0];
  } catch (error) {
    throw new Error(JSON.stringify(error));
  }
};
