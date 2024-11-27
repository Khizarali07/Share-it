"use server";

// Import required Appwrite SDK modules
import { Account, Avatars, Client, Databases, Storage } from "node-appwrite";
import { appwriteConfig } from "./config"; // Import configuration (endpoint URL, project ID, etc.)
import { cookies } from "next/headers"; // Import Next.js cookies utility

/**
 * Creates a session-based Appwrite client for authenticated users.
 * This function configures the Appwrite client with session details from cookies.
 */
export const createSessionClient = async () => {
  // Initialize an Appwrite Client
  const client = new Client()
    .setEndpoint(appwriteConfig.endpointUrl) // Set Appwrite API endpoint
    .setProject(appwriteConfig.projectId); // Set the Appwrite project ID

  // Retrieve the session cookie
  const session = (await cookies()).get("appwrite-session");

  // Check if the session exists; throw an error if not found
  if (!session || !session.value) throw new Error("No session");

  // Set the session token in the Appwrite client
  client.setSession(session.value);

  // Return an object with access to specific Appwrite services
  return {
    // Access the Account service for user account operations
    get account() {
      return new Account(client);
    },
    // Access the Databases service for database operations
    get databases() {
      return new Databases(client);
    },
  };
};

/**
 * Creates an admin Appwrite client using a secret API key.
 * This function is for server-side operations requiring admin privileges.
 */
export const createAdminClient = async () => {
  // Initialize an Appwrite Client
  const client = new Client()
    .setEndpoint(appwriteConfig.endpointUrl) // Set Appwrite API endpoint
    .setProject(appwriteConfig.projectId) // Set the Appwrite project ID
    .setKey(appwriteConfig.secretKey); // Set the Appwrite admin API key

  // Return an object with access to various Appwrite services
  return {
    // Access the Account service for user account operations
    get account() {
      return new Account(client);
    },
    // Access the Databases service for database operations
    get databases() {
      return new Databases(client);
    },
    // Access the Storage service for file management
    get storage() {
      return new Storage(client);
    },
    // Access the Avatars service for generating avatars
    get avatars() {
      return new Avatars(client);
    },
  };
};
