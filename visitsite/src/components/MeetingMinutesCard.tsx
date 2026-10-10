import React from 'react';
import { TrashIcon, CalendarIcon, FileTextIcon } from 'lucide-react';
export interface MeetingMinutes {
  id: string;
  title: string;
  date: string;
  content: string;
}
interface MeetingMinutesCardProps {
  minutes: MeetingMinutes;
  onDelete: (id: string) => void;
}
export function MeetingMinutesCard({
  minutes,
  onDelete
}: MeetingMinutesCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  return <article className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-start gap-4 flex-1">
          <div className="bg-blue-100 p-3 rounded-lg flex-shrink-0">
            <FileTextIcon className="w-6 h-6 text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              {minutes.title}
            </h3>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <CalendarIcon className="w-4 h-4" />
              <time>{formatDate(minutes.date)}</time>
            </div>
          </div>
        </div>
        <button onClick={() => onDelete(minutes.id)} className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-colors flex-shrink-0" aria-label="Delete meeting minutes">
          <TrashIcon className="w-4 h-4" />
        </button>
      </div>
      <div className="prose prose-sm max-w-none">
        <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">
          {minutes.content}
        </div>
      </div>
    </article>;
}