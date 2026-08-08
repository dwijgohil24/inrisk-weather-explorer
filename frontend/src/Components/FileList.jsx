"use client";

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(iso) {
  return new Date(iso).toLocaleString();
}

export default function FileList({ files, status, selectedFile, onSelect }) {
  if (status === "loading") {
    return <p className="text-sm text-slate-400">Loading files...</p>;
  }
  if (status === "error") {
    return <p className="text-sm text-red-600">Could not load files.</p>;
  }
  if (files.length === 0) {
    return <p className="text-sm text-slate-400">No files stored yet.</p>;
  }

  return (
    <ul className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
      {files.map((file) => (
        <li key={file.name}>
          <button
            type="button"
            onClick={() => onSelect(file.name)}
            className={`w-full text-left px-2 py-2.5 rounded-lg text-sm hover:bg-slate-50 transition-colors ${
              selectedFile === file.name ? "bg-brand-50 text-brand-700" : "text-slate-700"
            }`}
          >
            <p className="truncate font-medium">{file.name}</p>
            <p className="text-xs text-slate-400 mt-0.5">
              {formatBytes(file.size)} · {formatDate(file.created_at)}
            </p>
          </button>
        </li>
      ))}
    </ul>
  );
}