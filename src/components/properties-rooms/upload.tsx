"use client";

import { useState } from "react";
import api from "@/services/api";

export default function UploadImage({ onUpload }: any) {
  const [loading, setLoading] = useState(false);

  const handleFile = async (e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    const form = new FormData();
    form.append("file", file);

    setLoading(true);

    const res = await api.post("/upload", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    onUpload(res.data.url);
    setLoading(false);
  };

  return (
    <div>
      <input type="file" onChange={handleFile} />

      {loading && <p>Uploading...</p>}
    </div>
  );
}