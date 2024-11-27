import Link from "next/link"; // Importing the Link component for navigation
import Thumbnail from "./Thumbnail"; // Component to display a thumbnail for the file
import { convertFileSize } from "@/lib/utils"; // Utility function to convert file size into a human-readable format
import FormattedDateTime from "@/app/_components/FormattedDateTime"; // Component to format and display the creation date
import ActionDropdown from "@/app/_components/ActionDropdown"; // Component to display a dropdown menu with file actions

const Card = ({ file }) => {
  return (
    // A clickable card linking to the file's URL in a new tab
    <Link href={file.url} target="_blank" className="file-card">
      {/* Top section containing the thumbnail and actions */}
      <div className="flex justify-between">
        {/* Thumbnail for file preview based on file type and extension */}
        <Thumbnail
          type={file.type} // File type (e.g., image, document, video)
          extension={file.extension} // File extension (e.g., .jpg, .pdf)
          url={file.url} // File URL for the thumbnail
          className="!size-20" // Custom size for the thumbnail container
          imageClassName="!size-11" // Custom size for the thumbnail image
        />

        {/* Actions and file size section */}
        <div className="flex flex-col items-end justify-between">
          {/* Dropdown for file actions (e.g., delete, rename) */}
          <ActionDropdown file={file} />
          {/* File size displayed in a human-readable format */}
          <p className="body-1">{convertFileSize(file.size)}</p>
        </div>
      </div>

      {/* File details section */}
      <div className="file-card-details">
        {/* File name with truncation for overflow */}
        <p className="subtitle-2 line-clamp-1">{file.name}</p>
        {/* Creation date formatted as a readable string */}
        <FormattedDateTime
          date={file.$createdAt} // File's creation timestamp
          className="body-2 text-light-100"
        />
        {/* File owner details with truncation */}
        <p className="caption line-clamp-1 text-light-200">
          By: {file.owner.fullName}
        </p>
      </div>
    </Link>
  );
};

export default Card;
