import { Models } from "node-appwrite";
import Thumbnail from "@/app/_components/Thumbnail";
import FormattedDateTime from "@/app/_components/FormattedDateTime";
import { convertFileSize, formatDateTime } from "@/lib/utils";
import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";

// Component to render an image thumbnail with file details
const ImageThumbnail = ({ file }) => (
  <div className="file-details-thumbnail">
    {/* Thumbnail component for rendering the file's thumbnail */}
    <Thumbnail type={file.type} extension={file.extension} url={file.url} />
    <div className="flex flex-col">
      {/* File name */}
      <p className="subtitle-2 mb-1">{file.name}</p>
      {/* Date created, formatted using the FormattedDateTime component */}
      <FormattedDateTime date={file.$createdAt} className="caption" />
    </div>
  </div>
);

// Component to render a row of details with a label and value
const DetailRow = ({ label, value }) => (
  <div className="flex">
    <p className="file-details-label text-left">{label}</p>
    <p className="file-details-value text-left">{value}</p>
  </div>
);

// Component to display file details, including format, size, owner, and last edit
export const FileDetails = ({ file }) => {
  return (
    <>
      {/* Render file thumbnail */}
      <ImageThumbnail file={file} />
      {/* Render file details */}
      <div className="space-y-4 px-2 pt-2">
        <DetailRow label="Format:" value={file.extension} />
        <DetailRow label="Size:" value={convertFileSize(file.size)} />
        <DetailRow label="Owner:" value={file.owner.fullName} />
        <DetailRow label="Last edit:" value={formatDateTime(file.$updatedAt)} />
      </div>
    </>
  );
};

// Component for sharing the file with other users
export const ShareInput = ({ file, onInputChange, onRemove }) => {
  return (
    <>
      {/* Render file thumbnail */}
      <ImageThumbnail file={file} />

      <div className="share-wrapper">
        <p className="subtitle-2 pl-1 text-light-100">
          Share file with other users
        </p>
        {/* Input field to enter email addresses */}
        <Input
          type="email"
          placeholder="Enter email address"
          onChange={(e) => onInputChange(e.target.value.trim().split(","))}
          className="share-input-field"
        />
        <div className="pt-4">
          <div className="flex justify-between">
            {/* Display the number of users the file is shared with */}
            <p className="subtitle-2 text-light-100">Shared with</p>
            <p className="subtitle-2 text-light-200">
              {file.users.length} users
            </p>
          </div>

          {/* List of users the file is shared with */}
          <ul className="pt-2">
            {file.users.map((email) => (
              <li
                key={email}
                className="flex items-center justify-between gap-2"
              >
                {/* Display user email */}
                <p className="subtitle-2">{email}</p>
                {/* Button to remove the user from the shared list */}
                <Button
                  onClick={() => onRemove(email)}
                  className="share-remove-user"
                >
                  <Image
                    src="/assets/icons/remove.svg"
                    alt="Remove"
                    width={24}
                    height={24}
                    className="remove-icon"
                  />
                </Button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};
