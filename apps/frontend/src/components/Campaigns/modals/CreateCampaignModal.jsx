import React, { useState, useEffect, useRef } from "react";
import { useMutation, gql } from "@apollo/client";
import { CREATE_CAMPAIGN, GET_CAMPAIGNS } from "../../../graphql";

export default function CreateCampaignModal({ open, onClose }) {
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [status, setStatus] = useState("draft");
  const [abConfig, setAbConfig] = useState({
    variationA: "",
    variationB: "",
    splitA: 50,
    winnerMetric: "",
  });
  const modalRef = useRef();

  const [createCampaign, { loading, error }] = useMutation(CREATE_CAMPAIGN, {
    refetchQueries: [{ query: GET_CAMPAIGNS }],
    awaitRefetchQueries: true,
    onCompleted: () => onClose(),
  });

  // reset each time we open
  useEffect(() => {
    if (open) {
      setTitle("");
      setStartDate("");
      setScheduleTime("");
      setStatus("draft");
      setAbConfig({ variationA: "", variationB: "", splitA: 50, winnerMetric: "" });
    }
  }, [open]);

  // auto‐set status to "scheduled" if scheduleTime is set
  useEffect(() => {
    setStatus(scheduleTime ? "scheduled" : "draft");
  }, [scheduleTime]);

  // ESC/outside‐click to close
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    const onClickOutside = (e) => modalRef.current && !modalRef.current.contains(e.target) && onClose();
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClickOutside);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClickOutside);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[9999] p-4">
      <div 
        ref={modalRef} 
        className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto transform transition-all duration-200 ease-out"
        style={{
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.05)'
        }}
      >
        <div className="p-6 space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">New Campaign</h2>
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <strong className="text-red-700">Error:</strong> {error.message}
            </div>
          )}
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              createCampaign({
                variables: {
                  title,
                  start_date: startDate,
                  schedule_time: scheduleTime || null,
                  status,
                  ab_config: abConfig,
                },
              });
            }}
          >
            <label className="block">
              <span className="text-sm font-medium text-gray-700 mb-1 block">Title</span>
              <input
                required
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-gray-700 mb-1 block">Start Date</span>
              <input
                required
                type="date"
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </label>

            <label className="block">
              <span className="text-sm font-medium text-gray-700 mb-1 block">Schedule Time (optional)</span>
              <input
                type="datetime-local"
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                value={scheduleTime}
                onChange={(e) => setScheduleTime(e.target.value)}
              />
            </label>

            <fieldset className="border border-gray-200 rounded-lg p-4 space-y-3">
              <legend className="px-2 text-sm font-medium text-gray-700">A/B Test Config</legend>
              <input
                className="w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                placeholder="Variation A"
                value={abConfig.variationA}
                onChange={(e) => setAbConfig({ ...abConfig, variationA: e.target.value })}
              />
              <input
                className="w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                placeholder="Variation B"
                value={abConfig.variationB}
                onChange={(e) => setAbConfig({ ...abConfig, variationB: e.target.value })}
              />
              <input
                type="number"
                min={0}
                max={100}
                className="w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                placeholder="Split % A"
                value={abConfig.splitA}
                onChange={(e) =>
                  setAbConfig({ ...abConfig, splitA: parseInt(e.target.value, 10) })
                }
              />
              <select
                className="w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                value={abConfig.winnerMetric}
                onChange={(e) => setAbConfig({ ...abConfig, winnerMetric: e.target.value })}
              >
                <option value="">Winner metric (optional)</option>
                <option value="clicks">Clicks</option>
                <option value="conversions">Conversions</option>
              </select>
            </fieldset>

            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
              >
                {loading ? "Creating…" : "Create campaign"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}