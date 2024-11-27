import React from "react";
import Sort from "@/app/_components/Sort"; // Importing the Sort component
import { getFiles } from "@/app/_lib/actions/fileActions";
import Card from "@/app/_components/Card"; // Component for rendering individual file cards
import { convertFileSize, getFileTypesParams } from "@/lib/utils"; // Utility function for processing file type parameters

const Page = async ({ searchParams, params }) => {
  // Fetching type from the URL params; default is an empty string if undefined
  const type = (await params)?.type || "";

  // Fetching the search query text from the search parameters; default is an empty string if undefined
  const searchText = (await searchParams)?.query || "";

  // Fetching the sorting criteria from the search parameters; default is an empty string if undefined
  const sort = (await searchParams)?.sort || "";

  // Processing the type into an array of file types using a utility function
  const types = getFileTypesParams(type);

  // Fetching the files using the getFiles function with filters for type, search text, and sorting criteria
  const files = await getFiles({ types, searchText, sort });

  const totalSize = files.documents.reduce(
    (total, file) => total + file.size,
    0
  );

  const totalSpace = convertFileSize(totalSize, 2);

  // The component's rendered JSX
  return (
    <div className="page-container">
      {/* Section containing the title and sorting options */}
      <section className="w-full">
        {/* Page title, dynamically capitalized based on type */}
        <h1 className="h1 capitalize">{type}</h1>

        <div className="total-size-section">
          {/* Placeholder for displaying the total size of the files */}
          <p className="body-1">
            Total: <span className="h5">{totalSpace}</span>
          </p>

          {/* Container for sorting options */}
          <div className="sort-container">
            <p className="body-1 hidden text-light-200 sm:block">Sort by:</p>

            {/* Sort component for rendering sort-related UI */}
            <Sort />
          </div>
        </div>
      </section>

      {/* Section to render files or a message if no files are uploaded */}
      {files.total > 0 ? (
        <section className="file-list">
          {/* Iterating over the fetched files and rendering a Card component for each */}
          {files.documents.map((file) => (
            <Card key={file.$id} file={file} />
          ))}
        </section>
      ) : (
        // Message to display if no files are available
        <p className="empty-list">No files uploaded</p>
      )}
    </div>
  );
};

export default Page;
