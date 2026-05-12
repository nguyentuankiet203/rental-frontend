"use client";

import { useEffect, useState } from "react";
import { getUsers, deleteUser } from "@/services/user.service";
import toast from "react-hot-toast";
import Link from "next/link";

import {
  Search,
  Plus,
  Pencil,
  Trash2,
  Users,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
  Building2,
  User,
} from "lucide-react";

const ROLE_CONFIG: Record<
  string,
  { label: string; color: string; icon: any }
> = {
  ADMIN: {
    label: "Admin",
    color: "bg-red-100 text-red-600",
    icon: ShieldAlert,
  },
  LANDLORD: {
    label: "Chủ trọ",
    color: "bg-blue-100 text-blue-600",
    icon: Building2,
  },
  TENANT: {
    label: "Khách thuê",
    color: "bg-green-100 text-green-600",
    icon: User,
  },
};

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [total, setTotal] = useState(0);

  const [page, setPage] = useState(1);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(false);

  const [deleting, setDeleting] = useState(false);

  const [openConfirm, setOpenConfirm] = useState(false);

  const [selectedId, setSelectedId] = useState<number | null>(null);

  // =========================
  // ROLE
  // =========================

  const [role, setRole] = useState("");

  useEffect(() => {
    const storedRole = localStorage.getItem("role") || "";

    setRole(storedRole);
  }, []);

  const routerPrefix =
    role === "ADMIN"
      ? "/admin"
      : role === "LANDLORD"
      ? "/landlord"
      : "";

  // =========================
  // PAGINATION
  // =========================

  const limit = 10;

  const totalPages = Math.ceil(total / limit);

  // =========================
  // FETCH USERS
  // =========================

  const fetchUsers = async () => {
    setLoading(true);

    try {
      const res = await getUsers({
        page,
        limit,
        search,
      });

      setUsers(res.data);

      setTotal(res.total);
    } catch (err) {
      toast.error("Không thể tải danh sách người dùng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, search]);

  // =========================
  // DELETE USER
  // =========================

  const handleDelete = async () => {
    if (!selectedId) return;

    setDeleting(true);

    try {
      await deleteUser(selectedId);

      toast.success("Đã xoá người dùng!");

      fetchUsers();

      setOpenConfirm(false);
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ||
          "Không thể xoá người dùng"
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="p-6 max-w-screen-xl space-y-5">
      {/* HEADER */}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Người dùng
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            Quản lý tài khoản và phân quyền hệ thống
          </p>
        </div>

        <Link
          href={`${routerPrefix}/users/create-user`}
          className="inline-flex w-fit items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 active:scale-95 transition-all duration-150 shadow-sm"
        >
          <Plus size={15} />

          Thêm người dùng
        </Link>
      </div>

      {/* SEARCH */}

      <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-3.5 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition bg-white">
        <Search
          size={15}
          className="text-gray-400 flex-shrink-0"
        />

        <input
          placeholder="Tìm theo email hoặc tên..."
          className="flex-1 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none bg-transparent"
          onChange={(e) => {
            setPage(1);

            setSearch(e.target.value);
          }}
        />
      </div>

      {/* TABLE */}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* TABLE HEADER */}

        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users
              size={16}
              className="text-gray-400"
            />

            <span className="text-sm font-semibold text-gray-700">
              Danh sách người dùng
            </span>
          </div>

          {!loading && (
            <span className="text-xs text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">
              {total} người dùng
            </span>
          )}
        </div>

        {/* LOADING */}

        {loading && (
          <div className="p-5 space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="h-14 bg-gray-100 rounded-xl animate-pulse"
              />
            ))}
          </div>
        )}

        {/* EMPTY */}

        {!loading && users.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
              <Users
                size={24}
                className="text-gray-400"
              />
            </div>

            <p className="text-base font-semibold text-gray-900">
              Không tìm thấy người dùng
            </p>

            <p className="text-sm text-gray-400 mt-1">
              Thử thay đổi từ khoá tìm kiếm
            </p>
          </div>
        )}

        {/* TABLE DATA */}

        {!loading && users.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  <th className="px-5 py-3">ID</th>

                  <th className="px-5 py-3">
                    Người dùng
                  </th>

                  <th className="px-5 py-3">
                    Quyền
                  </th>

                  <th className="px-5 py-3 text-right">
                    Thao tác
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {users.map((u) => {
                  const role =
                    ROLE_CONFIG[u.role] ??
                    ROLE_CONFIG["TENANT"];

                  const RoleIcon = role.icon;

                  return (
                    <tr
                      key={u.id}
                      className="hover:bg-gray-50/70 transition-colors"
                    >
                      {/* ID */}

                      <td className="px-5 py-4">
                        <span className="text-xs text-gray-400 font-mono bg-gray-100 px-2 py-1 rounded-lg">
                          #{u.id}
                        </span>
                      </td>

                      {/* USER */}

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                            {u.name
                              ?.charAt(0)
                              ?.toUpperCase() ||
                              u.email
                                ?.charAt(0)
                                ?.toUpperCase() ||
                              "?"}
                          </div>

                          <div>
                            <p className="font-semibold text-gray-900">
                              {u.name || "—"}
                            </p>

                            <p className="text-xs text-gray-400">
                              {u.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* ROLE */}

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${role.color}`}
                        >
                          <RoleIcon size={11} />

                          {role.label}
                        </span>
                      </td>

                      {/* ACTIONS */}

                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`${routerPrefix}/users/${u.id}/edit-user`}
                            className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-blue-600 active:scale-95 transition-all"
                          >
                            <Pencil size={14} />
                          </Link>

                          <button
                            onClick={() => {
                              setSelectedId(u.id);

                              setOpenConfirm(true);
                            }}
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-red-400 hover:bg-red-50 hover:text-red-600 active:scale-95 transition-all"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* PAGINATION */}

        {totalPages > 1 && (
          <div className="px-5 py-4 border-t border-gray-100 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Trang {page} / {totalPages} · {total} người
              dùng
            </p>

            <div className="flex items-center gap-2">
              <button
                onClick={() =>
                  setPage((p) => Math.max(p - 1, 1))
                }
                disabled={page === 1}
                className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                <ChevronLeft size={16} />
              </button>

              <button
                onClick={() =>
                  setPage((p) =>
                    Math.min(p + 1, totalPages)
                  )
                }
                disabled={page === totalPages}
                className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* DELETE MODAL */}

      {openConfirm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
            <div className="w-12 h-12 rounded-2xl bg-red-100 flex items-center justify-center mb-4">
              <Trash2
                size={20}
                className="text-red-500"
              />
            </div>

            <h2 className="text-base font-bold text-gray-900">
              Xác nhận xoá
            </h2>

            <p className="text-sm text-gray-500 mt-1.5">
              Bạn có chắc muốn xoá người dùng này
              không?
            </p>

            <div className="flex items-center gap-3 mt-6">
              <button
                onClick={() => setOpenConfirm(false)}
                className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition"
              >
                Huỷ
              </button>

              <button
                disabled={deleting}
                onClick={handleDelete}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-red-500 text-white rounded-xl text-sm font-semibold hover:bg-red-600 transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {deleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />

                    Đang xoá...
                  </>
                ) : (
                  <>
                    <Trash2 size={14} />

                    Xoá
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
