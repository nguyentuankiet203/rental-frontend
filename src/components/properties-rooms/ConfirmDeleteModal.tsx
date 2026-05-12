"use client";

export default function ConfirmDeleteModal({
  openConfirm,
  setOpenConfirm,
  selectedId,
  deleting,
  setDeleting,
  deleteRoom,
  fetchRooms,
  toast,
}: any) {
  if (!openConfirm) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl w-80">
        <p className="mb-4">Delete this room?</p>

        <div className="flex justify-end gap-2">
          <button onClick={() => setOpenConfirm(false)}>
            Cancel
          </button>

          <button
            disabled={deleting}
            className={`px-4 py-2 rounded text-white ${
              deleting
                ? "bg-gray-400"
                : "bg-red-500 hover:bg-red-600"
            }`}
            onClick={async () => {
              if (!selectedId) return;

              try {
                setDeleting(true);

                await deleteRoom(selectedId);
                toast.success("Deleted");

                await fetchRooms();
              } catch {
                toast.error("Delete failed");
              } finally {
                setDeleting(false);
                setOpenConfirm(false);
              }
            }}
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}