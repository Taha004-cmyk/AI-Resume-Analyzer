import {useCallback, useState} from "react";
import {useDropzone} from "react-dropzone";

interface FileUploaderProps {
    onFileSelect?: (file: File | null) => void;
}

// Converts file size into human-readable format
const formatSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";

    const units = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));

    return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${units[i]}`;
};

const FileUploader = ({onFileSelect}: FileUploaderProps) => {
    const [file, setFile] = useState<File | null>(null);

    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            const selectedFile = acceptedFiles[0] || null;

            setFile(selectedFile);
            onFileSelect?.(selectedFile);
        },
        [onFileSelect]
    );

    const {getRootProps, getInputProps, isDragActive} = useDropzone({
        onDrop,
        accept: {
            "application/pdf": [".pdf"],
        },
        maxSize: 20 * 1024 * 1024,
        multiple: false,
    });

    return (
        <div className="w-full gradient-border">
            <div {...getRootProps()}>
                <input {...getInputProps()} />

                <div className="space-y-4 cursor-pointer">


                    {file ? (
                        <div className="uploader-selected-file" onClick={(e) => e.stopPropagation()}>
                            <img src="/images/pdf.png" alt="pdf" className="size-10"/>
                            <div className="flex items-center space-y-3">

                                <div>
                                    <p className="text-lg text-gray-700 font-semibold">
                                        {file.name}
                                    </p>

                                    <p className="text-sm text-gray-500">
                                        {formatSize(file.size)}
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                className="p-2 cursor-pointer"
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    onFileSelect?.(null);
                                    setFile(null);
                                }}
                            >
                                <img
                                    src="/icons/cross.svg"
                                    alt="remove"
                                    className="w-4 h-4"
                                />
                            </button>
                        </div>
                    ) : (
                        <div>
                            <div className="mx-auto w-16 h-16 flex items-center justify-center mb-2">
                                <img
                                    src="/icons/info.svg"
                                    alt="upload"
                                    className="size-20"
                                />
                            </div>
                            <p className="text-lg text-gray-500">
                                <span className="font-semibold">
                                    {isDragActive
                                        ? "Drop your resume here"
                                        : "Click to Upload"}
                                </span>{" "}
                                {!isDragActive && "or drag and drop"}
                            </p>

                            <p className="text-lg text-gray-500">
                                PDF (max 20 MB)
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FileUploader;