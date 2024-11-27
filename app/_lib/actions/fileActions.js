"use server";

const { createAdminClient, createSessionClient } = require("../appwrite/index");
const { InputFile } = require("node-appwrite/file");
const { appwriteConfig } = require("../appwrite/config");
const { ID, Models, Query } = require("node-appwrite");
const {
  constructFileUrl,
  getFileType,
  parseStringify,
} = require("@/lib/utils");
const { revalidatePath } = require("next/cache");
const { getCurrentUser } = require("@/app/_lib/actions/userActions");

/**
 * Handles errors by logging and throwing the error.
 *
 * @param {unknown} error - The caught error.
 * @param {string} message - Custom error message.
 */
const handleError = (error, message) => {
  console.log(error, message);
  throw error;
};

/**
 * Uploads a file to the Appwrite storage and creates a document in the database.
 *
 * @param {Object} params - Function parameters.
 * @param {File} params.file - File object to upload.
 * @param {string} params.ownerId - Owner ID of the file.
 * @param {string} params.accountId - Account ID associated with the file.
 * @param {string} params.path - Path to revalidate after upload.
 * @returns {Object} - Newly created file document.
 */
export const uploadFile = async ({ file, ownerId, accountId, path }) => {
  const { storage, databases } = await createAdminClient();

  try {
    // Create an InputFile object from the uploaded file buffer
    const inputFile = InputFile.fromBuffer(file, file.name);

    // Upload the file to Appwrite storage
    const bucketFile = await storage.createFile(
      appwriteConfig.bucketId,
      ID.unique(),
      inputFile
    );

    // Construct the file document to save in the database
    const fileDocument = {
      type: getFileType(bucketFile.name).type, // File type
      name: bucketFile.name, // Original file name
      url: constructFileUrl(bucketFile.$id), // URL for accessing the file
      extension: getFileType(bucketFile.name).extension, // File extension
      size: bucketFile.sizeOriginal, // File size
      owner: ownerId, // Owner ID
      accountId, // Account ID
      users: [], // Empty array for users
      bucketFileId: bucketFile.$id, // File ID in the bucket
    };

    // Create a document in the database for the uploaded file
    const newFile = await databases
      .createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.filesCollectionId,
        ID.unique(),
        fileDocument
      )
      .catch(async (error) => {
        // Roll back by deleting the file if document creation fails
        await storage.deleteFile(appwriteConfig.bucketId, bucketFile.$id);
        handleError(error, "Failed to create file document");
      });

    // Revalidate the path for caching purposes
    revalidatePath(path);

    // Return the newly created file document
    return parseStringify(newFile);
  } catch (error) {
    // Handle any errors during the process
    handleError(error, "Failed to upload file");
  }
};

const createQueries = (currentUser, types, searchText, sort, limit) => {
  // Initialize the queries array with a query to filter files
  // where the current user is either the owner or included in the `users` field.
  const queries = [
    Query.or([
      Query.equal("owner", [currentUser.$id]),
      Query.contains("users", [currentUser.email]),
    ]),
  ];

  // Add a query to filter by file types if types are provided.
  if (types.length > 0) queries.push(Query.equal("type", types));

  // Add a query to search for files by name if a searchText is provided.
  if (searchText) queries.push(Query.contains("name", searchText));

  // Add a query to limit the number of results if a limit is specified.
  if (limit) queries.push(Query.limit(limit));

  // If sort is provided, split it into the field to sort by and the order (asc/desc).
  if (sort) {
    const [sortBy, orderBy] = sort.split("-");

    // Add a query to sort in ascending or descending order.
    queries.push(
      orderBy === "asc" ? Query.orderAsc(sortBy) : Query.orderDesc(sortBy)
    );
  }

  // Return the constructed queries array.
  return queries;
};

export const getFiles = async ({
  types = [],
  searchText = "",
  sort = "$createdAt-desc", // Default sort is by creation date, descending.
  limit,
}) => {
  // Create an Appwrite admin client to interact with the database.
  const { databases } = await createAdminClient();

  try {
    // Fetch the current user from the application context.
    const currentUser = await getCurrentUser();

    // If the current user is not found, throw an error.
    if (!currentUser) throw new Error("User not found");

    // Create queries for fetching files based on user input.
    const queries = createQueries(currentUser, types, searchText, sort, limit);

    // Fetch the list of files from the database using the generated queries.
    const files = await databases.listDocuments(
      appwriteConfig.databaseId, // The database ID in Appwrite.
      appwriteConfig.filesCollectionId, // The collection ID for files.
      queries // The queries array.
    );

    console.log({ files }); // Log the fetched files for debugging.

    // Parse the files object into a JSON-safe format and return it.
    return parseStringify(files);
  } catch (error) {
    // Handle any errors that occur during the file fetch process.
    handleError(error, "Failed to get files");
  }
};

export const renameFile = async ({ fileId, name, extension, path }) => {
  // Create an Appwrite admin client to interact with the database.
  const { databases } = await createAdminClient();

  try {
    // Construct the new name for the file by appending the extension.
    const newName = `${name}.${extension}`;

    // Update the file document in the database with the new name.
    const updatedFile = await databases.updateDocument(
      appwriteConfig.databaseId, // The database ID in Appwrite.
      appwriteConfig.filesCollectionId, // The collection ID for files.
      fileId, // The ID of the file to update.
      {
        name: newName, // The new name for the file.
      }
    );

    // Revalidate the cache for the specified path after the update.
    revalidatePath(path);

    // Parse the updated file object into a JSON-safe format and return it.
    return parseStringify(updatedFile);
  } catch (error) {
    // Handle any errors that occur during the file rename process.
    handleError(error, "Failed to rename file");
  }
};

export const updateFileUsers = async ({ fileId, emails, path }) => {
  // Create an admin client for accessing Appwrite services
  const { databases } = await createAdminClient();

  try {
    // Update the document in the database with the new list of users (emails)
    const updatedFile = await databases.updateDocument(
      appwriteConfig.databaseId, // ID of the database containing the file
      appwriteConfig.filesCollectionId, // ID of the collection where the file document is stored
      fileId, // ID of the document to be updated
      {
        users: emails, // Update the "users" field with the provided email array
      }
    );

    // Revalidate the specific path to ensure that the frontend gets the updated data
    revalidatePath(path);

    // Return the updated file data after parsing and stringifying it
    return parseStringify(updatedFile);
  } catch (error) {
    // Handle any errors that occur during the process
    handleError(error, "Failed to rename file");
  }
};

export const deleteFile = async ({ fileId, bucketFileId, path }) => {
  // Create an admin client for accessing Appwrite services
  const { databases, storage } = await createAdminClient();

  try {
    // Delete the document representing the file from the database
    const deletedFile = await databases.deleteDocument(
      appwriteConfig.databaseId, // ID of the database
      appwriteConfig.filesCollectionId, // ID of the collection where the document is stored
      fileId // ID of the document to delete
    );

    if (deletedFile) {
      // If the document deletion was successful, delete the actual file from storage
      await storage.deleteFile(appwriteConfig.bucketId, bucketFileId);
    }

    // Revalidate the specific path to ensure the frontend reflects the deletion
    revalidatePath(path);

    // Return a success message after parsing and stringifying
    return parseStringify({ status: "success" });
  } catch (error) {
    // Handle any errors that occur during the process
    handleError(error, "Failed to rename file");
  }
};

export async function getTotalSpaceUsed() {
  try {
    const { databases } = await createSessionClient();
    const currentUser = await getCurrentUser();
    if (!currentUser) throw new Error("User is not authenticated.");

    const files = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.filesCollectionId,
      [Query.equal("owner", [currentUser.$id])]
    );

    const totalSpace = {
      image: { size: 0, latestDate: "" },
      document: { size: 0, latestDate: "" },
      video: { size: 0, latestDate: "" },
      audio: { size: 0, latestDate: "" },
      other: { size: 0, latestDate: "" },
      used: 0,
      all: 2 * 1024 * 1024 * 1024, // 2GB available bucket storage
    };

    files.documents.forEach((file) => {
      const fileType = file.type; // Removed TypeScript type annotation
      totalSpace[fileType].size += file.size;
      totalSpace.used += file.size;

      if (
        !totalSpace[fileType].latestDate ||
        new Date(file.$updatedAt) > new Date(totalSpace[fileType].latestDate)
      ) {
        totalSpace[fileType].latestDate = file.$updatedAt;
      }
    });

    return parseStringify(totalSpace);
  } catch (error) {
    handleError(error, "Error calculating total space used:");
  }
}
