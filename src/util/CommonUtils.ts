import * as React from "react";

export const handleCopyText = (
  e: React.MouseEvent<HTMLButtonElement>,
  text: string,
) => {
  e.stopPropagation();
  navigator.clipboard.writeText(text).catch((error: unknown) => {
    if (error instanceof Error) {
      console.error("Failed to copy text:", error.message, error);
    } else {
      console.error("Failed to copy text:", error);
    }
  });
};
