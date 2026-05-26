import { useEffect, useState } from "react";

export default function App() {
  const DEVICE_COUNT = 15;

  const initialDevices = Array.from({ length: DEVICE_COUNT }, (_, i) => ({
    id: i + 1,
    name: `马${i + 1}`,
    status: "可使用",
    endDate: "",
  }));

  const [devices, setDevices] = useState(() => {
    const saved = localStorage.getItem("device-status-data");
    return saved ? JSON.parse(saved) : initialDevices;
  });

  useEffect(() => {
    localStorage.setItem(
      "device-status-data",
      JSON.stringify(devices)
    );
  }, [devices]);

  const getEndDate = (status) => {
    const today = new Date();

    if (status === "休息") {
      today.setDate(today.getDate() + 2);
    }

    if (status === "养设备") {
      today.setDate(today.getDate() + 3);
    }

    return today.toLocaleDateString("zh-CN");
  };

  const updateStatus = (id, newStatus) => {
    setDevices((prev) =>
      prev.map((device) => {
        if (device.id !== id) return device;

        return {
          ...device,
          status: newStatus,
          endDate:
            newStatus === "可使用"
              ? ""
              : getEndDate(newStatus),
        };
      })
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "休息":
        return "bg-yellow-100 border-yellow-300";
      case "养设备":
        return "bg-blue-100 border-blue-300";
      default:
        return "bg-green-100 border-green-300";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "休息":
        return "😴";
      case "养设备":
        return "🔧";
      default:
        return "✅";
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-4xl font-bold mb-8">
        手机设备管理系统
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-5">
        {devices.map((device) => (
          <div
            key={device.id}
            className={`rounded-3xl border-2 p-5 shadow-lg ${getStatusColor(
              device.status
            )}`}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">
                {device.name}
              </h2>

              <div className="text-4xl">
                {getStatusIcon(device.status)}
              </div>
            </div>

            <select
              value={device.status}
              onChange={(e) =>
                updateStatus(device.id, e.target.value)
              }
              className="w-full p-2 rounded-xl border bg-white mb-4"
            >
              <option>拍单</option>
              <option>休息</option>
              <option>养设备</option>
            </select>

            <div className="bg-white rounded-2xl p-3">
              <p className="mb-2">
                当前状态：
                <strong>{device.status}</strong>
              </p>

              {device.endDate ? (
                <p>
                  截止时间：
                  <strong>{device.endDate}</strong>
                </p>
              ) : (
                <p className="text-green-600">
                  当前可以使用
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}