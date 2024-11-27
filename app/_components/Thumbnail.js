import React from "react";
import Image from "next/image";
import { cn, getFileIcon } from "@/lib/utils"; // Utility functions: `cn` for conditional classNames, `getFileIcon` for getting icons for file types

/**
 * Thumbnail Component
 * Displays a thumbnail for a file, which can either be an image or an icon depending on the file type.
 *
 * @param {Object} props - The component props
 * @param {string} props.type - The type of the file (e.g., "image", "video", "document")
 * @param {string} props.extension - The file extension (e.g., "jpg", "pdf")
 * @param {string} [props.url=""] - Optional URL for the file (used for images)
 * @param {string} [props.imageClassName] - Optional className for styling the image
 * @param {string} [props.className] - Optional className for styling the container
 * @returns JSX.Element
 */
const Thumbnail = ({
  type,
  extension,
  url = "", // Default to an empty string if no URL is provided
  imageClassName,
  className,
}) => {
  // Determine if the file is an image (excluding SVGs)
  const isImage = type === "image" && extension !== "svg";

  return (
    // Container figure element with dynamic classNames
    <figure className={cn("thumbnail", className)}>
      {/* Display the image if the file is an image, otherwise display an icon */}
      <Image
        src={isImage ? url : getFileIcon(extension, type)} // Image URL if it's an image; otherwise, get the icon
        alt="thumbnail" // Accessibility: Alt text for the image
        width={100}
        height={100}
        className={cn(
          "size-8 object-contain", // Base styles for the image
          imageClassName, // Additional image-specific styles
          isImage && "thumbnail-image" // Add this class only if it's an image
        )}
      />
    </figure>
  );
};

export default Thumbnail; // Export the component for reuse
