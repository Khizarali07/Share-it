import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const parseStringify = (value) => JSON.parse(JSON.stringify(value));

export const convertFileToUrl = (file) => URL.createObjectURL(file);

// Determines the file type (document, image, video, audio, or other) based on the file's extension
export const getFileType = (fileName) => {
  // Extracts the file extension from the file name and converts it to lowercase
  const extension = fileName.split(".").pop()?.toLowerCase();

  // If the extension is not found, return a default type of "other"
  if (!extension) return { type: "other", extension: "" };

  // Arrays of extensions categorized by file types
  const documentExtensions = [
    "pdf",
    "doc",
    "docx",
    "txt",
    "xls",
    "xlsx",
    "csv",
    "rtf",
    "ods",
    "ppt",
    "odp",
    "md",
    "html",
    "htm",
    "epub",
    "pages",
    "fig",
    "psd",
    "ai",
    "indd",
    "xd",
    "sketch",
    "afdesign",
    "afphoto",
  ];
  const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "svg", "webp"];
  const videoExtensions = ["mp4", "avi", "mov", "mkv", "webm"];
  const audioExtensions = ["mp3", "wav", "ogg", "flac"];

  // Determines the type based on the file extension
  if (documentExtensions.includes(extension))
    return { type: "document", extension }; // File is a document
  if (imageExtensions.includes(extension)) return { type: "image", extension }; // File is an image
  if (videoExtensions.includes(extension)) return { type: "video", extension }; // File is a video
  if (audioExtensions.includes(extension)) return { type: "audio", extension }; // File is an audio file

  // If no match is found, return type "other"
  return { type: "other", extension };
};

// Returns the appropriate icon URL for the file based on its extension or type
export const getFileIcon = (extension, type) => {
  switch (extension) {
    // Document extensions and their corresponding icons
    case "pdf":
      return "/assets/icons/file-pdf.svg";
    case "doc":
      return "/assets/icons/file-doc.svg";
    case "docx":
      return "/assets/icons/file-docx.svg";
    case "csv":
      return "/assets/icons/file-csv.svg";
    case "txt":
      return "/assets/icons/file-txt.svg";
    case "xls":
    case "xlsx":
      return "/assets/icons/file-document.svg";

    // Image-specific extension
    case "svg":
      return "/assets/icons/file-image.svg";

    // Video extensions and their corresponding icons
    case "mkv":
    case "mov":
    case "avi":
    case "wmv":
    case "mp4":
    case "flv":
    case "webm":
    case "m4v":
    case "3gp":
      return "/assets/icons/file-video.svg";

    // Audio extensions and their corresponding icons
    case "mp3":
    case "mpeg":
    case "wav":
    case "aac":
    case "flac":
    case "ogg":
    case "wma":
    case "m4a":
    case "aiff":
    case "alac":
      return "/assets/icons/file-audio.svg";

    // Default case when the file extension doesn't match specific cases
    default:
      // Further determine the icon based on the general file type
      switch (type) {
        case "image":
          return "/assets/icons/file-image.svg";
        case "document":
          return "/assets/icons/file-document.svg";
        case "video":
          return "/assets/icons/file-video.svg";
        case "audio":
          return "/assets/icons/file-audio.svg";
        default:
          return "/assets/icons/file-other.svg"; // Default for unrecognized types
      }
  }
};

// Constructs the URL for accessing a file stored in Appwrite's storage
export const constructFileUrl = (bucketFileId) => {
  // Uses environment variables to dynamically construct the file access URL
  return `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${process.env.NEXT_PUBLIC_APPWRITE_BUCKET}/files/${bucketFileId}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT}`;
};

export const constructDownloadUrl = (bucketFileId) => {
  // Constructs a download URL for a specific file stored in Appwrite's storage service.
  return `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${process.env.NEXT_PUBLIC_APPWRITE_BUCKET}/files/${bucketFileId}/download?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT}`;
};

export const getFileTypesParams = (type) => {
  // Maps the provided file type string to an array of specific file types.
  switch (type) {
    case "documents":
      return ["document"]; // Maps "documents" to the single file type "document"
    case "images":
      return ["image"]; // Maps "images" to the single file type "image"
    case "media":
      return ["video", "audio"]; // Maps "media" to both "video" and "audio"
    case "others":
      return ["other"]; // Maps "others" to the single file type "other"
    default:
      return ["document"]; // Default to "document" if no valid type is provided
  }
};

export const convertFileSize = (sizeInBytes, digits) => {
  if (sizeInBytes < 1024) {
    return sizeInBytes + " Bytes"; // Less than 1 KB, show in Bytes
  } else if (sizeInBytes < 1024 * 1024) {
    const sizeInKB = sizeInBytes / 1024;
    return sizeInKB.toFixed(digits || 1) + " KB"; // Less than 1 MB, show in KB
  } else if (sizeInBytes < 1024 * 1024 * 1024) {
    const sizeInMB = sizeInBytes / (1024 * 1024);
    return sizeInMB.toFixed(digits || 1) + " MB"; // Less than 1 GB, show in MB
  } else {
    const sizeInGB = sizeInBytes / (1024 * 1024 * 1024);
    return sizeInGB.toFixed(digits || 1) + " GB"; // 1 GB or more, show in GB
  }
};

export const formatDateTime = (isoString) => {
  if (!isoString) return "—"; // Return a placeholder if the input is null or undefined.

  const date = new Date(isoString); // Convert the ISO string to a JavaScript Date object.

  // Get hours and adjust for 12-hour format.
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const period = hours >= 12 ? "pm" : "am"; // Determine whether it's AM or PM.

  // Convert hours to 12-hour format (e.g., 0 -> 12, 13 -> 1).
  hours = hours % 12 || 12;

  // Format the time string, ensuring minutes are always two digits.
  const time = `${hours}:${minutes.toString().padStart(2, "0")}${period}`;

  // Get the day of the month.
  const day = date.getDate();

  // Define month names for formatting.
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Get the month's name based on the month index (0-11).
  const month = monthNames[date.getMonth()];

  // Return the formatted date and time.
  return `${time}, ${day} ${month}`;
};

export const calculatePercentage = (sizeInBytes) => {
  const totalSizeInBytes = 2 * 1024 * 1024 * 1024; // 2GB in bytes
  const percentage = (sizeInBytes / totalSizeInBytes) * 100;
  return Number(percentage.toFixed(2));
};

export const getUsageSummary = (totalSpace) => {
  return [
    {
      title: "Documents",
      size: totalSpace.document.size,
      latestDate: totalSpace.document.latestDate,
      icon: "/assets/icons/file-document-light.svg",
      url: "/documents",
    },
    {
      title: "Images",
      size: totalSpace.image.size,
      latestDate: totalSpace.image.latestDate,
      icon: "/assets/icons/file-image-light.svg",
      url: "/images",
    },
    {
      title: "Media",
      size: totalSpace.video.size + totalSpace.audio.size,
      latestDate:
        totalSpace.video.latestDate > totalSpace.audio.latestDate
          ? totalSpace.video.latestDate
          : totalSpace.audio.latestDate,
      icon: "/assets/icons/file-video-light.svg",
      url: "/media",
    },
    {
      title: "Others",
      size: totalSpace.other.size,
      latestDate: totalSpace.other.latestDate,
      icon: "/assets/icons/file-other-light.svg",
      url: "/others",
    },
  ];
};
