"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth.store";
import { updateUser } from "@/services/user.service";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const { user, setAuth } = useAuthStore();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [avatar, setAvatar] = useState<File | null>(null);

  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user) return;

    setName(user.name || "");
    setPhone(user.phone || "");
    setPreview(user.avatar || "");
  }, [user]);

  const handleAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;

    const file = e.target.files[0];

    setAvatar(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    if (!user?.id) {
        return toast.error("User not found");
    }

    try {
        setLoading(true);

        const formData = new FormData();

        formData.append("name", name);
        formData.append("phone", phone);

        if (avatar) {
        formData.append("avatar", avatar);
        }

        const updatedUser = await updateUser(
        String(user.id),
        formData
        );

        const token = localStorage.getItem("token");

        // ✅ merge user cũ + user mới
        setAuth(
        {
            ...user,
            ...updatedUser,
        },
        token || ""
        );

        toast.success("Updated");
    } catch (err: any) {
        toast.error(
        err?.response?.data?.message || "Error"
        );
    } finally {
        setLoading(false);
    }
    };

  return (
    <div className="p-6">

      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          My Profile
        </h1>

        <p className="text-sm text-gray-500 mt-1">
          Manage your account information
        </p>
      </div>

      {/* CARD */}
      <div className="bg-white rounded-2xl shadow p-6 max-w-2xl">

        {/* AVATAR */}
        <div className="flex items-center gap-5 mb-8">

          <div className="w-24 h-24 rounded-full overflow-hidden border bg-gray-100">
            {preview ? (
              <img
                src={preview}
                alt="avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-gray-400">
                {user?.email?.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          <div>
            <label className="px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition">
              Upload Avatar

              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleAvatar}
              />
            </label>

            <p className="text-xs text-gray-400 mt-2">
              PNG, JPG up to 5MB
            </p>
          </div>

        </div>

        {/* FORM */}
        <div className="grid grid-cols-1 gap-5">

          {/* EMAIL */}
          <div>
            <label className="text-sm text-gray-500 mb-1 block">
              Email
            </label>

            <input
              disabled
              value={user?.email || ""}
              className="w-full border rounded-xl p-3 bg-gray-100 text-gray-500"
            />
          </div>

          {/* NAME */}
          <div>
            <label className="text-sm text-gray-500 mb-1 block">
              Name
            </label>

            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* PHONE */}
          <div>
            <label className="text-sm text-gray-500 mb-1 block">
              Phone
            </label>

            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone number"
              className="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* ROLE */}
          <div>
            <label className="text-sm text-gray-500 mb-1 block">
              Role
            </label>

            <div className="inline-flex px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-600">
              {user?.role}
            </div>
          </div>

        </div>

        {/* ACTION */}
        <div className="mt-8 flex justify-end">
          <button
            disabled={loading}
            onClick={handleSubmit}
            className={`px-5 py-3 rounded-xl text-white font-medium transition ${
              loading
                ? "bg-gray-400"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>

      </div>
    </div>
  );
}