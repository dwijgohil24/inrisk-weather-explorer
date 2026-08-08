"use client";

import { useState, useEffect, useCallback } from "react";
import { listWeatherFiles, getWeatherFileContent } from "@/lib/api";
import Card from "@/components/Card";
import InputPanel from "@/components/InputPanel";
import FileList from "@/components/FileList";
import DailyTable from "@/components/DailyTable";
import TemperatureChart from "@/components/TemperatureChart";

export default function Dashboard() {
  const [files, setFiles] = useState([]);
  const [filesStatus, setFilesStatus] = useState("loading");
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileData, setFileData] = useState(null);
  const [fileDataStatus, setFileDataStatus] = useState("idle");

  const refreshFiles = useCallback(async () => {
    setFilesStatus("loading");
    try {
      const result = await listWeatherFiles();
      setFiles(result.files);
      setFilesStatus("idle");
    } catch (err) {
      setFilesStatus("error");
    }
  }, []);

  useEffect(() => {
    refreshFiles();
  }, [refreshFiles]);

  useEffect(() => {
    if (!selectedFile) return;

    let cancelled = false;

    async function loadFileContent() {
      setFileDataStatus("loading");
      try {
        const data = await getWeatherFileContent(selectedFile);
        if (!cancelled) {
          setFileData(data);
          setFileDataStatus("idle");
        }
      } catch (err) {
        if (!cancelled) {
          setFileData(null);
          setFileDataStatus("error");
        }
      }
    }

    loadFileContent();

    return () => {
      cancelled = true;
    };
  }, [selectedFile]);

  function handleStored(filename) {
    refreshFiles();
    setSelectedFile(filename);
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1 space-y-6">
        <Card title="Fetch & Store" description="Pull historical weather for a location and date range.">
          <InputPanel onStored={handleStored} />
        </Card>
        <Card title="Stored Files" description="Files saved in cloud storage.">
          <FileList files={files} status={filesStatus} selectedFile={selectedFile} onSelect={setSelectedFile} />
        </Card>
      </div>

      <div className="lg:col-span-2 space-y-6">
        <Card title="Temperature Trend">
        {fileDataStatus === "loading" && <p className="text-sm text-slate-400">Loading chart...</p>}
        {fileDataStatus === "error" && <p className="text-sm text-red-600">Could not load file content.</p>}
        {fileDataStatus === "idle" && <TemperatureChart fileData={fileData} />}
        </Card>
        <Card title="Daily Data">
        <DailyTable fileData={fileData} />
        </Card>
      </div>
    </div>
  );
}