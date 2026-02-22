import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, Trash2 } from "lucide-react";

export default function SingleImageUploader({ onChange }) {
  const [image, setImage] = useState(null);

  const onDrop = useCallback(
    (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        file.preview = URL.createObjectURL(file);
        setImage(file);
        onChange?.(file);
      }
    },
    [onChange]
  );

  const removeImage = () => {
    setImage(null);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: false,
  });

  return (
    <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-border rounded-lg w-full mx-auto bg-surface text-foreground font-sans">
      <div
        {...getRootProps()}
        className={`flex flex-col items-center justify-center w-full h-48 cursor-pointer rounded transition-all duration-200
          ${
            isDragActive
              ? "bg-accent-surface border-primary"
              : "bg-surface border-border hover:border-primary"
          }
        `}
      >
        <input {...getInputProps()} />
        {!image ? (
          <div className="flex flex-col items-center justify-center gap-2 text-center text-muted">
            <UploadCloud className="w-10 h-10 text-primary" />
            <p className="text-secondary">
              Drag & drop an image here, or click to select
            </p>
          </div>
        ) : (
          <img
            src={image.preview}
            alt="Preview"
            className="w-full h-full object-cover rounded"
          />
        )}
      </div>

      {image && (
        <div className="mt-4 flex items-center justify-between w-full px-2">
          <p className="text-secondary text-sm truncate">{image.name}</p>
          <button
            onClick={removeImage}
            className="flex items-center justify-center p-2 rounded hover:bg-error hover:text-surface transition-colors"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}
